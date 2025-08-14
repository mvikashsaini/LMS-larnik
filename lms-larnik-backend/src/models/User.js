const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please add a valid phone number']
  },
  password: {
    type: String,
    required: function() {
      return this.role !== 'student'; // Students use OTP login
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'universityAdmin', 'superAdmin', 'referralPartner', 'subAdmin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  dateOfBirth: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  
  // University specific fields
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: function() {
      return ['universityAdmin', 'teacher'].includes(this.role);
    }
  },
  universityRole: {
    type: String,
    enum: ['superAdmin', 'courseManager', 'financeOfficer', 'documentationManager', 'certificationOfficer', 'analyst', 'referralManager'],
    required: function() {
      return this.role === 'universityAdmin';
    }
  },
  
  // Teacher specific fields
  teacherProfile: {
    idProof: {
      type: String,
      required: function() {
        return this.role === 'teacher';
      }
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    },
    upiId: String,
    specialization: [String],
    experience: Number,
    qualification: String,
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  
  // Student specific fields
  studentProfile: {
    referralCode: String,
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    certificates: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    }]
  },
  
  // Referral Partner specific fields
  referralPartner: {
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    totalReferrals: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    commissionRate: {
      type: Number,
      default: 1 // Default 1%
    },
    tier: {
      type: String,
      enum: ['tier1', 'tier2', 'tier3', 'tier4'],
      default: 'tier1'
    }
  },
  
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // OTP fields for students
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'referralPartner.referralCode': 1 });
UserSchema.index({ university: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for user's enrollments
UserSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'student',
  justOne: false
});

// Virtual for user's courses (if teacher)
UserSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'teacher',
  justOne: false
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate referral code for referral partners
UserSchema.pre('save', async function(next) {
  if (this.role === 'referralPartner' && !this.referralPartner.referralCode) {
    this.referralPartner.referralCode = this.generateReferralCode();
  }
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Generate refresh token
UserSchema.methods.getRefreshToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate OTP for students
UserSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  };
  return otp;
};

// Verify OTP
UserSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  
  if (new Date() > this.otp.expiresAt) {
    return false;
  }
  
  return this.otp.code === otp;
};

// Generate referral code
UserSchema.methods.generateReferralCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Update referral tier based on total referrals
UserSchema.methods.updateReferralTier = function() {
  const { totalReferrals } = this.referralPartner;
  
  if (totalReferrals >= 41) {
    this.referralPartner.tier = 'tier4';
    this.referralPartner.commissionRate = 10;
  } else if (totalReferrals >= 21) {
    this.referralPartner.tier = 'tier3';
    this.referralPartner.commissionRate = 5;
  } else if (totalReferrals >= 11) {
    this.referralPartner.tier = 'tier2';
    this.referralPartner.commissionRate = 2.5;
  } else {
    this.referralPartner.tier = 'tier1';
    this.referralPartner.commissionRate = 1;
  }
};

// Cascade delete related data when user is deleted
UserSchema.pre('remove', async function(next) {
  await this.model('Enrollment').deleteMany({ student: this._id });
  await this.model('Course').deleteMany({ teacher: this._id });
  await this.model('Wallet').deleteMany({ user: this._id });
  next();
});

module.exports = mongoose.model('User', UserSchema);
