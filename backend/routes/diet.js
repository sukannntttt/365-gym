const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');

// get all diets
router.get('/', async (req, res) => {
  const list = await Diet.find();
  res.json(list);
});

// get by goal and type
router.get('/:goal/:type', async (req, res) => {
  const { goal, type } = req.params;
  const diet = await Diet.findOne({ goal, type });
  if (!diet) return res.status(404).json({ message: 'No diet found for that goal and preference' });
  res.json(diet);
});

module.exports = router;