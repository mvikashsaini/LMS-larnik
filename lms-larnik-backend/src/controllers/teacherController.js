const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');
const { sendEmail } = require('../services/emailService');

/**
 * @desc    Get teacher's courses
 * @route   GET /api/teacher/courses
 * @access  Private (Teacher)
 */
const getMyCourses = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = req.query;

  const query = { teacher: req.user._id };
  
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const courses = await Course.find(query)
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('university', 'name')
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Course.countDocuments(query);

  res.status(200).json({
    success: true,
    data: courses,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Create new course
 * @route   POST /api/teacher/courses
 * @access  Private (Teacher)
 */
const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    category,
    subCategory,
    price,
    originalPrice,
    discount,
    duration,
    level,
    language,
    requirements,
    outcomes,
    targetAudience,
    tags,
    thumbnail,
    previewVideo,
    modules
  } = req.body;

  // Check if course with same title exists
  const existingCourse = await Course.findOne({ 
    title, 
    teacher: req.user._id 
  });

  if (existingCourse) {
    return res.status(400).json({
      success: false,
      message: 'Course with this title already exists'
    });
  }

  const courseData = {
    title,
    description,
    shortDescription,
    teacher: req.user._id,
    university: req.user.university,
    category,
    subCategory,
    price: parseFloat(price),
    originalPrice: parseFloat(originalPrice),
    discount: parseFloat(discount),
    duration: parseInt(duration),
    level,
    language,
    requirements: requirements ? requirements.split('\n').filter(req => req.trim()) : [],
    outcomes: outcomes ? outcomes.split('\n').filter(outcome => outcome.trim()) : [],
    targetAudience,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    thumbnail,
    previewVideo,
    modules: modules || [],
    status: 'pending',
    isPublished: false
  };

  const course = await Course.create(courseData);

  res.status(201).json({
    success: true,
    data: course
  });
});

/**
 * @desc    Update course
 * @route   PUT /api/teacher/courses/:id
 * @access  Private (Teacher)
 */
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const course = await Course.findOne({ _id: id, teacher: req.user._id });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Reset approval status if content changed
  if (updateData.title || updateData.description || updateData.modules) {
    updateData.status = 'pending';
    updateData.isPublished = false;
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('category', 'name')
   .populate('subCategory', 'name');

  res.status(200).json({
    success: true,
    data: updatedCourse
  });
});

/**
 * @desc    Delete course
 * @route   DELETE /api/teacher/courses/:id
 * @access  Private (Teacher)
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const course = await Course.findOne({ _id: id, teacher: req.user._id });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Check if course has enrollments
  const enrollmentCount = await Enrollment.countDocuments({ course: id });
  if (enrollmentCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete course with active enrollments'
    });
  }

  await course.remove();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
});

/**
 * @desc    Get course enrollments
 * @route   GET /api/teacher/courses/:id/enrollments
 * @access  Private (Teacher)
 */
const getCourseEnrollments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10, status, search } = req.query;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  // Verify course ownership
  const course = await Course.findOne({ _id: id, teacher: req.user._id });
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const query = { course: id };
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { 'student.firstName': { $regex: search, $options: 'i' } },
      { 'student.lastName': { $regex: search, $options: 'i' } },
      { 'student.email': { $regex: search, $options: 'i' } }
    ];
  }

  const enrollments = await Enrollment.find(query)
    .populate('student', 'firstName lastName email phone avatar')
    .populate('payment', 'amount status paymentMethod')
    .sort({ enrolledAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Enrollment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: enrollments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get teacher's earnings
 * @route   GET /api/teacher/earnings
 * @access  Private (Teacher)
 */
const getMyEarnings = asyncHandler(async (req, res) => {
  const { period = '30d', startDate, endDate } = req.query;

  let dateFilter = {};
  const now = new Date();

  if (startDate && endDate) {
    dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
  } else {
    switch (period) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case '1y':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
        break;
    }
  }

  // Get teacher's courses
  const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
  const courseIds = teacherCourses.map(course => course._id);

  const [
    totalEarnings,
    totalEnrollments,
    monthlyEarnings,
    courseEarnings,
    recentPayments
  ] = await Promise.all([
    Payment.aggregate([
      { 
        $match: { 
          course: { $in: courseIds }, 
          status: 'completed',
          ...dateFilter
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Enrollment.countDocuments({ 
      course: { $in: courseIds },
      ...dateFilter
    }),
    Payment.aggregate([
      { 
        $match: { 
          course: { $in: courseIds }, 
          status: 'completed',
          ...dateFilter
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          earnings: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]),
    Payment.aggregate([
      { 
        $match: { 
          course: { $in: courseIds }, 
          status: 'completed',
          ...dateFilter
        } 
      },
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
          earnings: { $sum: '$amount' },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { earnings: -1 } },
      { $limit: 10 }
    ]),
    Payment.find({ 
      course: { $in: courseIds }, 
      status: 'completed'
    })
      .populate('course', 'title')
      .populate('student', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalEarnings: totalEarnings[0]?.total || 0,
        totalEnrollments,
        averageEarning: totalEnrollments > 0 ? (totalEarnings[0]?.total || 0) / totalEnrollments : 0
      },
      monthlyEarnings,
      courseEarnings,
      recentPayments
    }
  });
});

/**
 * @desc    Get teacher's wallet
 * @route   GET /api/teacher/wallet
 * @access  Private (Teacher)
 */
const getMyWallet = asyncHandler(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });

  if (!wallet) {
    wallet = await Wallet.create({
      user: req.user._id,
      balance: 0,
      currency: 'INR'
    });
  }

  // Get recent transactions
  const recentTransactions = wallet.transactions
    .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt))
    .slice(0, 10);

  res.status(200).json({
    success: true,
    data: {
      wallet: {
        _id: wallet._id,
        balance: wallet.balance,
        currency: wallet.currency,
        totalEarnings: wallet.totalEarnings || 0,
        totalWithdrawn: wallet.totalWithdrawn || 0
      },
      recentTransactions
    }
  });
});

/**
 * @desc    Request settlement
 * @route   POST /api/teacher/settlement
 * @access  Private (Teacher)
 */
const requestSettlement = asyncHandler(async (req, res) => {
  const { amount, bankDetails, upiId, notes } = req.body;

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'Wallet not found'
    });
  }

  // Check minimum settlement amount
  if (amount < 1000) {
    return res.status(400).json({
      success: false,
      message: 'Minimum settlement amount is ₹1000'
    });
  }

  // Check if sufficient balance
  if (amount > wallet.balance) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient balance'
    });
  }

  const settlementRequest = {
    amount: parseFloat(amount),
    bankDetails,
    upiId,
    notes,
    status: 'pending',
    requestedAt: new Date()
  };

  wallet.settlementRequests.push(settlementRequest);
  await wallet.save();

  res.status(200).json({
    success: true,
    data: settlementRequest
  });
});

/**
 * @desc    Get teacher dashboard
 * @route   GET /api/teacher/dashboard
 * @access  Private (Teacher)
 */
const getTeacherDashboard = asyncHandler(async (req, res) => {
  const [
    totalCourses,
    activeCourses,
    totalEnrollments,
    totalEarnings,
    recentEnrollments,
    pendingApprovals,
    topCourses
  ] = await Promise.all([
    Course.countDocuments({ teacher: req.user._id }),
    Course.countDocuments({ teacher: req.user._id, status: 'active', isPublished: true }),
    Enrollment.countDocuments({ 
      course: { $in: await Course.find({ teacher: req.user._id }).select('_id') }
    }),
    Payment.aggregate([
      { 
        $match: { 
          course: { $in: await Course.find({ teacher: req.user._id }).select('_id') }, 
          status: 'completed' 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Enrollment.find({ 
      course: { $in: await Course.find({ teacher: req.user._id }).select('_id') }
    })
      .populate('course', 'title')
      .populate('student', 'firstName lastName')
      .sort({ enrolledAt: -1 })
      .limit(5),
    Course.find({ teacher: req.user._id, status: 'pending' })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
    Course.find({ teacher: req.user._id })
      .populate('category', 'name')
      .sort({ enrollments: -1 })
      .limit(5)
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalCourses,
        activeCourses,
        totalEnrollments,
        totalEarnings: totalEarnings[0]?.total || 0,
        approvalRate: totalCourses > 0 ? Math.round((activeCourses / totalCourses) * 100) : 0
      },
      recentEnrollments,
      pendingApprovals,
      topCourses
    }
  });
});

module.exports = {
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseEnrollments,
  getMyEarnings,
  getMyWallet,
  requestSettlement,
  getTeacherDashboard
};
