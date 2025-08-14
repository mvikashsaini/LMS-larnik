# Larnik E-Learning Platform - Backend API

A production-ready MERN stack backend for the Larnik E-Learning Platform with comprehensive features including user management, course management, payments, certificates, and analytics.

## 🚀 Features

### Core Functionality
- **Authentication & Authorization**: JWT-based with role-based access control (RBAC)
- **User Management**: Multiple roles (Student, Teacher, University Admin, Super Admin, etc.)
- **Course Management**: Create, update, approve, and manage courses with modules and lessons
- **Enrollment System**: Track student progress, quiz attempts, and course completion
- **Payment Integration**: Razorpay integration with order creation, capture, and refunds
- **Certificate Generation**: Auto-generated PDF certificates with QR codes
- **Analytics & Reporting**: Comprehensive analytics for all user roles
- **File Uploads**: Secure file uploads for videos, documents, and images
- **Notifications**: Real-time notifications and bulk messaging

### User Roles
- **Super Admin**: Platform management, user oversight, analytics
- **University Admin**: University-specific management, staff assignment
- **Teacher**: Course creation, student management, earnings tracking
- **Student**: Course enrollment, progress tracking, certificate generation
- **Referral Partner**: Referral system with tiered commissions
- **Sub Admin**: Limited administrative access

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Payment**: Razorpay integration
- **File Uploads**: Multer with S3 readiness
- **PDF Generation**: PDFKit with QR codes
- **Email**: Nodemailer
- **SMS**: Twilio
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest
- **Validation**: Express-validator

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd larnik-lms-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
nano .env
```

### 4. Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/larnik_lms

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./src/uploads

# Certificate
CERTIFICATE_PATH=./src/certificates
CERTIFICATE_TEMPLATE_PATH=./src/templates
```

### 5. Setup Project Structure
```bash
# Create necessary directories
npm run setup
```

### 6. Seed Initial Data
```bash
# Seed database with initial users and categories
npm run seed
```

### 7. Start Development Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage Report
After running tests with coverage, view the HTML report:
```bash
open coverage/lcov-report/index.html
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210",
  "role": "student"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Send OTP (Students Only)
```http
POST /auth/send-otp
Content-Type: application/json

{
  "email": "student@example.com"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "student@example.com",
  "otp": "123456"
}
```

### Course Management

#### Create Course (Teacher/Admin)
```http
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "price": 999,
  "category": "category-id",
  "subCategory": "subcategory-id",
  "modules": [
    {
      "title": "Introduction to React",
      "description": "Basic concepts",
      "lessons": [
        {
          "title": "What is React?",
          "type": "video",
          "content": "video-url.mp4",
          "duration": 300
        }
      ]
    }
  ]
}
```

#### Get All Courses
```http
GET /courses?page=1&limit=10&category=category-id&status=published
```

#### Get Course by ID
```http
GET /courses/:courseId
```

### Enrollment Management

#### Create Enrollment
```http
POST /enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course-id",
  "amount": 999
}
```

#### Update Progress
```http
PUT /enrollments/:enrollmentId/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "moduleIndex": 0,
  "lessonIndex": 1,
  "completed": true
}
```

#### Submit Quiz
```http
POST /enrollments/:enrollmentId/quiz
Authorization: Bearer <token>
Content-Type: application/json

{
  "moduleIndex": 0,
  "lessonIndex": 1,
  "answers": [0, 1, 2]
}
```

### Payment Management

#### Create Payment Order
```http
POST /payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course-id",
  "amount": 999,
  "currency": "INR"
}
```

#### Capture Payment
```http
POST /payments/capture
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-id",
  "paymentId": "payment-id",
  "signature": "signature",
  "enrollmentId": "enrollment-id"
}
```

### Certificate Management

#### Generate Certificate
```http
POST /certificates/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "enrollmentId": "enrollment-id"
}
```

#### Verify Certificate
```http
GET /certificates/verify/:certificateId
```

#### Download Certificate
```http
GET /certificates/:certificateId/download
Authorization: Bearer <token>
```

### Analytics

#### Dashboard Analytics
```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

#### Export Data
```http
GET /analytics/export?type=enrollments&format=csv
Authorization: Bearer <token>
```

## 🔐 Authentication & Authorization

### JWT Token Format
```json
{
  "id": "user-id",
  "role": "student|teacher|admin|superAdmin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control

#### Student Permissions
- View available courses
- Enroll in courses
- Track progress
- Submit quizzes
- Generate certificates
- View payments

#### Teacher Permissions
- Create and manage courses
- View enrollments
- Track earnings
- Upload course content
- View analytics

#### Admin Permissions
- Manage users
- Approve courses
- View platform analytics
- Manage categories
- Handle settlements

#### Super Admin Permissions
- All admin permissions
- Platform configuration
- User role management
- Certificate revocation
- System-wide analytics

## 📁 Project Structure

```
larnik-lms-backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── jwt.js        # JWT configuration
│   │   └── razorpay.js   # Razorpay configuration
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── paymentController.js
│   │   ├── certificateController.js
│   │   └── analyticsController.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication & authorization
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   ├── validate.js
│   │   └── upload.js
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Payment.js
│   │   ├── Certificate.js
│   │   └── ...
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── enrollments.js
│   │   ├── payments.js
│   │   └── ...
│   ├── services/        # External services
│   │   ├── emailService.js
│   │   ├── smsService.js
│   │   ├── razorpayService.js
│   │   └── certificateService.js
│   ├── utils/           # Utility functions
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── uploads/         # File uploads
│   ├── certificates/    # Generated certificates
│   └── templates/       # Certificate templates
├── tests/               # Test files
│   ├── setup.js
│   ├── auth.test.js
│   ├── courses.test.js
│   ├── payments.test.js
│   ├── enrollments.test.js
│   └── certificates.test.js
├── scripts/             # Utility scripts
│   ├── setup.js
│   └── seed.js
├── app.js              # Main application file
├── package.json
├── .env.example
└── README.md
```

## 🧪 Testing Strategy

### Test Categories
1. **Unit Tests**: Individual function testing
2. **Integration Tests**: API endpoint testing
3. **Authentication Tests**: JWT and role-based access
4. **Payment Tests**: Razorpay integration
5. **File Upload Tests**: Multer functionality
6. **Database Tests**: MongoDB operations

### Test Coverage
- Authentication flows
- CRUD operations
- Business logic validation
- Error handling
- Authorization checks
- Payment processing
- Certificate generation

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

### Health Check Endpoint
```http
GET /api/health
```

### Logging
- Request/response logging with Morgan
- Error logging with custom error handler
- Payment transaction logging
- User activity tracking

## 🔧 Configuration

### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- API endpoints: 100 requests per 15 minutes

### File Upload Limits
- Video files: 100MB
- Document files: 10MB
- Image files: 5MB

### Security Features
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- Complete user management system
- Course creation and management
- Payment integration
- Certificate generation
- Analytics and reporting
- Comprehensive testing suite
