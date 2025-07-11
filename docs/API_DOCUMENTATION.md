# MigrantConnect REST API Documentation

## Base URL

```
http://localhost:3000/api
```

## API Endpoints

### 1. Server Status

```
GET /api/status
```

Check server and database connection status.

### 2. Users API

#### Get all users

```
GET /api/users
```

#### Get user by migrant ID

```
GET /api/users/MIG-BH-001
```

#### Create new user

```
POST /api/users
Content-Type: application/json

{
  "migrant_id": "MIG-TEST-001",
  "name": "Test User",
  "phone": "+91-9876543214",
  "aadhaar": "****-****-7890",
  "home_state": "Tamil Nadu",
  "current_state": "Kerala"
}
```

#### Update user

```
PUT /api/users/MIG-BH-001
Content-Type: application/json

{
  "name": "Ravi Kumar Updated",
  "phone": "+91-9876543210",
  "current_state": "Mumbai"
}
```

### 3. Food Benefits API

#### Get food benefits

```
GET /api/food/MIG-BH-001
```

#### Update food usage

```
PUT /api/food/MIG-BH-001/usage
Content-Type: application/json

{
  "usage_percentage": 80
}
```

#### Add food transaction

```
POST /api/food/MIG-BH-001/transaction
Content-Type: application/json

{
  "amount": 325.50,
  "description": "Monthly ration - January 2025",
  "location": "Delhi Fair Price Shop"
}
```

### 4. Health Benefits API

#### Get health benefits

```
GET /api/health/MIG-BH-001
```

#### Update health usage

```
PUT /api/health/MIG-BH-001/usage
Content-Type: application/json

{
  "used_amount": 150000
}
```

#### Add health transaction

```
POST /api/health/MIG-BH-001/transaction
Content-Type: application/json

{
  "amount": 35000,
  "description": "Surgery and treatment",
  "location": "AIIMS Delhi"
}
```

### 5. Education Benefits API

#### Get education benefits

```
GET /api/education/MIG-BH-001
```

#### Update education benefits

```
PUT /api/education/MIG-BH-001
Content-Type: application/json

{
  "children_count": 3,
  "scholarship_status": "active",
  "school_transfer_status": "completed"
}
```

#### Add education transaction

```
POST /api/education/MIG-BH-001/transaction
Content-Type: application/json

{
  "amount": 5000,
  "description": "Monthly scholarship",
  "location": "Delhi Education Department"
}
```

### 6. Finance Benefits API

#### Get finance benefits

```
GET /api/finance/MIG-BH-001
```

#### Update balance

```
PUT /api/finance/MIG-BH-001/balance
Content-Type: application/json

{
  "balance": 25000
}
```

#### Add financial transaction

```
POST /api/finance/MIG-BH-001/transaction
Content-Type: application/json

{
  "transaction_type": "Credit",
  "amount": 5000,
  "description": "Salary credit",
  "location": "Bank Branch Delhi"
}
```

## Test Commands (using curl)

### Test server status:

```bash
curl http://localhost:3000/api/status
```

### Get user data:

```bash
curl http://localhost:3000/api/users/MIG-BH-001
```

### Get food benefits:

```bash
curl http://localhost:3000/api/food/MIG-BH-001
```

### Add food transaction:

```bash
curl -X POST http://localhost:3000/api/food/MIG-BH-001/transaction \
  -H "Content-Type: application/json" \
  -d '{"amount": 300, "description": "Test purchase", "location": "Test Shop"}'
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 404: Not Found
- 500: Internal Server Error

Error response format:

```json
{
  "error": "Error message description"
}
```
