const express = require('express');
const router = express.Router();
const {
  getUserAnalytics,
  getRevenueAnalytics,
  exportAnalytics,
  getRealTimeAnalytics,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  sendBulkNotifications,
  getSubAdminDashboard
} = require('../controllers/subAdminController');

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and sub admin role
router.use(protect);
router.use(authorize('subAdmin'));

// Dashboard
router.get('/dashboard', getSubAdminDashboard);

// Analytics
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/export', exportAnalytics);
router.get('/analytics/realtime', getRealTimeAnalytics);

// Category management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Notifications
router.post('/notifications/bulk', sendBulkNotifications);

module.exports = router;
