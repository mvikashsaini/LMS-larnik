const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add category name'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  icon: {
    type: String,
    default: 'default-category-icon.png'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  
  // Statistics
  stats: {
    totalCourses: {
      type: Number,
      default: 0
    },
    totalEnrollments: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ order: 1 });

// Virtual for category's courses
CategorySchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

// Virtual for category's sub-categories
CategorySchema.virtual('subCategories', {
  ref: 'SubCategory',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

// Generate slug from name
CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  next();
});

// Update category statistics
CategorySchema.methods.updateStats = async function() {
  const Course = mongoose.model('Course');
  const Enrollment = mongoose.model('Enrollment');
  
  const [courses, enrollments] = await Promise.all([
    Course.find({ category: this._id, isActive: true }),
    Enrollment.find({ 
      course: { $in: courses.map(c => c._id) },
      status: 'active'
    })
  ]);
  
  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;
  const totalRevenue = enrollments.reduce((sum, enrollment) => sum + enrollment.amount, 0);
  
  this.stats.totalCourses = totalCourses;
  this.stats.totalEnrollments = totalEnrollments;
  this.stats.totalRevenue = totalRevenue;
  
  await this.save();
};

module.exports = mongoose.model('Category', CategorySchema);
