const express = require('express');
const { pool } = require('../config/database');
const crypto = require('crypto');

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
    try {
        const { aadhaar, password } = req.body;

        if (!aadhaar || !password) {
            return res.status(400).json({ error: 'Aadhaar and password are required' });
        }

        // Find user by Aadhaar
        const [userRows] = await pool.execute(
            'SELECT * FROM users WHERE aadhaar = ? AND is_active = TRUE',
            [aadhaar]
        );

        if (userRows.length === 0) {
            return res.status(401).json({ error: 'Invalid Aadhaar or password' });
        }

        const user = userRows[0];

        // Check password (in production, use bcrypt for hashing)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid Aadhaar or password' });
        }

        // Generate session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store session
        await pool.execute(
            'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            [user.id, sessionToken, expiresAt]
        );

        // Update last login
        await pool.execute(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        // Get user benefits
        const [benefitRows] = await pool.execute(
            'SELECT * FROM benefits WHERE user_id = ?',
            [user.id]
        );

        // Format benefits
        const benefits = {};
        benefitRows.forEach(benefit => {
            benefits[benefit.benefit_type] = {
                status: benefit.status,
                usage: benefit.usage_percentage
            };
        });

        // Return user data (exclude password)
        const userData = {
            token: sessionToken,  // Frontend expects 'token'
            user: {
                name: user.name,
                id: user.migrant_id,
                homeState: user.home_state,
                currentState: user.current_state,
                phone: user.phone,
                aadhaar: user.aadhaar,
                benefits: benefits
            }
        };

        res.json(userData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// User registration with comprehensive data
router.post('/register', async (req, res) => {
    try {
        const {
            // Personal Information
            name, dateOfBirth, gender, maritalStatus, aadhaar, phone, password,
            // Family Information
            familySize, dependents, children, elderlyMembers, disabledMembers,
            // Income and Employment
            monthlyIncome, annualIncome, employmentType, occupation,
            // Housing and Assets
            houseOwnership, houseType, assets,
            // Location and Migration
            homeState, currentState, migrationReason, yearsInCurrentState,
            // Social Category and Special Circumstances
            socialCategory, religion, specialCircumstances
        } = req.body;

        // Validate required fields
        if (!name || !aadhaar || !phone || !password || !homeState || !currentState || !socialCategory) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        // Validate Aadhaar format (basic)
        if (aadhaar.length !== 12 || !/^\d{12}$/.test(aadhaar)) {
            return res.status(400).json({ error: 'Invalid Aadhaar format. Must be 12 digits.' });
        }

        // Check if user already exists
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE aadhaar = ?',
            [aadhaar]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User with this Aadhaar already exists' });
        }

        // Generate unique migrant ID
        const stateCode = homeState.substring(0, 2).toUpperCase();
        const [lastUser] = await pool.execute(
            'SELECT migrant_id FROM users WHERE migrant_id LIKE ? ORDER BY id DESC LIMIT 1',
            [`MIG-${stateCode}-%`]
        );

        let nextNumber = 1;
        if (lastUser.length > 0) {
            const lastNumber = parseInt(lastUser[0].migrant_id.split('-')[2]);
            nextNumber = lastNumber + 1;
        }

        const migrantId = `MIG-${stateCode}-${nextNumber.toString().padStart(3, '0')}`;

        // Create user with comprehensive data
        const [result] = await pool.execute(
            `INSERT INTO users (
                migrant_id, name, aadhaar, phone, password,
                date_of_birth, gender, marital_status,
                family_size, dependents, children, elderly_members, disabled_members,
                monthly_income, annual_income, employment_type, occupation,
                house_ownership, house_type, assets,
                home_state, current_state, migration_reason, years_in_current_state,
                social_category, religion, special_circumstances
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                migrantId, name, aadhaar, phone, password,
                dateOfBirth || null, gender || null, maritalStatus || null,
                familySize || 1, dependents || 0, children || 0, elderlyMembers || 0, disabledMembers || 0,
                monthlyIncome || 0, annualIncome || 0, employmentType || null, occupation || null,
                houseOwnership || null, houseType || null, JSON.stringify(assets || []),
                homeState, currentState, migrationReason || null, yearsInCurrentState || 0,
                socialCategory, religion || null, JSON.stringify(specialCircumstances || [])
            ]
        );

        const userId = result.insertId;

        // Create default benefits for new user
        const benefitTypes = ['food', 'health', 'education', 'finance'];
        for (const benefitType of benefitTypes) {
            await pool.execute(
                'INSERT INTO benefits (user_id, benefit_type, status, usage_percentage) VALUES (?, ?, ?, ?)',
                [userId, benefitType, 'pending', 0]
            );
        }

        // Create detailed benefit records
        await pool.execute(
            'INSERT INTO food_benefits (user_id, card_number, valid_till) VALUES (?, ?, ?)',
            [userId, `${stateCode}-${nextNumber.toString().padStart(3, '0')}-${aadhaar.slice(-4)}`, '2025-12-31']
        );

        await pool.execute(
            'INSERT INTO health_benefits (user_id, card_number, family_members, valid_till) VALUES (?, ?, ?, ?)',
            [userId, `AB-${nextNumber.toString().padStart(3, '0')}-${aadhaar.slice(-4)}`, familySize || 1, '2025-12-31']
        );

        await pool.execute(
            'INSERT INTO education_benefits (user_id, children_count) VALUES (?, ?)',
            [userId, children || 0]
        );

        await pool.execute(
            'INSERT INTO finance_benefits (user_id, bank_account) VALUES (?, ?)',
            [userId, `****${aadhaar.slice(-4)}`]
        );

        // Prepare comprehensive user data for QR code
        const qrData = {
            migrantId,
            name,
            aadhaar,
            phone,
            dateOfBirth,
            gender,
            maritalStatus,
            familySize,
            monthlyIncome,
            employmentType,
            homeState,
            currentState,
            socialCategory,
            specialCircumstances,
            registrationDate: new Date().toISOString().split('T')[0]
        };

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            migrantId: migrantId,
            user: {
                name,
                id: migrantId,
                aadhaar,
                homeState,
                currentState,
                phone,
                dateOfBirth,
                gender,
                familySize,
                monthlyIncome,
                employmentType,
                socialCategory
            },
            qrData: qrData
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Get user data for QR generation
router.get('/user/:migrantId', async (req, res) => {
    try {
        const { migrantId } = req.params;

        // Get session token from Authorization header
        let sessionToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            sessionToken = req.headers.authorization.substring(7);
        }

        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token provided' });
        }

        // Verify session
        const [sessionRows] = await pool.execute(
            'SELECT s.*, u.* FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = ? AND s.expires_at > NOW() AND u.migrant_id = ?',
            [sessionToken, migrantId]
        );

        if (sessionRows.length === 0) {
            return res.status(401).json({ error: 'Invalid session or unauthorized access' });
        }

        const user = sessionRows[0];

        // Get user benefits
        const [benefitRows] = await pool.execute(
            'SELECT * FROM benefits WHERE user_id = ?',
            [user.user_id]
        );

        const benefits = {};
        benefitRows.forEach(benefit => {
            benefits[benefit.benefit_type] = {
                status: benefit.status,
                usage: benefit.usage_percentage
            };
        });

        // Parse JSON fields
        let assets = [];
        let specialCircumstances = [];

        try {
            assets = user.assets ? JSON.parse(user.assets) : [];
        } catch (e) {
            console.error('Error parsing assets:', e);
        }

        try {
            specialCircumstances = user.special_circumstances ? JSON.parse(user.special_circumstances) : [];
        } catch (e) {
            console.error('Error parsing special circumstances:', e);
        }

        const userData = {
            migrantId: user.migrant_id,
            name: user.name,
            aadhaar: user.aadhaar,
            phone: user.phone,
            dateOfBirth: user.date_of_birth,
            gender: user.gender,
            maritalStatus: user.marital_status,
            familySize: user.family_size,
            dependents: user.dependents,
            children: user.children,
            elderlyMembers: user.elderly_members,
            disabledMembers: user.disabled_members,
            monthlyIncome: user.monthly_income,
            annualIncome: user.annual_income,
            employmentType: user.employment_type,
            occupation: user.occupation,
            houseOwnership: user.house_ownership,
            houseType: user.house_type,
            assets: assets,
            homeState: user.home_state,
            currentState: user.current_state,
            migrationReason: user.migration_reason,
            yearsInCurrentState: user.years_in_current_state,
            socialCategory: user.social_category,
            religion: user.religion,
            specialCircumstances: specialCircumstances,
            registrationDate: user.created_at ? user.created_at.toISOString().split('T')[0] : null,
            benefits: benefits
        };

        res.json(userData);

    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Logout
router.post('/logout', async (req, res) => {
    try {
        let sessionToken;

        // Get token from Authorization header or request body
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            sessionToken = req.headers.authorization.substring(7);
        } else if (req.body && req.body.sessionToken) {
            sessionToken = req.body.sessionToken;
        }

        if (sessionToken) {
            await pool.execute(
                'DELETE FROM user_sessions WHERE session_token = ?',
                [sessionToken]
            );
        }

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Verify session (supports both GET and POST)
router.get('/verify', verifySession);
router.post('/verify', verifySession);

async function verifySession(req, res) {
    try {
        let sessionToken;

        // Get token from Authorization header or request body
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            sessionToken = req.headers.authorization.substring(7);
        } else if (req.body && req.body.sessionToken) {
            sessionToken = req.body.sessionToken;
        }

        if (!sessionToken) {
            return res.status(401).json({ error: 'No session token provided' });
        }

        const [sessionRows] = await pool.execute(
            'SELECT s.*, u.* FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = ? AND s.expires_at > NOW()',
            [sessionToken]
        );

        if (sessionRows.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const session = sessionRows[0];

        // Get user benefits
        const [benefitRows] = await pool.execute(
            'SELECT * FROM benefits WHERE user_id = ?',
            [session.user_id]
        );

        const benefits = {};
        benefitRows.forEach(benefit => {
            benefits[benefit.benefit_type] = {
                status: benefit.status,
                usage: benefit.usage_percentage
            };
        });

        const userData = {
            name: session.name,
            id: session.migrant_id,
            homeState: session.home_state,
            currentState: session.current_state,
            phone: session.phone,
            aadhaar: session.aadhaar,
            benefits: benefits
        };

        res.json({ user: userData });
    } catch (error) {
        console.error('Session verification error:', error);
        res.status(500).json({ error: 'Session verification failed' });
    }
}

module.exports = router;
