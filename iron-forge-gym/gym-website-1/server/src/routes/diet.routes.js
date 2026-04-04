const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');

// Get diet plans by user goal
router.get('/:goal', dietController.getDietByGoal);

// Get all available diet plans
router.get('/', dietController.getAllDiets);

module.exports = router;