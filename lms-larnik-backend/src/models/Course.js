const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add course title'],
    trim: true,
    maxlength: [100, 'Course title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please add course description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add teacher']
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'Please add university']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add category']
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: [true, 'Please add sub-category']
  },
  thumbnail: {
    type: String,
    default: 'default-course-thumbnail.png'
  },
  price: {
    type: Number,
    required: [true, 'Please add course price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add course duration']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  language: {
    type: String,
    default: 'English'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  
  // Course content
  modules: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    order: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lessons: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      type: {
        type: String,
        enum: ['video', 'document', 'quiz'],
        default: 'video'
      },
      order: {
        type: Number,
        required: true
      },
      duration: Number, // in minutes
      isActive: {
        type: Boolean,
        default: true
      },
      isLocked: {
        type: Boolean,
        default: true
      },
      content: {
        video: {
          url: String,
          thumbnail: String,
          duration: Number
        },
        document: {
          url: String,
          fileName: String,
          fileSize: Number
        },
        quiz: {
          questions: [{
            question: {
              type: String,
              required: true
            },
            options: [{
              text: String,
              isCorrect: {
                type: Boolean,
                default: false
              }
            }],
            explanation: String,
            points: {
              type: Number,
              default: 1
            }
          }],
          passingScore: {
            type: Number,
            default: 33
          },
          timeLimit: Number // in minutes
        }
      }
    }]
  }],
  
  // Course requirements
  requirements: [String],
  learningOutcomes: [String],
  targetAudience: [String],
  
  // Course statistics
  stats: {
    totalEnrollments: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  
  // Course tags
  tags: [String],
  
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  
  // Review board
  reviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewComments: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CourseSchema.index({ slug: 1 });
CourseSchema.index({ teacher: 1 });
CourseSchema.index({ university: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ isActive: 1 });
CourseSchema.index({ isApproved: 1 });
CourseSchema.index({ isPublished: 1 });
CourseSchema.index({ price: 1 });
CourseSchema.index({ 'stats.totalEnrollments': -1 });
CourseSchema.index({ 'stats.averageRating': -1 });

// Virtual for course enrollments
CourseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

// Virtual for course reviews
CourseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

// Generate slug from title
CourseSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  next();
});

// Calculate course duration from modules
CourseSchema.methods.calculateDuration = function() {
  let totalDuration = 0;
  
  this.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      if (lesson.duration) {
        totalDuration += lesson.duration;
      }
    });
  });
  
  this.duration = totalDuration;
  return totalDuration;
};

// Update course statistics
CourseSchema.methods.updateStats = async function() {
  const Enrollment = mongoose.model('Enrollment');
  const Review = mongoose.model('Review');
  
  const [enrollments, reviews] = await Promise.all([
    Enrollment.find({ course: this._id }),
    Review.find({ course: this._id })
  ]);
  
  const totalEnrollments = enrollments.length;
  const totalRevenue = enrollments.reduce((sum, enrollment) => sum + enrollment.amount, 0);
  
  let averageRating = 0;
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = totalRating / reviews.length;
  }
  
  this.stats.totalEnrollments = totalEnrollments;
  this.stats.totalRevenue = totalRevenue;
  this.stats.averageRating = Math.round(averageRating * 10) / 10;
  this.stats.totalRatings = reviews.length;
  
  await this.save();
};

// Get course progress for a student
CourseSchema.methods.getStudentProgress = async function(studentId) {
  const Enrollment = mongoose.model('Enrollment');
  const enrollment = await Enrollment.findOne({
    course: this._id,
    student: studentId
  });
  
  if (!enrollment) {
    return null;
  }
  
  let completedLessons = 0;
  let totalLessons = 0;
  
  this.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      totalLessons++;
      if (enrollment.completedLessons.includes(lesson._id)) {
        completedLessons++;
      }
    });
  });
  
  return {
    completedLessons,
    totalLessons,
    progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  };
};

// Check if lesson is accessible for student
CourseSchema.methods.isLessonAccessible = function(studentId, lessonId) {
  // This would be implemented based on enrollment and lesson completion logic
  return true; // Simplified for now
};

// Cascade delete related data when course is deleted
CourseSchema.pre('remove', async function(next) {
  await this.model('Enrollment').deleteMany({ course: this._id });
  await this.model('Review').deleteMany({ course: this._id });
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
