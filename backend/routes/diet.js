const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');

// get all diets
router.get('/', async (req, res) => {
  const list = await Diet.find();
  res.json(list);
});

// get by goal
router.get('/:goal', async (req, res) => {
  const goal = req.params.goal;
  const diet = await Diet.findOne({ goal });
  if (!diet) return res.status(404).json({ message: 'No diet for that goal' });
  res.json(diet);
});

module.exports = router;