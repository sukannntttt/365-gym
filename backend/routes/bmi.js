const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// POST /api/bmi — calculate BMI
router.post('/', [
  body('weight').isFloat({ min: 20, max: 300 }).withMessage('Weight must be 20–300 kg'),
  body('height').isFloat({ min: 50, max: 250 }).withMessage('Height must be 50–250 cm'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  const { weight, height } = req.body;
  try {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const rounded = Math.round(bmi * 10) / 10;

    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    return res.json({ success: true, bmi: rounded, category });
  } catch (err) {
    console.error('BMI error:', err.message);
    return res.status(500).json({ success: false, message: 'BMI calculation failed' });
  }
});

module.exports = router;
