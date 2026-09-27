const mongoose = require('mongoose');

const AthleteProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  metricType: {
    type: String,
    enum: [
      'vertical_jump',
      'broad_jump',
      'sprint_10m',
      'sprint_20m',
      'sprint_30m',
      'sprint_100m',
      'pull_ups',
      'iso_hold',
      'hyrox_time',
      'strength_pr'
    ],
    required: true
  },
  value: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g. 'cm', 'sec', 'reps', 'min', 'kg'
  exerciseName: { type: String }, // optional, for strength_pr or iso_hold
  notes: { type: String }
});

module.exports = mongoose.model('AthleteProgress', AthleteProgressSchema);
