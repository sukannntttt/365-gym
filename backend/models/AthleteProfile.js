const mongoose = require('mongoose');

const ReadinessLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  sleepHours: { type: Number, default: 8 },
  sleepQuality: { type: Number, min: 1, max: 5, default: 4 }, // 1-5
  soreness: { type: Number, min: 1, max: 5, default: 2 }, // 1-5 (5 = extreme soreness)
  fatigue: { type: Number, min: 1, max: 5, default: 2 }, // 1-5 (5 = exhausted)
  motivation: { type: Number, min: 1, max: 5, default: 4 }, // 1-5
  readinessScore: { type: Number, default: 85 } // calculated 0-100
}, { _id: true });

const AthleteProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  sport: { type: String, default: 'General Athletic' },
  positionOrEvent: { type: String, default: 'All-Rounder' },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  primaryGoal: { type: String, default: 'Overall Performance' },
  trainingDaysPerWeek: { type: Number, default: 4 },
  dietBudget: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
  dietPreference: { type: String, enum: ['veg', 'non-veg', 'egg', 'vegan'], default: 'veg' },
  isWheyFree: { type: Boolean, default: false },
  readinessLogs: [ReadinessLogSchema],
  completedScheduleItems: [{ type: String }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AthleteProfile', AthleteProfileSchema);
