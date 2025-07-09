const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get finance benefits for a user
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

        // Get finance benefits
        const [financeRows] = await pool.execute(
            'SELECT * FROM finance_benefits WHERE user_id = ?',
            [userId]
        );

        // Get recent financial transactions
        const [transactionRows] = await pool.execute(
            'SELECT * FROM transactions WHERE user_id = ? AND benefit_type = "finance" ORDER BY transaction_date DESC LIMIT 10',
            [userId]
        );

        res.json({
            benefits: financeRows[0] || null,
            recentTransactions: transactionRows
        });
    } catch (error) {
        console.error('Error fetching finance benefits:', error);
        res.status(500).json({ error: 'Failed to fetch finance benefits' });
    }
});

// Update account balance
router.put('/:migrant_id/balance', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { balance } = req.body;

        // Get user
        const [userRows] = await pool.execute(
            'SELECT id FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].id;

        // Update balance
        await pool.execute(
            'UPDATE finance_benefits SET balance = ? WHERE user_id = ?',
            [balance, userId]
        );

        res.json({ message: 'Balance updated successfully' });
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({ error: 'Failed to update balance' });
    }
});

// Add financial transaction
router.post('/:migrant_id/transaction', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { transaction_type, amount, description, location } = req.body;

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
            [userId, 'finance', transaction_type, amount, description, location]
        );

        // Update balance if it's a credit/debit transaction
        if (transaction_type === 'Credit' || transaction_type === 'Debit') {
            const [currentBalance] = await pool.execute(
                'SELECT balance FROM finance_benefits WHERE user_id = ?',
                [userId]
            );

            if (currentBalance.length > 0) {
                const newBalance = transaction_type === 'Credit'
                    ? parseFloat(currentBalance[0].balance) + parseFloat(amount)
                    : parseFloat(currentBalance[0].balance) - parseFloat(amount);

                await pool.execute(
                    'UPDATE finance_benefits SET balance = ? WHERE user_id = ?',
                    [newBalance, userId]
                );
            }
        }

        res.status(201).json({ message: 'Financial transaction added successfully' });
    } catch (error) {
        console.error('Error adding financial transaction:', error);
        res.status(500).json({ error: 'Failed to add financial transaction' });
    }
});

module.exports = router;
