const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Enrollment = require('../src/models/Enrollment');
const Payment = require('../src/models/Payment');

describe('Enrollment APIs', () => {
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

    // Create test course with modules and lessons
    course = await Course.create({
      title: 'Test Course',
      description: 'Test course description',
      price: 999,
      teacher: teacher._id,
      status: 'published',
      modules: [
        {
          title: 'Module 1',
          description: 'First module',
          lessons: [
            {
              title: 'Lesson 1.1',
              type: 'video',
              content: 'video1.mp4',
              duration: 300
            },
            {
              title: 'Lesson 1.2',
              type: 'quiz',
              content: {
                questions: [
                  {
                    question: 'What is React?',
                    options: ['Library', 'Framework', 'Language', 'Database'],
                    correctAnswer: 0
                  }
                ]
              }
            }
          ]
        },
        {
          title: 'Module 2',
          description: 'Second module',
          lessons: [
            {
              title: 'Lesson 2.1',
              type: 'video',
              content: 'video2.mp4',
              duration: 450
            }
          ]
        }
      ]
    });

    // Create test enrollment
    enrollment = await Enrollment.create({
      student: student._id,
      course: course._id,
      status: 'active',
      amount: 999,
      progress: {
        completedLessons: [],
        currentModule: 0,
        currentLesson: 0
      }
    });
  });

  describe('POST /api/enrollments', () => {
    it('should create enrollment successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      const enrollmentData = {
        courseId: course._id,
        amount: 999
      };

      const response = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${token}`)
        .send(enrollmentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.student).toBe(student._id.toString());
      expect(response.body.data.course).toBe(course._id.toString());
      expect(response.body.data.status).toBe('pending');
    });

    it('should return error for already enrolled course', async () => {
      const token = global.testUtils.createTestToken(student);
      const enrollmentData = {
        courseId: course._id,
        amount: 999
      };

      const response = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${token}`)
        .send(enrollmentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Already enrolled');
    });

    it('should return error for non-existent course', async () => {
      const token = global.testUtils.createTestToken(student);
      const fakeCourseId = '507f1f77bcf86cd799439011';
      const enrollmentData = {
        courseId: fakeCourseId,
        amount: 999
      };

      const response = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${token}`)
        .send(enrollmentData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Course not found');
    });

    it('should validate required fields', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .post('/api/enrollments')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/enrollments', () => {
    it('should get student enrollments', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/enrollments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('enrollments');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.enrollments)).toBe(true);
    });

    it('should get teacher enrollments', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .get('/api/enrollments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('enrollments');
    });

    it('should filter enrollments by status', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/enrollments?status=active')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.enrollments.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/enrollments/:id', () => {
    it('should get enrollment by ID', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/enrollments/${enrollment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(enrollment._id.toString());
      expect(response.body.data.student).toBe(student._id.toString());
      expect(response.body.data.course).toBe(course._id.toString());
    });

    it('should return 404 for non-existent enrollment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get(`/api/enrollments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
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

      const response = await request(app)
        .get(`/api/enrollments/${enrollment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/enrollments/:id/progress', () => {
    it('should update enrollment progress successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      const progressData = {
        moduleIndex: 0,
        lessonIndex: 1,
        completed: true
      };

      const response = await request(app)
        .put(`/api/enrollments/${enrollment._id}/progress`)
        .set('Authorization', `Bearer ${token}`)
        .send(progressData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress.currentModule).toBe(progressData.moduleIndex);
      expect(response.body.data.progress.currentLesson).toBe(progressData.lessonIndex);
      expect(response.body.data.progress.completedLessons).toContain('0-1');
    });

    it('should return error for invalid lesson access', async () => {
      const token = global.testUtils.createTestToken(student);
      const progressData = {
        moduleIndex: 0,
        lessonIndex: 5, // Invalid lesson index
        completed: true
      };

      const response = await request(app)
        .put(`/api/enrollments/${enrollment._id}/progress`)
        .set('Authorization', `Bearer ${token}`)
        .send(progressData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid lesson');
    });

    it('should return error for unauthorized access', async () => {
      const otherStudent = await global.testUtils.createTestUser(User, {
        email: 'otherstudent@example.com',
        role: 'student'
      });

      const token = global.testUtils.createTestToken(otherStudent);
      const progressData = {
        moduleIndex: 0,
        lessonIndex: 1,
        completed: true
      };

      const response = await request(app)
        .put(`/api/enrollments/${enrollment._id}/progress`)
        .set('Authorization', `Bearer ${token}`)
        .send(progressData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/enrollments/:id/quiz', () => {
    it('should submit quiz successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      const quizData = {
        moduleIndex: 0,
        lessonIndex: 1,
        answers: [0] // Correct answer for the quiz
      };

      const response = await request(app)
        .post(`/api/enrollments/${enrollment._id}/quiz`)
        .set('Authorization', `Bearer ${token}`)
        .send(quizData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('score');
      expect(response.body.data).toHaveProperty('passed');
      expect(response.body.data.score).toBeGreaterThan(0);
    });

    it('should fail quiz with wrong answers', async () => {
      const token = global.testUtils.createTestToken(student);
      const quizData = {
        moduleIndex: 0,
        lessonIndex: 1,
        answers: [3] // Wrong answer
      };

      const response = await request(app)
        .post(`/api/enrollments/${enrollment._id}/quiz`)
        .set('Authorization', `Bearer ${token}`)
        .send(quizData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.score).toBe(0);
      expect(response.body.data.passed).toBe(false);
    });

    it('should return error for non-quiz lesson', async () => {
      const token = global.testUtils.createTestToken(student);
      const quizData = {
        moduleIndex: 0,
        lessonIndex: 0, // Video lesson, not quiz
        answers: [0]
      };

      const response = await request(app)
        .post(`/api/enrollments/${enrollment._id}/quiz`)
        .set('Authorization', `Bearer ${token}`)
        .send(quizData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not a quiz lesson');
    });
  });

  describe('POST /api/enrollments/:id/review', () => {
    it('should submit course review successfully', async () => {
      const token = global.testUtils.createTestToken(student);
      const reviewData = {
        rating: 5,
        comment: 'Excellent course! Very informative and well-structured.'
      };

      const response = await request(app)
        .post(`/api/enrollments/${enrollment._id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.rating).toBe(reviewData.rating);
      expect(response.body.data.comment).toBe(reviewData.comment);
    });

    it('should return error for invalid rating', async () => {
      const token = global.testUtils.createTestToken(student);
      const reviewData = {
        rating: 6, // Invalid rating (should be 1-5)
        comment: 'Good course'
      };

      const response = await request(app)
        .post(`/api/enrollments/${enrollment._id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Rating must be between 1 and 5');
    });

    it('should return error for duplicate review', async () => {
      const token = global.testUtils.createTestToken(student);
      const reviewData = {
        rating: 4,
        comment: 'Good course'
      };

      // Submit first review
      await request(app)
        .post(`/api/enrollments/${enrollment._id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData)
        .expect(200);

      // Try to submit second review
      const response = await request(app)
        .post(`/api/enrollments/${enrollment._id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Review already submitted');
    });
  });

  describe('PUT /api/enrollments/:id/cancel', () => {
    it('should cancel enrollment successfully', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .put(`/api/enrollments/${enrollment._id}/cancel`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
    });

    it('should return error for already cancelled enrollment', async () => {
      // Cancel the enrollment first
      enrollment.status = 'cancelled';
      await enrollment.save();

      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .put(`/api/enrollments/${enrollment._id}/cancel`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Enrollment already cancelled');
    });
  });

  describe('GET /api/enrollments/analytics', () => {
    beforeEach(async () => {
      // Create additional enrollments for analytics
      await Enrollment.create([
        {
          student: student._id,
          course: course._id,
          status: 'completed',
          amount: 999,
          progress: {
            completedLessons: ['0-0', '0-1', '1-0'],
            currentModule: 1,
            currentLesson: 0
          },
          review: {
            rating: 5,
            comment: 'Great course!'
          }
        },
        {
          student: student._id,
          course: course._id,
          status: 'active',
          amount: 1499,
          progress: {
            completedLessons: ['0-0'],
            currentModule: 0,
            currentLesson: 1
          }
        }
      ]);
    });

    it('should get enrollment analytics for student', async () => {
      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .get('/api/enrollments/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalEnrollments');
      expect(response.body.data).toHaveProperty('completedCourses');
      expect(response.body.data).toHaveProperty('averageProgress');
    });

    it('should get enrollment analytics for teacher', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .get('/api/enrollments/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalEnrollments');
      expect(response.body.data).toHaveProperty('averageRating');
      expect(response.body.data).toHaveProperty('completionRate');
    });

    it('should get enrollment analytics for super admin', async () => {
      const superAdmin = await global.testUtils.createTestUser(User, {
        email: 'admin@example.com',
        role: 'superAdmin'
      });

      const token = global.testUtils.createTestToken(superAdmin);

      const response = await request(app)
        .get('/api/enrollments/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalEnrollments');
      expect(response.body.data).toHaveProperty('enrollmentsByStatus');
      expect(response.body.data).toHaveProperty('revenueFromEnrollments');
    });
  });

  describe('GET /api/enrollments/course/:courseId', () => {
    it('should get enrollments for specific course', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .get(`/api/enrollments/course/${course._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return error for unauthorized access', async () => {
      const otherTeacher = await global.testUtils.createTestUser(User, {
        email: 'otherteacher@example.com',
        role: 'teacher'
      });

      const token = global.testUtils.createTestToken(otherTeacher);

      const response = await request(app)
        .get(`/api/enrollments/course/${course._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});

