-- ============================================================================
-- MigrantConnect Database Setup - Complete Schema with Demo Data
-- Compatible with Enhanced Registration System and Admin Portal
-- ============================================================================

-- Drop existing tables in correct order (to handle foreign key constraints)
DROP TABLE IF EXISTS `scheme_eligibility_results`;
DROP TABLE IF EXISTS `scheme_applications`;
DROP TABLE IF EXISTS `admin_schemes`;
DROP TABLE IF EXISTS `finance_benefits`;
DROP TABLE IF EXISTS `education_benefits`;
DROP TABLE IF EXISTS `health_benefits`;
DROP TABLE IF EXISTS `food_benefits`;
DROP TABLE IF EXISTS `benefits`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `users`;

-- ============================================================================
-- ADMIN SCHEMES TABLE - For storing government schemes/benefits
-- ============================================================================
CREATE TABLE `admin_schemes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `category` enum('food','health','education','finance','housing','employment','social') NOT NULL,
  `description` text,
  `status` enum('active','inactive','draft') DEFAULT 'active',
  `beneficiaries_count` int DEFAULT 0,
  
  -- Eligibility Criteria (stored as JSON for flexibility)
  `max_income` decimal(10,2) DEFAULT NULL,
  `min_family_size` int DEFAULT 1,
  `social_category` enum('general','obc','sc','st','ews','') DEFAULT '',
  `housing_status` enum('owned','rented','homeless','') DEFAULT '',
  `bpl_required` boolean DEFAULT FALSE,
  `widow_preference` boolean DEFAULT FALSE,
  `disability_preference` boolean DEFAULT FALSE,
  `age_criteria` JSON DEFAULT NULL, -- Store age ranges
  `additional_criteria` JSON DEFAULT NULL, -- Store other criteria
  
  -- Scheme Details
  `benefit_amount` decimal(10,2) DEFAULT NULL,
  `benefit_type` enum('cash','subsidy','service','document') DEFAULT 'service',
  `application_process` text,
  `required_documents` JSON DEFAULT NULL,
  
  -- Administrative
  `created_by` varchar(100) DEFAULT 'system',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `scheme_name_unique` (`name`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SCHEME APPLICATIONS TABLE - Track user applications to schemes
-- ============================================================================
CREATE TABLE `scheme_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `scheme_id` int NOT NULL,
  `application_status` enum('pending','approved','rejected','under_review') DEFAULT 'pending',
  `application_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `approval_date` timestamp NULL DEFAULT NULL,
  `rejection_reason` text,
  `application_data` JSON DEFAULT NULL, -- Store application form data
  `documents_submitted` JSON DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`scheme_id`) REFERENCES `admin_schemes`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `user_scheme_unique` (`user_id`, `scheme_id`),
  INDEX `idx_application_status` (`application_status`),
  INDEX `idx_application_date` (`application_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SCHEME ELIGIBILITY RESULTS TABLE - Store QR scan eligibility results
-- ============================================================================
CREATE TABLE `scheme_eligibility_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `scheme_id` int NOT NULL,
  `is_eligible` boolean NOT NULL,
  `eligibility_score` decimal(5,2) DEFAULT 0,
  `eligibility_reasons` JSON DEFAULT NULL,
  `scan_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `scanned_by` varchar(100) DEFAULT 'admin',
  `qr_data_hash` varchar(64) DEFAULT NULL, -- Hash of QR data for verification
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`scheme_id`) REFERENCES `admin_schemes`(`id`) ON DELETE CASCADE,
  INDEX `idx_eligibility` (`is_eligible`),
  INDEX `idx_scan_date` (`scan_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MAIN USERS TABLE - Enhanced with Comprehensive Registration Data
-- ============================================================================
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `migrant_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `aadhaar` varchar(12) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  
  -- Personal Information
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `marital_status` enum('single','married','divorced','widowed') DEFAULT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  
  -- Family Information
  `family_size` int DEFAULT 1,
  `dependents` int DEFAULT 0,
  `children` int DEFAULT 0,
  `elderly_members` int DEFAULT 0,
  `disabled_members` int DEFAULT 0,
  
  -- Income and Employment
  `monthly_income` decimal(10,2) DEFAULT 0,
  `annual_income` decimal(12,2) DEFAULT 0,
  `employment_type` enum('formal','informal','self-employed','unemployed','farmer','student') DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  
  -- Housing and Assets
  `house_ownership` enum('owned','rented','family','government','homeless') DEFAULT NULL,
  `house_type` enum('pucca','semi-pucca','kutcha','slum') DEFAULT NULL,
  `assets` JSON DEFAULT NULL, -- Store assets as JSON array
  
  -- Location and Migration
  `home_state` varchar(50) NOT NULL,
  `current_state` varchar(50) NOT NULL,
  `migration_reason` enum('employment','education','marriage','family','business','other') DEFAULT NULL,
  `years_in_current_state` int DEFAULT 0,
  
  -- Social Category and Special Circumstances
  `social_category` enum('general','obc','sc','st','ews') NOT NULL,
  `religion` enum('hindu','muslim','christian','sikh','buddhist','jain','other') DEFAULT NULL,
  `special_circumstances` JSON DEFAULT NULL, -- Store special circumstances as JSON array
  
  -- System fields
  `is_active` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `migrant_id` (`migrant_id`),
  UNIQUE KEY `aadhaar` (`aadhaar`),
  KEY `idx_phone` (`phone`),
  KEY `idx_home_state` (`home_state`),
  KEY `idx_current_state` (`current_state`),
  KEY `idx_social_category` (`social_category`),
  KEY `idx_employment_type` (`employment_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- USER SESSIONS TABLE - For authentication management
-- ============================================================================
CREATE TABLE `user_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `session_token` varchar(64) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `user_id` (`user_id`),
  KEY `expires_at` (`expires_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- BENEFITS TABLE - Main benefits tracking
-- ============================================================================
CREATE TABLE `benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `benefit_type` enum('food','health','education','finance') NOT NULL,
  `status` enum('pending','approved','rejected','active') DEFAULT 'pending',
  `usage_percentage` decimal(5,2) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_benefit_type` (`user_id`, `benefit_type`),
  KEY `user_id` (`user_id`),
  KEY `benefit_type` (`benefit_type`),
  KEY `status` (`status`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FOOD BENEFITS TABLE - PDS and food security schemes
-- ============================================================================
CREATE TABLE `food_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `card_number` varchar(50) DEFAULT NULL,
  `card_type` enum('apl','bpl','aay') DEFAULT 'apl',
  `family_members` int DEFAULT 1,
  `monthly_quota` decimal(8,2) DEFAULT 0,
  `valid_till` date DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `card_number` (`card_number`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- HEALTH BENEFITS TABLE - Healthcare schemes and insurance
-- ============================================================================
CREATE TABLE `health_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `card_number` varchar(50) DEFAULT NULL,
  `scheme_name` varchar(100) DEFAULT 'Ayushman Bharat',
  `family_members` int DEFAULT 1,
  `coverage_amount` decimal(10,2) DEFAULT 500000,
  `valid_till` date DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `card_number` (`card_number`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- EDUCATION BENEFITS TABLE - Education schemes and scholarships
-- ============================================================================
CREATE TABLE `education_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `children_count` int DEFAULT 0,
  `scholarship_eligible` boolean DEFAULT FALSE,
  `school_enrolled` int DEFAULT 0,
  `scholarship_amount` decimal(8,2) DEFAULT 0,
  `academic_year` varchar(10) DEFAULT '2024-25',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- FINANCE BENEFITS TABLE - Financial inclusion and banking
-- ============================================================================
CREATE TABLE `finance_benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bank_account` varchar(50) DEFAULT NULL,
  `account_type` enum('savings','current','jan_dhan') DEFAULT 'savings',
  `ifsc_code` varchar(11) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `loan_eligible` boolean DEFAULT FALSE,
  `credit_score` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `bank_account` (`bank_account`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INSERT DEMO DATA
-- ============================================================================

-- Insert Demo User 1 - Comprehensive profile
INSERT INTO `users` (
  `migrant_id`, `name`, `aadhaar`, `phone`, `password`,
  `date_of_birth`, `gender`, `marital_status`, `pan_number`,
  `family_size`, `dependents`, `children`, `elderly_members`, `disabled_members`,
  `monthly_income`, `annual_income`, `employment_type`, `occupation`,
  `house_ownership`, `house_type`, `assets`,
  `home_state`, `current_state`, `migration_reason`, `years_in_current_state`,
  `social_category`, `religion`, `special_circumstances`
) VALUES (
  'MIG-BI-001', 'Ramesh Kumar Singh', '123456789012', '9876543210', 'demo123',
  '1985-03-15', 'male', 'married', 'ABCDE1234F',
  4, 2, 2, 0, 0,
  12000.00, 144000.00, 'informal', 'Construction Worker',
  'rented', 'kutcha', '["vehicle"]',
  'BR', 'MH', 'employment', 3,
  'obc', 'hindu', '["bpl"]'
);

-- Insert Demo User 2 - Different profile
INSERT INTO `users` (
  `migrant_id`, `name`, `aadhaar`, `phone`, `password`,
  `date_of_birth`, `gender`, `marital_status`,
  `family_size`, `dependents`, `children`, `elderly_members`,
  `monthly_income`, `annual_income`, `employment_type`, `occupation`,
  `house_ownership`, `house_type`, `assets`,
  `home_state`, `current_state`, `migration_reason`, `years_in_current_state`,
  `social_category`, `religion`, `special_circumstances`
) VALUES (
  'MIG-UP-002', 'Priya Sharma', '987654321098', '8765432109', 'demo456',
  '1990-08-22', 'female', 'single',
  2, 1, 0, 1,
  8000.00, 96000.00, 'formal', 'Domestic Helper',
  'family', 'semi-pucca', '[]',
  'UP', 'DL', 'education', 1,
  'general', 'hindu', '["widow"]'
);

-- Insert Demo User 3 - Student profile
INSERT INTO `users` (
  `migrant_id`, `name`, `aadhaar`, `phone`, `password`,
  `date_of_birth`, `gender`, `marital_status`,
  `family_size`, `dependents`, `children`,
  `monthly_income`, `annual_income`, `employment_type`, `occupation`,
  `house_ownership`, `house_type`, `assets`,
  `home_state`, `current_state`, `migration_reason`, `years_in_current_state`,
  `social_category`, `religion`, `special_circumstances`
) VALUES (
  'MIG-WB-003', 'Arjun Das', '456789123456', '7654321098', 'student123',
  '2000-12-10', 'male', 'single',
  3, 2, 0,
  5000.00, 60000.00, 'student', 'Student',
  'family', 'pucca', '[]',
  'WB', 'KA', 'education', 2,
  'sc', 'hindu', '[]'
);

-- Insert benefits for demo users
INSERT INTO `benefits` (`user_id`, `benefit_type`, `status`, `usage_percentage`) VALUES
(1, 'food', 'active', 75.00),
(1, 'health', 'approved', 25.00),
(1, 'education', 'active', 60.00),
(1, 'finance', 'pending', 0.00),
(2, 'food', 'active', 50.00),
(2, 'health', 'active', 80.00),
(2, 'education', 'pending', 0.00),
(2, 'finance', 'approved', 40.00),
(3, 'food', 'approved', 30.00),
(3, 'health', 'active', 10.00),
(3, 'education', 'active', 90.00),
(3, 'finance', 'pending', 0.00);

-- Insert detailed benefit records
INSERT INTO `food_benefits` (`user_id`, `card_number`, `card_type`, `family_members`, `monthly_quota`, `valid_till`) VALUES
(1, 'BI-001-9012', 'bpl', 4, 20.00, '2025-12-31'),
(2, 'UP-002-1098', 'apl', 2, 10.00, '2025-12-31'),
(3, 'WB-003-3456', 'apl', 3, 15.00, '2025-12-31');

INSERT INTO `health_benefits` (`user_id`, `card_number`, `scheme_name`, `family_members`, `coverage_amount`, `valid_till`) VALUES
(1, 'AB-001-9012', 'Ayushman Bharat', 4, 500000.00, '2025-12-31'),
(2, 'AB-002-1098', 'Ayushman Bharat', 2, 500000.00, '2025-12-31'),
(3, 'AB-003-3456', 'Ayushman Bharat', 3, 500000.00, '2025-12-31');

INSERT INTO `education_benefits` (`user_id`, `children_count`, `scholarship_eligible`, `school_enrolled`, `scholarship_amount`, `academic_year`) VALUES
(1, 2, TRUE, 2, 5000.00, '2024-25'),
(2, 0, FALSE, 0, 0.00, '2024-25'),
(3, 0, TRUE, 1, 12000.00, '2024-25');

INSERT INTO `finance_benefits` (`user_id`, `bank_account`, `account_type`, `ifsc_code`, `bank_name`, `loan_eligible`, `credit_score`) VALUES
(1, '****9012', 'jan_dhan', 'SBIN0001234', 'State Bank of India', FALSE, 650),
(2, '****1098', 'savings', 'HDFC0002345', 'HDFC Bank', TRUE, 720),
(3, '****3456', 'savings', 'ICIC0003456', 'ICICI Bank', FALSE, 680);

-- ============================================================================
-- INSERT DEMO ADMIN SCHEMES
-- ============================================================================

INSERT INTO `admin_schemes` (
  `name`, `category`, `description`, `status`, `beneficiaries_count`,
  `max_income`, `min_family_size`, `social_category`, `housing_status`,
  `bpl_required`, `widow_preference`, `disability_preference`,
  `benefit_amount`, `benefit_type`, `application_process`,
  `required_documents`, `created_by`
) VALUES 
(
  'Pradhan Mantri Awas Yojana', 'housing', 
  'Affordable housing scheme for urban poor providing financial assistance for home construction and purchase',
  'active', 1250, 18000.00, 2, '', 'homeless', TRUE, FALSE, FALSE,
  120000.00, 'subsidy', 'Apply through local municipal corporation or designated centers',
  '["Aadhaar Card", "Income Certificate", "BPL Card", "Property Documents"]', 'system'
),
(
  'Antyodaya Anna Yojana', 'food',
  'Food security scheme providing subsidized food grains to the poorest of poor families',
  'active', 2800, 15000.00, 1, '', '', TRUE, TRUE, TRUE,
  35.00, 'subsidy', 'Apply at local Fair Price Shop with required documents',
  '["Aadhaar Card", "BPL Card", "Income Certificate", "Residence Proof"]', 'system'
),
(
  'Ayushman Bharat Scheme', 'health',
  'Health insurance scheme providing cashless treatment up to ₹5 lakh per family per year',
  'active', 3500, 25000.00, 1, '', '', FALSE, FALSE, TRUE,
  500000.00, 'service', 'Apply online or at designated enrollment centers',
  '["Aadhaar Card", "Ration Card", "Income Certificate", "Family Photo"]', 'system'
),
(
  'Pradhan Mantri Mudra Yojana', 'finance',
  'Micro-finance scheme providing collateral-free loans for small businesses and entrepreneurship',
  'active', 980, 50000.00, 1, '', '', FALSE, FALSE, FALSE,
  1000000.00, 'cash', 'Apply through participating banks and financial institutions',
  '["Aadhaar Card", "PAN Card", "Business Plan", "Address Proof"]', 'system'
),
(
  'PM Scholarship Scheme', 'education',
  'Scholarship for children of construction workers and other laborers',
  'active', 450, 30000.00, 1, '', '', FALSE, FALSE, FALSE,
  36000.00, 'cash', 'Apply through National Scholarship Portal',
  '["Aadhaar Card", "Income Certificate", "Caste Certificate", "Academic Records"]', 'system'
),
(
  'Widow Pension Scheme', 'social',
  'Monthly pension for widowed women to support their livelihood',
  'active', 1200, 20000.00, 1, '', '', FALSE, TRUE, FALSE,
  1500.00, 'cash', 'Apply through local Block Development Office',
  '["Aadhaar Card", "Death Certificate of Husband", "Income Certificate", "Bank Account Details"]', 'system'
),
(
  'Disability Pension Scheme', 'social',
  'Monthly financial assistance for persons with disabilities',
  'active', 800, 25000.00, 1, '', '', FALSE, FALSE, TRUE,
  2000.00, 'cash', 'Apply with disability certificate at local government office',
  '["Aadhaar Card", "Disability Certificate", "Income Certificate", "Bank Account Details"]', 'system'
),
(
  'Kisan Credit Card', 'finance',
  'Credit facility for farmers to meet agricultural expenses',
  'active', 2200, 200000.00, 1, '', '', FALSE, FALSE, FALSE,
  300000.00, 'cash', 'Apply through participating banks with land documents',
  '["Aadhaar Card", "Land Records", "Income Certificate", "Passport Size Photos"]', 'system'
);

-- ============================================================================
-- DEMO SCHEME APPLICATIONS
-- ============================================================================

INSERT INTO `scheme_applications` (
  `user_id`, `scheme_id`, `application_status`, `application_date`, `application_data`
) VALUES 
(1, 1, 'approved', '2024-11-15 10:30:00', '{"application_type": "new", "preferred_location": "Delhi NCR"}'),
(1, 2, 'pending', '2024-12-01 14:20:00', '{"family_members": 4, "monthly_consumption": "25kg"}'),
(2, 2, 'approved', '2024-11-20 09:15:00', '{"family_members": 3, "monthly_consumption": "15kg"}'),
(2, 6, 'approved', '2024-10-05 11:45:00', '{"pension_start_date": "2024-11-01"}'),
(3, 3, 'under_review', '2024-12-10 16:30:00', '{"medical_history": "none", "preferred_hospital": "Government Hospital"}'),
(3, 5, 'pending', '2024-12-05 13:20:00', '{"course": "Engineering", "college": "Delhi Technical University"}');

-- ============================================================================
-- Display success message
-- ============================================================================
SELECT 'Database setup completed successfully! Admin portal tables created.' AS status;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional indexes for better query performance
CREATE INDEX idx_users_income ON users(monthly_income);
CREATE INDEX idx_users_migration ON users(migration_reason, years_in_current_state);
CREATE INDEX idx_benefits_status_type ON benefits(status, benefit_type);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

SELECT 'Database setup completed successfully!' as status;
SELECT 'Demo users created with comprehensive profiles' as info;
SELECT 'You can now test registration and login functionality' as next_step;
