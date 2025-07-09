-- MigrantConnect Database Schema
-- Fresh database setup for authentication and benefits system

-- -- Create database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS migrantconnect;
-- USE migrantconnect;

-- Disable foreign key checks for clean setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables if they exist
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS finance_benefits;
DROP TABLE IF EXISTS education_benefits;
DROP TABLE IF EXISTS health_benefits;
DROP TABLE IF EXISTS food_benefits;
DROP TABLE IF EXISTS benefits;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

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
    INDEX idx_active (is_active)
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
    INDEX idx_status (status)
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
    loan_eligibility DECIMAL(10,2) DEFAULT 50000.00,
    current_loan DECIMAL(10,2) DEFAULT 0.00,
    credit_score INT DEFAULT 650,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_finance (user_id),
    INDEX idx_credit_score (credit_score)
);
