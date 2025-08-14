const express = require('express');
const router = express.Router();
const {
  getUniversityDetails,
  updateUniversityDetails,
  getUniversityStaff,
  assignStaffRole,
  removeStaffRole,
  getUniversityStudents,
  getUniversityCourses,
  approveCourse,
  uploadMoU,
  approveCertificate,
  getUniversityAnalytics,
  getUniversityDashboard
} = require('../controllers/universityAdminController');

const { protect, authorize } = require('../middleware/auth');
const { uploadMou } = require('../middleware/upload');

// All routes require authentication and university admin role
router.use(protect);
router.use(authorize('universityAdmin'));

// Dashboard
router.get('/dashboard', getUniversityDashboard);

// University management
router.get('/university', getUniversityDetails);
router.put('/university', updateUniversityDetails);

// Staff management
router.get('/staff', getUniversityStaff);
router.post('/staff', assignStaffRole);
router.delete('/staff/:userId', removeStaffRole);

// Student management
router.get('/students', getUniversityStudents);

// Course management
router.get('/courses', getUniversityCourses);
router.put('/courses/:id/approve', approveCourse);

// MoU management
router.post('/mou', uploadMou, uploadMoU);

// Certificate management
router.put('/certificates/:id/approve', approveCertificate);

// Analytics
router.get('/analytics', getUniversityAnalytics);

module.exports = router;
