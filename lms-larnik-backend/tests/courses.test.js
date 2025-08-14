const request = require('supertest');
const app = require('../app');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Category = require('../src/models/Category');
const SubCategory = require('../src/models/SubCategory');

describe('Course Management APIs', () => {
  let teacher, superAdmin, category, subCategory, course;

  beforeEach(async () => {
    // Create test users
    teacher = await global.testUtils.createTestUser(User, {
      email: 'teacher@example.com',
      role: 'teacher'
    });

    superAdmin = await global.testUtils.createTestUser(User, {
      email: 'admin@example.com',
      role: 'superAdmin'
    });

    // Create test category and subcategory
    category = await Category.create({
      name: 'Technology',
      slug: 'technology',
      description: 'Technology courses'
    });

    subCategory = await SubCategory.create({
      name: 'Web Development',
      slug: 'web-development',
      category: category._id,
      description: 'Web development courses'
    });

    // Create test course
    course = await Course.create({
      title: 'React Fundamentals',
      description: 'Learn React from scratch',
      price: 999,
      category: category._id,
      subCategory: subCategory._id,
      teacher: teacher._id,
      status: 'draft',
      modules: [
        {
          title: 'Introduction to React',
          description: 'Basic concepts',
          lessons: [
            {
              title: 'What is React?',
              type: 'video',
              content: 'video-url.mp4',
              duration: 300
            }
          ]
        }
      ]
    });
  });

  describe('POST /api/courses', () => {
    it('should create a new course successfully', async () => {
      const token = global.testUtils.createTestToken(teacher);
      const courseData = {
        title: 'Node.js Backend Development',
        description: 'Learn Node.js and Express',
        price: 1499,
        category: category._id,
        subCategory: subCategory._id,
        modules: [
          {
            title: 'Introduction to Node.js',
            description: 'Getting started with Node.js',
            lessons: [
              {
                title: 'What is Node.js?',
                type: 'video',
                content: 'node-intro.mp4',
                duration: 600
              }
            ]
          }
        ]
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${token}`)
        .send(courseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(courseData.title);
      expect(response.body.data.teacher).toBe(teacher._id.toString());
      expect(response.body.data.status).toBe('draft');
    });

    it('should return error for unauthorized access', async () => {
      const student = await global.testUtils.createTestUser(User, {
        email: 'student@example.com',
        role: 'student'
      });

      const token = global.testUtils.createTestToken(student);
      const courseData = {
        title: 'Test Course',
        description: 'Test description',
        price: 999
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${token}`)
        .send(courseData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });

    it('should validate required fields', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/courses', () => {
    it('should get all courses with pagination', async () => {
      const response = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('courses');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.courses)).toBe(true);
    });

    it('should filter courses by category', async () => {
      const response = await request(app)
        .get(`/api/courses?category=${category._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.courses.length).toBeGreaterThan(0);
    });

    it('should filter courses by status', async () => {
      const response = await request(app)
        .get('/api/courses?status=published')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should search courses by title', async () => {
      const response = await request(app)
        .get('/api/courses?search=React')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.courses.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should get course by ID', async () => {
      const response = await request(app)
        .get(`/api/courses/${course._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(course._id.toString());
      expect(response.body.data.title).toBe(course.title);
    });

    it('should return 404 for non-existent course', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/courses/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Course not found');
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update course successfully', async () => {
      const token = global.testUtils.createTestToken(teacher);
      const updateData = {
        title: 'Updated React Course',
        description: 'Updated description',
        price: 1299
      };

      const response = await request(app)
        .put(`/api/courses/${course._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.price).toBe(updateData.price);
    });

    it('should return error for unauthorized update', async () => {
      const otherTeacher = await global.testUtils.createTestUser(User, {
        email: 'otherteacher@example.com',
        role: 'teacher'
      });

      const token = global.testUtils.createTestToken(otherTeacher);
      const updateData = {
        title: 'Unauthorized Update'
      };

      const response = await request(app)
        .put(`/api/courses/${course._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete course successfully', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .delete(`/api/courses/${course._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Course deleted successfully');
    });

    it('should return error for unauthorized deletion', async () => {
      const student = await global.testUtils.createTestUser(User, {
        email: 'student@example.com',
        role: 'student'
      });

      const token = global.testUtils.createTestToken(student);

      const response = await request(app)
        .delete(`/api/courses/${course._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/courses/:id/approve', () => {
    it('should approve course by super admin', async () => {
      const token = global.testUtils.createTestToken(superAdmin);

      const response = await request(app)
        .post(`/api/courses/${course._id}/approve`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'approved' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('approved');
    });

    it('should reject course by super admin', async () => {
      const token = global.testUtils.createTestToken(superAdmin);

      const response = await request(app)
        .post(`/api/courses/${course._id}/approve`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          status: 'rejected',
          rejectionReason: 'Content quality issues'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('rejected');
    });

    it('should return error for non-admin user', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .post(`/api/courses/${course._id}/approve`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'approved' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/courses/featured', () => {
    it('should get featured courses', async () => {
      // Create a featured course
      await Course.create({
        title: 'Featured Course',
        description: 'This is a featured course',
        price: 999,
        category: category._id,
        subCategory: subCategory._id,
        teacher: teacher._id,
        status: 'published',
        isFeatured: true
      });

      const response = await request(app)
        .get('/api/courses/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/courses/trending', () => {
    it('should get trending courses', async () => {
      const response = await request(app)
        .get('/api/courses/trending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/courses/teacher/:teacherId', () => {
    it('should get courses by teacher', async () => {
      const response = await request(app)
        .get(`/api/courses/teacher/${teacher._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/courses/:id/modules', () => {
    it('should add module to course', async () => {
      const token = global.testUtils.createTestToken(teacher);
      const moduleData = {
        title: 'New Module',
        description: 'Module description',
        lessons: [
          {
            title: 'New Lesson',
            type: 'video',
            content: 'lesson-video.mp4',
            duration: 450
          }
        ]
      };

      const response = await request(app)
        .post(`/api/courses/${course._id}/modules`)
        .set('Authorization', `Bearer ${token}`)
        .send(moduleData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.modules.length).toBeGreaterThan(course.modules.length);
    });
  });

  describe('GET /api/courses/analytics', () => {
    it('should get course analytics for teacher', async () => {
      const token = global.testUtils.createTestToken(teacher);

      const response = await request(app)
        .get('/api/courses/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCourses');
      expect(response.body.data).toHaveProperty('totalEnrollments');
      expect(response.body.data).toHaveProperty('totalRevenue');
    });

    it('should get course analytics for super admin', async () => {
      const token = global.testUtils.createTestToken(superAdmin);

      const response = await request(app)
        .get('/api/courses/analytics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCourses');
      expect(response.body.data).toHaveProperty('coursesByStatus');
    });
  });
});

