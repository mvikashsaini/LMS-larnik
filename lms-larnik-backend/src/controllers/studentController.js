const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');

/**
 * @desc    Get student's enrolled courses
 * @route   GET /api/student/my-courses
 * @access  Private (Student)
 */
const getMyCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = { student: req.user._id };
  
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { 'course.title': { $regex: search, $options: 'i' } },
      { 'course.description': { $regex: search, $options: 'i' } }
    ];
  }

  const enrollments = await Enrollment.find(query)
    .populate('course', 'title description thumbnail price level duration')
    .populate('teacher', 'firstName lastName avatar')
    .populate('certificate', 'certificateId issuedDate')
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
 * @desc    Get student's course progress
 * @route   GET /api/student/course/:courseId/progress
 * @access  Private (Student)
 */
const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!validateObjectId(courseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  }).populate('course', 'title modules');

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Calculate detailed progress
  const course = enrollment.course;
  let totalLessons = 0;
  let completedLessons = 0;
  let moduleProgress = [];

  if (course.modules) {
    moduleProgress = course.modules.map(module => {
      const moduleLessons = module.lessons ? module.lessons.length : 0;
      const moduleCompleted = enrollment.completedLessons.filter(
        lessonId => module.lessons.some(lesson => lesson._id.toString() === lessonId.toString())
      ).length;

      totalLessons += moduleLessons;
      completedLessons += moduleCompleted;

      return {
        moduleId: module._id,
        moduleTitle: module.title,
        totalLessons: moduleLessons,
        completedLessons: moduleCompleted,
        progress: moduleLessons > 0 ? Math.round((moduleCompleted / moduleLessons) * 100) : 0
      };
    });
  }

  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      enrollment,
      progress: {
        overall: overallProgress,
        totalLessons,
        completedLessons,
        modules: moduleProgress
      }
    }
  });
});

/**
 * @desc    Update course progress
 * @route   PUT /api/student/course/:courseId/progress
 * @access  Private (Student)
 */
const updateCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { completedLessons, completedModules, lastAccessedAt } = req.body;

  if (!validateObjectId(courseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Update progress
  const updateData = {};
  if (completedLessons) updateData.completedLessons = completedLessons;
  if (completedModules) updateData.completedModules = completedModules;
  if (lastAccessedAt) updateData.lastAccessedAt = new Date(lastAccessedAt);

  // Calculate overall progress
  const course = await Course.findById(courseId);
  if (course && course.modules) {
    const totalLessons = course.modules.reduce((total, module) => {
      return total + (module.lessons ? module.lessons.length : 0);
    }, 0);

    if (totalLessons > 0) {
      updateData.progress = Math.round((completedLessons / totalLessons) * 100);
    }
  }

  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollment._id,
    updateData,
    { new: true, runValidators: true }
  ).populate('course', 'title description');

  res.status(200).json({
    success: true,
    data: updatedEnrollment
  });
});

/**
 * @desc    Submit quiz attempt
 * @route   POST /api/student/course/:courseId/quiz
 * @access  Private (Student)
 */
const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { moduleId, answers, score, passed } = req.body;

  if (!validateObjectId(courseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Add quiz attempt
  const quizAttempt = {
    moduleId,
    answers,
    score,
    passed,
    attemptedAt: new Date()
  };

  enrollment.quizAttempts.push(quizAttempt);
  await enrollment.save();

  res.status(200).json({
    success: true,
    data: {
      quizAttempt,
      totalAttempts: enrollment.quizAttempts.length
    }
  });
});

/**
 * @desc    Submit course review
 * @route   POST /api/student/course/:courseId/review
 * @access  Private (Student)
 */
const submitCourseReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { rating, review, anonymous = false } = req.body;

  if (!validateObjectId(courseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  // Check if student has already reviewed
  if (enrollment.review) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this course'
    });
  }

  // Add review
  enrollment.review = {
    rating,
    review,
    anonymous,
    submittedAt: new Date()
  };

  await enrollment.save();

  res.status(200).json({
    success: true,
    data: enrollment.review
  });
});

/**
 * @desc    Get student's certificates
 * @route   GET /api/student/certificates
 * @access  Private (Student)
 */
const getMyCertificates = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const certificates = await Certificate.find({ student: req.user._id })
    .populate('course', 'title description thumbnail')
    .populate('teacher', 'firstName lastName')
    .populate('university', 'name')
    .sort({ issuedDate: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Certificate.countDocuments({ student: req.user._id });

  res.status(200).json({
    success: true,
    data: certificates,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Download certificate
 * @route   GET /api/student/certificate/:certificateId/download
 * @access  Private (Student)
 */
const downloadCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  if (!validateObjectId(certificateId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid certificate ID'
    });
  }

  const certificate = await Certificate.findOne({
    _id: certificateId,
    student: req.user._id
  });

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found'
    });
  }

  if (!certificate.pdfFile) {
    return res.status(404).json({
      success: false,
      message: 'Certificate file not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      downloadUrl: `/certificates/${certificate.pdfFile}`,
      certificateId: certificate.certificateId,
      issuedDate: certificate.issuedDate
    }
  });
});

/**
 * @desc    Get student's payment history
 * @route   GET /api/student/payments
 * @access  Private (Student)
 */
const getMyPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { student: req.user._id };
  if (status) query.status = status;

  const payments = await Payment.find(query)
    .populate('course', 'title thumbnail')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get student dashboard
 * @route   GET /api/student/dashboard
 * @access  Private (Student)
 */
const getStudentDashboard = asyncHandler(async (req, res) => {
  const [
    totalEnrollments,
    completedCourses,
    totalCertificates,
    totalSpent,
    recentEnrollments,
    upcomingDeadlines,
    recommendedCourses
  ] = await Promise.all([
    Enrollment.countDocuments({ student: req.user._id }),
    Enrollment.countDocuments({ student: req.user._id, status: 'completed' }),
    Certificate.countDocuments({ student: req.user._id }),
    Payment.aggregate([
      { $match: { student: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Enrollment.find({ student: req.user._id })
      .populate('course', 'title thumbnail')
      .sort({ enrolledAt: -1 })
      .limit(5),
    Enrollment.find({ 
      student: req.user._id, 
      status: 'active',
      expiresAt: { $gte: new Date() }
    })
      .populate('course', 'title')
      .sort({ expiresAt: 1 })
      .limit(5),
    Course.find({ 
      status: 'active', 
      isPublished: true,
      _id: { $nin: await Enrollment.distinct('course', { student: req.user._id }) }
    })
      .populate('teacher', 'firstName lastName')
      .sort({ enrollments: -1 })
      .limit(6)
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalEnrollments,
        completedCourses,
        totalCertificates,
        totalSpent: totalSpent[0]?.total || 0,
        completionRate: totalEnrollments > 0 ? Math.round((completedCourses / totalEnrollments) * 100) : 0
      },
      recentEnrollments,
      upcomingDeadlines,
      recommendedCourses
    }
  });
});

module.exports = {
  getMyCourses,
  getCourseProgress,
  updateCourseProgress,
  submitQuizAttempt,
  submitCourseReview,
  getMyCertificates,
  downloadCertificate,
  getMyPayments,
  getStudentDashboard
};
