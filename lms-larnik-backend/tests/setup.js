const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

// Setup MongoDB Memory Server
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

// Global test timeout
jest.setTimeout(30000);

// Mock external services
jest.mock('../src/services/emailService', () => ({
  sendOTP: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendEnrollmentEmail: jest.fn().mockResolvedValue(true),
  sendPaymentEmail: jest.fn().mockResolvedValue(true),
  sendCertificateEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendBulkNotification: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/services/smsService', () => ({
  sendOTP: jest.fn().mockResolvedValue(true),
  sendWelcomeSMS: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/services/razorpayService', () => ({
  createOrder: jest.fn().mockResolvedValue({
    id: 'order_test123',
    amount: 100000,
    currency: 'INR',
    receipt: 'receipt_test123'
  }),
  verifySignature: jest.fn().mockResolvedValue(true),
  capturePayment: jest.fn().mockResolvedValue({
    id: 'pay_test123',
    status: 'captured'
  }),
  processRefund: jest.fn().mockResolvedValue({
    id: 'rfnd_test123',
    status: 'processed'
  }),
  getPaymentDetails: jest.fn().mockResolvedValue({
    id: 'pay_test123',
    status: 'captured',
    amount: 100000
  }),
  createPaymentLink: jest.fn().mockResolvedValue({
    id: 'plink_test123',
    short_url: 'https://rzp.io/test'
  })
}));

jest.mock('../src/services/certificateService', () => ({
  generateCertificate: jest.fn().mockResolvedValue({
    certificateId: 'cert_test123',
    pdfPath: '/certificates/cert_test123.pdf',
    qrCode: 'qr_test123'
  }),
  verifyCertificate: jest.fn().mockResolvedValue(true)
}));

// Mock file uploads
jest.mock('multer', () => {
  return jest.fn().mockReturnValue({
    single: jest.fn().mockReturnValue((req, res, next) => {
      req.file = {
        filename: 'test-file.pdf',
        path: '/uploads/test-file.pdf',
        mimetype: 'application/pdf',
        size: 1024
      };
      next();
    }),
    array: jest.fn().mockReturnValue((req, res, next) => {
      req.files = [{
        filename: 'test-file.pdf',
        path: '/uploads/test-file.pdf',
        mimetype: 'application/pdf',
        size: 1024
      }];
      next();
    })
  });
});

// Global test utilities
global.testUtils = {
  createTestUser: async (User, userData = {}) => {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      phone: '+919876543210'
    };
    const user = new User({ ...defaultUser, ...userData });
    await user.save();
    return user;
  },

  createTestToken: (user) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  },

  createTestCourse: async (Course, courseData = {}) => {
    const defaultCourse = {
      title: 'Test Course',
      description: 'Test course description',
      price: 999,
      category: 'test-category',
      teacher: 'test-teacher-id',
      status: 'draft'
    };
    const course = new Course({ ...defaultCourse, ...courseData });
    await course.save();
    return course;
  }
};

