const { body, param, query } = require('express-validator');
const mongoose = require('mongoose');

// Utility functions
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Common validation rules
const commonValidators = {
  // User validators
  firstName: body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  lastName: body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  email: body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  phone: body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit phone number'),

  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  confirmPassword: body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  // Course validators
  courseTitle: body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Course title must be between 5 and 200 characters'),

  courseDescription: body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Course description must be between 20 and 2000 characters'),

  coursePrice: body('price')
    .isFloat({ min: 0 })
    .withMessage('Course price must be a positive number'),

  courseLevel: body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Course level must be beginner, intermediate, or advanced'),

  courseLanguage: body('language')
    .isIn(['english', 'hindi', 'gujarati', 'marathi', 'tamil', 'telugu', 'kannada', 'malayalam', 'bengali', 'punjabi'])
    .withMessage('Please select a valid language'),

  // Payment validators
  amount: body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be a positive number'),

  paymentMethod: body('paymentMethod')
    .isIn(['razorpay', 'stripe', 'paypal'])
    .withMessage('Please select a valid payment method'),

  // Category validators
  categoryName: body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),

  categoryDescription: body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Category description must be between 10 and 500 characters'),

  // File upload validators
  imageFile: body('image')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Please upload an image file');
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, WebP)');
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new Error('Image file size must be less than 5MB');
      }
      
      return true;
    }),

  videoFile: body('video')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Please upload a video file');
      }
      
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Please upload a valid video file (MP4, WebM, OGG)');
      }
      
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (req.file.size > maxSize) {
        throw new Error('Video file size must be less than 500MB');
      }
      
      return true;
    }),

  documentFile: body('document')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Please upload a document file');
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Please upload a valid document file (PDF, DOC, DOCX)');
      }
      
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (req.file.size > maxSize) {
        throw new Error('Document file size must be less than 50MB');
      }
      
      return true;
    }),

  // ID validators
  mongoId: param('id')
    .isMongoId()
    .withMessage('Please provide a valid ID'),

  // Query validators
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  // Date validators
  startDate: query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  endDate: query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (req.query.startDate && new Date(value) <= new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  // Search validators
  search: query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search term must be at least 2 characters long'),

  // Sort validators
  sortBy: query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'name', 'price', 'rating', 'enrollments'])
    .withMessage('Invalid sort field'),

  sortOrder: query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  // Status validators
  status: query('status')
    .optional()
    .isIn(['active', 'inactive', 'pending', 'approved', 'rejected', 'completed', 'cancelled'])
    .withMessage('Invalid status'),

  // Role validators
  role: body('role')
    .optional()
    .isIn(['student', 'teacher', 'universityAdmin', 'superAdmin', 'referralPartner', 'subAdmin'])
    .withMessage('Invalid role'),

  // Rating validators
  rating: body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  // Review validators
  review: body('review')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters'),

  // Bank details validators
  bankDetails: body('bankDetails')
    .optional()
    .isObject()
    .withMessage('Bank details must be an object'),

  'bankDetails.accountNumber': body('bankDetails.accountNumber')
    .optional()
    .matches(/^\d{9,18}$/)
    .withMessage('Account number must be between 9 and 18 digits'),

  'bankDetails.ifscCode': body('bankDetails.ifscCode')
    .optional()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage('Please provide a valid IFSC code'),

  'bankDetails.accountHolderName': body('bankDetails.accountHolderName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Account holder name must be between 2 and 100 characters'),

  // UPI validators
  upiId: body('upiId')
    .optional()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/)
    .withMessage('Please provide a valid UPI ID'),

  // Address validators
  address: body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),

  city: body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  state: body('state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  pincode: body('pincode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be 6 digits'),

  // Website validators
  website: body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),

  // Social media validators
  linkedin: body('linkedin')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),

  twitter: body('twitter')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),

  facebook: body('facebook')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Facebook URL'),

  instagram: body('instagram')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Instagram URL'),

  // Notification validators
  notificationTitle: body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Notification title must be between 5 and 200 characters'),

  notificationMessage: body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Notification message must be between 10 and 1000 characters'),

  notificationType: body('type')
    .optional()
    .isIn(['general', 'enrollment', 'payment', 'certificate', 'review', 'settlement'])
    .withMessage('Invalid notification type'),

  notificationPriority: body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid notification priority'),

  // Settlement validators
  settlementAmount: body('amount')
    .isFloat({ min: 100 })
    .withMessage('Settlement amount must be at least ₹100'),

  // Referral validators
  referralCode: body('referralCode')
    .optional()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Referral code must be between 6 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Referral code can only contain uppercase letters and numbers'),

  // Certificate validators
  certificateTitle: body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Certificate title must be between 5 and 200 characters'),

  certificateDescription: body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Certificate description must be between 10 and 500 characters'),

  // University validators
  universityName: body('name')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('University name must be between 5 and 200 characters'),

  universityCode: body('code')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('University code must be between 2 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('University code can only contain uppercase letters and numbers'),

  // Contact person validators
  contactPersonName: body('contactPerson.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person name must be between 2 and 100 characters'),

  contactPersonEmail: body('contactPerson.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid contact person email'),

  contactPersonPhone: body('contactPerson.phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid contact person phone number'),

  contactPersonDesignation: body('contactPerson.designation')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person designation must be between 2 and 100 characters')
};

// Validation chains for common operations
const validationChains = {
  // User registration
  registerUser: [
    commonValidators.firstName,
    commonValidators.lastName,
    commonValidators.email,
    commonValidators.phone,
    commonValidators.password,
    commonValidators.confirmPassword,
    commonValidators.role
  ],

  // User login
  loginUser: [
    commonValidators.email,
    body('password').notEmpty().withMessage('Password is required')
  ],

  // Course creation
  createCourse: [
    commonValidators.courseTitle,
    commonValidators.courseDescription,
    commonValidators.coursePrice,
    commonValidators.courseLevel,
    commonValidators.courseLanguage
  ],

  // Payment processing
  processPayment: [
    commonValidators.amount,
    commonValidators.paymentMethod
  ],

  // Category creation
  createCategory: [
    commonValidators.categoryName,
    commonValidators.categoryDescription
  ],

  // File upload
  uploadImage: [commonValidators.imageFile],
  uploadVideo: [commonValidators.videoFile],
  uploadDocument: [commonValidators.documentFile],

  // Pagination
  pagination: [
    commonValidators.page,
    commonValidators.limit,
    commonValidators.sortBy,
    commonValidators.sortOrder
  ],

  // Search
  search: [
    commonValidators.search,
    commonValidators.status
  ],

  // Date range
  dateRange: [
    commonValidators.startDate,
    commonValidators.endDate
  ],

  // Review submission
  submitReview: [
    commonValidators.rating,
    commonValidators.review
  ],

  // Settlement request
  requestSettlement: [
    commonValidators.settlementAmount,
    commonValidators.bankDetails,
    commonValidators.upiId
  ],

  // Notification
  sendNotification: [
    commonValidators.notificationTitle,
    commonValidators.notificationMessage,
    commonValidators.notificationType,
    commonValidators.notificationPriority
  ],

  // University creation
  createUniversity: [
    commonValidators.universityName,
    commonValidators.universityCode,
    commonValidators.email,
    commonValidators.phone
  ],

  // Certificate creation
  createCertificate: [
    commonValidators.certificateTitle,
    commonValidators.certificateDescription
  ]
};

module.exports = {
  commonValidators,
  validationChains,
  validateObjectId
};
