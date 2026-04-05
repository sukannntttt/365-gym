const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const WorkoutLog = require('../models/WorkoutLog');

// create log (protected)
router.post('/', auth, async (req, res) => {
  const { exercise, sets, reps, weight, date } = req.body;
  const log = new WorkoutLog({ userId: req.user.id, exercise, sets, reps, weight, date });
  await log.save();
  res.status(201).json(log);
});

// get logs by user
router.get('/:userId', auth, async (req, res) => {
  if (req.user.id !== req.params.userId) return res.status(403).json({ message: 'Forbidden' });
  const logs = await WorkoutLog.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(logs);
});

module.exports = router;