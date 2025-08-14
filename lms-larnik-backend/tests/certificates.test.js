const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Enrollment = require('../src/models/Enrollment');
const Certificate = require('../src/models/Certificate');

describe('Certificate APIs', () => {
  let student, teacher, course, enrollment, certificate;

  beforeEach(async () => {
    // Create test users
    student = await global.testUtils.createTestUser(User, {
      email: 'student@example.com',
      role: 'student',
      name: 'John Doe'
    });

    teacher = await global.testUtils.createTestUser(User, {
      email: 'teacher@example.com',
      role: 'teacher',
      name: 'Jane Teacher'
    });

    // Create test course
    course = await Course.create({
      title: 'Advanced Web Development',
      description: 'Learn advanced web development concepts',
      price: 1499,
      teacher: teacher._id,
      status: 'published',
      modules: [
        {
          title: 'Module 1',
          lessons: [
            { title: 'Lesson 1', type: 'video', content: 'video1.mp4' },
            { title: 'Quiz 1', type: 'quiz', content: { questions: [] } }
          ]
        }
      ]
    });

    // Create test enrollment
    enrollment = await Enrollment.create({
      student: student._id,
      course: course._id,
      status: 'completed',
      amount: 1499,
      progress: {
        completedLessons: ['0-0', '0-1'],
        currentModule: 0,
        currentLesson: 1
      },
      quizAttempts: [
        {
          moduleIndex: 0,
          lessonIndex: 1,
          score: 100,
          passed: true,
          answers: [0]
        }
      ]
    });

    // Create test certificate
    certificate = await Certificate.create({
      certificateId: 'CERT-2024-001',
      student: student._id,
      course: course._id,
      enrollment: enrollment._id,
      issuedDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      status: 'valid',
      qrCode: 'qr-code-data',
      pdfPath: '/certificates/CERT-2024-001.pdf'
    });
  });

  describe('POST /api/certificates/generate', () => {
    it('should generate certificate for completed course', async () => {
      const token = global.testUtils.createTestToken(student);
      const generateData = {
        enrollmentId: enrollment._id
      };

      const response = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generateData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('certificateId');
      expect(response.body.data).toHaveProperty('qrCode');
      expect(response.body.data).toHaveProperty('pdfPath');
      expect(response.body.data.student).toBe(student._id.toString());
      expect(response.body.data.course).toBe(course._id.toString());
    });

    it('should return error for incomplete course', async () => {
      // Create incomplete enrollment
      const incompleteEnrollment = await Enrollment.create({
        student: student._id,
        course: course._id,
        status: 'active',
        amount: 1499,
        progress: {
          completedLessons: ['0-0'],
          currentModule: 0,
          currentLesson: 1
        }
      });

      const token = global.testUtils.createTestToken(student);
      const generateData = {
        enrollmentId: incompleteEnrollment._id
      };

      const response = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Course not completed');
    });

    it('should return error for failed quiz attempts', async () => {
      // Create enrollment with failed quiz
      const failedEnrollment = await Enrollment.create({
        student: student._id,
        course: course._id,
        status: 'active',
        amount: 1499,
        progress: {
          completedLessons: ['0-0', '0-1'],
          currentModule: 0,
          currentLesson: 1
        },
        quizAttempts: [
          {
            moduleIndex: 0,
            lessonIndex: 1,
            score: 20, // Below passing threshold
            passed: false,
            answers: [3]
          }
        ]
      });

      const token = global.testUtils.createTestToken(student);
      const generateData = {
        enrollmentId: failedEnrollment._id
      };

      const response = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Quiz requirements not met');
    });

    it('should return error for non-existent enrollment', async () => {
      const token = global.testUtils.createTestToken(student);
      const fakeEnrollmentId = '507f1f77bcf86cd799439011';
      const generateData = {
        enrollmentId: fakeEnrollmentId
      };

      const response = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Enrollment not found');
    });

    it('should return error for unauthorized access', async () => {
      const otherStudent = await global.testUtils.createTestUser(User, {
        email: 'otherstudent@example.com',
        role: 'student'
      });

      const token = global.testUtils.createTestToken(otherStudent);
      const generateData = {
        enrollmentId: enrollment._id
      };

      const response = await request(app)
        .post('/api/certificates/generate')
        .set('Authorization', `Bearer ${token}`)
        .send(generateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/certificates', () => {
    it('should get student certificates', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/certificates')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('certificates');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.certificates)).toBe(true);
      expect(response.body.data.certificates.length).toBeGreaterThan(0);
    });

    it('should get teacher certificates', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .get('/api/certificates')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('certificates');
    });

    it('should filter certificates by status', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/certificates?status=valid')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.certificates.length).toBeGreaterThan(0);
    });

    it('should filter certificates by course', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/certificates?courseId=${course._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.certificates.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/certificates/:id', () => {
    it('should get certificate by ID', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/certificates/${certificate._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(certificate._id.toString());
      expect(response.body.data.certificateId).toBe(certificate.certificateId);
      expect(response.body.data.student).toBe(student._id.toString());
      expect(response.body.data.course).toBe(course._id.toString());
    });

    it('should return 404 for non-existent certificate', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/certificates/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Certificate not found');
    });

    it('should return error for unauthorized access', async () => {
      const otherStudent = await global.testUtils.createTestUser(User, {
        email: 'otherstudent@example.com',
        role: 'student'
      });

      const token = global.testUtils.createTestToken(otherStudent);

      const response = await request(app)
        .get(`/api/certificates/${certificate._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/certificates/:id/download', () => {
    it('should download certificate PDF', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/certificates/${certificate._id}/download`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    it('should return error for revoked certificate', async () => {
      // Revoke the certificate
      certificate.status = 'revoked';
      await certificate.save();

      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/certificates/${certificate._id}/download`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Certificate is revoked');
    });

    it('should return error for expired certificate', async () => {
      // Set certificate as expired
      certificate.expiryDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      await certificate.save();

      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/certificates/${certificate._id}/download`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Certificate has expired');
    });
  });

  describe('GET /api/certificates/verify/:certificateId', () => {
    it('should verify valid certificate', async () => {
      const response = await request(app)
        .get(`/api/certificates/verify/${certificate.certificateId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('valid');
      expect(response.body.data.valid).toBe(true);
      expect(response.body.data.certificate).toHaveProperty('student');
      expect(response.body.data.certificate).toHaveProperty('course');
    });

    it('should return invalid for revoked certificate', async () => {
      // Revoke the certificate
      certificate.status = 'revoked';
      await certificate.save();

      const response = await request(app)
        .get(`/api/certificates/verify/${certificate.certificateId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(false);
      expect(response.body.data.reason).toContain('Certificate is revoked');
    });

    it('should return invalid for expired certificate', async () => {
      // Set certificate as expired
      certificate.expiryDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      await certificate.save();

      const response = await request(app)
        .get(`/api/certificates/verify/${certificate.certificateId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(false);
      expect(response.body.data.reason).toContain('Certificate has expired');
    });

    it('should return invalid for non-existent certificate', async () => {
      const fakeCertificateId = 'CERT-FAKE-001';

      const response = await request(app)
        .get(`/api/certificates/verify/${fakeCertificateId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(false);
      expect(response.body.data.reason).toContain('Certificate not found');
    });
  });

  describe('POST /api/certificates/:id/revoke', () => {
    it('should revoke certificate by super admin', async () => {
      const superAdmin = await global.testUtils.createTestUser(User, {
        email: 'admin@example.com',
        role: 'superAdmin'
      });

      const token = global.testUtils.createTestToken(superAdmin);
      const revokeData = {
        reason: 'Academic misconduct'
      };

      const response = await request(app)
        .post(`/api/certificates/${certificate._id}/revoke`)
        .set('Authorization', `Bearer ${token}`)
        .send(revokeData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('revoked');
      expect(response.body.data.revocationReason).toBe(revokeData.reason);
    });

    it('should return error for non-admin user', async () => {
      const token = global.testUtils.createTestToken(student);
      const revokeData = {
        reason: 'Test reason'
      };

      const response = await request(app)
        .post(`/api/certificates/${certificate._id}/revoke`)
        .set('Authorization', `Bearer ${token}`)
        .send(revokeData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });

    it('should return error for already revoked certificate', async () => {
      // Revoke the certificate first
      certificate.status = 'revoked';
      await certificate.save();

      const superAdmin = await global.testUtils.createTestUser(User, {
        email: 'admin@example.com',
        role: 'superAdmin'
      });

      const token = global.testUtils.createTestToken(superAdmin);
      const revokeData = {
        reason: 'Another reason'
      };

      const response = await request(app)
        .post(`/api/certificates/${certificate._id}/revoke`)
        .set('Authorization', `Bearer ${token}`)
        .send(revokeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Certificate already revoked');
    });
  });

  describe('GET /api/certificates/analytics', () => {
    beforeEach(async () => {
      // Create additional certificates for analytics
      await Certificate.create([
        {
          certificateId: 'CERT-2024-002',
          student: student._id,
          course: course._id,
          enrollment: enrollment._id,
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'valid',
          qrCode: 'qr-code-data-2',
          pdfPath: '/certificates/CERT-2024-002.pdf'
        },
        {
          certificateId: 'CERT-2024-003',
          student: student._id,
          course: course._id,
          enrollment: enrollment._id,
          issuedDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'revoked',
          qrCode: 'qr-code-data-3',
          pdfPath: '/certificates/CERT-2024-003.pdf',
          revocationReason: 'Academic misconduct'
        }
      ]);
    });

    it('should get certificate analytics for super admin', async () => {
      const superAdmin = await global.testUtils.createTestUser(User, {
        email: 'admin@example.com',
        role: 'superAdmin'
      });

      const token = global.testUtils.createTestToken(superAdmin);

      const response = await request(app)
        .get('/api/certificates/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCertificates');
      expect(response.body.data).toHaveProperty('validCertificates');
      expect(response.body.data).toHaveProperty('revokedCertificates');
      expect(response.body.data).toHaveProperty('certificatesByMonth');
    });

    it('should get certificate analytics for teacher', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .get('/api/certificates/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCertificates');
      expect(response.body.data).toHaveProperty('certificatesByCourse');
    });

    it('should return error for unauthorized access', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/certificates/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/certificates/qr/:qrCode', () => {
    it('should get certificate by QR code', async () => {
      const response = await request(app)
        .get(`/api/certificates/qr/${certificate.qrCode}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(certificate._id.toString());
      expect(response.body.data.certificateId).toBe(certificate.certificateId);
    });

    it('should return 404 for invalid QR code', async () => {
      const fakeQrCode = 'invalid-qr-code';

      const response = await request(app)
        .get(`/api/certificates/qr/${fakeQrCode}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Certificate not found');
    });
  });
});

