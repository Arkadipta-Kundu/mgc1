-- Blockchain Integration Schema for MigrantConnect
-- Add these tables to support blockchain functionality

-- Blockchain blocks table
CREATE TABLE IF NOT EXISTS blockchain_blocks (
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

-- BECKN protocol transactions table
CREATE TABLE IF NOT EXISTS beckn_transactions (
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

-- Service providers table (for BECKN)
CREATE TABLE IF NOT EXISTS service_providers (
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

-- Enhanced transactions table with blockchain integration
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS blockchain_hash VARCHAR(64);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS beckn_transaction_id VARCHAR(100);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS verification_status ENUM('pending', 'blockchain_verified', 'beckn_confirmed') DEFAULT 'pending';

-- QR code generations log with blockchain
CREATE TABLE IF NOT EXISTS qr_generations (
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

-- Insert sample service providers
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
 'https://pmjdy.gov.in/beckn');

-- Add sample blockchain genesis entries
INSERT INTO blockchain_blocks (block_index, block_hash, previous_hash, block_data, timestamp, nonce) VALUES
(0, 'genesis123hash456', '0', 
 '{"type": "GENESIS", "message": "MigrantConnect Blockchain Genesis", "version": "1.0"}',
 '2025-01-01 00:00:00', 0);

-- Add indexes for better performance
CREATE INDEX idx_users_states ON users(home_state, current_state);
CREATE INDEX idx_benefits_user_type ON benefits(user_id, benefit_type);
CREATE INDEX idx_transactions_type_date ON transactions(benefit_type, transaction_date);
