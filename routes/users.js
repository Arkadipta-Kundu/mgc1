const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users ORDER BY name');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by migrant_id
router.get('/:migrant_id', async (req, res) => {
    try {
        const { migrant_id } = req.params;

        const [userRows] = await pool.execute(
            'SELECT * FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userRows[0];

        // Get user benefits
        const [benefitRows] = await pool.execute(
            'SELECT * FROM benefits WHERE user_id = ?',
            [user.id]
        );

        // Format benefits as expected by frontend
        const benefits = {};
        benefitRows.forEach(benefit => {
            benefits[benefit.benefit_type] = {
                status: benefit.status,
                usage: benefit.usage_percentage
            };
        });

        // Format user data to match frontend expectations
        const userData = {
            name: user.name,
            id: user.migrant_id,
            homeState: user.home_state,
            currentState: user.current_state,
            phone: user.phone,
            aadhaar: user.aadhaar,
            benefits: benefits
        };

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update user information
router.put('/:migrant_id', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { name, phone, current_state } = req.body;

        const [result] = await pool.execute(
            'UPDATE users SET name = ?, phone = ?, current_state = ?, updated_at = CURRENT_TIMESTAMP WHERE migrant_id = ?',
            [name, phone, current_state, migrant_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { migrant_id, name, phone, aadhaar, home_state, current_state } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO users (migrant_id, name, phone, aadhaar, home_state, current_state) VALUES (?, ?, ?, ?, ?, ?)',
            [migrant_id, name, phone, aadhaar, home_state, current_state]
        );

        const userId = result.insertId;

        // Create default benefits for new user
        const benefitTypes = ['food', 'health', 'education', 'finance'];
        for (const benefitType of benefitTypes) {
            await pool.execute(
                'INSERT INTO benefits (user_id, benefit_type, status, usage_percentage) VALUES (?, ?, ?, ?)',
                [userId, benefitType, 'pending', 0]
            );
        }

        res.status(201).json({ message: 'User created successfully', id: userId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router;
