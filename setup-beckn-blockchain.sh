#!/bin/bash

echo "🚀 Setting up BECKN Protocol + Blockchain Integration for MigrantConnect"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup database schema
echo "🗄️ Setting up database schema..."
echo "Please ensure your MySQL server is running and you have the 'migrantconnect' database created."
echo "Run this command manually:"
echo "mysql -u root -p migrantconnect < blockchain_beckn_schema.sql"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOL
# Database Configuration
DB_HOST=localhost
DB_PORT=3308
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=migrantconnect

# Server Configuration
PORT=3000
NODE_ENV=development

# BECKN Configuration
BECKN_ENABLED=true
BECKN_BAP_ID=migrantconnect.gov.in
BECKN_BAP_URI=https://migrantconnect.gov.in/beckn

# Blockchain Configuration
BLOCKCHAIN_ENABLED=true
BLOCKCHAIN_DIFFICULTY=2
EOL
    echo "✅ .env file created. Please update with your MySQL credentials."
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Update the .env file with your MySQL credentials"
echo "2. Run: mysql -u root -p migrantconnect < blockchain_beckn_schema.sql"
echo "3. Run: npm start"
echo "4. Open: http://localhost:3000/beckn-blockchain-demo.html"
echo ""
echo "🌐 BECKN Protocol endpoints will be available at /api/beckn/*"
echo "⛓️ Blockchain endpoints will be available at /api/blockchain/*"
echo ""
echo "Happy hacking! 🚀"
