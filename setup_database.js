// Database Setup Script for MigrantConnect
// This script sets up the complete database schema and demo data

const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        console.log('🔄 Starting fresh database setup...');

        // Step 1: Setup schema
        console.log('📋 Setting up database schema...');
        const schemaFile = path.join(__dirname, 'database_schema.sql');
        const schemaSQL = fs.readFileSync(schemaFile, 'utf8');
        
        // Execute schema setup
        await executeSQL(schemaSQL, 'Schema');

        // Step 2: Insert demo data
        console.log('📊 Inserting demo data...');
        const demoFile = path.join(__dirname, 'demo_data.sql');
        const demoSQL = fs.readFileSync(demoFile, 'utf8');
        
        // Execute demo data
        await executeSQL(demoSQL, 'Demo Data');

        // Step 3: Verify setup
        await verifySetup();

        console.log('\n✅ Database setup completed successfully!');
        console.log('\n📋 Demo Login Credentials:');
        console.log('   Aadhaar: 234567890123, Password: demo123 (Ravi Kumar)');
        console.log('   Aadhaar: 345678901234, Password: demo123 (Priya Sharma)');
        console.log('   Aadhaar: 456789012345, Password: demo123 (Amit Das)');
        console.log('   Aadhaar: 567890123456, Password: demo123 (Sunita Devi)');
        console.log('   Aadhaar: 678901234567, Password: demo123 (Murugan Raj)');
        console.log('   Aadhaar: 789012345678, Password: demo123 (Deepak Patil)');
        console.log('\n🚀 Server is ready! Start with: npm start');

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

async function executeSQL(sqlContent, label) {
    // Split SQL into individual statements
    const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => 
            stmt.length > 0 && 
            !stmt.startsWith('--') && 
            !stmt.toLowerCase().startsWith('use migrantconnect')
        );

    console.log(`   Found ${statements.length} ${label.toLowerCase()} statements`);

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement && statement.trim().length > 0) {
            try {
                const preview = statement.replace(/\s+/g, ' ').substring(0, 50);
                console.log(`   ⏳ Executing: ${preview}...`);
                
                await pool.execute(statement);
                console.log(`   ✅ Statement ${i + 1}/${statements.length} completed`);
            } catch (error) {
                console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
                console.error(`   Statement: ${statement.substring(0, 100)}...`);
                throw error;
            }
        }
    }
}

async function verifySetup() {
    console.log('\n🔍 Verifying database setup...');

    try {
        // Check users table
        const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
        console.log(`   👥 Users: ${users[0].count}`);

        // Check benefits table
        const [benefits] = await pool.execute('SELECT COUNT(*) as count FROM benefits');
        console.log(`   🎁 Benefits: ${benefits[0].count}`);

        // Check sessions table
        const [sessions] = await pool.execute('SHOW TABLES LIKE "user_sessions"');
        console.log(`   🔑 Sessions table: ${sessions.length > 0 ? 'Created' : 'Missing'}`);

        // Check specific benefit tables
        const [foodBenefits] = await pool.execute('SELECT COUNT(*) as count FROM food_benefits');
        console.log(`   🍚 Food benefits: ${foodBenefits[0].count}`);

        const [healthBenefits] = await pool.execute('SELECT COUNT(*) as count FROM health_benefits');
        console.log(`   🏥 Health benefits: ${healthBenefits[0].count}`);

        const [educationBenefits] = await pool.execute('SELECT COUNT(*) as count FROM education_benefits');
        console.log(`   🎓 Education benefits: ${educationBenefits[0].count}`);

        const [financeBenefits] = await pool.execute('SELECT COUNT(*) as count FROM finance_benefits');
        console.log(`   💰 Finance benefits: ${financeBenefits[0].count}`);

        // Test a sample login query
        const [testUser] = await pool.execute(
            'SELECT u.*, COUNT(b.id) as benefit_count FROM users u LEFT JOIN benefits b ON u.id = b.user_id WHERE u.aadhaar = ?',
            ['234567890123']
        );
        console.log(`   🧪 Test query: User found with ${testUser[0]?.benefit_count || 0} benefits`);

    } catch (error) {
        console.error('   ❌ Verification failed:', error.message);
        throw error;
    }
}

// Run setup
setupDatabase();
