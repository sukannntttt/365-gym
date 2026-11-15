const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const WorkoutLog = require('../models/WorkoutLog');
const Diet = require('../models/Diet');
const Progress = require('../models/Progress');

// @route   GET api/analytics/stats
// @desc    Get user workout and diet stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await WorkoutLog.find({ userId, date: { $gte: sevenDaysAgo } });
    let weeklyVolume = 0;
    logs.forEach(log => {
      weeklyVolume += (log.sets || 0) * (log.reps || 0) * (log.weight || 0);
    });

    const progressLogs = await Progress.find({ userId, date: { $gte: sevenDaysAgo } }).sort({ date: -1 });
    const currentWeight = progressLogs.length > 0 ? progressLogs[0].weight : null;

    const dietLogs = await Diet.find({ userId, date: { $gte: sevenDaysAgo } });
    let totalCalories = 0;
    dietLogs.forEach(log => { totalCalories += log.calories || 0; });
    const avgDailyCalories = dietLogs.length > 0 ? Math.round(totalCalories / dietLogs.length) : 0;

    return res.json({
      success: true,
      weeklyVolume,
      currentWeight,
      avgDailyCalories,
      workoutCount: logs.length,
    });
  } catch (err) {
    console.error('Analytics error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load analytics' });
  }
});

module.exports = router;
