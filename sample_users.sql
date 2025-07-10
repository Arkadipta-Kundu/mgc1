-- Sample data for MigrantConnect database
-- Created on: July 10, 2025
-- Contains: 5 users with complete benefit data

-- Disable foreign key checks temporarily for easier loading

-- Insert sample users
-- Format: id, migrant_id, name, aadhaar, phone, password, home_state, current_state, is_active, last_login
INSERT INTO `users` (`id`, `migrant_id`, `name`, `aadhaar`, `phone`, `password`, `home_state`, `current_state`, `is_active`, `last_login`) VALUES
(1, 'MG-2025-00101', 'Rajesh Kumar', '879012345678', '9876543210', '$2a$10$HxGz3eFgmxvDjmGVOYRDm.cQqtbE.HvSlvZaov.xCUJCy.K3cwKtS', 'Bihar', 'Maharashtra', 1, '2025-07-09 09:45:22'),
(2, 'MG-2025-00102', 'Priya Sharma', '567890123456', '8765432109', '$2a$10$QpCvR3vTpz5BhXVZO.4g.eGgwCbH7OMGUVxWqZUjr5U4.RcM6CHm2', 'Uttar Pradesh', 'Delhi', 1, '2025-07-08 14:32:19'),
(3, 'MG-2025-00103', 'Mohammad Imran', '678901234567', '7654321098', '$2a$10$DwlXFbUYdPGEHSVFN9Cudu3xRzGG9Hmr28D1qsVI33JB4gvL/vxr6', 'West Bengal', 'Karnataka', 1, '2025-07-10 05:12:37'),
(4, 'MG-2025-00104', 'Lakshmi Narayanan', '456789012345', '6543210987', '$2a$10$JYXHXPjEV.YOBiebLpqXZOJFB7wzCPKND2QOvt1C2LwnA.PtCTBJW', 'Tamil Nadu', 'Kerala', 1, '2025-07-07 18:54:03'),
(5, 'MG-2025-00105', 'Amrita Singh', '345678901234', '5432109876', '$2a$10$JNLUrq1HGe8tX9MYXQXfHeIyZ0IUSOFagN3OVxnF7Xa.n5ERf2CnC', 'Punjab', 'Gujarat', 1, '2025-07-09 12:20:51');

-- Insert benefits summary records
-- Each user has different benefit statuses and usage percentages
INSERT INTO `benefits` (`user_id`, `benefit_type`, `status`, `usage_percentage`) VALUES
-- User 1 (Rajesh Kumar) benefits
(1, 'food', 'active', 65.50),
(1, 'health', 'active', 12.25),
(1, 'education', 'pending', 0.00),
(1, 'finance', 'active', 40.00),
-- User 2 (Priya Sharma) benefits
(2, 'food', 'active', 78.20),
(2, 'health', 'active', 35.75),
(2, 'education', 'active', 90.00),
(2, 'finance', 'active', 25.50),
-- User 3 (Mohammad Imran) benefits
(3, 'food', 'active', 45.80),
(3, 'health', 'pending', 0.00),
(3, 'education', 'active', 52.30),
(3, 'finance', 'suspended', 85.00),
-- User 4 (Lakshmi Narayanan) benefits
(4, 'food', 'active', 23.40),
(4, 'health', 'active', 45.60),
(4, 'education', 'pending', 0.00),
(4, 'finance', 'active', 15.20),
-- User 5 (Amrita Singh) benefits
(5, 'food', 'suspended', 92.75),
(5, 'health', 'active', 18.30),
(5, 'education', 'active', 75.50),
(5, 'finance', 'pending', 0.00);

-- Insert food benefits details
-- Format: user_id, card_number, rice/wheat/sugar/oil quotas and usage, valid_till
INSERT INTO `food_benefits` (`user_id`, `card_number`, `rice_quota`, `wheat_quota`, `sugar_quota`, `oil_quota`, `rice_used`, `wheat_used`, `sugar_used`, `oil_used`, `valid_till`) VALUES
(1, 'NFSA-MH-10045782', 7.00, 3.50, 1.50, 1.00, 4.50, 2.30, 1.00, 0.70, '2026-03-31'),
(2, 'NFSA-DL-20087612', 5.00, 5.00, 1.00, 1.00, 4.20, 3.70, 0.80, 0.50, '2026-02-28'),
(3, 'NFSA-KA-30096574', 6.50, 4.00, 1.20, 1.00, 3.10, 1.75, 0.50, 0.40, '2026-04-30'),
(4, 'NFSA-KL-40014529', 8.00, 2.50, 1.00, 1.50, 1.90, 0.50, 0.30, 0.35, '2026-01-31'),
(5, 'NFSA-GJ-50036128', 5.50, 4.50, 1.00, 1.00, 5.10, 4.20, 0.90, 0.95, '2025-12-31');

-- Insert health benefits details
-- Format: user_id, card_number, family_members, annual_limit, used_amount, valid_till
INSERT INTO `health_benefits` (`user_id`, `card_number`, `family_members`, `annual_limit`, `used_amount`, `valid_till`) VALUES
(1, 'PMJAY-MH-9078563412', 4, 500000.00, 61250.00, '2026-05-31'),
(2, 'PMJAY-DL-7856341209', 3, 500000.00, 178750.00, '2026-04-30'),
(3, 'PMJAY-KA-6534120987', 2, 500000.00, 0.00, '2026-06-30'),
(4, 'PMJAY-KL-5341209876', 5, 500000.00, 228000.00, '2026-03-31'),
(5, 'PMJAY-GJ-4120987654', 3, 500000.00, 91500.00, '2026-02-28');

-- Insert education benefits
-- Format: user_id, children_count, scholarship_amount, academic_year
INSERT INTO `education_benefits` (`user_id`, `children_count`, `scholarship_amount`, `academic_year`) VALUES
(1, 2, 15000.00, '2025-26'),
(2, 1, 24000.00, '2025-26'),
(3, 3, 36000.00, '2025-26'),
(4, 2, 18000.00, '2025-26'),
(5, 2, 30000.00, '2025-26');

-- Insert finance benefits details
-- Format: user_id, bank_account, loan_eligibility, current_loan, credit_score
INSERT INTO `finance_benefits` (`user_id`, `bank_account`, `loan_eligibility`, `current_loan`, `credit_score`) VALUES
(1, '35642018709654', 75000.00, 30000.00, 680),
(2, '67890432157821', 100000.00, 25500.00, 720),
(3, '54321098765432', 25000.00, 21250.00, 590),
(4, '98765432109876', 65000.00, 9880.00, 640),
(5, '23456789012345', 120000.00, 0.00, 710);

-- Insert session data (one active session per user)
INSERT INTO `user_sessions` (`user_id`, `session_token`, `expires_at`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMDA2MTUyMiwiZXhwIjoxNzIwMTQ3OTIyfQ', '2025-07-11 09:45:22'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyMDA2MTUyMiwiZXhwIjoxNzIwMTQ3OTIyfQ', '2025-07-10 14:32:19'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyMDA2MTUyMiwiZXhwIjoxNzIwMTQ3OTIyfQ', '2025-07-11 05:12:37'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcyMDA2MTUyMiwiZXhwIjoxNzIwMTQ3OTIyfQ', '2025-07-08 18:54:03'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTcyMDA2MTUyMiwiZXhwIjoxNzIwMTQ3OTIyfQ', '2025-07-10 12:20:51');

-- Notes: 
-- 1. All passwords are encrypted with bcrypt, the plain text password for all users is "Password@123"
-- 2. The Aadhaar numbers provided are 12-digit fictional numbers (not real)
-- 3. Bank accounts are fictional 14-digit numbers
-- 4. Session tokens are JWT format placeholders (not actual valid tokens)
-- 5. Various benefit statuses are assigned to showcase different scenarios (active/pending/suspended)
