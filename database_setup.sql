-- MigrantConnect Database Setup
-- Execute these commands in your MySQL client

-- -- Create database
-- CREATE DATABASE migrantconnect;
-- USE migrantconnect;

-- 1. Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    migrant_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    aadhaar VARCHAR(20),
    home_state VARCHAR(50),
    current_state VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Benefits table
CREATE TABLE benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    benefit_type ENUM('food', 'health', 'education', 'finance') NOT NULL,
    status ENUM('active', 'pending', 'inactive') DEFAULT 'pending',
    usage_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Food benefits details
CREATE TABLE food_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    card_number VARCHAR(50),
    monthly_rice_kg INT DEFAULT 5,
    monthly_wheat_kg INT DEFAULT 5,
    monthly_sugar_kg INT DEFAULT 1,
    monthly_oil_liters INT DEFAULT 1,
    current_usage_percentage INT DEFAULT 0,
    valid_till DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Health benefits details
CREATE TABLE health_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    card_number VARCHAR(50),
    coverage_amount DECIMAL(10,2) DEFAULT 500000.00,
    used_amount DECIMAL(10,2) DEFAULT 0.00,
    family_members INT DEFAULT 1,
    valid_till DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Education benefits details
CREATE TABLE education_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    children_count INT DEFAULT 0,
    scholarship_status ENUM('active', 'pending', 'not_applied') DEFAULT 'not_applied',
    school_transfer_status ENUM('completed', 'pending', 'not_required') DEFAULT 'not_required',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Finance benefits details
CREATE TABLE finance_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    bank_account VARCHAR(50),
    balance DECIMAL(10,2) DEFAULT 0.00,
    loan_eligibility DECIMAL(10,2) DEFAULT 50000.00,
    pension_amount DECIMAL(10,2) DEFAULT 1200.00,
    insurance_coverage DECIMAL(10,2) DEFAULT 200000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Transactions table for tracking usage
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    benefit_type ENUM('food', 'health', 'education', 'finance') NOT NULL,
    transaction_type VARCHAR(100),
    amount DECIMAL(10,2),
    description TEXT,
    location VARCHAR(100),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data based on your existing users
INSERT INTO users (migrant_id, name, phone, aadhaar, home_state, current_state) VALUES
('MIG-BH-001', 'Ravi Kumar', '+91-9876543210', '****-****-1234', 'Bihar', 'Delhi'),
('MIG-UP-002', 'Priya Sharma', '+91-9876543211', '****-****-5678', 'Uttar Pradesh', 'Maharashtra'),
('MIG-WB-003', 'Amit Das', '+91-9876543212', '****-****-9012', 'West Bengal', 'Karnataka'),
('MIG-RJ-004', 'Sunita Devi', '+91-9876543213', '****-****-3456', 'Rajasthan', 'Gujarat');

-- Insert benefits for each user
INSERT INTO benefits (user_id, benefit_type, status, usage_percentage) VALUES
-- Ravi Kumar (user_id: 1)
(1, 'food', 'active', 75),
(1, 'health', 'active', 25),
(1, 'education', 'pending', 0),
(1, 'finance', 'active', 60),
-- Priya Sharma (user_id: 2)
(2, 'food', 'active', 50),
(2, 'health', 'active', 30),
(2, 'education', 'active', 80),
(2, 'finance', 'active', 40),
-- Amit Das (user_id: 3)
(3, 'food', 'active', 90),
(3, 'health', 'active', 15),
(3, 'education', 'active', 45),
(3, 'finance', 'pending', 0),
-- Sunita Devi (user_id: 4)
(4, 'food', 'active', 65),
(4, 'health', 'active', 35),
(4, 'education', 'active', 70),
(4, 'finance', 'active', 55);

-- Insert detailed benefit information
INSERT INTO food_benefits (user_id, card_number, current_usage_percentage, valid_till) VALUES
(1, 'BH-001-1234', 75, '2025-03-31'),
(2, 'UP-002-5678', 50, '2025-03-31'),
(3, 'WB-003-9012', 90, '2025-03-31'),
(4, 'RJ-004-3456', 65, '2025-03-31');

INSERT INTO health_benefits (user_id, card_number, used_amount, family_members, valid_till) VALUES
(1, 'AB-001-1234', 125000.00, 4, '2025-03-31'),
(2, 'AB-002-5678', 150000.00, 3, '2025-03-31'),
(3, 'AB-003-9012', 75000.00, 5, '2025-03-31'),
(4, 'AB-004-3456', 175000.00, 4, '2025-03-31');

INSERT INTO education_benefits (user_id, children_count, scholarship_status, school_transfer_status) VALUES
(1, 2, 'not_applied', 'not_required'),
(2, 1, 'active', 'completed'),
(3, 3, 'pending', 'pending'),
(4, 1, 'active', 'not_required');

INSERT INTO finance_benefits (user_id, bank_account, balance) VALUES
(1, '****1234', 15450.00),
(2, '****5678', 22340.00),
(3, '****9012', 8750.00),
(4, '****3456', 18920.00);

-- Insert some sample transactions
INSERT INTO transactions (user_id, benefit_type, transaction_type, amount, description, location) VALUES
(1, 'food', 'PDS Purchase', 285.50, 'Rice and Wheat - November 2024', 'Delhi Fair Price Shop'),
(1, 'health', 'Medical Treatment', 25000.00, 'Consultation and medicines', 'AIIMS Delhi'),
(2, 'education', 'Scholarship', 5000.00, 'Monthly scholarship amount', 'Maharashtra Education Dept'),
(3, 'food', 'PDS Purchase', 342.75, 'Monthly ration - December 2024', 'Karnataka FPS-142'),
(4, 'finance', 'Pension', 1200.00, 'Monthly pension credit', 'Gujarat State Pension');

-- Create indexes for better performance
CREATE INDEX idx_users_migrant_id ON users(migrant_id);
CREATE INDEX idx_benefits_user_id ON benefits(user_id);
CREATE INDEX idx_benefits_type ON benefits(benefit_type);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);

-- Show all tables
SHOW TABLES;

-- Verify data
SELECT u.name, u.migrant_id, b.benefit_type, b.status, b.usage_percentage 
FROM users u 
JOIN benefits b ON u.id = b.user_id 
ORDER BY u.name, b.benefit_type;
