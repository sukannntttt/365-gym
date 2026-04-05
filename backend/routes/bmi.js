const express = require('express');
const router = express.Router();

// POST /api/bmi — calculate BMI
router.post('/', (req, res) => {
  const { weight, height } = req.body; // weight in kg, height in cm
  if (!weight || !height)
    return res.status(400).json({ message: 'weight and height are required' });

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  res.json({ bmi: rounded, category });
});

module.exports = router;
