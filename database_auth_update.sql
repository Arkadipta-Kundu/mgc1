-- Authentication Enhancement for MigrantConnect
-- Add password and authentication fields to existing database

USE migrantconnect;

-- Add password field to users table
ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'temp123';
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Update existing users with default passwords (for demo)
UPDATE users SET password = 'password123' WHERE migrant_id = 'MIG-BH-001'; -- Ravi Kumar
UPDATE users SET password = 'password123' WHERE migrant_id = 'MIG-UP-002'; -- Priya Sharma  
UPDATE users SET password = 'password123' WHERE migrant_id = 'MIG-WB-003'; -- Amit Das
UPDATE users SET password = 'password123' WHERE migrant_id = 'MIG-RJ-004'; -- Sunita Devi

-- Create a more realistic aadhaar format for login
UPDATE users SET aadhaar = '1234-5678-9012' WHERE migrant_id = 'MIG-BH-001';
UPDATE users SET aadhaar = '2345-6789-0123' WHERE migrant_id = 'MIG-UP-002';
UPDATE users SET aadhaar = '3456-7890-1234' WHERE migrant_id = 'MIG-WB-003';
UPDATE users SET aadhaar = '4567-8901-2345' WHERE migrant_id = 'MIG-RJ-004';

-- Create sessions table for managing user sessions
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_aadhaar ON users(aadhaar);
CREATE INDEX idx_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_active ON users(is_active);

-- Show updated users with login credentials
SELECT migrant_id, name, aadhaar, password, home_state, current_state 
FROM users 
ORDER BY name;

-- Demo Login Credentials:
-- Aadhaar: 1234-5678-9012, Password: password123 (Ravi Kumar)
-- Aadhaar: 2345-6789-0123, Password: password123 (Priya Sharma)
-- Aadhaar: 3456-7890-1234, Password: password123 (Amit Das) 
-- Aadhaar: 4567-8901-2345, Password: password123 (Sunita Devi)
