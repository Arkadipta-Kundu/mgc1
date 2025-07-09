const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import database and routes
const { testConnection } = require('./config/database');
const usersRoute = require('./routes/users');
const foodRoute = require('./routes/food');
const healthRoute = require('./routes/health');
const educationRoute = require('./routes/education');
const financeRoute = require('./routes/finance');
const authRoute = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/food', foodRoute);
app.use('/api/health', healthRoute);
app.use('/api/education', educationRoute);
app.use('/api/finance', financeRoute);

// API endpoint to test database connection
app.get('/api/status', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        status: 'Server running',
        database: dbConnected ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route for education
app.get('/education', (req, res) => {
    res.sendFile(path.join(__dirname, 'education.html'));
});

// Route for finance
app.get('/finance', (req, res) => {
    res.sendFile(path.join(__dirname, 'finance.html'));
});

// Route for food
app.get('/food', (req, res) => {
    res.sendFile(path.join(__dirname, 'food.html'));
});

// Route for health
app.get('/health', (req, res) => {
    res.sendFile(path.join(__dirname, 'health.html'));
});

// Route for QR
app.get('/qr', (req, res) => {
    res.sendFile(path.join(__dirname, 'qr.html'));
});

// Start the server
app.listen(PORT, async () => {
    console.log(`🚀 MigrantConnect server is running on http://localhost:${PORT}`);
    console.log(`📊 API Status: http://localhost:${PORT}/api/status`);

    // Test database connection
    const dbConnected = await testConnection();
    if (dbConnected) {
        console.log(`📱 You can access your application at:`);
        console.log(`   - Main page: http://localhost:${PORT}/`);
        console.log(`   - Dashboard: http://localhost:${PORT}/dashboard`);
        console.log(`   - API Endpoints:`);
        console.log(`     • GET /api/users - Get all users`);
        console.log(`     • GET /api/users/:migrant_id - Get user by ID`);
        console.log(`     • GET /api/food/:migrant_id - Get food benefits`);
        console.log(`     • GET /api/health/:migrant_id - Get health benefits`);
        console.log(`     • GET /api/education/:migrant_id - Get education benefits`);
        console.log(`     • GET /api/finance/:migrant_id - Get finance benefits`);
    } else {
        console.log(`❌ Database connection failed. Please check your MySQL setup.`);
        console.log(`   1. Make sure MySQL is running`);
        console.log(`   2. Update .env file with correct database credentials`);
        console.log(`   3. Run the database_setup.sql script`);
    }
});
