const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const WorkoutLog = require('../models/WorkoutLog');
const Progress = require('../models/Progress');

// Admin Check Middleware
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ _id: -1 });
    
    // Quick overall stats
    const totalWorkouts = await WorkoutLog.countDocuments();
    const totalProgress = await Progress.countDocuments();

    res.json({
      totalUsers: users.length,
      totalWorkouts,
      totalProgress,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Utility: promote manually if user exists before schema update
router.post('/promote', async (req, res) => {
  const { secret, email } = req.body;
  if (secret !== process.env.JWT_SECRET) return res.status(403).json({ message: 'Invalid secret' });
  
  const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { role: 'admin' }, { new: true });
  res.json({ user });
});

// POST /api/admin/pay-fee/:id
router.post('/pay-fee/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Calculate new date: +30 days
    const currentDue = user.feeDueDate ? new Date(user.feeDueDate) : new Date();
    const baseDate = currentDue > new Date() ? currentDue : new Date();
    
    const newDueDate = new Date(baseDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    user.feeDueDate = newDueDate;

    // Apply the pending tier if it exists
    if (user.pendingTier) {
      user.membershipTier = user.pendingTier;
      user.pendingTier = undefined; // Clear after applying
    } else {
      // Default to Pro if nothing was pending (legacy support)
      user.membershipTier = 'Pro';
    }

    user.pendingTxnId = undefined; // Clear the transaction ID
    await user.save();
    
    res.json({ message: 'Fee marked paid', feeDueDate: user.feeDueDate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
