const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add sub-category name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add category']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  icon: {
    type: String,
    default: 'default-subcategory-icon.png'
  },
  color: {
    type: String,
    default: '#6B7280'
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
SubCategorySchema.index({ slug: 1 });
SubCategorySchema.index({ category: 1 });
SubCategorySchema.index({ isActive: 1 });
SubCategorySchema.index({ order: 1 });

// Virtual for sub-category's courses
SubCategorySchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'subCategory',
  justOne: false
});

// Generate slug from name
SubCategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  next();
});

// Update sub-category statistics
SubCategorySchema.methods.updateStats = async function() {
  const Course = mongoose.model('Course');
  const Enrollment = mongoose.model('Enrollment');
  
  const [courses, enrollments] = await Promise.all([
    Course.find({ subCategory: this._id, isActive: true }),
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

module.exports = mongoose.model('SubCategory', SubCategorySchema);
