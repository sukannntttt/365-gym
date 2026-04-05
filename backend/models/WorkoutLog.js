const mongoose = require('mongoose');

const WorkoutLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  exercise: String,
  sets: Number,
  reps: Number,
  weight: Number
});

module.exports = mongoose.model('WorkoutLog', WorkoutLogSchema);