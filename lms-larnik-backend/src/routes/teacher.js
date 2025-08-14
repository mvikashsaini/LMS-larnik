const express = require('express');
const router = express.Router();
const {
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseEnrollments,
  getMyEarnings,
  getMyWallet,
  requestSettlement,
  getTeacherDashboard
} = require('../controllers/teacherController');

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and teacher role
router.use(protect);
router.use(authorize('teacher'));

// Dashboard
router.get('/dashboard', getTeacherDashboard);

// Course management
router.get('/courses', getMyCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Course enrollments
router.get('/courses/:id/enrollments', getCourseEnrollments);

// Earnings and wallet
router.get('/earnings', getMyEarnings);
router.get('/wallet', getMyWallet);
router.post('/settlement', requestSettlement);

module.exports = router;
