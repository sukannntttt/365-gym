const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Progress = require('../models/Progress');
const { body, param, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(e => ({ field: e.path || e.param, message: e.msg })),
    });
  }
  next();
}

// log weight (protected)
router.post('/', auth, [
  body('weight').isFloat({ min: 20, max: 300 }).withMessage('Weight must be 20–300 kg'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
], handleValidationErrors, async (req, res) => {
  try {
    const { weight, date } = req.body;
    const entry = new Progress({ userId: req.user.id, weight, date: date || new Date().toISOString() });
    await entry.save();
    return res.status(201).json({ success: true, entry });
  } catch (err) {
    console.error('Create progress error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to save progress' });
  }
});

// get progress by user (protected)
router.get('/:userId', auth, [
  param('userId').isMongoId().withMessage('Invalid ID format'),
], handleValidationErrors, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const entries = await Progress.find({ userId: req.params.userId }).sort({ date: 1 });
    return res.json({ success: true, entries });
  } catch (err) {
    console.error('Get progress error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load progress' });
  }
});

module.exports = router;
