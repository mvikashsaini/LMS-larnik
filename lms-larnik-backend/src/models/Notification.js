const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add recipient']
  },
  title: {
    type: String,
    required: [true, 'Please add notification title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add notification message'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'course', 'payment', 'certificate', 'system'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  
  // Action details
  action: {
    type: {
      type: String,
      enum: ['link', 'button', 'none'],
      default: 'none'
    },
    text: String,
    url: String,
    data: mongoose.Schema.Types.Mixed
  },
  
  // Related entities
  relatedEntity: {
    type: {
      type: String,
      enum: ['course', 'enrollment', 'payment', 'certificate', 'user', 'university'],
      required: false
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity.type'
    }
  },
  
  // Delivery channels
  delivery: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },
  
  // Delivery status
  deliveryStatus: {
    inApp: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    }
  },
  
  // Read status
  readAt: Date,
  archivedAt: Date,
  
  // Expiry
  expiresAt: Date,
  
  // Metadata
  metadata: {
    source: String,
    campaign: String,
    tags: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
NotificationSchema.index({ recipient: 1 });
NotificationSchema.index({ status: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 });

// Virtual for notification age
NotificationSchema.virtual('age').get(function() {
  if (!this.createdAt) return 0;
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Virtual for is expired
NotificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Mark as read
NotificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Mark as archived
NotificationSchema.methods.markAsArchived = function() {
  this.status = 'archived';
  this.archivedAt = new Date();
  return this.save();
};

// Mark delivery as sent
NotificationSchema.methods.markDeliverySent = function(channel) {
  if (this.deliveryStatus[channel]) {
    this.deliveryStatus[channel].sent = true;
    this.deliveryStatus[channel].sentAt = new Date();
  }
  return this.save();
};

// Mark delivery as failed
NotificationSchema.methods.markDeliveryFailed = function(channel, error) {
  if (this.deliveryStatus[channel]) {
    this.deliveryStatus[channel].sent = false;
    this.deliveryStatus[channel].error = error;
  }
  return this.save();
};

// Get notification analytics
NotificationSchema.statics.getAnalytics = async function() {
  const analytics = await this.aggregate([
    {
      $group: {
        _id: null,
        totalNotifications: { $sum: 1 },
        unreadNotifications: {
          $sum: {
            $cond: [{ $eq: ['$status', 'unread'] }, 1, 0]
          }
        },
        readNotifications: {
          $sum: {
            $cond: [{ $eq: ['$status', 'read'] }, 1, 0]
          }
        },
        archivedNotifications: {
          $sum: {
            $cond: [{ $eq: ['$status', 'archived'] }, 1, 0]
          }
        }
      }
    }
  ]);
  
  return analytics[0] || {
    totalNotifications: 0,
    unreadNotifications: 0,
    readNotifications: 0,
    archivedNotifications: 0
  };
};

// Get notifications by user
NotificationSchema.statics.getUserNotifications = async function(userId, options = {}) {
  const {
    status = 'unread',
    limit = 20,
    offset = 0,
    type = null,
    priority = null
  } = options;
  
  const query = { recipient: userId };
  
  if (status !== 'all') {
    query.status = status;
  }
  
  if (type) {
    query.type = type;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .populate('relatedEntity.id');
};

// Bulk mark as read
NotificationSchema.statics.bulkMarkAsRead = async function(userId, notificationIds) {
  return this.updateMany(
    {
      recipient: userId,
      _id: { $in: notificationIds },
      status: 'unread'
    },
    {
      status: 'read',
      readAt: new Date()
    }
  );
};

// Clean expired notifications
NotificationSchema.statics.cleanExpired = async function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

module.exports = mongoose.model('Notification', NotificationSchema);
