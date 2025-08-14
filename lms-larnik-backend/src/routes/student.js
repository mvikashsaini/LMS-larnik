const express = require('express');
const router = express.Router();
const {
  getMyCourses,
  getCourseProgress,
  updateCourseProgress,
  submitQuizAttempt,
  submitCourseReview,
  getMyCertificates,
  downloadCertificate,
  getMyPayments,
  getStudentDashboard
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// Dashboard
router.get('/dashboard', getStudentDashboard);

// Course management
router.get('/my-courses', getMyCourses);
router.get('/course/:courseId/progress', getCourseProgress);
router.put('/course/:courseId/progress', updateCourseProgress);

// Quiz and reviews
router.post('/course/:courseId/quiz', submitQuizAttempt);
router.post('/course/:courseId/review', submitCourseReview);

// Certificates
router.get('/certificates', getMyCertificates);
router.get('/certificate/:certificateId/download', downloadCertificate);

// Payments
router.get('/payments', getMyPayments);

module.exports = router;
