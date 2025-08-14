const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/referralPartnerController');

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and referral partner role
router.use(protect);
router.use(authorize('referralPartner'));

// Dashboard
router.get('/dashboard', getReferralPartnerDashboard);

// Profile management
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Referral management
router.get('/stats', getReferralStats);
router.get('/links', getReferralLinks);
router.get('/referrals', getReferredUsers);

// Commission and earnings
router.get('/commissions', getCommissionHistory);

// Wallet and settlements
router.get('/wallet', getWallet);
router.post('/settlement', requestSettlement);
router.get('/settlements', getSettlementHistory);

module.exports = router;
