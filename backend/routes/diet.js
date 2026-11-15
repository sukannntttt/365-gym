const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');

// get all diets (public, rate-limited at app level)
router.get('/', async (req, res) => {
  try {
    const list = await Diet.find();
    return res.json({ success: true, diets: list });
  } catch (err) {
    console.error('Get diets error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load diets' });
  }
});

// get by goal and type
router.get('/:goal/:type', async (req, res) => {
  const { goal, type } = req.params;
  try {
    if (!goal || !type) {
      return res.status(400).json({ success: false, message: 'Goal and type are required' });
    }
    const diet = await Diet.findOne({ goal, type });
    if (!diet) return res.status(404).json({ success: false, message: 'No diet found for that goal and preference' });
    return res.json({ success: true, diet });
  } catch (err) {
    console.error('Get diet error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load diet' });
  }
});

module.exports = router;
