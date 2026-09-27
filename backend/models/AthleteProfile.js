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

const CompletedWorkoutSchema = new mongoose.Schema({
  planId: { type: String, required: true },
  planName: { type: String },
  category: { type: String },
  completedAt: { type: Date, default: Date.now },
  durationMinutes: { type: Number, default: 0 },
  completedExercises: [{ type: String }]
}, { _id: true });

const AthleteProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  sport: { type: String, default: 'General Athletic' },
  secondarySport: { type: String, default: '' },
  positionOrEvent: { type: String, default: 'All-Rounder' },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  primaryGoal: { type: String, default: 'Explosive Power & Speed' },
  secondaryGoals: [{ type: String }],
  age: { type: Number },
  bodyWeight: { type: Number },
  height: { type: Number },
  trainingDaysPerWeek: { type: Number, default: 4 },
  sessionDuration: { type: String, default: '60 Min' },
  equipment: { type: String, default: 'Full Gym' },
  trainingLocation: { type: String, default: 'Mixed' },
  dietBudget: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
  dietPreference: { type: String, enum: ['veg', 'non-veg', 'egg', 'vegan'], default: 'veg' },
  isWheyFree: { type: Boolean, default: false },
  competitionDate: { type: Date },
  readinessLogs: [ReadinessLogSchema],
  completedScheduleItems: [{ type: String }],
  customSchedule: [mongoose.Schema.Types.Mixed],
  completedWorkouts: [CompletedWorkoutSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AthleteProfile', AthleteProfileSchema);
