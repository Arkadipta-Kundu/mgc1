-- MigrantConnect Complete Database Schema with BECKN Protocol and Blockchain Integration
-- Full database setup for authentication, benefits system, BECKN protocol, and blockchain

-- Create database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS migrantconnect;
-- USE migrantconnect;

-- Disable foreign key checks for clean setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables if they exist (including new blockchain and BECKN tables)
DROP TABLE IF EXISTS qr_generations;
DROP TABLE IF EXISTS beckn_transactions;
DROP TABLE IF EXISTS service_providers;
DROP TABLE IF EXISTS blockchain_blocks;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS finance_benefits;
DROP TABLE IF EXISTS education_benefits;
DROP TABLE IF EXISTS health_benefits;
DROP TABLE IF EXISTS food_benefits;
DROP TABLE IF EXISTS benefits;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- CORE TABLES (Original MigrantConnect)
-- ========================================

-- Users table - core authentication and user data
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    migrant_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    aadhaar VARCHAR(12) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    home_state VARCHAR(50),
    current_state VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_aadhaar (aadhaar),
    INDEX idx_migrant_id (migrant_id),
    INDEX idx_active (is_active),
    INDEX idx_users_states (home_state, current_state)
);

-- User sessions table - authentication sessions
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_expires (expires_at)
);

-- Benefits table - tracks benefit status for each user
CREATE TABLE benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    benefit_type ENUM('food', 'health', 'education', 'finance') NOT NULL,
    status ENUM('active', 'pending', 'suspended') DEFAULT 'pending',
    usage_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_benefit (user_id, benefit_type),
    INDEX idx_user_benefits (user_id),
    INDEX idx_benefit_type (benefit_type),
    INDEX idx_status (status),
    INDEX idx_benefits_user_type (user_id, benefit_type)
);

-- Food benefits table - detailed food ration data
CREATE TABLE food_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_number VARCHAR(50) UNIQUE NOT NULL,
    rice_quota DECIMAL(8,2) DEFAULT 5.00,
    wheat_quota DECIMAL(8,2) DEFAULT 5.00,
    sugar_quota DECIMAL(8,2) DEFAULT 1.00,
    oil_quota DECIMAL(8,2) DEFAULT 1.00,
    rice_used DECIMAL(8,2) DEFAULT 0.00,
    wheat_used DECIMAL(8,2) DEFAULT 0.00,
    sugar_used DECIMAL(8,2) DEFAULT 0.00,
    oil_used DECIMAL(8,2) DEFAULT 0.00,
    current_usage_percentage DECIMAL(5,2) DEFAULT 0.00,
    valid_till DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_food (user_id),
    INDEX idx_card_number (card_number),
    INDEX idx_valid_till (valid_till)
);

-- Health benefits table - healthcare coverage data
CREATE TABLE health_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_number VARCHAR(50) UNIQUE NOT NULL,
    family_members INT DEFAULT 1,
    annual_limit DECIMAL(10,2) DEFAULT 500000.00,
    used_amount DECIMAL(10,2) DEFAULT 0.00,
    valid_till DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_health (user_id),
    INDEX idx_health_card (card_number),
    INDEX idx_health_valid (valid_till)
);

-- Education benefits table - scholarship and education data
CREATE TABLE education_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    children_count INT DEFAULT 0,
    scholarship_amount DECIMAL(10,2) DEFAULT 0.00,
    academic_year VARCHAR(20) DEFAULT '2024-25',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_education (user_id),
    INDEX idx_academic_year (academic_year)
);

-- Finance benefits table - banking and financial data
CREATE TABLE finance_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    bank_account VARCHAR(50),
    balance DECIMAL(15,2) DEFAULT 0.00,
    loan_eligibility DECIMAL(10,2) DEFAULT 50000.00,
    current_loan DECIMAL(10,2) DEFAULT 0.00,
    credit_score INT DEFAULT 650,
    insurance_coverage DECIMAL(10,2) DEFAULT 200000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_finance (user_id),
    INDEX idx_credit_score (credit_score)
);

-- Transactions table - for tracking all benefit usage (Enhanced with blockchain and BECKN integration)
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    benefit_type ENUM('food', 'health', 'education', 'finance') NOT NULL,
    transaction_type VARCHAR(100),
    amount DECIMAL(10,2),
    description TEXT,
    location VARCHAR(100),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blockchain_hash VARCHAR(64),
    beckn_transaction_id VARCHAR(100),
    verification_status ENUM('pending', 'blockchain_verified', 'beckn_confirmed') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_transactions_user_id (user_id),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_type_date (benefit_type, transaction_date),
    INDEX idx_blockchain_hash (blockchain_hash),
    INDEX idx_beckn_transaction (beckn_transaction_id)
);

-- ========================================
-- BLOCKCHAIN INTEGRATION TABLES
-- ========================================

-- Blockchain blocks table
CREATE TABLE blockchain_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    block_index INT NOT NULL,
    block_hash VARCHAR(64) NOT NULL UNIQUE,
    previous_hash VARCHAR(64) NOT NULL,
    block_data JSON NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    nonce INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_block_index (block_index),
    INDEX idx_block_hash (block_hash),
    INDEX idx_timestamp (timestamp)
);

-- QR code generations log with blockchain verification
CREATE TABLE qr_generations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    migrant_id VARCHAR(50) NOT NULL,
    qr_data TEXT NOT NULL,
    blockchain_hash VARCHAR(64),
    generation_method ENUM('standard', 'blockchain', 'beckn') DEFAULT 'standard',
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (migrant_id) REFERENCES users(migrant_id) ON DELETE CASCADE,
    INDEX idx_migrant_id (migrant_id),
    INDEX idx_blockchain_hash (blockchain_hash),
    INDEX idx_expires_at (expires_at),
    INDEX idx_active (is_active)
);

-- ========================================
-- BECKN PROTOCOL INTEGRATION TABLES
-- ========================================

-- Service providers table (for BECKN protocol)
CREATE TABLE service_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id VARCHAR(100) NOT NULL UNIQUE,
    provider_name VARCHAR(200) NOT NULL,
    provider_type ENUM('government', 'private', 'ngo') NOT NULL,
    service_categories JSON NOT NULL,
    locations JSON NOT NULL,
    beckn_uri VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_provider_id (provider_id),
    INDEX idx_provider_type (provider_type),
    INDEX idx_active (is_active)
);

-- BECKN protocol transactions table
CREATE TABLE beckn_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    context JSON NOT NULL,
    message JSON NOT NULL,
    action_type ENUM('search', 'select', 'confirm', 'status', 'cancel') NOT NULL,
    migrant_id VARCHAR(50),
    provider_id VARCHAR(100),
    service_type VARCHAR(50),
    status ENUM('initiated', 'confirmed', 'completed', 'failed') DEFAULT 'initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (migrant_id) REFERENCES users(migrant_id) ON DELETE SET NULL,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_migrant_id (migrant_id),
    INDEX idx_action_type (action_type),
    INDEX idx_status (status)
);

-- ========================================
-- SAMPLE DATA INSERTION
-- ========================================

-- Insert sample users
INSERT INTO users (migrant_id, name, phone, aadhaar, password, home_state, current_state) VALUES
('MIG-BH-001', 'Ravi Kumar', '+91-9876543210', '234567890123', 'demo123', 'Bihar', 'Delhi'),
('MIG-UP-002', 'Priya Sharma', '+91-9876543211', '345678901234', 'demo123', 'Uttar Pradesh', 'Maharashtra'),
('MIG-WB-003', 'Amit Das', '+91-9876543212', '456789012345', 'demo123', 'West Bengal', 'Karnataka'),
('MIG-RJ-004', 'Sunita Devi', '+91-9876543213', '567890123456', 'demo123', 'Rajasthan', 'Gujarat'),
('MIG-TN-005', 'Murugan Raj', '+91-9876543214', '678901234567', 'demo123', 'Tamil Nadu', 'Kerala'),
('MIG-MH-006', 'Deepak Patil', '+91-9876543215', '789012345678', 'demo123', 'Maharashtra', 'Karnataka');

-- Insert benefits for each user
INSERT INTO benefits (user_id, benefit_type, status, usage_percentage) VALUES
-- User 1 (Ravi Kumar)
(1, 'food', 'active', 75.00),
(1, 'health', 'active', 25.00),
(1, 'education', 'pending', 0.00),
(1, 'finance', 'active', 60.00),
-- User 2 (Priya Sharma)
(2, 'food', 'active', 60.00),
(2, 'health', 'active', 40.00),
(2, 'education', 'active', 80.00),
(2, 'finance', 'pending', 0.00),
-- User 3 (Amit Das)
(3, 'food', 'active', 90.00),
(3, 'health', 'pending', 0.00),
(3, 'education', 'active', 50.00),
(3, 'finance', 'active', 30.00),
-- User 4 (Sunita Devi)
(4, 'food', 'active', 45.00),
(4, 'health', 'active', 70.00),
(4, 'education', 'active', 90.00),
(4, 'finance', 'active', 40.00),
-- User 5 (Murugan Raj)
(5, 'food', 'pending', 0.00),
(5, 'health', 'active', 20.00),
(5, 'education', 'pending', 0.00),
(5, 'finance', 'active', 85.00),
-- User 6 (Deepak Patil)
(6, 'food', 'active', 55.00),
(6, 'health', 'active', 35.00),
(6, 'education', 'active', 70.00),
(6, 'finance', 'active', 75.00);

-- Insert food benefits
INSERT INTO food_benefits (user_id, card_number, current_usage_percentage, valid_till) VALUES
(1, 'BH-001-1234', 75.00, '2025-12-31'),
(2, 'UP-002-2345', 60.00, '2025-12-31'),
(3, 'WB-003-3456', 90.00, '2025-12-31'),
(4, 'RJ-004-4567', 45.00, '2025-12-31'),
(5, 'TN-005-5678', 0.00, '2025-12-31'),
(6, 'MH-006-6789', 55.00, '2025-12-31');

-- Insert health benefits
INSERT INTO health_benefits (user_id, card_number, family_members, used_amount, valid_till) VALUES
(1, 'AB-001-1234', 4, 125000.00, '2025-12-31'),
(2, 'AB-002-2345', 3, 200000.00, '2025-12-31'),
(3, 'AB-003-3456', 2, 0.00, '2025-12-31'),
(4, 'AB-004-4567', 5, 350000.00, '2025-12-31'),
(5, 'AB-005-5678', 1, 100000.00, '2025-12-31'),
(6, 'AB-006-6789', 3, 175000.00, '2025-12-31');

-- Insert education benefits
INSERT INTO education_benefits (user_id, children_count, scholarship_amount) VALUES
(1, 0, 0.00),
(2, 2, 15000.00),
(3, 1, 7500.00),
(4, 3, 22500.00),
(5, 0, 0.00),
(6, 2, 15000.00);

-- Insert finance benefits
INSERT INTO finance_benefits (user_id, bank_account, balance) VALUES
(1, '****1234', 15450.75),
(2, '****2345', 8750.50),
(3, '****3456', 25600.25),
(4, '****4567', 12300.00),
(5, '****5678', 45750.80),
(6, '****6789', 18950.40);

-- Insert sample transactions
INSERT INTO transactions (user_id, benefit_type, transaction_type, amount, description, location) VALUES
(1, 'food', 'Purchase', 325.50, 'Monthly ration - Rice, Wheat, Sugar', 'Delhi Fair Price Shop'),
(1, 'health', 'Medical Treatment', 5000.00, 'General checkup and medicines', 'AIIMS Delhi'),
(2, 'education', 'Scholarship', 7500.00, 'Monthly scholarship payment', 'School Direct Transfer'),
(3, 'food', 'Purchase', 290.75, 'Weekly grocery purchase', 'Bangalore PDS Center'),
(4, 'health', 'Medical Treatment', 15000.00, 'Emergency treatment', 'Civil Hospital Ahmedabad');

-- Insert BECKN service providers
INSERT INTO service_providers (provider_id, provider_name, provider_type, service_categories, locations, beckn_uri) VALUES
('pds-delhi', 'Public Distribution System Delhi', 'government', 
 '["food-benefits", "ration-distribution"]', 
 '[{"city": "Delhi", "areas": ["Central Delhi", "North Delhi", "South Delhi"]}]',
 'https://pds.delhi.gov.in/beckn'),
 
('ayushman-bharat', 'Ayushman Bharat National Health Mission', 'government',
 '["health-benefits", "medical-coverage", "cashless-treatment"]',
 '[{"city": "*", "areas": ["pan-india"]}]',
 'https://pmjay.gov.in/beckn'),
 
('sarva-shiksha', 'Sarva Shiksha Abhiyan', 'government',
 '["education-benefits", "school-admission", "midday-meal"]',
 '[{"city": "*", "areas": ["pan-india"]}]',
 'https://ssa.nic.in/beckn'),
 
('pmjdy-banks', 'PM Jan Dhan Yojana Banking Network', 'government',
 '["financial-services", "banking", "digital-payments"]',
 '[{"city": "*", "areas": ["pan-india"]}]',
 'https://pmjdy.gov.in/beckn'),

('pds-mumbai', 'Public Distribution System Maharashtra', 'government',
 '["food-benefits", "ration-distribution"]',
 '[{"city": "Mumbai", "areas": ["Mumbai City", "Mumbai Suburban"]}]',
 'https://pds.maharashtra.gov.in/beckn'),

('karnataka-health', 'Karnataka State Health Mission', 'government',
 '["health-benefits", "state-health-coverage"]',
 '[{"city": "Bangalore", "areas": ["Bangalore Urban", "Bangalore Rural"]}]',
 'https://health.karnataka.gov.in/beckn');

-- Insert blockchain genesis block
INSERT INTO blockchain_blocks (block_index, block_hash, previous_hash, block_data, timestamp, nonce) VALUES
(0, 'genesis123hash456789abcdef', '0', 
 '{"type": "GENESIS", "message": "MigrantConnect Blockchain Genesis - Portable Services for Mobile Workers", "version": "1.0", "created_by": "MigrantConnect", "purpose": "Immutable record of migrant worker benefits and services"}',
 '2025-01-01 00:00:00', 0);

-- Insert sample QR generations
INSERT INTO qr_generations (migrant_id, qr_data, generation_method, expires_at) VALUES
('MIG-BH-001', '{"migrant_id":"MIG-BH-001","name":"Ravi Kumar","verified":true}', 'standard', DATE_ADD(NOW(), INTERVAL 30 DAY)),
('MIG-UP-002', '{"migrant_id":"MIG-UP-002","name":"Priya Sharma","verified":true}', 'standard', DATE_ADD(NOW(), INTERVAL 30 DAY));

-- ========================================
-- CREATE ADDITIONAL INDEXES FOR PERFORMANCE
-- ========================================

-- Additional performance indexes
CREATE INDEX idx_users_login ON users(aadhaar, password);
CREATE INDEX idx_benefits_status_type ON benefits(status, benefit_type);
CREATE INDEX idx_food_benefits_usage ON food_benefits(current_usage_percentage);
CREATE INDEX idx_health_benefits_usage ON health_benefits(used_amount);
CREATE INDEX idx_transactions_recent ON transactions(user_id, transaction_date DESC);

-- ========================================
-- DATABASE SETUP COMPLETE
-- ========================================

-- Display success message
SELECT 
    'MigrantConnect Database Setup Complete!' as Status,
    'BECKN Protocol Integration: Enabled' as BECKN_Status,
    'Blockchain Integration: Enabled' as Blockchain_Status,
    COUNT(DISTINCT u.id) as Total_Users,
    COUNT(DISTINCT b.id) as Total_Benefits,
    COUNT(DISTINCT t.id) as Total_Transactions,
    COUNT(DISTINCT sp.id) as Service_Providers,
    COUNT(DISTINCT bb.id) as Blockchain_Blocks
FROM users u
LEFT JOIN benefits b ON u.id = b.user_id
LEFT JOIN transactions t ON u.id = t.user_id
LEFT JOIN service_providers sp ON sp.is_active = TRUE
LEFT JOIN blockchain_blocks bb ON bb.id IS NOT NULL;
