const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  bulkUpdateUsers,
  sendBulkNotifications,
  getAllUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  approveCourse,
  getPlatformAnalytics,
  getSuperAdminDashboard
} = require('../controllers/superAdminController');

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and super admin role
router.use(protect);
router.use(authorize('superAdmin'));

// Dashboard
router.get('/dashboard', getSuperAdminDashboard);

// User management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/bulk', bulkUpdateUsers);

// Notifications
router.post('/notifications/bulk', sendBulkNotifications);

// University management
router.get('/universities', getAllUniversities);
router.post('/universities', createUniversity);
router.put('/universities/:id', updateUniversity);
router.delete('/universities/:id', deleteUniversity);

// Course approval
router.put('/courses/:id/approve', approveCourse);

// Platform analytics
router.get('/analytics', getPlatformAnalytics);

module.exports = router;
