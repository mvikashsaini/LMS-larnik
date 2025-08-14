const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Please add order ID'],
    unique: true
  },
  paymentId: {
    type: String,
    unique: true,
    sparse: true
  },
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
  amount: {
    type: Number,
    required: [true, 'Please add payment amount']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'captured', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'wallet', 'coupon'],
    default: 'razorpay'
  },
  
  // Razorpay specific fields
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  // Coupon details
  coupon: {
    code: String,
    discount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  
  // Referral details
  referral: {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    commission: Number,
    commissionRate: Number
  },
  
  // Settlement details
  settlement: {
    teacherAmount: Number,
    universityAmount: Number,
    platformAmount: Number,
    referralAmount: Number,
    teacherSettled: {
      type: Boolean,
      default: false
    },
    universitySettled: {
      type: Boolean,
      default: false
    },
    referralSettled: {
      type: Boolean,
      default: false
    }
  },
  
  // Refund details
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  capturedAt: Date,
  failedAt: Date,
  refundedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ student: 1 });
PaymentSchema.index({ course: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });

// Virtual for payment duration
PaymentSchema.virtual('duration').get(function() {
  if (!this.createdAt) return 0;
  const endDate = this.capturedAt || new Date();
  return Math.floor((endDate - this.createdAt) / (1000 * 60)); // minutes
});

// Calculate settlement amounts
PaymentSchema.methods.calculateSettlement = function() {
  const totalAmount = this.amount;
  let remainingAmount = totalAmount;
  
  // Platform fee (10%)
  const platformFee = Math.round(totalAmount * 0.10);
  remainingAmount -= platformFee;
  
  // Referral commission
  let referralAmount = 0;
  if (this.referral && this.referral.commission) {
    referralAmount = this.referral.commission;
    remainingAmount -= referralAmount;
  }
  
  // Split remaining between teacher and university (70% teacher, 30% university)
  const teacherAmount = Math.round(remainingAmount * 0.70);
  const universityAmount = remainingAmount - teacherAmount;
  
  this.settlement = {
    teacherAmount,
    universityAmount,
    platformAmount: platformFee,
    referralAmount,
    teacherSettled: false,
    universitySettled: false,
    referralSettled: false
  };
  
  return this.save();
};

// Mark payment as captured
PaymentSchema.methods.markAsCaptured = function(paymentId, signature) {
  this.status = 'captured';
  this.paymentId = paymentId;
  this.razorpayPaymentId = paymentId;
  this.razorpaySignature = signature;
  this.capturedAt = new Date();
  
  return this.calculateSettlement();
};

// Mark payment as failed
PaymentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  this.failedAt = new Date();
  return this.save();
};

// Process refund
PaymentSchema.methods.processRefund = function(amount, reason, processedBy) {
  this.status = 'refunded';
  this.refund = {
    amount: amount || this.amount,
    reason,
    processedAt: new Date(),
    processedBy
  };
  this.refundedAt = new Date();
  return this.save();
};

// Get payment analytics
PaymentSchema.statics.getAnalytics = async function() {
  const analytics = await this.aggregate([
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        capturedPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'captured'] }, 1, 0]
          }
        },
        capturedAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'captured'] }, '$amount', 0]
          }
        },
        failedPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
          }
        },
        refundedPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0]
          }
        },
        refundedAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'refunded'] }, '$refund.amount', 0]
          }
        }
      }
    }
  ]);
  
  return analytics[0] || {
    totalPayments: 0,
    totalAmount: 0,
    capturedPayments: 0,
    capturedAmount: 0,
    failedPayments: 0,
    refundedPayments: 0,
    refundedAmount: 0
  };
};

// Get payments by date range
PaymentSchema.statics.getPaymentsByDateRange = async function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('student', 'firstName lastName email')
    .populate('course', 'title')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Payment', PaymentSchema);
