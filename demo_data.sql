-- MigrantConnect Demo Data
-- Sample users and benefits for testing

USE migrantconnect;

-- Insert demo users with authentication data
INSERT INTO users (migrant_id, name, aadhaar, phone, password, home_state, current_state, is_active) VALUES
('MIG-BI-001', 'Ravi Kumar', '234567890123', '+91-9876543210', 'demo123', 'Bihar', 'Delhi', TRUE),
('MIG-UP-002', 'Priya Sharma', '345678901234', '+91-9876543211', 'demo123', 'Uttar Pradesh', 'Maharashtra', TRUE),
('MIG-WB-003', 'Amit Das', '456789012345', '+91-9876543212', 'demo123', 'West Bengal', 'Karnataka', TRUE),
('MIG-RJ-004', 'Sunita Devi', '567890123456', '+91-9876543213', 'demo123', 'Rajasthan', 'Gujarat', TRUE),
('MIG-TA-005', 'Murugan Raj', '678901234567', '+91-9876543214', 'demo123', 'Tamil Nadu', 'Kerala', TRUE),
('MIG-MH-006', 'Deepak Patil', '789012345678', '+91-9876543215', 'demo123', 'Maharashtra', 'Punjab', TRUE);

-- Insert benefits status for all users
INSERT INTO benefits (user_id, benefit_type, status, usage_percentage) VALUES
-- Ravi Kumar (user_id: 1)
(1, 'food', 'active', 75.00),
(1, 'health', 'active', 25.00),
(1, 'education', 'pending', 0.00),
(1, 'finance', 'active', 60.00),

-- Priya Sharma (user_id: 2)
(2, 'food', 'active', 50.00),
(2, 'health', 'active', 30.00),
(2, 'education', 'active', 80.00),
(2, 'finance', 'active', 40.00),

-- Amit Das (user_id: 3)
(3, 'food', 'active', 90.00),
(3, 'health', 'active', 15.00),
(3, 'education', 'active', 45.00),
(3, 'finance', 'pending', 0.00),

-- Sunita Devi (user_id: 4)
(4, 'food', 'active', 65.00),
(4, 'health', 'active', 35.00),
(4, 'education', 'active', 70.00),
(4, 'finance', 'active', 55.00),

-- Murugan Raj (user_id: 5)
(5, 'food', 'active', 40.00),
(5, 'health', 'active', 20.00),
(5, 'education', 'active', 60.00),
(5, 'finance', 'active', 30.00),

-- Deepak Patil (user_id: 6)
(6, 'food', 'active', 85.00),
(6, 'health', 'active', 45.00),
(6, 'education', 'pending', 0.00),
(6, 'finance', 'active', 70.00);

-- Insert detailed food benefits
INSERT INTO food_benefits (user_id, card_number, rice_used, wheat_used, sugar_used, oil_used, valid_till) VALUES
(1, 'BI-001-0123', 3.75, 3.75, 0.75, 0.75, '2025-12-31'),
(2, 'UP-002-1234', 2.50, 2.50, 0.50, 0.50, '2025-12-31'),
(3, 'WB-003-2345', 4.50, 4.50, 0.90, 0.90, '2025-12-31'),
(4, 'RJ-004-3456', 3.25, 3.25, 0.65, 0.65, '2025-12-31'),
(5, 'TA-005-4567', 2.00, 2.00, 0.40, 0.40, '2025-12-31'),
(6, 'MH-006-5678', 4.25, 4.25, 0.85, 0.85, '2025-12-31');

-- Insert detailed health benefits
INSERT INTO health_benefits (user_id, card_number, family_members, used_amount, valid_till) VALUES
(1, 'AB-001-0123', 4, 125000.00, '2025-12-31'),
(2, 'AB-002-1234', 3, 150000.00, '2025-12-31'),
(3, 'AB-003-2345', 2, 75000.00, '2025-12-31'),
(4, 'AB-004-3456', 5, 175000.00, '2025-12-31'),
(5, 'AB-005-4567', 3, 100000.00, '2025-12-31'),
(6, 'AB-006-5678', 4, 225000.00, '2025-12-31');

-- Insert detailed education benefits
INSERT INTO education_benefits (user_id, children_count, scholarship_amount) VALUES
(1, 0, 0.00),
(2, 2, 15000.00),
(3, 1, 8000.00),
(4, 3, 20000.00),
(5, 2, 12000.00),
(6, 0, 0.00);

-- Insert detailed finance benefits
INSERT INTO finance_benefits (user_id, bank_account, current_loan, credit_score) VALUES
(1, 'SBI00120123', 25000.00, 720),
(2, 'HDFC00231234', 15000.00, 680),
(3, 'ICICI00342345', 0.00, 650),
(4, 'PNB00453456', 30000.00, 700),
(5, 'AXIS00564567', 18000.00, 660),
(6, 'BOI00675678', 35000.00, 740);
