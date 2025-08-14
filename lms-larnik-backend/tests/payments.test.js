const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Payment = require('../src/models/Payment');
const Enrollment = require('../src/models/Enrollment');

describe('Payment APIs', () => {
  let student, teacher, course, enrollment;

  beforeEach(async () => {
    // Create test users
    student = await global.testUtils.createTestUser(User, {
      email: 'student@example.com',
      role: 'student'
    });

    teacher = await global.testUtils.createTestUser(User, {
      email: 'teacher@example.com',
      role: 'teacher'
    });

    // Create test course
    course = await global.testUtils.createTestCourse(Course, {
      title: 'Test Course',
      price: 999,
      teacher: teacher._id,
      status: 'published'
    });

    // Create test enrollment
    enrollment = await Enrollment.create({
      student: student._id,
      course: course._id,
      status: 'pending',
      amount: 999
    });
  });

  describe('POST /api/payments/create-order', () => {
    it('should create payment order successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      const orderData = {
        courseId: course._id,
        amount: 999,
        currency: 'INR'
      };

      const response = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('orderId');
      expect(response.body.data).toHaveProperty('amount');
      expect(response.body.data).toHaveProperty('currency');
      expect(response.body.data.amount).toBe(orderData.amount);
    });

    it('should return error for invalid course', async () => {
      const token = global.testUtils.createTestToken(student);
      const fakeCourseId = '507f1f77bcf86cd799439011';
      const orderData = {
        courseId: fakeCourseId,
        amount: 999,
        currency: 'INR'
      };

      const response = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Course not found');
    });

    it('should return error for unauthorized access', async () => {
      const orderData = {
        courseId: course._id,
        amount: 999,
        currency: 'INR'
      };

      const response = await request(app)
        .post('/api/payments/create-order')
        .send(orderData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/payments/capture', () => {
    it('should capture payment successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      const captureData = {
        orderId: 'order_test123',
        paymentId: 'pay_test123',
        signature: 'valid_signature',
        enrollmentId: enrollment._id
      };

      const response = await request(app)
        .post('/api/payments/capture')
        .set('Authorization', `Bearer ${token}`)
        .send(captureData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('paymentId');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data.status).toBe('captured');
    });

    it('should return error for invalid signature', async () => {
      const token = global.testUtils.createTestToken(student);
      const captureData = {
        orderId: 'order_test123',
        paymentId: 'pay_test123',
        signature: 'invalid_signature',
        enrollmentId: enrollment._id
      };

      const response = await request(app)
        .post('/api/payments/capture')
        .set('Authorization', `Bearer ${token}`)
        .send(captureData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid signature');
    });

    it('should return error for non-existent enrollment', async () => {
      const token = global.testUtils.createTestToken(student);
      const fakeEnrollmentId = '507f1f77bcf86cd799439011';
      const captureData = {
        orderId: 'order_test123',
        paymentId: 'pay_test123',
        signature: 'valid_signature',
        enrollmentId: fakeEnrollmentId
      };

      const response = await request(app)
        .post('/api/payments/capture')
        .set('Authorization', `Bearer ${token}`)
        .send(captureData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Enrollment not found');
    });
  });

  describe('POST /api/payments/refund', () => {
    it('should process refund successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      
      // Create a payment first
      const payment = await Payment.create({
        orderId: 'order_test123',
        paymentId: 'pay_test123',
        student: student._id,
        course: course._id,
        amount: 999,
        status: 'captured',
        enrollment: enrollment._id
      });

      const refundData = {
        paymentId: payment.paymentId,
        amount: 999,
        reason: 'Student request'
      };

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Authorization', `Bearer ${token}`)
        .send(refundData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('refundId');
      expect(response.body.data).toHaveProperty('status');
    });

    it('should return error for non-existent payment', async () => {
      const token = global.testUtils.createTestToken(student);
      const refundData = {
        paymentId: 'nonexistent_payment',
        amount: 999,
        reason: 'Student request'
      };

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Authorization', `Bearer ${token}`)
        .send(refundData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Payment not found');
    });

    it('should return error for already refunded payment', async () => {
      const token = global.testUtils.createTestToken(student);
      
      // Create a payment that's already refunded
      const payment = await Payment.create({
        orderId: 'order_test123',
        paymentId: 'pay_test123',
        student: student._id,
        course: course._id,
        amount: 999,
        status: 'refunded',
        enrollment: enrollment._id
      });

      const refundData = {
        paymentId: payment.paymentId,
        amount: 999,
        reason: 'Student request'
      };

      const response = await request(app)
        .post('/api/payments/refund')
        .set('Authorization', `Bearer ${token}`)
        .send(refundData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Payment already refunded');
    });
  });

  describe('GET /api/payments', () => {
    beforeEach(async () => {
      // Create test payments
      await Payment.create([
        {
          orderId: 'order_1',
          paymentId: 'pay_1',
          student: student._id,
          course: course._id,
          amount: 999,
          status: 'captured',
          enrollment: enrollment._id
        },
        {
          orderId: 'order_2',
          paymentId: 'pay_2',
          student: student._id,
          course: course._id,
          amount: 1499,
          status: 'captured',
          enrollment: enrollment._id
        }
      ]);
    });

    it('should get all payments with pagination', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('payments');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.payments)).toBe(true);
    });

    it('should filter payments by status', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/payments?status=captured')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.payments.length).toBeGreaterThan(0);
    });

    it('should filter payments by date range', async () => {
      const token = global.testUtils.createTestToken(student);
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const response = await request(app)
        .get(`/api/payments?startDate=${startDate}&endDate=${endDate}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/payments/:id', () => {
    it('should get payment by ID', async () => {
      const payment = await Payment.create({
        orderId: 'order_test123',
        paymentId: 'pay_test123',
        student: student._id,
        course: course._id,
        amount: 999,
        status: 'captured',
        enrollment: enrollment._id
      });

      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/payments/${payment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(payment._id.toString());
      expect(response.body.data.paymentId).toBe(payment.paymentId);
    });

    it('should return 404 for non-existent payment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/payments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Payment not found');
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('should handle payment success webhook', async () => {
      const webhookData = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_test123',
              amount: 999,
              status: 'captured',
              order_id: 'order_test123'
            }
          }
        }
      };

      const response = await request(app)
        .post('/api/payments/webhook')
        .send(webhookData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle payment failure webhook', async () => {
      const webhookData = {
        event: 'payment.failed',
        payload: {
          payment: {
            entity: {
              id: 'pay_test123',
              amount: 999,
              status: 'failed',
              order_id: 'order_test123'
            }
          }
        }
      };

      const response = await request(app)
        .post('/api/payments/webhook')
        .send(webhookData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/payments/analytics', () => {
    beforeEach(async () => {
      // Create test payments for analytics
      await Payment.create([
        {
          orderId: 'order_1',
          paymentId: 'pay_1',
          student: student._id,
          course: course._id,
          amount: 999,
          status: 'captured',
          enrollment: enrollment._id,
          createdAt: new Date()
        },
        {
          orderId: 'order_2',
          paymentId: 'pay_2',
          student: student._id,
          course: course._id,
          amount: 1499,
          status: 'captured',
          enrollment: enrollment._id,
          createdAt: new Date()
        }
      ]);
    });

    it('should get payment analytics for student', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/payments/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalPayments');
      expect(response.body.data).toHaveProperty('totalAmount');
      expect(response.body.data).toHaveProperty('paymentsByStatus');
    });

    it('should get payment analytics for teacher', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .get('/api/payments/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalEarnings');
      expect(response.body.data).toHaveProperty('earningsByMonth');
    });

    it('should get payment analytics for super admin', async () => {
      const superAdmin = await global.testUtils.createTestUser(User, {
        email: 'admin@example.com',
        role: 'superAdmin'
      });

      const token = global.testUtils.createTestToken(superAdmin);

      const response = await request(app)
        .get('/api/payments/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalRevenue');
      expect(response.body.data).toHaveProperty('revenueByMonth');
      expect(response.body.data).toHaveProperty('paymentsByStatus');
    });
  });

  describe('POST /api/payments/create-payment-link', () => {
    it('should create payment link successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      const linkData = {
        courseId: course._id,
        amount: 999,
        description: 'Payment for Test Course'
      };

      const response = await request(app)
        .post('/api/payments/create-payment-link')
        .set('Authorization', `Bearer ${token}`)
        .send(linkData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('paymentLinkId');
      expect(response.body.data).toHaveProperty('shortUrl');
    });

    it('should validate required fields for payment link', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .post('/api/payments/create-payment-link')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
});

