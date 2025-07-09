# 🗄️ MySQL Database Setup Guide for MigrantConnect

## Prerequisites

You need to have MySQL installed on your local machine.

### For Windows:

1. **Download MySQL**: Go to https://dev.mysql.com/downloads/mysql/
2. **Install MySQL**: Follow the installation wizard
3. **Remember your root password** during installation

### Alternative: Use XAMPP

1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP and start MySQL service
3. Default credentials: username=`root`, password=`` (empty)

## Step-by-Step Setup

### 1. Start MySQL Service

- **Windows**: Open Services and start "MySQL" service
- **XAMPP**: Open XAMPP Control Panel and start MySQL

### 2. Update Database Credentials

Edit the `.env` file in your project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=migrantconnect
PORT=3000
NODE_ENV=development
```

**Important**: Replace `your_mysql_password_here` with your actual MySQL root password.

### 3. Create Database and Tables

You have two options:

#### Option A: Using MySQL Command Line

```bash
# Connect to MySQL
mysql -u root -p

# Then run the SQL commands from database_setup.sql
source C:/Users/arka2002/Desktop/tmc2/database_setup.sql
```

#### Option B: Using MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Connect to your local MySQL instance
3. Open the `database_setup.sql` file
4. Execute the entire script

#### Option C: Using phpMyAdmin (if using XAMPP)

1. Go to http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose the `database_setup.sql` file
4. Click "Go"

### 4. Verify Database Setup

After running the SQL script, you should see:

- Database: `migrantconnect`
- Tables: `users`, `benefits`, `food_benefits`, `health_benefits`, `education_benefits`, `finance_benefits`, `transactions`
- Sample data for 4 users

### 5. Test the Connection

```bash
# Start the server
npm start

# Test API in browser or curl
curl http://localhost:3000/api/status
```

You should see:

```json
{
  "status": "Server running",
  "database": "Connected",
  "timestamp": "2025-01-09T..."
}
```

### 6. Test API Endpoints

#### Get all users:

```bash
curl http://localhost:3000/api/users
```

#### Get specific user:

```bash
curl http://localhost:3000/api/users/MIG-BH-001
```

#### Get food benefits:

```bash
curl http://localhost:3000/api/food/MIG-BH-001
```

## Common Issues & Solutions

### Issue 1: "Access denied for user 'root'"

**Solution**: Update the password in `.env` file

### Issue 2: "Connection refused"

**Solution**: Make sure MySQL service is running

### Issue 3: "Database 'migrantconnect' doesn't exist"

**Solution**: Run the `database_setup.sql` script

### Issue 4: Port 3306 already in use

**Solution**:

- Stop other MySQL instances
- Or change the port in `.env` file

### Issue 5: Permission denied

**Solution**: Make sure MySQL user has proper privileges:

```sql
GRANT ALL PRIVILEGES ON migrantconnect.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Database Schema Overview

### Tables Created:

1. **users** - Basic user information
2. **benefits** - General benefit status per user
3. **food_benefits** - PDS and food-related details
4. **health_benefits** - Healthcare coverage details
5. **education_benefits** - Education service details
6. **finance_benefits** - Banking and financial details
7. **transactions** - All transaction history

### Sample Users in Database:

- Ravi Kumar (MIG-BH-001): Bihar → Delhi
- Priya Sharma (MIG-UP-002): UP → Maharashtra
- Amit Das (MIG-WB-003): West Bengal → Karnataka
- Sunita Devi (MIG-RJ-004): Rajasthan → Gujarat

## Next Steps After Setup

1. ✅ Database connected successfully
2. 🚀 Server running with REST APIs
3. 📱 Frontend can now fetch real data from MySQL
4. 🔄 Ready to integrate frontend with backend APIs

## Need Help?

If you encounter any issues:

1. Check MySQL error logs
2. Verify `.env` file credentials
3. Ensure MySQL service is running
4. Test connection manually with MySQL client

Once database is set up, your MigrantConnect app will use real MySQL data instead of hardcoded JSON! 🎉
