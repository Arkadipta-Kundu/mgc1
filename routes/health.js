const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get health benefits for a user
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

        // Get health benefits
        const [healthRows] = await pool.execute(
            'SELECT * FROM health_benefits WHERE user_id = ?',
            [userId]
        );

        // Get recent medical history
        const [transactionRows] = await pool.execute(
            'SELECT * FROM transactions WHERE user_id = ? AND benefit_type = "health" ORDER BY transaction_date DESC LIMIT 5',
            [userId]
        );

        res.json({
            benefits: healthRows[0] || null,
            medicalHistory: transactionRows
        });
    } catch (error) {
        console.error('Error fetching health benefits:', error);
        res.status(500).json({ error: 'Failed to fetch health benefits' });
    }
});

// Update health benefit usage
router.put('/:migrant_id/usage', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { used_amount } = req.body;

        // Get user
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].id;

        // Calculate usage percentage
        const usagePercentage = Math.round((used_amount / 500000) * 100);

        // Update health benefits
        await pool.execute(
            'UPDATE health_benefits SET used_amount = ? WHERE user_id = ?',
            [used_amount, userId]
        );

        // Update general benefits table
        await pool.execute(
            'UPDATE benefits SET usage_percentage = ? WHERE user_id = ? AND benefit_type = "health"',
            [usagePercentage, userId]
        );

        res.json({ message: 'Health benefit usage updated successfully' });
    } catch (error) {
        console.error('Error updating health benefits:', error);
        res.status(500).json({ error: 'Failed to update health benefits' });
    }
});

// Add health transaction
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
            [userId, 'health', 'Medical Treatment', amount, description, location]
        );

        res.status(201).json({ message: 'Health transaction added successfully' });
    } catch (error) {
        console.error('Error adding health transaction:', error);
        res.status(500).json({ error: 'Failed to add health transaction' });
    }
});

module.exports = router;
