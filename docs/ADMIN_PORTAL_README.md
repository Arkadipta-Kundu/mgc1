# MigrantConnect Admin Portal

## Overview

The MigrantConnect Admin Portal is a comprehensive management system for government schemes and benefits. It allows administrators to:

- **Scan QR Codes**: Camera scanner and image upload functionality to verify citizen eligibility
- **Manage Schemes**: Create, edit, and delete government benefit schemes with detailed eligibility criteria
- **Track Applications**: Monitor scheme applications and approval status
- **Generate Reports**: View statistics and analytics on scheme performance

## 🚀 Quick Start

### For Windows:

```bash
setup-admin-portal.bat
```

### For Linux/Mac:

```bash
chmod +x setup-admin-portal.sh
./setup-admin-portal.sh
```

### Manual Setup:

1. Install dependencies: `npm install`
2. Setup database: `node setup-database.js`
3. Start server: `npm start`
4. Open: http://localhost:3000

## 🔐 Admin Access

- **URL**: http://localhost:3000/admin-login.html
- **Username**: admin
- **Password**: admin123

## 📱 QR Code Scanner Features

### 1. Camera Scanner

- Real-time QR code detection using device camera
- Automatic citizen data extraction
- Instant eligibility verification

### 2. Image Upload Scanner

- Upload QR code images from device
- Support for JPG, PNG, and other image formats
- Process QR codes from photos or screenshots

### 3. Demo Mode

- Test with pre-loaded demo users
- Ramesh Kumar Singh (Construction Worker)
- Priya Sharma (Domestic Helper)
- Arjun Das (Student)

## 🗄️ Database Tables

### admin_schemes

Stores government schemes and benefits with eligibility criteria:

```sql
- id, name, category, description
- max_income, min_family_size, social_category
- bpl_required, widow_preference, disability_preference
- benefit_amount, benefit_type, application_process
```

### scheme_applications

Tracks user applications to schemes:

```sql
- user_id, scheme_id, application_status
- application_date, approval_date, rejection_reason
- application_data (JSON), documents_submitted (JSON)
```

### scheme_eligibility_results

Stores QR scan eligibility results:

```sql
- user_id, scheme_id, is_eligible, eligibility_score
- eligibility_reasons (JSON), scan_date, scanned_by
- qr_data_hash (for verification)
```

## 🎯 Admin Portal Features

### Dashboard

- Real-time statistics on schemes, beneficiaries, QR scans
- Quick access to major functions
- Activity monitoring

### QR Scanner

- **Camera Mode**: Live camera feed with QR detection
- **Upload Mode**: Process QR images from files
- **Citizen Info Display**: Complete user profile view
- **Eligibility Results**: Automatic scheme matching and scoring

### Scheme Management

- **Create Schemes**: Add new government benefits
- **Edit Schemes**: Modify eligibility criteria and details
- **Delete Schemes**: Remove obsolete schemes
- **CRUD Operations**: Full database integration

### Eligibility Criteria Configuration

- Income limits and family size requirements
- Social category preferences (General, OBC, SC, ST, EWS)
- Housing status requirements
- Special circumstances (BPL, Widow, Disability preferences)

### Reports & Analytics

- Scheme performance metrics
- Application status tracking
- QR scan activity logs
- Beneficiary statistics

## 🔧 API Endpoints

### Scheme Management

- `GET /api/admin/schemes` - Fetch all schemes
- `POST /api/admin/schemes` - Create new scheme
- `PUT /api/admin/schemes/:id` - Update scheme
- `DELETE /api/admin/schemes/:id` - Delete scheme

### Eligibility Checking

- `POST /api/admin/check-eligibility` - Check user eligibility for all schemes
- `POST /api/admin/store-eligibility-scan` - Store QR scan results

### Statistics

- `GET /api/admin/statistics` - Get dashboard statistics

## 📊 Sample Schemes Included

1. **Pradhan Mantri Awas Yojana** (Housing)

   - Max Income: ₹18,000/month
   - BPL card required
   - Housing for homeless families

2. **Antyodaya Anna Yojana** (Food Security)

   - Max Income: ₹15,000/month
   - BPL card required
   - Widow/disability preference

3. **Ayushman Bharat Scheme** (Healthcare)

   - Max Income: ₹25,000/month
   - Health insurance coverage
   - Disability preference

4. **PM Mudra Yojana** (Financial Aid)
   - Max Income: ₹50,000/month
   - Micro-finance loans
   - Business development support

## 🛠️ Technical Requirements

- **Node.js**: v14 or higher
- **MySQL**: v8.0 or higher
- **Browser**: Modern browser with camera support for QR scanning
- **Dependencies**: Express.js, MySQL2, CORS, dotenv

## 🔒 Security Features

- Document number masking in QR codes
- Secure admin authentication
- Database transaction safety
- Input validation and sanitization

## 📱 Mobile Compatibility

- Responsive design for tablets and mobile devices
- Touch-friendly QR scanner interface
- Mobile camera integration
- Optimized for field use by administrators

## 🐛 Troubleshooting

### Camera Access Issues

- Grant camera permissions in browser
- Use HTTPS for camera access in production
- Fallback to image upload if camera unavailable

### Database Connection

- Check MySQL server status
- Verify database credentials in .env file
- Run setup-database.js to initialize tables

### QR Code Recognition

- Ensure good lighting for camera scanning
- Use high-quality images for upload
- Check QR code format compatibility

## 📞 Support

For technical support or feature requests, refer to the main project documentation or contact the development team.
