const Workout = require('../models/Workout');

// Get all workouts
exports.getAllWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get workouts by goal
exports.getWorkoutByGoal = async (req, res) => {
    const { goal } = req.params;
    try {
        const workouts = await Workout.find({ goal });
        if (!workouts.length) {
            return res.status(404).json({ message: 'No workouts found for this goal' });
        }
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};