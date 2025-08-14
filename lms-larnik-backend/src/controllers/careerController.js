const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');

// Career Schema (since it wasn't in the original models, I'll define it here)
const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['job', 'webinar', 'internship', 'workshop']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'education', 'healthcare', 'finance', 'marketing', 'design', 'other']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  salary: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'monthly'
    }
  },
  experience: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number
    }
  },
  education: {
    type: String,
    enum: ['high_school', 'bachelor', 'master', 'phd', 'any']
  },
  skills: [{
    type: String,
    trim: true
  }],
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required']
    },
    phone: String,
    website: String
  },
  applicationDeadline: {
    type: Date
  },
  startDate: {
    type: Date
  },
  duration: {
    type: String
  },
  maxApplicants: {
    type: Number
  },
  currentApplicants: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'expired'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resume: {
      type: String
    },
    coverLetter: {
      type: String
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    feedback: {
      type: String
    }
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes
careerSchema.index({ type: 1, status: 1 });
careerSchema.index({ category: 1 });
careerSchema.index({ location: 1 });
careerSchema.index({ company: 1 });
careerSchema.index({ createdAt: -1 });

const Career = mongoose.model('Career', careerSchema);

/**
 * @desc    Get all career opportunities (with filters)
 * @route   GET /api/careers
 * @access  Public/Private
 */
const getCareers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    category,
    location,
    company,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (company) filter.company = { $regex: company, $options: 'i' };
  
  // Public users can only see published careers
  if (!req.user || !['careercell', 'superadmin'].includes(req.user.role)) {
    filter.isPublished = true;
    filter.status = 'active';
  }
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get careers with populated data
  const careers = await Career.find(filter)
    .populate('approvedBy', 'firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Career.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: careers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get single career opportunity
 * @route   GET /api/careers/:id
 * @access  Public/Private
 */
const getCareer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid career ID'
    });
  }

  const filter = { _id: id };
  
  // Public users can only see published careers
  if (!req.user || !['careercell', 'superadmin'].includes(req.user.role)) {
    filter.isPublished = true;
    filter.status = 'active';
  }

  const career = await Career.findOne(filter)
    .populate('approvedBy', 'firstName lastName')
    .populate('applications.applicant', 'firstName lastName email')
    .populate('applications.reviewedBy', 'firstName lastName');

  if (!career) {
    return res.status(404).json({
      success: false,
      message: 'Career opportunity not found'
    });
  }

  res.status(200).json({
    success: true,
    data: career
  });
});

/**
 * @desc    Create new career opportunity
 * @route   POST /api/careers
 * @access  Private
 */
const createCareer = asyncHandler(async (req, res) => {
  const {
    title,
    type,
    description,
    company,
    location,
    category,
    requirements,
    responsibilities,
    benefits,
    salary,
    experience,
    education,
    skills,
    contactInfo,
    applicationDeadline,
    startDate,
    duration,
    maxApplicants,
    seo
  } = req.body;

  const career = await Career.create({
    title,
    type,
    description,
    company,
    location,
    category,
    requirements,
    responsibilities,
    benefits,
    salary,
    experience,
    education,
    skills,
    contactInfo,
    applicationDeadline,
    startDate,
    duration,
    maxApplicants,
    seo,
    status: 'draft'
  });

  const populatedCareer = await Career.findById(career._id)
    .populate('approvedBy', 'firstName lastName');

  res.status(201).json({
    success: true,
    data: populatedCareer
  });
});

/**
 * @desc    Update career opportunity
 * @route   PUT /api/careers/:id
 * @access  Private
 */
const updateCareer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid career ID'
    });
  }

  const career = await Career.findById(id);
  if (!career) {
    return res.status(404).json({
      success: false,
      message: 'Career opportunity not found'
    });
  }

  // Check ownership or admin rights
  if (!['careercell', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update career opportunities'
    });
  }

  const updatedCareer = await Career.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('approvedBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: updatedCareer
  });
});

/**
 * @desc    Delete career opportunity
 * @route   DELETE /api/careers/:id
 * @access  Private
 */
const deleteCareer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid career ID'
    });
  }

  const career = await Career.findById(id);
  if (!career) {
    return res.status(404).json({
      success: false,
      message: 'Career opportunity not found'
    });
  }

  // Check admin rights
  if (!['careercell', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete career opportunities'
    });
  }

  await Career.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    data: {
      message: 'Career opportunity deleted successfully'
    }
  });
});

/**
 * @desc    Approve/publish career opportunity
 * @route   PUT /api/careers/:id/approve
 * @access  Private (Career Cell, Super Admin)
 */
const approveCareer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid career ID'
    });
  }

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be approved or rejected'
    });
  }

  const career = await Career.findById(id);
  if (!career) {
    return res.status(404).json({
      success: false,
      message: 'Career opportunity not found'
    });
  }

  career.status = status;
  career.approvedBy = req.user.id;
  career.approvedAt = new Date();

  if (status === 'approved') {
    career.isPublished = true;
    career.publishedAt = new Date();
  }

  await career.save();

  const updatedCareer = await Career.findById(id)
    .populate('approvedBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: {
      message: `Career opportunity ${status} successfully`,
      career: updatedCareer
    }
  });
});

/**
 * @desc    Apply for career opportunity
 * @route   POST /api/careers/:id/apply
 * @access  Private
 */
const applyForCareer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resume, coverLetter } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid career ID'
    });
  }

  const career = await Career.findById(id);
  if (!career) {
    return res.status(404).json({
      success: false,
      message: 'Career opportunity not found'
    });
  }

  if (!career.isPublished || career.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'This career opportunity is not accepting applications'
    });
  }

  // Check if already applied
  const existingApplication = career.applications.find(
    app => app.applicant.toString() === req.user.id
  );

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied for this opportunity'
    });
  }

  // Check if max applicants reached
  if (career.maxApplicants && career.currentApplicants >= career.maxApplicants) {
    return res.status(400).json({
      success: false,
      message: 'Maximum number of applicants reached'
    });
  }

  // Add application
  const application = {
    applicant: req.user.id,
    resume,
    coverLetter,
    status: 'pending'
  };

  career.applications.push(application);
  career.currentApplicants += 1;
  await career.save();

  const updatedCareer = await Career.findById(id)
    .populate('applications.applicant', 'firstName lastName email');

  res.status(200).json({
    success: true,
    data: {
      message: 'Application submitted successfully',
      application: updatedCareer.applications[updatedCareer.applications.length - 1]
    }
  });
});

/**
 * @desc    Review application
 * @route   PUT /api/careers/:id/applications/:applicationId
 * @access  Private (Career Cell, Super Admin)
 */
const reviewApplication = asyncHandler(async (req, res) => {
  const { id, applicationId } = req.params;
  const { status, feedback } = req.body;

  if (!validateObjectId(id) || !validateObjectId(applicationId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid career or application ID'
    });
  }

  if (!['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid application status'
    });
  }

  const career = await Career.findById(id);
  if (!career) {
    return res.status(404).json({
      success: false,
      message: 'Career opportunity not found'
    });
  }

  const application = career.applications.id(applicationId);
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  application.status = status;
  application.reviewedBy = req.user.id;
  application.reviewedAt = new Date();
  application.feedback = feedback;

  await career.save();

  const updatedCareer = await Career.findById(id)
    .populate('applications.applicant', 'firstName lastName email')
    .populate('applications.reviewedBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: {
      message: 'Application reviewed successfully',
      application: updatedCareer.applications.id(applicationId)
    }
  });
});

/**
 * @desc    Get career statistics
 * @route   GET /api/careers/stats
 * @access  Private (Career Cell, Super Admin)
 */
const getCareerStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  // Get career statistics
  const stats = await Career.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalCareers: { $sum: 1 },
        publishedCareers: {
          $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
        },
        activeCareers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        totalApplications: { $sum: { $size: '$applications' } },
        totalApplicants: { $sum: '$currentApplicants' }
      }
    }
  ]);

  // Get type breakdown
  const typeStats = await Career.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get category breakdown
  const categoryStats = await Career.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get application status breakdown
  const applicationStats = await Career.aggregate([
    { $match: dateFilter },
    { $unwind: '$applications' },
    {
      $group: {
        _id: '$applications.status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {
        totalCareers: 0,
        publishedCareers: 0,
        activeCareers: 0,
        totalApplications: 0,
        totalApplicants: 0
      },
      typeStats,
      categoryStats,
      applicationStats
    }
  });
});

module.exports = {
  getCareers,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  approveCareer,
  applyForCareer,
  reviewApplication,
  getCareerStats
};
