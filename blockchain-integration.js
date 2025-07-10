// Basic Blockchain Implementation for MigrantConnect
// Simplified blockchain for hackathon demonstration

const crypto = require('crypto');
const { pool } = require('./config/database');

class MigrantConnectBlockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 2; // Simple proof of work
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        const genesisBlock = {
            index: 0,
            timestamp: Date.now(),
            data: "MigrantConnect Genesis Block - Portable Services for Mobile Workers",
            previousHash: "0",
            hash: this.calculateHash({
                index: 0,
                timestamp: Date.now(),
                data: "Genesis Block",
                previousHash: "0",
                nonce: 0
            }),
            nonce: 0
        };
        this.chain.push(genesisBlock);
    }

    calculateHash(block) {
        return crypto.createHash('sha256')
            .update(block.index + block.previousHash + block.timestamp + JSON.stringify(block.data) + block.nonce)
            .digest('hex');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add migrant identity to blockchain
    addMigrantIdentity(migrantData) {
        const newBlock = {
            index: this.chain.length,
            timestamp: Date.now(),
            data: {
                type: "IDENTITY_CREATION",
                migrant_id: migrantData.migrant_id,
                name_hash: crypto.createHash('sha256').update(migrantData.name).digest('hex'),
                aadhaar_hash: crypto.createHash('sha256').update(migrantData.aadhaar).digest('hex'),
                home_state: migrantData.home_state,
                current_state: migrantData.current_state,
                created_at: new Date().toISOString()
            },
            previousHash: this.getLatestBlock().hash,
            nonce: 0
        };

        newBlock.hash = this.mineBlock(newBlock);
        this.chain.push(newBlock);

        // Store in database for persistence
        this.saveBlockToDatabase(newBlock);

        return newBlock;
    }

    // Add benefit usage transaction to blockchain
    addBenefitTransaction(transactionData) {
        const newBlock = {
            index: this.chain.length,
            timestamp: Date.now(),
            data: {
                type: "BENEFIT_USAGE",
                migrant_id: transactionData.migrant_id,
                benefit_type: transactionData.benefit_type,
                amount: transactionData.amount,
                location: transactionData.location,
                provider: transactionData.provider || "Government",
                description: transactionData.description,
                transaction_hash: crypto.createHash('sha256')
                    .update(transactionData.migrant_id + transactionData.amount + Date.now())
                    .digest('hex'),
                timestamp: new Date().toISOString()
            },
            previousHash: this.getLatestBlock().hash,
            nonce: 0
        };

        newBlock.hash = this.mineBlock(newBlock);
        this.chain.push(newBlock);

        // Store in database
        this.saveBlockToDatabase(newBlock);

        return newBlock;
    }

    // Add state migration record to blockchain
    addStateMigration(migrationData) {
        const newBlock = {
            index: this.chain.length,
            timestamp: Date.now(),
            data: {
                type: "STATE_MIGRATION",
                migrant_id: migrationData.migrant_id,
                from_state: migrationData.from_state,
                to_state: migrationData.to_state,
                migration_reason: migrationData.reason || "Economic opportunity",
                verification_required: false,
                timestamp: new Date().toISOString()
            },
            previousHash: this.getLatestBlock().hash,
            nonce: 0
        };

        newBlock.hash = this.mineBlock(newBlock);
        this.chain.push(newBlock);

        this.saveBlockToDatabase(newBlock);

        return newBlock;
    }

    // Simple Proof of Work mining
    mineBlock(block) {
        const target = Array(this.difficulty + 1).join("0");

        while (block.hash.substring(0, this.difficulty) !== target) {
            block.nonce++;
            block.hash = this.calculateHash(block);
        }

        console.log(`Block mined: ${block.hash}`);
        return block.hash;
    }

    // Validate blockchain integrity
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== this.calculateHash(currentBlock)) {
                console.log('Invalid hash at block', i);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('Invalid previous hash at block', i);
                return false;
            }
        }
        return true;
    }

    // Get migrant's transaction history from blockchain
    getMigrantHistory(migrant_id) {
        return this.chain.filter(block =>
            block.data &&
            typeof block.data === 'object' &&
            block.data.migrant_id === migrant_id
        );
    }

    // Generate QR code with blockchain verification
    generateBlockchainQR(migrantData) {
        const qrData = {
            migrant_id: migrantData.migrant_id,
            name: migrantData.name,
            blockchain_verified: true,
            latest_block_hash: this.getLatestBlock().hash,
            verification_url: `https://migrantconnect.gov.in/verify/${migrantData.migrant_id}`,
            generated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        };

        return {
            qr_data: JSON.stringify(qrData),
            blockchain_hash: crypto.createHash('sha256').update(JSON.stringify(qrData)).digest('hex')
        };
    }

    // Save block to database for persistence
    async saveBlockToDatabase(block) {
        try {
            await pool.execute(
                'INSERT INTO blockchain_blocks (block_index, block_hash, previous_hash, block_data, timestamp, nonce) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    block.index,
                    block.hash,
                    block.previousHash,
                    JSON.stringify(block.data),
                    new Date(block.timestamp),
                    block.nonce
                ]
            );
        } catch (error) {
            console.log('Note: Blockchain persistence requires blockchain_blocks table');
        }
    }

    // Load blockchain from database
    async loadFromDatabase() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM blockchain_blocks ORDER BY block_index ASC'
            );

            if (rows.length > 1) { // Keep genesis block, load others
                this.chain = [this.chain[0]]; // Keep genesis
                rows.slice(1).forEach(row => {
                    this.chain.push({
                        index: row.block_index,
                        timestamp: row.timestamp.getTime(),
                        data: JSON.parse(row.block_data),
                        previousHash: row.previous_hash,
                        hash: row.block_hash,
                        nonce: row.nonce
                    });
                });
            }
        } catch (error) {
            console.log('Starting with fresh blockchain - database table not found');
        }
    }
}

// Initialize blockchain
const migrantBlockchain = new MigrantConnectBlockchain();

// API endpoints for blockchain functionality
const express = require('express');
const blockchainRouter = express.Router();

// Add migrant to blockchain
blockchainRouter.post('/identity/:migrant_id', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const { name, aadhaar, home_state, current_state } = req.body;

        const block = migrantBlockchain.addMigrantIdentity({
            migrant_id,
            name,
            aadhaar,
            home_state,
            current_state
        });

        res.json({
            success: true,
            message: "Migrant identity added to blockchain",
            block_hash: block.hash,
            block_index: block.index
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to add to blockchain" });
    }
});

// Add benefit transaction to blockchain
blockchainRouter.post('/transaction/:migrant_id', async (req, res) => {
    try {
        const { migrant_id } = req.params;
        const transactionData = { migrant_id, ...req.body };

        const block = migrantBlockchain.addBenefitTransaction(transactionData);

        res.json({
            success: true,
            message: "Transaction added to blockchain",
            block_hash: block.hash,
            transaction_hash: block.data.transaction_hash
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to add transaction to blockchain" });
    }
});

// Get migrant's blockchain history
blockchainRouter.get('/history/:migrant_id', (req, res) => {
    try {
        const { migrant_id } = req.params;
        const history = migrantBlockchain.getMigrantHistory(migrant_id);

        res.json({
            migrant_id,
            blockchain_verified: migrantBlockchain.isChainValid(),
            total_records: history.length,
            history: history.map(block => ({
                type: block.data.type,
                timestamp: block.data.timestamp,
                block_hash: block.hash,
                details: block.data
            }))
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blockchain history" });
    }
});

// Verify blockchain integrity
blockchainRouter.get('/verify', (req, res) => {
    res.json({
        blockchain_valid: migrantBlockchain.isChainValid(),
        total_blocks: migrantBlockchain.chain.length,
        latest_block: migrantBlockchain.getLatestBlock().hash
    });
});

// Generate blockchain-verified QR
blockchainRouter.post('/qr/:migrant_id', async (req, res) => {
    try {
        const { migrant_id } = req.params;

        // Get migrant data from database
        const [userRows] = await pool.execute(
            'SELECT * FROM users WHERE migrant_id = ?',
            [migrant_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'Migrant not found' });
        }

        const migrantData = userRows[0];
        const qrResult = migrantBlockchain.generateBlockchainQR(migrantData);

        res.json({
            success: true,
            qr_data: qrResult.qr_data,
            blockchain_hash: qrResult.blockchain_hash,
            verified: true
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate blockchain QR" });
    }
});

module.exports = { migrantBlockchain, blockchainRouter };
