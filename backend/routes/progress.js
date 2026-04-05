const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');

// log weight (protected)
router.post('/', auth, async (req, res) => {
  const { weight, date } = req.body;
  const entry = new Progress({ userId: req.user.id, weight, date });
  await entry.save();
  res.status(201).json(entry);
});

// get progress by user (protected)
router.get('/:userId', auth, async (req, res) => {
  if (req.user.id !== req.params.userId)
    return res.status(403).json({ message: 'Forbidden' });
  const entries = await Progress.find({ userId: req.params.userId }).sort({ date: 1 });
  res.json(entries);
});

module.exports = router;
