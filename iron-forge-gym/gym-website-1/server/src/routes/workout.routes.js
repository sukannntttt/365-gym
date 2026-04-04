const express = require('express');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

// Get all workouts
router.get('/', workoutController.getAllWorkouts);

// Get workouts by goal
router.get('/:goal', workoutController.getWorkoutByGoal);

module.exports = router;