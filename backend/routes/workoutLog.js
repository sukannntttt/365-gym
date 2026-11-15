const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const WorkoutLog = require('../models/WorkoutLog');
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

// create log (protected)
router.post('/', auth, [
  body('exercise').trim().isLength({ min: 1, max: 100 }).withMessage('Exercise name is required'),
  body('sets').isInt({ min: 1, max: 100 }).withMessage('Sets must be 1–100'),
  body('reps').isInt({ min: 1, max: 1000 }).withMessage('Reps must be 1–1000'),
  body('weight').optional().isFloat({ min: 0, max: 1000 }).toFloat(),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
], handleValidationErrors, async (req, res) => {
  try {
    const { exercise, sets, reps, weight, date } = req.body;
    const log = new WorkoutLog({
      userId: req.user.id, exercise, sets, reps,
      weight: weight || 0, date: date || new Date().toISOString(),
    });
    await log.save();
    return res.status(201).json({ success: true, log });
  } catch (err) {
    console.error('Create workout log error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to log workout' });
  }
});

// get logs by user (protected)
router.get('/:userId', auth, [
  param('userId').isMongoId().withMessage('Invalid ID format'),
], handleValidationErrors, async (req, res) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const logs = await WorkoutLog.find({ userId: req.params.userId }).sort({ date: -1 });
    return res.json({ success: true, logs });
  } catch (err) {
    console.error('Get workout logs error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load workout logs' });
  }
});

module.exports = router;
