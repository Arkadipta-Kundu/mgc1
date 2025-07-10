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

// User registration
router.post('/register', async (req, res) => {
    try {
        const { name, aadhaar, phone, password, home_state, current_state } = req.body;

        // Validation
        if (!name || !aadhaar || !phone || !password || !home_state || !current_state) {
            return res.status(400).json({ error: 'All fields are required' });
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
        const stateCode = home_state.substring(0, 2).toUpperCase();
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

        // Create user
        const [result] = await pool.execute(
            'INSERT INTO users (migrant_id, name, aadhaar, phone, password, home_state, current_state) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [migrantId, name, aadhaar, phone, password, home_state, current_state]
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
            [userId, `AB-${nextNumber.toString().padStart(3, '0')}-${aadhaar.slice(-4)}`, 1, '2025-12-31']
        );

        await pool.execute(
            'INSERT INTO education_benefits (user_id, children_count) VALUES (?, ?)',
            [userId, 0]
        );

        await pool.execute(
            'INSERT INTO finance_benefits (user_id, bank_account) VALUES (?, ?)',
            [userId, `****${aadhaar.slice(-4)}`]
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            migrantId: migrantId,
            user: {
                name,
                id: migrantId,
                aadhaar,
                homeState: home_state,
                currentState: current_state
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
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
