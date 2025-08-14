const Course = require('../models/Course');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');

/**
 * @desc    Get all courses pending review
 * @route   GET /api/review-board/pending
 * @access  Private (Review Board)
 */
const getPendingReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    categoryId,
    teacherId,
    universityId,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {
    reviewStatus: { $in: ['pending', 'under_review'] }
  };

  if (categoryId) filter.category = categoryId;
  if (teacherId) filter.teacher = teacherId;
  if (universityId) filter.university = universityId;
  if (priority) filter.priority = priority;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get courses with populated data
  const courses = await Course.find(filter)
    .populate('teacher', 'firstName lastName email')
    .populate('university', 'name code')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Course.countDocuments(filter);

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
 * @desc    Get single course for review
 * @route   GET /api/review-board/:id
 * @access  Private (Review Board)
 */
const getCourseForReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const course = await Course.findById(id)
    .populate('teacher', 'firstName lastName email phone')
    .populate('university', 'name code email')
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .populate('reviewedBy', 'firstName lastName email');

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
 * @desc    Submit course review
 * @route   POST /api/review-board/:id/review
 * @access  Private (Review Board)
 */
const submitCourseReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    status,
    score,
    feedback,
    contentQuality,
    technicalAccuracy,
    presentationQuality,
    accessibility,
    complianceIssues,
    recommendations
  } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  if (!status || !['approved', 'rejected', 'needs_revision'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be approved, rejected, or needs_revision'
    });
  }

  const course = await Course.findById(id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Create review object
  const review = {
    status,
    score: score || 0,
    feedback,
    criteria: {
      contentQuality: contentQuality || 0,
      technicalAccuracy: technicalAccuracy || 0,
      presentationQuality: presentationQuality || 0,
      accessibility: accessibility || 0
    },
    complianceIssues: complianceIssues || [],
    recommendations: recommendations || [],
    reviewedBy: req.user.id,
    reviewedAt: new Date()
  };

  // Update course with review
  course.review = review;
  course.reviewStatus = status;
  course.reviewedAt = new Date();

  if (status === 'approved') {
    course.isApproved = true;
    course.approvedAt = new Date();
  } else if (status === 'rejected') {
    course.isApproved = false;
    course.rejectedAt = new Date();
  }

  await course.save();

  res.status(200).json({
    success: true,
    data: {
      message: `Course review submitted successfully. Status: ${status}`,
      review
    }
  });
});

/**
 * @desc    Get review statistics
 * @route   GET /api/review-board/stats
 * @access  Private (Review Board)
 */
const getReviewStats = asyncHandler(async (req, res) => {
  const { startDate, endDate, reviewerId } = req.query;

  // Build date filter
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.reviewedAt = {};
    if (startDate) dateFilter.reviewedAt.$gte = new Date(startDate);
    if (endDate) dateFilter.reviewedAt.$lte = new Date(endDate);
  }

  if (reviewerId) dateFilter['review.reviewedBy'] = reviewerId;

  // Get review statistics
  const stats = await Course.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalReviewed: { $sum: 1 },
        approved: {
          $sum: { $cond: [{ $eq: ['$reviewStatus', 'approved'] }, 1, 0] }
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$reviewStatus', 'rejected'] }, 1, 0] }
        },
        needsRevision: {
          $sum: { $cond: [{ $eq: ['$reviewStatus', 'needs_revision'] }, 1, 0] }
        },
        averageScore: { $avg: '$review.score' }
      }
    }
  ]);

  // Get pending reviews count
  const pendingCount = await Course.countDocuments({
    reviewStatus: { $in: ['pending', 'under_review'] }
  });

  // Get reviewer performance
  const reviewerStats = await Course.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$review.reviewedBy',
        reviewsCount: { $sum: 1 },
        averageScore: { $avg: '$review.score' },
        approvedCount: {
          $sum: { $cond: [{ $eq: ['$reviewStatus', 'approved'] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'reviewer'
      }
    },
    { $unwind: '$reviewer' },
    {
      $project: {
        reviewer: {
          _id: '$reviewer._id',
          firstName: '$reviewer.firstName',
          lastName: '$reviewer.lastName',
          email: '$reviewer.email'
        },
        reviewsCount: 1,
        averageScore: 1,
        approvedCount: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {
        totalReviewed: 0,
        approved: 0,
        rejected: 0,
        needsRevision: 0,
        averageScore: 0
      },
      pendingCount,
      reviewerStats
    }
  });
});

/**
 * @desc    Assign reviewer to course
 * @route   POST /api/review-board/:id/assign
 * @access  Private (Review Board Admin)
 */
const assignReviewer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reviewerId, priority = 'normal' } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  if (!validateObjectId(reviewerId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid reviewer ID'
    });
  }

  // Check if reviewer exists and has review board role
  const reviewer = await User.findById(reviewerId);
  if (!reviewer || !['reviewboard', 'superadmin'].includes(reviewer.role)) {
    return res.status(404).json({
      success: false,
      message: 'Reviewer not found or not authorized'
    });
  }

  const course = await Course.findById(id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  course.assignedReviewer = reviewerId;
  course.reviewPriority = priority;
  course.reviewStatus = 'under_review';
  course.assignedAt = new Date();

  await course.save();

  res.status(200).json({
    success: true,
    data: {
      message: 'Reviewer assigned successfully',
      course: {
        id: course._id,
        title: course.title,
        assignedReviewer: reviewerId,
        reviewPriority: priority,
        reviewStatus: course.reviewStatus
      }
    }
  });
});

/**
 * @desc    Get my assigned reviews
 * @route   GET /api/review-board/my-assignments
 * @access  Private (Review Board)
 */
const getMyAssignments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const filter = { assignedReviewer: req.user.id };
  if (status) filter.reviewStatus = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const courses = await Course.find(filter)
    .populate('teacher', 'firstName lastName email')
    .populate('university', 'name code')
    .populate('category', 'name')
    .sort({ assignedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments(filter);

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

module.exports = {
  getPendingReviews,
  getCourseForReview,
  submitCourseReview,
  getReviewStats,
  assignReviewer,
  getMyAssignments
};
