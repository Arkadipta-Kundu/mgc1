const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import database and routes
const { testConnection } = require('./config/database');
const usersRoute = require('./routes/users');
const foodRoute = require('./routes/food');
const healthRoute = require('./routes/health');
const educationRoute = require('./routes/education');
const financeRoute = require('./routes/finance');
const authRoute = require('./routes/auth');

// Import BECKN and Blockchain integrations
const becknRoute = require('./beckn-integration');
const { blockchainRouter, migrantBlockchain } = require('./blockchain-integration');

// Import database connection
const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Database connection pool
let dbPool;
try {
    dbPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'migrant_connect',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} catch (error) {
    console.error('Database connection failed:', error);
}

// User-facing API Routes for Schemes
app.get('/api/user/schemes', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        const [schemes] = await dbPool.execute(`
            SELECT 
                id as scheme_id,
                name as scheme_name,
                description as scheme_description,
                category,
                benefit_amount,
                CONCAT('{"maxIncome":', IFNULL(max_income, 'null'), 
                       ',"minFamilySize":', IFNULL(min_family_size, 1), 
                       ',"socialCategory":"', IFNULL(social_category, ''), '"',
                       ',"housingStatus":"', IFNULL(housing_status, ''), '"',
                       ',"bplRequired":', IFNULL(bpl_required, false), 
                       ',"additionalCriteria":', IFNULL(additional_criteria, '{}'), '}') as eligibility_criteria,
                required_documents,
                NULL as application_deadline,
                beneficiaries_count,
                status
            FROM admin_schemes 
            WHERE status = 'active'
            ORDER BY created_at DESC
        `);

        // Parse eligibility criteria JSON for each scheme
        const processedSchemes = schemes.map(scheme => ({
            ...scheme,
            eligibility_criteria: scheme.eligibility_criteria ? JSON.parse(scheme.eligibility_criteria) : {},
            required_documents: scheme.required_documents ? JSON.parse(scheme.required_documents) : []
        }));

        res.json({ success: true, schemes: processedSchemes });
    } catch (error) {
        console.error('Error fetching user schemes:', error);
        res.status(500).json({ success: false, message: 'Error fetching schemes' });
    }
});

// Check user eligibility for specific scheme
app.post('/api/user/check-scheme-eligibility', async (req, res) => {
    try {
        const { schemeId, userId } = req.body;

        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        // Get scheme details
        const [schemes] = await dbPool.execute(
            'SELECT CONCAT(\'{"maxIncome":\', IFNULL(max_income, \'null\'), \',"minFamilySize":\', IFNULL(min_family_size, 1), \',"socialCategory":"\', IFNULL(social_category, \'\'), \'"\', \',"housingStatus":"\', IFNULL(housing_status, \'\'), \'"\', \',"bplRequired":\', IFNULL(bpl_required, false), \',"additionalCriteria":\', IFNULL(additional_criteria, \'{}\'), \'}\') as eligibility_criteria FROM admin_schemes WHERE id = ?',
            [schemeId]
        );

        if (schemes.length === 0) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        // Get user data
        const [users] = await dbPool.execute(
            'SELECT * FROM comprehensive_users WHERE migrant_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = users[0];
        const criteria = JSON.parse(schemes[0].eligibility_criteria || '{}');

        // Evaluate eligibility
        const eligibilityResult = evaluateSchemeEligibility(userData, criteria);

        res.json({
            success: true,
            eligible: eligibilityResult.isEligible,
            reasons: eligibilityResult.reasons,
            schemeId: schemeId
        });
    } catch (error) {
        console.error('Error checking scheme eligibility:', error);
        res.status(500).json({ success: false, message: 'Error checking eligibility' });
    }
});

// Submit scheme application
app.post('/api/user/apply-scheme', async (req, res) => {
    try {
        const { schemeId, userId, applicationData } = req.body;

        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        // Check if application already exists
        const [existing] = await dbPool.execute(`
            SELECT id as application_id FROM scheme_applications 
            WHERE scheme_id = ? AND user_id = ?
        `, [schemeId, userId]);

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Application already submitted for this scheme'
            });
        }

        // Insert new application
        const [result] = await dbPool.execute(`
            INSERT INTO scheme_applications 
            (scheme_id, user_id, application_data, application_status, application_date)
            VALUES (?, ?, ?, 'pending', NOW())
        `, [
            schemeId,
            userId,
            JSON.stringify(applicationData)
        ]);

        res.json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: result.insertId
        });
    } catch (error) {
        console.error('Error submitting scheme application:', error);
        res.status(500).json({ success: false, message: 'Error submitting application' });
    }
});

// Check user eligibility for all schemes
app.post('/api/admin/check-eligibility', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not available' });
        }

        const userData = req.body;

        // Get all active schemes
        const [schemes] = await dbPool.execute(`
            SELECT * FROM admin_schemes WHERE status = 'active'
        `);

        const eligibilityResults = [];

        schemes.forEach(scheme => {
            const eligible = evaluateSchemeEligibility(userData, {
                maxIncome: scheme.max_income,
                minFamilySize: scheme.min_family_size,
                socialCategory: scheme.social_category,
                housingStatus: scheme.housing_status,
                bplRequired: Boolean(scheme.bpl_required),
                widowPreference: Boolean(scheme.widow_preference),
                disabilityPreference: Boolean(scheme.disability_preference)
            });

            eligibilityResults.push({
                schemeId: scheme.id,
                schemeName: scheme.name,
                category: scheme.category,
                eligible: eligible.isEligible,
                reasons: eligible.reasons
            });
        });

        res.json({ success: true, results: eligibilityResults });
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ success: false, message: 'Error checking eligibility' });
    }
});

// Store eligibility scan results
app.post('/api/admin/store-eligibility-scan', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not available' });
        }

        const { userId, results, scannedBy = 'admin' } = req.body;

        // Store each eligibility result
        for (const result of results) {
            await dbPool.execute(`
                INSERT INTO scheme_eligibility_results 
                (user_id, scheme_id, is_eligible, eligibility_reasons, scanned_by)
                VALUES (?, ?, ?, ?, ?)
            `, [
                userId,
                result.schemeId,
                result.eligible,
                JSON.stringify(result.reasons),
                scannedBy
            ]);
        }

        res.json({ success: true, message: 'Eligibility scan results stored successfully' });
    } catch (error) {
        console.error('Error storing eligibility scan:', error);
        res.status(500).json({ success: false, message: 'Error storing eligibility scan' });
    }
});

// Get scheme statistics
app.get('/api/admin/statistics', async (req, res) => {
    try {
        if (!dbPool) {
            return res.json({
                totalSchemes: 0,
                totalBeneficiaries: 0,
                qrScansToday: 0,
                pendingApplications: 0
            });
        }

        const [schemeStats] = await dbPool.execute(`
            SELECT 
                COUNT(*) as total_schemes,
                SUM(beneficiaries_count) as total_beneficiaries
            FROM admin_schemes WHERE status = 'active'
        `);

        const [scanStats] = await dbPool.execute(`
            SELECT COUNT(*) as scans_today
            FROM scheme_eligibility_results 
            WHERE DATE(scan_date) = CURDATE()
        `);

        const [appStats] = await dbPool.execute(`
            SELECT COUNT(*) as pending_applications
            FROM scheme_applications 
            WHERE application_status = 'pending'
        `);

        res.json({
            totalSchemes: schemeStats[0].total_schemes || 0,
            totalBeneficiaries: schemeStats[0].total_beneficiaries || 0,
            qrScansToday: scanStats[0].scans_today || 0,
            pendingApplications: appStats[0].pending_applications || 0
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
});

function evaluateSchemeEligibility(userData, criteria) {
    const reasons = [];
    let isEligible = true;

    // Income check
    if (criteria.maxIncome && userData.incomeEmployment?.monthlyIncome > criteria.maxIncome) {
        isEligible = false;
        reasons.push(`Income exceeds limit of ₹${criteria.maxIncome.toLocaleString()}`);
    }

    // Family size check
    if (criteria.minFamilySize && userData.familyInfo?.totalMembers < criteria.minFamilySize) {
        isEligible = false;
        reasons.push(`Family size below minimum of ${criteria.minFamilySize}`);
    }

    // Social category check
    if (criteria.socialCategory && criteria.socialCategory !== userData.socialCategory?.caste) {
        isEligible = false;
        reasons.push(`Social category doesn't match requirement`);
    }

    // Housing status check
    if (criteria.housingStatus && criteria.housingStatus !== userData.housingAssets?.housingStatus) {
        isEligible = false;
        reasons.push(`Housing status doesn't match requirement`);
    }

    // BPL card check
    if (criteria.bplRequired && !userData.specialCircumstances?.hasBPLCard) {
        isEligible = false;
        reasons.push('BPL card required but not available');
    }

    return { isEligible, reasons };
}

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/food', foodRoute);
app.use('/api/health', healthRoute);
app.use('/api/education', educationRoute);
app.use('/api/finance', financeRoute);

// 🌐 BECKN Protocol Integration Routes
app.use('/api/beckn', becknRoute);

// ⛓️ Blockchain Integration Routes
app.use('/api/blockchain', blockchainRouter);

// API endpoint to test database connection
app.get('/api/status', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        status: 'Server running',
        database: dbConnected ? 'Connected' : 'Disconnected',
        blockchain: migrantBlockchain.isChainValid() ? 'Valid' : 'Invalid',
        beckn_enabled: true,
        timestamp: new Date().toISOString()
    });
});

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing-page.html'));
});

// Route for landing page
app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing-page.html'));
});

// Route for application home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route for education
app.get('/education', (req, res) => {
    res.sendFile(path.join(__dirname, 'education.html'));
});

// Route for finance
app.get('/finance', (req, res) => {
    res.sendFile(path.join(__dirname, 'finance.html'));
});

// Route for food
app.get('/food', (req, res) => {
    res.sendFile(path.join(__dirname, 'food.html'));
});

// Route for health
app.get('/health', (req, res) => {
    res.sendFile(path.join(__dirname, 'health.html'));
});

// Route for QR
app.get('/qr', (req, res) => {
    res.sendFile(path.join(__dirname, 'qr.html'));
});

// Route for schemes page
app.get('/schemes', (req, res) => {
    res.sendFile(path.join(__dirname, 'schemes.html'));
});

// ============================================================================
// ADMIN SCHEME MANAGEMENT ENDPOINTS
// ============================================================================

// Get all schemes for admin
app.get('/api/admin/schemes', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        const [schemes] = await dbPool.execute(`
            SELECT 
                id,
                name,
                category,
                description,
                status,
                beneficiaries_count,
                max_income,
                min_family_size,
                social_category,
                housing_status,
                bpl_required,
                widow_preference,
                disability_preference,
                benefit_amount,
                benefit_type,
                application_process,
                required_documents,
                created_by,
                created_at,
                updated_at
            FROM admin_schemes 
            ORDER BY created_at DESC
        `);

        res.json({ success: true, schemes });
    } catch (error) {
        console.error('Error fetching admin schemes:', error);
        res.status(500).json({ success: false, message: 'Error fetching schemes' });
    }
});

// Create new scheme
app.post('/api/admin/schemes', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        const {
            name,
            category,
            description,
            status = 'active',
            beneficiaries_count = 0,
            max_income,
            min_family_size = 1,
            social_category = '',
            housing_status = '',
            bpl_required = false,
            widow_preference = false,
            disability_preference = false,
            benefit_amount,
            benefit_type = 'service',
            application_process,
            required_documents,
            created_by = 'admin'
        } = req.body;

        // Validate required fields
        if (!name || !category || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, and description are required'
            });
        }

        // Insert new scheme
        const [result] = await dbPool.execute(`
            INSERT INTO admin_schemes (
                name, category, description, status, beneficiaries_count,
                max_income, min_family_size, social_category, housing_status,
                bpl_required, widow_preference, disability_preference,
                benefit_amount, benefit_type, application_process,
                required_documents, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name, category, description, status, beneficiaries_count,
            max_income, min_family_size, social_category, housing_status,
            bpl_required, widow_preference, disability_preference,
            benefit_amount, benefit_type, application_process,
            JSON.stringify(required_documents || []), created_by
        ]);

        res.json({
            success: true,
            message: 'Scheme created successfully',
            schemeId: result.insertId
        });
    } catch (error) {
        console.error('Error creating scheme:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'Scheme name already exists' });
        } else {
            res.status(500).json({ success: false, message: 'Error creating scheme' });
        }
    }
});

// Update existing scheme
app.put('/api/admin/schemes/:id', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        const schemeId = req.params.id;
        const {
            name,
            category,
            description,
            status,
            beneficiaries_count,
            max_income,
            min_family_size,
            social_category,
            housing_status,
            bpl_required,
            widow_preference,
            disability_preference,
            benefit_amount,
            benefit_type,
            application_process,
            required_documents
        } = req.body;

        // Update scheme
        const [result] = await dbPool.execute(`
            UPDATE admin_schemes SET 
                name = ?, category = ?, description = ?, status = ?, beneficiaries_count = ?,
                max_income = ?, min_family_size = ?, social_category = ?, housing_status = ?,
                bpl_required = ?, widow_preference = ?, disability_preference = ?,
                benefit_amount = ?, benefit_type = ?, application_process = ?,
                required_documents = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            name, category, description, status, beneficiaries_count,
            max_income, min_family_size, social_category, housing_status,
            bpl_required, widow_preference, disability_preference,
            benefit_amount, benefit_type, application_process,
            JSON.stringify(required_documents || []), schemeId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        res.json({ success: true, message: 'Scheme updated successfully' });
    } catch (error) {
        console.error('Error updating scheme:', error);
        res.status(500).json({ success: false, message: 'Error updating scheme' });
    }
});

// Delete scheme
app.delete('/api/admin/schemes/:id', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ success: false, message: 'Database not connected' });
        }

        const schemeId = req.params.id;

        // Check if scheme has applications
        const [applications] = await dbPool.execute(
            'SELECT COUNT(*) as count FROM scheme_applications WHERE scheme_id = ?',
            [schemeId]
        );

        if (applications[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete scheme with existing applications. Set status to inactive instead.'
            });
        }

        // Delete scheme
        const [result] = await dbPool.execute('DELETE FROM admin_schemes WHERE id = ?', [schemeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        res.json({ success: true, message: 'Scheme deleted successfully' });
    } catch (error) {
        console.error('Error deleting scheme:', error);
        res.status(500).json({ success: false, message: 'Error deleting scheme' });
    }
});

// Start the server
app.listen(PORT, async () => {
    console.log(`🚀 MigrantConnect server is running on http://localhost:${PORT}`);
    console.log(`📊 API Status: http://localhost:${PORT}/api/status`);

    // Initialize blockchain from database
    await migrantBlockchain.loadFromDatabase();
    console.log(`⛓️ Blockchain initialized with ${migrantBlockchain.chain.length} blocks`);

    // Test database connection
    const dbConnected = await testConnection();
    if (dbConnected) {
        console.log(`📱 You can access your application at:`);
        console.log(`   - Main page: http://localhost:${PORT}/`);
        console.log(`   - Dashboard: http://localhost:${PORT}/dashboard`);
        console.log(`   - API Endpoints:`);
        console.log(`     • GET /api/users - Get all users`);
        console.log(`     • GET /api/users/:migrant_id - Get user by ID`);
        console.log(`     • GET /api/food/:migrant_id - Get food benefits`);
        console.log(`     • GET /api/health/:migrant_id - Get health benefits`);
        console.log(`     • GET /api/education/:migrant_id - Get education benefits`);
        console.log(`     • GET /api/finance/:migrant_id - Get finance benefits`);
        console.log(`   🌐 BECKN Protocol Endpoints:`);
        console.log(`     • POST /api/beckn/search - Discover services`);
        console.log(`     • POST /api/beckn/select - Select service`);
        console.log(`     • POST /api/beckn/confirm - Confirm service usage`);
        console.log(`     • POST /api/beckn/status - Check service status`);
        console.log(`   ⛓️ Blockchain Endpoints:`);
        console.log(`     • POST /api/blockchain/identity/:migrant_id - Add to blockchain`);
        console.log(`     • POST /api/blockchain/transaction/:migrant_id - Log transaction`);
        console.log(`     • GET /api/blockchain/history/:migrant_id - Get blockchain history`);
        console.log(`     • GET /api/blockchain/verify - Verify blockchain integrity`);
        console.log(`     • POST /api/blockchain/qr/:migrant_id - Generate blockchain QR`);
        console.log(`   🔧 Admin Portal Endpoints:`);
        console.log(`     • GET /api/admin/schemes - Get all schemes`);
        console.log(`     • POST /api/admin/schemes - Create new scheme`);
        console.log(`     • PUT /api/admin/schemes/:id - Update scheme`);
        console.log(`     • DELETE /api/admin/schemes/:id - Delete scheme`);
        console.log(`     • POST /api/admin/check-eligibility - Check scheme eligibility`);
    } else {
        console.log(`❌ Database connection failed. Please check your MySQL setup.`);
        console.log(`   1. Make sure MySQL is running`);
        console.log(`   2. Update .env file with correct database credentials`);
        console.log(`   3. Run the database_setup.sql script`);
        console.log(`   4. Run the blockchain_beckn_schema.sql script for new features`);
    }
});
