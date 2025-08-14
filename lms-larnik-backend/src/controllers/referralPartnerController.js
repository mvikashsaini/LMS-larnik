const User = require('../models/User');
const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');
const { sendEmail } = require('../services/emailService');

/**
 * @desc    Get referral partner dashboard
 * @route   GET /api/referral-partner/dashboard
 * @access  Private (Referral Partner)
 */
const getReferralPartnerDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalReferrals,
    totalEarnings,
    totalPaidOut,
    currentBalance,
    referrals30d,
    earnings30d,
    recentReferrals,
    topReferrals,
    commissionHistory
  ] = await Promise.all([
    User.countDocuments({ 'studentProfile.referredBy': req.user._id }),
    Payment.aggregate([
      { $match: { referralPartner: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$referralCommission' } } }
    ]),
    Wallet.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$transactions' },
      { $match: { 'transactions.type': 'withdrawal' } },
      { $group: { _id: null, total: { $sum: '$transactions.amount' } } }
    ]),
    Wallet.findOne({ user: req.user._id }).select('balance'),
    User.countDocuments({ 
      'studentProfile.referredBy': req.user._id,
      createdAt: { $gte: last30Days }
    }),
    Payment.aggregate([
      { 
        $match: { 
          referralPartner: req.user._id, 
          status: 'completed',
          createdAt: { $gte: last30Days }
        } 
      },
      { $group: { _id: null, total: { $sum: '$referralCommission' } } }
    ]),
    User.find({ 'studentProfile.referredBy': req.user._id })
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .limit(10),
    Payment.aggregate([
      { $match: { referralPartner: req.user._id, status: 'completed' } },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      { $unwind: '$studentData' },
      {
        $group: {
          _id: '$studentData._id',
          name: { $first: '$studentData.firstName' },
          email: { $first: '$studentData.email' },
          totalSpent: { $sum: '$amount' },
          commission: { $sum: '$referralCommission' },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { commission: -1 } },
      { $limit: 5 }
    ]),
    Payment.find({ referralPartner: req.user._id })
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .select('amount referralCommission createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalReferrals,
        totalEarnings: totalEarnings[0]?.total || 0,
        totalPaidOut: totalPaidOut[0]?.total || 0,
        currentBalance: currentBalance?.balance || 0,
        referrals30d,
        earnings30d: earnings30d[0]?.total || 0
      },
      recentReferrals,
      topReferrals,
      commissionHistory
    }
  });
});

/**
 * @desc    Get referral statistics
 * @route   GET /api/referral-partner/stats
 * @access  Private (Referral Partner)
 */
const getReferralStats = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;

  let dateFilter = {};
  const now = new Date();

  switch (period) {
    case '7d':
      dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      break;
    case '30d':
      dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      break;
    case '90d':
      dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
      break;
    case '1y':
      dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
      break;
  }

  const [
    totalReferrals,
    totalEarnings,
    totalEnrollments,
    totalRevenue,
    monthlyReferrals,
    monthlyEarnings,
    tierStats,
    conversionRate
  ] = await Promise.all([
    User.countDocuments({ 
      'studentProfile.referredBy': req.user._id,
      createdAt: dateFilter
    }),
    Payment.aggregate([
      { 
        $match: { 
          referralPartner: req.user._id, 
          status: 'completed',
          createdAt: dateFilter
        } 
      },
      { $group: { _id: null, total: { $sum: '$referralCommission' } } }
    ]),
    Payment.countDocuments({ 
      referralPartner: req.user._id, 
      status: 'completed',
      createdAt: dateFilter
    }),
    Payment.aggregate([
      { 
        $match: { 
          referralPartner: req.user._id, 
          status: 'completed',
          createdAt: dateFilter
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    User.aggregate([
      { 
        $match: { 
          'studentProfile.referredBy': req.user._id,
          createdAt: dateFilter
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]),
    Payment.aggregate([
      { 
        $match: { 
          referralPartner: req.user._id, 
          status: 'completed',
          createdAt: dateFilter
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          earnings: { $sum: '$referralCommission' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]),
    {
      currentTier: req.user.referralPartner.tier,
      commissionRate: req.user.referralPartner.commissionRate,
      nextTier: req.user.referralPartner.totalReferrals >= 41 ? 'Maximum' : 
                req.user.referralPartner.totalReferrals >= 21 ? 'tier4' :
                req.user.referralPartner.totalReferrals >= 11 ? 'tier3' : 'tier2',
      referralsToNextTier: req.user.referralPartner.totalReferrals >= 41 ? 0 :
                          req.user.referralPartner.totalReferrals >= 21 ? 41 - req.user.referralPartner.totalReferrals :
                          req.user.referralPartner.totalReferrals >= 11 ? 21 - req.user.referralPartner.totalReferrals :
                          11 - req.user.referralPartner.totalReferrals
    },
    Payment.aggregate([
      { 
        $match: { 
          referralPartner: req.user._id, 
          status: 'completed',
          createdAt: dateFilter
        } 
      },
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: 1 },
          totalRevenue: { $sum: '$amount' }
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalReferrals,
        totalEarnings: totalEarnings[0]?.total || 0,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageCommission: totalEnrollments > 0 ? (totalEarnings[0]?.total || 0) / totalEnrollments : 0
      },
      trends: {
        monthlyReferrals,
        monthlyEarnings
      },
      tierStats,
      conversionRate: totalReferrals > 0 ? Math.round((totalEnrollments / totalReferrals) * 100) : 0
    }
  });
});

/**
 * @desc    Get referral links
 * @route   GET /api/referral-partner/links
 * @access  Private (Referral Partner)
 */
const getReferralLinks = asyncHandler(async (req, res) => {
  const referralCode = req.user.referralPartner.referralCode;
  const baseUrl = process.env.FRONTEND_URL || 'https://larnik.com';

  const links = {
    main: `${baseUrl}/register?ref=${referralCode}`,
    course: `${baseUrl}/courses?ref=${referralCode}`,
    landing: `${baseUrl}/?ref=${referralCode}`,
    social: {
      whatsapp: `https://wa.me/?text=Join%20Larnik%20LMS%20using%20my%20referral%20link:%20${baseUrl}/register?ref=${referralCode}`,
      telegram: `https://t.me/share/url?url=${baseUrl}/register?ref=${referralCode}&text=Join%20Larnik%20LMS%20using%20my%20referral%20link`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${baseUrl}/register?ref=${referralCode}`,
      twitter: `https://twitter.com/intent/tweet?text=Join%20Larnik%20LMS%20using%20my%20referral%20link&url=${baseUrl}/register?ref=${referralCode}`
    }
  };

  res.status(200).json({
    success: true,
    data: {
      referralCode,
      links
    }
  });
});

/**
 * @desc    Get referred users
 * @route   GET /api/referral-partner/referrals
 * @access  Private (Referral Partner)
 */
const getReferredUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = { 'studentProfile.referredBy': req.user._id };
  
  if (status) {
    if (status === 'enrolled') {
      query._id = { $in: await Payment.distinct('student', { referralPartner: req.user._id }) };
    } else if (status === 'not_enrolled') {
      query._id = { $nin: await Payment.distinct('student', { referralPartner: req.user._id }) };
    }
  }

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const referrals = await User.find(query)
    .select('firstName lastName email phone createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await User.countDocuments(query);

  // Get enrollment and commission data for each referral
  const referralsWithData = await Promise.all(
    referrals.map(async (referral) => {
      const enrollments = await Payment.find({ 
        student: referral._id, 
        referralPartner: req.user._id 
      }).populate('course', 'title');

      const totalSpent = enrollments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalCommission = enrollments.reduce((sum, payment) => sum + payment.referralCommission, 0);

      return {
        ...referral.toObject(),
        enrollments: enrollments.length,
        totalSpent,
        totalCommission,
        courses: enrollments.map(payment => payment.course.title)
      };
    })
  );

  res.status(200).json({
    success: true,
    data: referralsWithData,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get commission history
 * @route   GET /api/referral-partner/commissions
 * @access  Private (Referral Partner)
 */
const getCommissionHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { referralPartner: req.user._id };
  if (status) query.status = status;

  const commissions = await Payment.find(query)
    .populate('student', 'firstName lastName email')
    .populate('course', 'title')
    .select('amount referralCommission status createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: commissions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get wallet details
 * @route   GET /api/referral-partner/wallet
 * @access  Private (Referral Partner)
 */
const getWallet = asyncHandler(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });

  if (!wallet) {
    wallet = await Wallet.create({
      user: req.user._id,
      balance: 0,
      currency: 'INR'
    });
  }

  // Get recent transactions
  const recentTransactions = wallet.transactions
    .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt))
    .slice(0, 10);

  // Get pending settlement requests
  const pendingSettlements = wallet.settlementRequests
    .filter(request => request.status === 'pending')
    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  res.status(200).json({
    success: true,
    data: {
      wallet: {
        _id: wallet._id,
        balance: wallet.balance,
        currency: wallet.currency,
        totalEarnings: wallet.totalEarnings || 0,
        totalWithdrawn: wallet.totalWithdrawn || 0
      },
      recentTransactions,
      pendingSettlements
    }
  });
});

/**
 * @desc    Request settlement
 * @route   POST /api/referral-partner/settlement
 * @access  Private (Referral Partner)
 */
const requestSettlement = asyncHandler(async (req, res) => {
  const { amount, bankDetails, upiId, notes } = req.body;

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'Wallet not found'
    });
  }

  // Check minimum settlement amount
  if (amount < 500) {
    return res.status(400).json({
      success: false,
      message: 'Minimum settlement amount is ₹500'
    });
  }

  // Check if sufficient balance
  if (amount > wallet.balance) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient balance'
    });
  }

  const settlementRequest = {
    amount: parseFloat(amount),
    bankDetails,
    upiId,
    notes,
    status: 'pending',
    requestedAt: new Date()
  };

  wallet.settlementRequests.push(settlementRequest);
  await wallet.save();

  res.status(200).json({
    success: true,
    data: settlementRequest
  });
});

/**
 * @desc    Get settlement history
 * @route   GET /api/referral-partner/settlements
 * @access  Private (Referral Partner)
 */
const getSettlementHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) {
    return res.status(404).json({
      success: false,
      message: 'Wallet not found'
    });
  }

  let settlements = wallet.settlementRequests;

  if (status) {
    settlements = settlements.filter(request => request.status === status);
  }

  // Sort by requested date (newest first)
  settlements.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  // Pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = parseInt(page) * parseInt(limit);
  const paginatedSettlements = settlements.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    data: paginatedSettlements,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: settlements.length,
      pages: Math.ceil(settlements.length / parseInt(limit))
    }
  });
});

/**
 * @desc    Update referral partner profile
 * @route   PUT /api/referral-partner/profile
 * @access  Private (Referral Partner)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    bio,
    socialLinks,
    preferredPaymentMethod
  } = req.body;

  const user = await User.findById(req.user._id);

  // Update basic fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (bio) user.bio = bio;

  // Update referral partner specific fields
  if (socialLinks) {
    user.referralPartner.socialLinks = socialLinks;
  }

  if (preferredPaymentMethod) {
    user.referralPartner.preferredPaymentMethod = preferredPaymentMethod;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Get referral partner profile
 * @route   GET /api/referral-partner/profile
 * @access  Private (Referral Partner)
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('firstName lastName email phone bio avatar referralPartner createdAt');

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  getReferralPartnerDashboard,
  getReferralStats,
  getReferralLinks,
  getReferredUsers,
  getCommissionHistory,
  getWallet,
  requestSettlement,
  getSettlementHistory,
  updateProfile,
  getProfile
};
