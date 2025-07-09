const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get food benefits for a user
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

        // Get food benefits
        const [foodRows] = await pool.execute(
            'SELECT * FROM food_benefits WHERE user_id = ?',
            [userId]
        );

        // Get recent transactions
        const [transactionRows] = await pool.execute(
            'SELECT * FROM transactions WHERE user_id = ? AND benefit_type = "food" ORDER BY transaction_date DESC LIMIT 5',
            [userId]
        );

        res.json({
            benefits: foodRows[0] || null,
            recentTransactions: transactionRows
        });
    } catch (error) {
        console.error('Error fetching food benefits:', error);
        res.status(500).json({ error: 'Failed to fetch food benefits' });
    }
});

// Update food benefit usage
router.put('/:migrant_id/usage', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { usage_percentage } = req.body;

        // Get user
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].id;

        // Update food benefits usage
        await pool.execute(
            'UPDATE food_benefits SET current_usage_percentage = ? WHERE user_id = ?',
            [usage_percentage, userId]
        );

        // Update general benefits table
        await pool.execute(
            'UPDATE benefits SET usage_percentage = ? WHERE user_id = ? AND benefit_type = "food"',
            [usage_percentage, userId]
        );

        res.json({ message: 'Food benefit usage updated successfully' });
    } catch (error) {
        console.error('Error updating food benefits:', error);
        res.status(500).json({ error: 'Failed to update food benefits' });
    }
});

// Add food transaction
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
            [userId, 'food', 'PDS Purchase', amount, description, location]
        );

        res.status(201).json({ message: 'Food transaction added successfully' });
    } catch (error) {
        console.error('Error adding food transaction:', error);
        res.status(500).json({ error: 'Failed to add food transaction' });
    }
});

module.exports = router;
