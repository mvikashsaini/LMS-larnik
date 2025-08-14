const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

describe('Authentication APIs', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new student successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+919876543210',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.role).toBe('student');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should register a teacher with additional fields', async () => {
      const userData = {
        name: 'Jane Teacher',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+919876543211',
        role: 'teacher',
        qualification: 'PhD in Computer Science',
        experience: 5,
        specialization: 'Web Development'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.role).toBe('teacher');
      expect(response.body.data.user.qualification).toBe(userData.qualification);
    });

    it('should return error for duplicate email', async () => {
      // Create first user
      await global.testUtils.createTestUser(User, {
        email: 'duplicate@example.com',
        role: 'student'
      });

      const userData = {
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'password123',
        phone: '+919876543212',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '+919876543210',
        role: 'student'
      });
    });

    it('should login with email and password successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return error for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/send-otp', () => {
    it('should send OTP to student email', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'student@example.com',
        role: 'student'
      });

      const response = await request(app)
        .post('/api/auth/send-otp')
        .send({ email: 'student@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent successfully');
    });

    it('should send OTP to student phone', async () => {
      const user = await global.testUtils.createTestUser(User, {
        phone: '+919876543210',
        role: 'student'
      });

      const response = await request(app)
        .post('/api/auth/send-otp')
        .send({ phone: '+919876543210' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return error for non-student role', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'teacher@example.com',
        role: 'teacher'
      });

      const response = await request(app)
        .post('/api/auth/send-otp')
        .send({ email: 'teacher@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('OTP login only available for students');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('should verify OTP and login student', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'student@example.com',
        role: 'student',
        otp: '123456',
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
      });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'student@example.com', otp: '123456' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return error for invalid OTP', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'student@example.com',
        role: 'student',
        otp: '123456',
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
      });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'student@example.com', otp: '000000' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid OTP');
    });

    it('should return error for expired OTP', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'student@example.com',
        role: 'student',
        otp: '123456',
        otpExpiry: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'student@example.com', otp: '123456' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('OTP expired');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should refresh token successfully', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'test@example.com',
        role: 'student'
      });

      const token = global.testUtils.createTestToken(user);

      const response = await request(app)
        .post('/api/auth/refresh-token')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return error for invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'test@example.com',
        role: 'student'
      });

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset email sent');
    });

    it('should return error for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User not found');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      const user = await global.testUtils.createTestUser(User, {
        email: 'test@example.com',
        role: 'student',
        resetPasswordToken: 'valid-reset-token',
        resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000)
      });

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'valid-reset-token',
          password: 'newpassword123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset successful');
    });

    it('should return error for invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'newpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });
  });
});

