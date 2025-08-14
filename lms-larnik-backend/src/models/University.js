const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add university name'],
    trim: true,
    maxlength: [100, 'University name cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Please add university code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add university email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add university phone number'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please add a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please add a valid website URL'
    ]
  },
  logo: {
    type: String,
    default: 'default-university-logo.png'
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  
  // University details
  establishedYear: Number,
  accreditation: [String],
  type: {
    type: String,
    enum: ['public', 'private', 'deemed', 'central'],
    default: 'public'
  },
  
  // Contact person
  contactPerson: {
    name: String,
    email: String,
    phone: String,
    designation: String
  },
  
  // Bank details for settlements
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String,
    panNumber: String,
    gstNumber: String
  },
  
  // University settings
  settings: {
    allowStudentRegistration: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: true
    },
    certificateTemplate: {
      type: String,
      default: 'default-certificate-template.pdf'
    },
    signatories: [{
      name: String,
      designation: String,
      signature: String
    }]
  },
  
  // Statistics
  stats: {
    totalStudents: {
      type: Number,
      default: 0
    },
    totalTeachers: {
      type: Number,
      default: 0
    },
    totalCourses: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  
  // MoU documents
  mous: [{
    title: String,
    filePath: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Staff members
  staff: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['superAdmin', 'courseManager', 'financeOfficer', 'documentationManager', 'certificationOfficer', 'analyst', 'referralManager']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
UniversitySchema.index({ code: 1 });
UniversitySchema.index({ email: 1 });
UniversitySchema.index({ isActive: 1 });
UniversitySchema.index({ isApproved: 1 });

// Virtual for university's courses
UniversitySchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'university',
  justOne: false
});

// Virtual for university's teachers
UniversitySchema.virtual('teachers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'university',
  justOne: false,
  match: { role: 'teacher' }
});

// Virtual for university's students
UniversitySchema.virtual('students', {
  ref: 'User',
  localField: '_id',
  foreignField: 'university',
  justOne: false,
  match: { role: 'student' }
});

// Update university stats
UniversitySchema.methods.updateStats = async function() {
  const Course = mongoose.model('Course');
  const User = mongoose.model('User');
  const Enrollment = mongoose.model('Enrollment');
  
  const [totalCourses, totalTeachers, totalStudents] = await Promise.all([
    Course.countDocuments({ university: this._id, isActive: true }),
    User.countDocuments({ university: this._id, role: 'teacher', isActive: true }),
    User.countDocuments({ university: this._id, role: 'student', isActive: true })
  ]);
  
  this.stats.totalCourses = totalCourses;
  this.stats.totalTeachers = totalTeachers;
  this.stats.totalStudents = totalStudents;
  
  await this.save();
};

// Add staff member
UniversitySchema.methods.addStaff = async function(userId, role) {
  const existingStaff = this.staff.find(staff => 
    staff.user.toString() === userId.toString()
  );
  
  if (existingStaff) {
    existingStaff.role = role;
    existingStaff.isActive = true;
  } else {
    this.staff.push({
      user: userId,
      role: role,
      isActive: true
    });
  }
  
  await this.save();
};

// Remove staff member
UniversitySchema.methods.removeStaff = async function(userId) {
  this.staff = this.staff.filter(staff => 
    staff.user.toString() !== userId.toString()
  );
  
  await this.save();
};

// Cascade delete related data when university is deleted
UniversitySchema.pre('remove', async function(next) {
  await this.model('Course').deleteMany({ university: this._id });
  await this.model('User').updateMany(
    { university: this._id },
    { $unset: { university: 1 } }
  );
  next();
});

module.exports = mongoose.model('University', UniversitySchema);
