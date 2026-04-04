const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: false // Duration in minutes
    }
});

const workoutSchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    exercises: [exerciseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);