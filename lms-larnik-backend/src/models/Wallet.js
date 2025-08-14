const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add user'],
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Transaction history
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit', 'settlement', 'refund', 'commission'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    reference: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    metadata: {
      paymentId: mongoose.Schema.Types.ObjectId,
      courseId: mongoose.Schema.Types.ObjectId,
      enrollmentId: mongoose.Schema.Types.ObjectId
    },
    processedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Settlement requests
  settlementRequests: [{
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    },
    upiId: String,
    notes: String
  }],
  
  // Wallet settings
  settings: {
    autoSettlement: {
      type: Boolean,
      default: false
    },
    minSettlementAmount: {
      type: Number,
      default: 1000 // ₹1000 minimum for settlement
    },
    settlementFrequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly'],
      default: 'monthly'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
WalletSchema.index({ user: 1 });
WalletSchema.index({ balance: -1 });
WalletSchema.index({ 'transactions.processedAt': -1 });
WalletSchema.index({ 'settlementRequests.status': 1 });

// Virtual for total credits
WalletSchema.virtual('totalCredits').get(function() {
  return this.transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
});

// Virtual for total debits
WalletSchema.virtual('totalDebits').get(function() {
  return this.transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
});

// Virtual for pending settlements
WalletSchema.virtual('pendingSettlements').get(function() {
  return this.settlementRequests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);
});

// Add transaction
WalletSchema.methods.addTransaction = function(type, amount, description, reference, metadata = {}) {
  const transaction = {
    type,
    amount,
    description,
    reference,
    status: 'completed',
    metadata,
    processedAt: new Date()
  };
  
  this.transactions.push(transaction);
  
  // Update balance
  if (type === 'credit') {
    this.balance += amount;
  } else if (type === 'debit') {
    this.balance = Math.max(0, this.balance - amount);
  }
  
  return this.save();
};

// Credit wallet
WalletSchema.methods.credit = function(amount, description, reference, metadata = {}) {
  return this.addTransaction('credit', amount, description, reference, metadata);
};

// Debit wallet
WalletSchema.methods.debit = function(amount, description, reference, metadata = {}) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  return this.addTransaction('debit', amount, description, reference, metadata);
};

// Request settlement
WalletSchema.methods.requestSettlement = function(amount, bankDetails, upiId, notes = '') {
  if (amount > this.balance) {
    throw new Error('Insufficient balance for settlement');
  }
  
  if (amount < this.settings.minSettlementAmount) {
    throw new Error(`Minimum settlement amount is ₹${this.settings.minSettlementAmount}`);
  }
  
  const settlementRequest = {
    amount,
    status: 'pending',
    requestedAt: new Date(),
    bankDetails,
    upiId,
    notes
  };
  
  this.settlementRequests.push(settlementRequest);
  
  // Deduct from balance
  this.balance -= amount;
  
  return this.save();
};

// Process settlement
WalletSchema.methods.processSettlement = function(requestId, status, processedBy, notes = '') {
  const request = this.settlementRequests.id(requestId);
  
  if (!request) {
    throw new Error('Settlement request not found');
  }
  
  request.status = status;
  request.processedAt = new Date();
  request.processedBy = processedBy;
  request.notes = notes;
  
  // If rejected, return amount to balance
  if (status === 'rejected') {
    this.balance += request.amount;
  }
  
  return this.save();
};

// Get transaction history
WalletSchema.methods.getTransactionHistory = function(limit = 50, offset = 0) {
  return this.transactions
    .sort((a, b) => b.processedAt - a.processedAt)
    .slice(offset, offset + limit);
};

// Get wallet analytics
WalletSchema.methods.getAnalytics = function() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  
  const monthlyTransactions = this.transactions.filter(t => 
    t.processedAt >= lastMonth && t.status === 'completed'
  );
  
  const monthlyCredits = monthlyTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyDebits = monthlyTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    currentBalance: this.balance,
    totalCredits: this.totalCredits,
    totalDebits: this.totalDebits,
    monthlyCredits,
    monthlyDebits,
    pendingSettlements: this.pendingSettlements,
    totalTransactions: this.transactions.length
  };
};

// Get wallet analytics for all users
WalletSchema.statics.getAnalytics = async function() {
  const analytics = await this.aggregate([
    {
      $group: {
        _id: null,
        totalWallets: { $sum: 1 },
        totalBalance: { $sum: '$balance' },
        averageBalance: { $avg: '$balance' },
        totalSettlementRequests: {
          $sum: {
            $size: {
              $filter: {
                input: '$settlementRequests',
                cond: { $eq: ['$$this.status', 'pending'] }
              }
            }
          }
        }
      }
    }
  ]);
  
  return analytics[0] || {
    totalWallets: 0,
    totalBalance: 0,
    averageBalance: 0,
    totalSettlementRequests: 0
  };
};

module.exports = mongoose.model('Wallet', WalletSchema);
