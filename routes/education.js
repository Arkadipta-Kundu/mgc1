const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get education benefits for a user
router.get('/:migrant_id', async (req, res) => {
    try {
        const { migrant_id } = req.params;

        // Get user
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].id;

        // Get education benefits
        const [educationRows] = await pool.execute(
            'SELECT * FROM education_benefits WHERE user_id = ?',
            [userId]
        );

        // Get recent education transactions
        const [transactionRows] = await pool.execute(
            'SELECT * FROM transactions WHERE user_id = ? AND benefit_type = "education" ORDER BY transaction_date DESC LIMIT 5',
            [userId]
        );

        res.json({
            benefits: educationRows[0] || null,
            recentTransactions: transactionRows
        });
    } catch (error) {
        console.error('Error fetching education benefits:', error);
        res.status(500).json({ error: 'Failed to fetch education benefits' });
    }
});

// Update education benefits
router.put('/:migrant_id', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { children_count, scholarship_status, school_transfer_status } = req.body;

        // Get user
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].id;

        // Update education benefits
        await pool.execute(
            'UPDATE education_benefits SET children_count = ?, scholarship_status = ?, school_transfer_status = ? WHERE user_id = ?',
            [children_count, scholarship_status, school_transfer_status, userId]
        );

        res.json({ message: 'Education benefits updated successfully' });
    } catch (error) {
        console.error('Error updating education benefits:', error);
        res.status(500).json({ error: 'Failed to update education benefits' });
    }
});

// Add education transaction
router.post('/:migrant_id/transaction', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { amount, description, location } = req.body;

        // Get user
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].id;

        // Add transaction
        await pool.execute(
            'INSERT INTO transactions (user_id, benefit_type, transaction_type, amount, description, location) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, 'education', 'Education Service', amount, description, location]
        );

        res.status(201).json({ message: 'Education transaction added successfully' });
    } catch (error) {
        console.error('Error adding education transaction:', error);
        res.status(500).json({ error: 'Failed to add education transaction' });
    }
});

module.exports = router;
