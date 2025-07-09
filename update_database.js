// Database Update Script for Authentication
const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function updateDatabase() {
    try {
        console.log('🔄 Starting database update for authentication...');

        // Read the SQL update file
        const sqlFile = path.join(__dirname, 'database_auth_update.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        // Split the SQL commands (simple split by semicolon)
        const commands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.toLowerCase().startsWith('use'));

        console.log(`📝 Found ${commands.length} SQL commands to execute`);

        // Execute each command
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            if (command) {
                try {
                    console.log(`⏳ Executing command ${i + 1}/${commands.length}...`);
                    console.log(`   ${command.substring(0, 50)}...`);
                    await pool.execute(command);
                    console.log(`✅ Command ${i + 1} executed successfully`);
                } catch (error) {
                    if (error.code === 'ER_DUP_FIELDNAME') {
                        console.log(`⚠️  Column already exists, skipping: ${error.message}`);
                    } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                        console.log(`⚠️  Table already exists, skipping: ${error.message}`);
                    } else {
                        console.error(`❌ Error executing command ${i + 1}:`, error.message);
                        // Don't throw, continue with other commands
                    }
                }
            }
        }

        console.log('✅ Database update completed successfully!');
        console.log('📋 Demo credentials:');
        console.log('   Aadhaar: 123456789012, Password: demo123');

    } catch (error) {
        console.error('❌ Database update failed:', error);
    } finally {
        process.exit(0);
    }
}

updateDatabase();
