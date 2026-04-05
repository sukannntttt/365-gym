const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: String, sets: Number, reps: String, rest: String
});

const WorkoutPlanSchema = new mongoose.Schema({
  goal: { type: String, required: true }, // fat loss / push pull legs / weight gain
  day: String,
  exercises: [ExerciseSchema]
});

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);