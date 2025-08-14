const University = require('../models/University');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');
const { sendEmail } = require('../services/emailService');

/**
 * @desc    Get university details
 * @route   GET /api/university-admin/university
 * @access  Private (University Admin)
 */
const getUniversityDetails = asyncHandler(async (req, res) => {
  const university = await University.findById(req.user.university)
    .populate('contact.contactPerson', 'firstName lastName email phone')
    .populate('staff.user', 'firstName lastName email role');

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
 * @desc    Update university details
 * @route   PUT /api/university-admin/university
 * @access  Private (University Admin)
 */
const updateUniversityDetails = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    website,
    description,
    contactPerson,
    settings
  } = req.body;

  const university = await University.findById(req.user.university);

  if (!university) {
    return res.status(404).json({
      success: false,
      message: 'University not found'
    });
  }

  // Update fields
  if (name) university.name = name;
  if (email) university.email = email;
  if (phone) university.phone = phone;
  if (address) university.address = address;
  if (website) university.website = website;
  if (description) university.description = description;
  if (contactPerson) university.contact.contactPerson = contactPerson;
  if (settings) university.settings = { ...university.settings, ...settings };

  await university.save();

  res.status(200).json({
    success: true,
    data: university
  });
});

/**
 * @desc    Get university staff
 * @route   GET /api/university-admin/staff
 * @access  Private (University Admin)
 */
const getUniversityStaff = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;

  const query = { university: req.user.university };
  
  if (role) query.universityRole = role;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const staff = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: staff,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Assign staff role
 * @route   POST /api/university-admin/staff
 * @access  Private (University Admin)
 */
const assignStaffRole = asyncHandler(async (req, res) => {
  const { userId, role, permissions } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update user's university and role
  user.university = req.user.university;
  user.universityRole = role;
  await user.save();

  // Update university staff
  const university = await University.findById(req.user.university);
  university.staff.push({
    user: userId,
    role,
    isActive: true,
    assignedDate: new Date()
  });

  if (permissions) {
    university.staffPermissions[role] = permissions;
  }

  await university.save();

  res.status(200).json({
    success: true,
    data: {
      user,
      role,
      permissions
    }
  });
});

/**
 * @desc    Remove staff role
 * @route   DELETE /api/university-admin/staff/:userId
 * @access  Private (University Admin)
 */
const removeStaffRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!validateObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = await User.findById(userId);
  if (!user || user.university.toString() !== req.user.university.toString()) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Remove university role
  user.university = undefined;
  user.universityRole = undefined;
  await user.save();

  // Remove from university staff
  const university = await University.findById(req.user.university);
  university.staff = university.staff.filter(staff => staff.user.toString() !== userId);
  await university.save();

  res.status(200).json({
    success: true,
    message: 'Staff role removed successfully'
  });
});

/**
 * @desc    Get university students
 * @route   GET /api/university-admin/students
 * @access  Private (University Admin)
 */
const getUniversityStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;

  const query = { 
    role: 'student',
    university: req.user.university 
  };
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (status) query.isActive = status === 'active';

  const students = await User.find(query)
    .select('-password')
    .populate('studentProfile')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: students,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get university courses
 * @route   GET /api/university-admin/courses
 * @access  Private (University Admin)
 */
const getUniversityCourses = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    search, 
    teacher,
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = req.query;

  const query = { university: req.user.university };
  
  if (status) query.status = status;
  if (teacher) query.teacher = teacher;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const courses = await Course.find(query)
    .populate('teacher', 'firstName lastName email')
    .populate('category', 'name')
    .populate('subCategory', 'name')
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
 * @desc    Approve/reject course
 * @route   PUT /api/university-admin/courses/:id/approve
 * @access  Private (University Admin)
 */
const approveCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid course ID'
    });
  }

  const course = await Course.findOne({ 
    _id: id, 
    university: req.user.university 
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be "approved" or "rejected"'
    });
  }

  course.status = status;
  course.isPublished = status === 'approved';
  course.approvalFeedback = feedback;
  course.approvedBy = req.user._id;
  course.approvedAt = new Date();

  await course.save();

  // Send notification to teacher
  const teacher = await User.findById(course.teacher);
  if (teacher && teacher.email) {
    await sendEmail({
      to: teacher.email,
      subject: `Course ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      template: 'course-approval',
      data: {
        name: teacher.firstName,
        courseTitle: course.title,
        status,
        feedback
      }
    });
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

/**
 * @desc    Upload MoU document
 * @route   POST /api/university-admin/mou
 * @access  Private (University Admin)
 */
const uploadMoU = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'MoU file is required'
    });
  }

  const university = await University.findById(req.user.university);

  if (!university) {
    return res.status(404).json({
      success: false,
      message: 'University not found'
    });
  }

  const mouDocument = {
    title,
    description,
    filePath: file.filename,
    uploadDate: new Date(),
    isActive: true
  };

  university.mous.push(mouDocument);
  await university.save();

  res.status(200).json({
    success: true,
    data: mouDocument
  });
});

/**
 * @desc    Approve certificate
 * @route   PUT /api/university-admin/certificates/:id/approve
 * @access  Private (University Admin)
 */
const approveCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approved, feedback } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid certificate ID'
    });
  }

  const certificate = await Certificate.findById(id)
    .populate('course', 'university')
    .populate('student', 'firstName lastName email');

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found'
    });
  }

  // Check if certificate belongs to university
  if (certificate.course.university.toString() !== req.user.university.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to approve this certificate'
    });
  }

  certificate.status = approved ? 'approved' : 'rejected';
  certificate.approvalFeedback = feedback;
  certificate.approvedBy = req.user._id;
  certificate.approvedAt = new Date();

  await certificate.save();

  // Send notification to student
  if (certificate.student && certificate.student.email) {
    await sendEmail({
      to: certificate.student.email,
      subject: `Certificate ${approved ? 'Approved' : 'Rejected'}`,
      template: 'certificate-approval',
      data: {
        name: certificate.student.firstName,
        courseTitle: certificate.course.title,
        approved,
        feedback
      }
    });
  }

  res.status(200).json({
    success: true,
    data: certificate
  });
});

/**
 * @desc    Get university analytics
 * @route   GET /api/university-admin/analytics
 * @access  Private (University Admin)
 */
const getUniversityAnalytics = asyncHandler(async (req, res) => {
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

  // Get university courses
  const universityCourses = await Course.find({ university: req.user.university }).select('_id');
  const courseIds = universityCourses.map(course => course._id);

  const [
    totalStudents,
    totalTeachers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    totalCertificates,
    monthlyRevenue,
    topCourses,
    recentEnrollments
  ] = await Promise.all([
    User.countDocuments({ 
      role: 'student', 
      university: req.user.university,
      createdAt: dateFilter
    }),
    User.countDocuments({ 
      role: 'teacher', 
      university: req.user.university,
      createdAt: dateFilter
    }),
    Course.countDocuments({ 
      university: req.user.university,
      createdAt: dateFilter
    }),
    Enrollment.countDocuments({ 
      course: { $in: courseIds },
      createdAt: dateFilter
    }),
    Payment.aggregate([
      { 
        $match: { 
          course: { $in: courseIds }, 
          status: 'completed',
          createdAt: dateFilter
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Certificate.countDocuments({ 
      course: { $in: courseIds },
      createdAt: dateFilter
    }),
    Payment.aggregate([
      { 
        $match: { 
          course: { $in: courseIds }, 
          status: 'completed',
          createdAt: dateFilter
        } 
      },
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
    Course.aggregate([
      { 
        $match: { 
          university: req.user.university,
          createdAt: dateFilter
        } 
      },
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
    Enrollment.find({ 
      course: { $in: courseIds }
    })
      .populate('course', 'title')
      .populate('student', 'firstName lastName')
      .sort({ enrolledAt: -1 })
      .limit(10)
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCertificates
      },
      trends: {
        monthlyRevenue
      },
      topCourses,
      recentEnrollments
    }
  });
});

/**
 * @desc    Get university dashboard
 * @route   GET /api/university-admin/dashboard
 * @access  Private (University Admin)
 */
const getUniversityDashboard = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalTeachers,
    totalCourses,
    activeCourses,
    pendingApprovals,
    totalRevenue,
    recentEnrollments,
    topTeachers
  ] = await Promise.all([
    User.countDocuments({ role: 'student', university: req.user.university }),
    User.countDocuments({ role: 'teacher', university: req.user.university }),
    Course.countDocuments({ university: req.user.university }),
    Course.countDocuments({ university: req.user.university, status: 'active', isPublished: true }),
    Course.countDocuments({ university: req.user.university, status: 'pending' }),
    Payment.aggregate([
      { 
        $match: { 
          course: { $in: await Course.find({ university: req.user.university }).select('_id') }, 
          status: 'completed' 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Enrollment.find({ 
      course: { $in: await Course.find({ university: req.user.university }).select('_id') }
    })
      .populate('course', 'title')
      .populate('student', 'firstName lastName')
      .sort({ enrolledAt: -1 })
      .limit(5),
    User.aggregate([
      { $match: { role: 'teacher', university: req.user.university } },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'teacher',
          as: 'courses'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          courseCount: { $size: '$courses' },
          totalEnrollments: { $sum: '$courses.enrollments' }
        }
      },
      { $sort: { courseCount: -1 } },
      { $limit: 5 }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        activeCourses,
        pendingApprovals,
        totalRevenue: totalRevenue[0]?.total || 0,
        approvalRate: totalCourses > 0 ? Math.round((activeCourses / totalCourses) * 100) : 0
      },
      recentEnrollments,
      topTeachers
    }
  });
});

module.exports = {
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
};
