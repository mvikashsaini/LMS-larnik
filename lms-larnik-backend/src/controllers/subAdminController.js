const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');
const { sendEmail } = require('../services/emailService');
const ExcelJS = require('exceljs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * @desc    Get user analytics (limited scope)
 * @route   GET /api/sub-admin/analytics/users
 * @access  Private (Sub Admin)
 */
const getUserAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d', role } = req.query;

  let dateFilter = {};
  const now = new Date();

  switch (period) {
    case '7d':
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      break;
    case '30d':
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      break;
    case '90d':
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      break;
    case '1y':
      dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
      break;
  }

  const query = { createdAt: dateFilter };
  if (role) query.role = role;

  const [
    totalUsers,
    activeUsers,
    newUsers,
    userRoles,
    userGrowth,
    topUsers
  ] = await Promise.all([
    User.countDocuments(query),
    User.countDocuments({ 
      ...query,
      lastLogin: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
    }),
    User.countDocuments({ 
      ...query,
      createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
    }),
    User.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]),
    User.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]),
    User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'student',
          as: 'enrollments'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          role: 1,
          enrollments: { $size: '$enrollments' },
          totalSpent: { $sum: '$enrollments.amount' }
        }
      },
      { $sort: { enrollments: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        activeUsers,
        newUsers,
        engagementRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
      },
      userRoles,
      userGrowth,
      topUsers
    }
  });
});

/**
 * @desc    Get revenue analytics (limited scope)
 * @route   GET /api/sub-admin/analytics/revenue
 * @access  Private (Sub Admin)
 */
const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;

  let dateFilter = {};
  const now = new Date();

  switch (period) {
    case '7d':
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      break;
    case '30d':
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      break;
    case '90d':
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      break;
    case '1y':
      dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
      break;
  }

  const query = { createdAt: dateFilter };

  const [
    totalRevenue,
    totalPayments,
    averageOrderValue,
    refunds,
    monthlyRevenue,
    revenueByCourse,
    revenueByTeacher,
    paymentMethods
  ] = await Promise.all([
    Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.countDocuments({ ...query, status: 'completed' }),
    Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      { $group: { _id: null, average: { $avg: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { ...query, status: 'refunded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]),
    Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseData'
        }
      },
      { $unwind: '$courseData' },
      {
        $group: {
          _id: '$courseData._id',
          title: { $first: '$courseData.title' },
          revenue: { $sum: '$amount' },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]),
    Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseData'
        }
      },
      { $unwind: '$courseData' },
      {
        $lookup: {
          from: 'users',
          localField: 'courseData.teacher',
          foreignField: '_id',
          as: 'teacherData'
        }
      },
      { $unwind: '$teacherData' },
      {
        $group: {
          _id: '$teacherData._id',
          name: { $first: '$teacherData.firstName' },
          revenue: { $sum: '$amount' },
          courses: { $addToSet: '$courseData.title' },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]),
    Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalPayments,
        averageOrderValue: averageOrderValue[0]?.average || 0,
        totalRefunds: refunds[0]?.total || 0,
        netRevenue: (totalRevenue[0]?.total || 0) - (refunds[0]?.total || 0)
      },
      trends: {
        monthlyRevenue
      },
      breakdown: {
        revenueByCourse,
        revenueByTeacher,
        paymentMethods
      }
    }
  });
});

/**
 * @desc    Export analytics data
 * @route   GET /api/sub-admin/analytics/export
 * @access  Private (Sub Admin)
 */
const exportAnalytics = asyncHandler(async (req, res) => {
  const { type, period = '30d', format = 'excel' } = req.query;

  let dateFilter = {};
  const now = new Date();

  switch (period) {
    case '7d':
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      break;
    case '30d':
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      break;
    case '90d':
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      break;
    case '1y':
      dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
      break;
  }

  let data = [];
  let fileName = '';

  switch (type) {
    case 'users':
      data = await User.find({ createdAt: dateFilter })
        .select('firstName lastName email role phone createdAt lastLogin')
        .sort({ createdAt: -1 });
      fileName = `users_${period}_${new Date().toISOString().split('T')[0]}`;
      break;

    case 'courses':
      data = await Course.find({ createdAt: dateFilter })
        .populate('teacher', 'firstName lastName')
        .populate('category', 'name')
        .select('title description price status enrollments createdAt')
        .sort({ createdAt: -1 });
      fileName = `courses_${period}_${new Date().toISOString().split('T')[0]}`;
      break;

    case 'enrollments':
      data = await Enrollment.find({ createdAt: dateFilter })
        .populate('student', 'firstName lastName email')
        .populate('course', 'title')
        .populate('teacher', 'firstName lastName')
        .select('status amount enrolledAt completedAt')
        .sort({ enrolledAt: -1 });
      fileName = `enrollments_${period}_${new Date().toISOString().split('T')[0]}`;
      break;

    case 'payments':
      data = await Payment.find({ createdAt: dateFilter })
        .populate('student', 'firstName lastName email')
        .populate('course', 'title')
        .select('amount status paymentMethod createdAt')
        .sort({ createdAt: -1 });
      fileName = `payments_${period}_${new Date().toISOString().split('T')[0]}`;
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid export type'
      });
  }

  if (format === 'excel') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type);

    // Add headers based on data type
    if (data.length > 0) {
      const headers = Object.keys(data[0]._doc || data[0]);
      worksheet.addRow(headers);

      // Add data rows
      data.forEach(item => {
        const row = headers.map(header => {
          const value = item[header];
          if (value && typeof value === 'object' && value._id) {
            return value.firstName ? `${value.firstName} ${value.lastName}` : value.name || value.title;
          }
          return value;
        });
        worksheet.addRow(row);
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } else if (format === 'csv') {
    const csvWriter = createCsvWriter({
      path: `/tmp/${fileName}.csv`,
      header: data.length > 0 ? Object.keys(data[0]._doc || data[0]).map(key => ({
        id: key,
        title: key
      })) : []
    });

    const csvData = data.map(item => {
      const row = {};
      Object.keys(item._doc || item).forEach(key => {
        const value = item[key];
        if (value && typeof value === 'object' && value._id) {
          row[key] = value.firstName ? `${value.firstName} ${value.lastName}` : value.name || value.title;
        } else {
          row[key] = value;
        }
      });
      return row;
    });

    await csvWriter.writeRecords(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`);
    res.sendFile(`/tmp/${fileName}.csv`);
  }
});

/**
 * @desc    Get real-time analytics
 * @route   GET /api/sub-admin/analytics/realtime
 * @access  Private (Sub Admin)
 */
const getRealTimeAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

  const [
    newUsers24h,
    newUsers1h,
    newEnrollments24h,
    newEnrollments1h,
    newPayments24h,
    newPayments1h,
    revenue24h,
    revenue1h,
    activeUsers,
    onlineUsers
  ] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: last24Hours } }),
    User.countDocuments({ createdAt: { $gte: lastHour } }),
    Enrollment.countDocuments({ enrolledAt: { $gte: last24Hours } }),
    Enrollment.countDocuments({ enrolledAt: { $gte: lastHour } }),
    Payment.countDocuments({ createdAt: { $gte: last24Hours }, status: 'completed' }),
    Payment.countDocuments({ createdAt: { $gte: lastHour }, status: 'completed' }),
    Payment.aggregate([
      { $match: { createdAt: { $gte: last24Hours }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Payment.aggregate([
      { $match: { createdAt: { $gte: lastHour }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    User.countDocuments({ lastLogin: { $gte: last24Hours } }),
    User.countDocuments({ lastLogin: { $gte: lastHour } })
  ]);

  res.status(200).json({
    success: true,
    data: {
      last24Hours: {
        newUsers: newUsers24h,
        newEnrollments: newEnrollments24h,
        newPayments: newPayments24h,
        revenue: revenue24h[0]?.total || 0,
        activeUsers
      },
      lastHour: {
        newUsers: newUsers1h,
        newEnrollments: newEnrollments1h,
        newPayments: newPayments1h,
        revenue: revenue1h[0]?.total || 0,
        onlineUsers
      }
    }
  });
});

/**
 * @desc    Get category management
 * @route   GET /api/sub-admin/categories
 * @access  Private (Sub Admin)
 */
const getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;

  const query = {};
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (status) {
    query.isActive = status === 'active';
  }

  const categories = await Category.find(query)
    .populate('subCategories', 'name')
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Category.countDocuments(query);

  res.status(200).json({
    success: true,
    data: categories,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Create category
 * @route   POST /api/sub-admin/categories
 * @access  Private (Sub Admin)
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color, order } = req.body;

  // Check if category with same name exists
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(400).json({
      success: false,
      message: 'Category with this name already exists'
    });
  }

  const categoryData = {
    name,
    description,
    icon,
    color,
    order: order || 0,
    isActive: true
  };

  const category = await Category.create(categoryData);

  res.status(201).json({
    success: true,
    data: category
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/sub-admin/categories/:id
 * @access  Private (Sub Admin)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category ID'
    });
  }

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedCategory
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/sub-admin/categories/:id
 * @access  Private (Sub Admin)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category ID'
    });
  }

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has courses
  const courseCount = await Course.countDocuments({ category: id });
  if (courseCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with active courses'
    });
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

/**
 * @desc    Send bulk notifications
 * @route   POST /api/sub-admin/notifications/bulk
 * @access  Private (Sub Admin)
 */
const sendBulkNotifications = asyncHandler(async (req, res) => {
  const { userIds, title, message, type = 'general', priority = 'normal' } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'User IDs array is required'
    });
  }

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Title and message are required'
    });
  }

  // Create notifications
  const notifications = userIds.map(userId => ({
    recipient: userId,
    title,
    message,
    type,
    priority,
    sentBy: req.user._id
  }));

  await Notification.insertMany(notifications);

  // Send emails in background
  const users = await User.find({ _id: { $in: userIds } });
  
  users.forEach(async (user) => {
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: title,
        template: 'notification',
        data: { name: user.firstName, message }
      });
    }
  });

  res.status(200).json({
    success: true,
    message: `Notifications sent to ${userIds.length} users`
  });
});

/**
 * @desc    Get sub admin dashboard
 * @route   GET /api/sub-admin/dashboard
 * @access  Private (Sub Admin)
 */
const getSubAdminDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    newUsers30d,
    newCourses30d,
    newEnrollments30d,
    revenue30d,
    topCategories,
    recentActivity
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    User.countDocuments({ createdAt: { $gte: last30Days } }),
    Course.countDocuments({ createdAt: { $gte: last30Days } }),
    Enrollment.countDocuments({ enrolledAt: { $gte: last30Days } }),
    Payment.aggregate([
      { $match: { createdAt: { $gte: last30Days }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Category.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'category',
          as: 'courses'
        }
      },
      {
        $project: {
          name: 1,
          courseCount: { $size: '$courses' },
          totalEnrollments: { $sum: '$courses.enrollments' }
        }
      },
      { $sort: { courseCount: -1 } },
      { $limit: 5 }
    ]),
    Enrollment.find()
      .populate('course', 'title')
      .populate('student', 'firstName lastName')
      .sort({ enrolledAt: -1 })
      .limit(10)
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        newUsers30d,
        newCourses30d,
        newEnrollments30d,
        revenue30d: revenue30d[0]?.total || 0
      },
      topCategories,
      recentActivity
    }
  });
});

module.exports = {
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
};
