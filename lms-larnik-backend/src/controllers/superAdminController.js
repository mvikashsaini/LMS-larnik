const User = require('../models/User');
const University = require('../models/University');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');
const { sendEmail } = require('../services/emailService');

/**
 * @desc    Get all users (platform-wide)
 * @route   GET /api/super-admin/users
 * @access  Private (Super Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    role,
    status,
    university,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};

  // Apply filters
  if (role) query.role = role;
  if (status) query.isActive = status === 'active';
  if (university) query.university = university;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const users = await User.find(query)
    .populate('university', 'name')
    .populate('teacherProfile.bankDetails')
    .populate('studentProfile')
    .populate('referralPartner')
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Create new user
 * @route   POST /api/super-admin/users
 * @access  Private (Super Admin)
 */
const createUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    university,
    universityRole,
    isActive = true
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    university,
    universityRole,
    isActive
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/super-admin/users/:id
 * @access  Private (Super Admin)
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  ).populate('university', 'name');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/super-admin/users/:id
 * @access  Private (Super Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * @desc    Bulk update users
 * @route   PUT /api/super-admin/users/bulk
 * @access  Private (Super Admin)
 */
const bulkUpdateUsers = asyncHandler(async (req, res) => {
  const { userIds, updates } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'User IDs array is required'
    });
  }

  const result = await User.updateMany(
    { _id: { $in: userIds } },
    updates
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} users updated successfully`
  });
});

/**
 * @desc    Send bulk notifications
 * @route   POST /api/super-admin/notifications/bulk
 * @access  Private (Super Admin)
 */
const sendBulkNotifications = asyncHandler(async (req, res) => {
  const { userIds, title, message, type = 'info', priority = 'normal' } = req.body;

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

  // Create notifications for all users
  const notifications = userIds.map(userId => ({
    recipient: userId,
    title,
    message,
    type,
    priority
  }));

  await Notification.insertMany(notifications);

  res.status(200).json({
    success: true,
    message: `Notifications sent to ${userIds.length} users`
  });
});

/**
 * @desc    Get all universities
 * @route   GET /api/super-admin/universities
 * @access  Private (Super Admin)
 */
const getAllUniversities = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};

  if (status) query.isActive = status === 'active';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const universities = await University.find(query)
    .populate('contact.contactPerson', 'firstName lastName email')
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await University.countDocuments(query);

  res.status(200).json({
    success: true,
    data: universities,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Create university
 * @route   POST /api/super-admin/universities
 * @access  Private (Super Admin)
 */
const createUniversity = asyncHandler(async (req, res) => {
  const university = await University.create(req.body);

  res.status(201).json({
    success: true,
    data: university
  });
});

/**
 * @desc    Update university
 * @route   PUT /api/super-admin/universities/:id
 * @access  Private (Super Admin)
 */
const updateUniversity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid university ID'
    });
  }

  const university = await University.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!university) {
    return res.status(404).json({
      success: false,
      message: 'University not found'
    });
  }

  res.status(200).json({
    success: true,
    data: university
  });
});

/**
 * @desc    Delete university
 * @route   DELETE /api/super-admin/universities/:id
 * @access  Private (Super Admin)
 */
const deleteUniversity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid university ID'
    });
  }

  const university = await University.findByIdAndDelete(id);

  if (!university) {
    return res.status(404).json({
      success: false,
      message: 'University not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'University deleted successfully'
  });
});

/**
 * @desc    Approve course
 * @route   PUT /api/super-admin/courses/:id/approve
 * @access  Private (Super Admin)
 */
const approveCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const course = await Course.findByIdAndUpdate(
    id,
    {
      isApproved: status === 'approved',
      reviewStatus: status,
      reviewComments: comments,
      reviewedBy: req.user._id,
      reviewedAt: new Date()
    },
    { new: true }
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

/**
 * @desc    Get platform analytics
 * @route   GET /api/super-admin/analytics
 * @access  Private (Super Admin)
 */
const getPlatformAnalytics = asyncHandler(async (req, res) => {
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

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    totalCertificates,
    userGrowth,
    revenueGrowth,
    topCourses,
    topUniversities
  ] = await Promise.all([
    User.countDocuments({ createdAt: dateFilter }),
    Course.countDocuments({ createdAt: dateFilter }),
    Enrollment.countDocuments({ createdAt: dateFilter }),
    Payment.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Certificate.countDocuments({ createdAt: dateFilter }),
    User.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]),
    Payment.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' }
        }
      }
    ]),
    Course.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments'
        }
      },
      {
        $project: {
          title: 1,
          enrollments: { $size: '$enrollments' },
          revenue: { $sum: '$enrollments.amount' }
        }
      },
      { $sort: { enrollments: -1 } },
      { $limit: 10 }
    ]),
    University.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'university',
          as: 'courses'
        }
      },
      {
        $project: {
          name: 1,
          courses: { $size: '$courses' },
          students: { $sum: '$courses.enrollments' }
        }
      },
      { $sort: { courses: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCertificates
      },
      userGrowth,
      revenueGrowth,
      topCourses,
      topUniversities
    }
  });
});

/**
 * @desc    Get super admin dashboard
 * @route   GET /api/super-admin/dashboard
 * @access  Private (Super Admin)
 */
const getSuperAdminDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalUniversities,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    pendingApprovals,
    recentUsers,
    recentCourses,
    recentPayments
  ] = await Promise.all([
    User.countDocuments(),
    University.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Course.countDocuments({ isApproved: false }),
    User.find().sort({ createdAt: -1 }).limit(10).select('firstName lastName email role createdAt'),
    Course.find().sort({ createdAt: -1 }).limit(10).select('title teacher university isApproved createdAt'),
    Payment.find().sort({ createdAt: -1 }).limit(10).populate('student', 'firstName lastName').populate('course', 'title')
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalUniversities,
        totalCourses,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingApprovals
      },
      recentUsers,
      recentCourses,
      recentPayments
    }
  });
});

module.exports = {
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
};
