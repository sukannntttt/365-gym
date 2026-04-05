const express = require('express');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog');
const Diet = require('../models/Diet');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// @route   GET api/analytics/stats
// @desc    Get user workout and diet stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Weekly Workout Volume (Sets * Reps * Weight)
    const logs = await WorkoutLog.find({
      userId,
      date: { $gte: sevenDaysAgo }
    });

    let weeklyVolume = 0;
    logs.forEach(log => {
      weeklyVolume += (log.sets || 0) * (log.reps || 0) * (log.weight || 0);
    });

    // 2. Average Weight (Progress)
    const progressLogs = await Progress.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    const currentWeight = progressLogs.length > 0 ? progressLogs[0].weight : null;

    // 3. Daily Calories Average (Diet)
    const dietLogs = await Diet.find({
      userId,
      date: { $gte: sevenDaysAgo }
    });

    let totalCalories = 0;
    dietLogs.forEach(log => {
      totalCalories += log.calories || 0;
    });
    const avgDailyCalories = dietLogs.length > 0 ? Math.round(totalCalories / dietLogs.length) : 0;

    res.json({
      weeklyVolume,
      currentWeight,
      avgDailyCalories,
      workoutCount: logs.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
