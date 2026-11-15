const express = require('express');
const router = express.Router();
const { auth, roleAllowed } = require('../middleware/auth');
const User = require('../models/User');
const WorkoutLog = require('../models/WorkoutLog');
const Progress = require('../models/Progress');

const adminAuth = roleAllowed('admin', 'superAdmin');
const superAdminAuth = roleAllowed('superAdmin');

// ---------- GET /api/admin/users ----------
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ _id: -1 });
    const totalWorkouts = await WorkoutLog.countDocuments();
    const totalProgress = await Progress.countDocuments();
    return res.json({
      success: true,
      totalUsers: users.length,
      totalWorkouts,
      totalProgress,
      users,
    });
  } catch (err) {
    console.error('Admin users error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load users' });
  }
});

// ---------- POST /api/admin/promote (super admin only) ----------
router.post('/promote', [auth, superAdminAuth], async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    console.error('Promote error:', err.message);
    return res.status(500).json({ success: false, message: 'Promote failed' });
  }
});

// ---------- POST /api/admin/pay-fee/:id ----------
router.post('/pay-fee/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const currentDue = user.feeDueDate ? new Date(user.feeDueDate) : new Date();
    const baseDate = currentDue > new Date() ? currentDue : new Date();
    const newDueDate = new Date(baseDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    user.feeDueDate = newDueDate;

    if (user.pendingTier) {
      user.membershipTier = user.pendingTier;
      user.pendingTier = undefined;
    } else {
      user.membershipTier = 'Pro';
    }
    user.pendingTxnId = undefined;
    await user.save();

    return res.json({ success: true, message: 'Fee marked paid', feeDueDate: user.feeDueDate });
  } catch (err) {
    console.error('Pay fee error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to mark fee paid' });
  }
});

module.exports = router;
