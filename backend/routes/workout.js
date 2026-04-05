const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');

// get all plans
router.get('/', async (req, res) => {
  const list = await WorkoutPlan.find();
  res.json(list);
});

// get plans by goal
router.get('/:goal', async (req, res) => {
  const list = await WorkoutPlan.find({ goal: req.params.goal });
  res.json(list);
});

module.exports = router;