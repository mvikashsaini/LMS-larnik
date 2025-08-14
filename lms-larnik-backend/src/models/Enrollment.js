const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add student']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please add course']
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: [true, 'Please add payment']
  },
  amount: {
    type: Number,
    required: [true, 'Please add enrollment amount']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  expiresAt: Date,
  
  // Progress tracking
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  completedModules: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  
  // Quiz attempts
  quizAttempts: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId
    },
    score: Number,
    maxScore: Number,
    passed: Boolean,
    attemptedAt: {
      type: Date,
      default: Date.now
    },
    answers: [{
      question: Number,
      selectedOption: Number,
      isCorrect: Boolean
    }]
  }],
  
  // Certificate
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  certificateEligible: {
    type: Boolean,
    default: false
  },
  
  // Referral tracking
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCommission: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
EnrollmentSchema.index({ student: 1 });
EnrollmentSchema.index({ course: 1 });
EnrollmentSchema.index({ status: 1 });
EnrollmentSchema.index({ enrolledAt: -1 });

// Virtual for enrollment duration
EnrollmentSchema.virtual('duration').get(function() {
  if (!this.enrolledAt) return 0;
  const endDate = this.completedAt || new Date();
  return Math.floor((endDate - this.enrolledAt) / (1000 * 60 * 60 * 24)); // days
});

// Check if enrollment is active
EnrollmentSchema.methods.isActive = function() {
  return this.status === 'active' && (!this.expiresAt || new Date() < this.expiresAt);
};

// Update progress based on completed lessons
EnrollmentSchema.methods.updateProgress = function() {
  const Course = mongoose.model('Course');
  
  return Course.findById(this.course).then(course => {
    if (!course) return;
    
    let totalLessons = 0;
    let completedLessons = 0;
    
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (this.completedLessons.includes(lesson._id)) {
          completedLessons++;
        }
      });
    });
    
    this.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Check if certificate is eligible (all lessons completed and quizzes passed)
    this.certificateEligible = this.checkCertificateEligibility();
    
    return this.save();
  });
};

// Mark lesson as completed
EnrollmentSchema.methods.completeLesson = function(lessonId) {
  if (!this.completedLessons.includes(lessonId)) {
    this.completedLessons.push(lessonId);
    this.lastAccessedAt = new Date();
    return this.updateProgress();
  }
  return Promise.resolve();
};

// Add quiz attempt
EnrollmentSchema.methods.addQuizAttempt = function(lessonId, score, maxScore, answers) {
  const passed = (score / maxScore) * 100 >= 33; // 33% passing score
  
  this.quizAttempts.push({
    lesson: lessonId,
    score,
    maxScore,
    passed,
    answers
  });
  
  return this.save();
};

// Check certificate eligibility
EnrollmentSchema.methods.checkCertificateEligibility = function() {
  const Course = mongoose.model('Course');
  
  return Course.findById(this.course).then(course => {
    if (!course) return false;
    
    // Check if all lessons are completed
    let allLessonsCompleted = true;
    let allQuizzesPassed = true;
    
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (!this.completedLessons.includes(lesson._id)) {
          allLessonsCompleted = false;
        }
        
        // Check if quiz is passed
        if (lesson.type === 'quiz') {
          const quizAttempt = this.quizAttempts.find(attempt => 
            attempt.lesson.toString() === lesson._id.toString()
          );
          
          if (!quizAttempt || !quizAttempt.passed) {
            allQuizzesPassed = false;
          }
        }
      });
    });
    
    return allLessonsCompleted && allQuizzesPassed;
  });
};

// Get enrollment analytics
EnrollmentSchema.statics.getAnalytics = async function() {
  const analytics = await this.aggregate([
    {
      $group: {
        _id: null,
        totalEnrollments: { $sum: 1 },
        activeEnrollments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        completedEnrollments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        totalRevenue: { $sum: '$amount' },
        averageProgress: { $avg: '$progress' }
      }
    }
  ]);
  
  return analytics[0] || {
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    totalRevenue: 0,
    averageProgress: 0
  };
};

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
