const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AthleteProfile = require('../models/AthleteProfile');
const AthleteProgress = require('../models/AthleteProgress');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_365gym';

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No auth token, access denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET Athlete Profile
router.get('/profile', auth, async (req, res) => {
  try {
    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await AthleteProfile.create({ userId: req.user.id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT / POST Athlete Profile
router.post('/profile', auth, async (req, res) => {
  try {
    const {
      sport,
      secondarySport,
      positionOrEvent,
      level,
      primaryGoal,
      secondaryGoals,
      age,
      bodyWeight,
      height,
      trainingDaysPerWeek,
      sessionDuration,
      equipment,
      trainingLocation,
      dietBudget,
      dietPreference,
      isWheyFree,
      competitionDate
    } = req.body;
    
    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }

    if (sport !== undefined) profile.sport = sport;
    if (secondarySport !== undefined) profile.secondarySport = secondarySport;
    if (positionOrEvent !== undefined) profile.positionOrEvent = positionOrEvent;
    if (level !== undefined) profile.level = level;
    if (primaryGoal !== undefined) profile.primaryGoal = primaryGoal;
    if (secondaryGoals !== undefined) profile.secondaryGoals = secondaryGoals;
    if (age !== undefined) profile.age = age ? Number(age) : null;
    if (bodyWeight !== undefined) profile.bodyWeight = bodyWeight ? Number(bodyWeight) : null;
    if (height !== undefined) profile.height = height ? Number(height) : null;
    if (trainingDaysPerWeek !== undefined) profile.trainingDaysPerWeek = Number(trainingDaysPerWeek);
    if (sessionDuration !== undefined) profile.sessionDuration = sessionDuration;
    if (equipment !== undefined) profile.equipment = equipment;
    if (trainingLocation !== undefined) profile.trainingLocation = trainingLocation;
    if (dietBudget !== undefined) profile.dietBudget = dietBudget;
    if (dietPreference !== undefined) profile.dietPreference = dietPreference;
    if (isWheyFree !== undefined) profile.isWheyFree = isWheyFree;
    if (competitionDate !== undefined) profile.competitionDate = competitionDate ? new Date(competitionDate) : null;
    profile.updatedAt = Date.now();

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST Reset Athlete Profile Preferences (Preserves Logs & History)
router.post('/profile/reset', auth, async (req, res) => {
  try {
    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    } else {
      profile.sport = 'General Athletic';
      profile.secondarySport = '';
      profile.positionOrEvent = 'All-Rounder';
      profile.level = 'intermediate';
      profile.primaryGoal = 'Explosive Power & Speed';
      profile.secondaryGoals = [];
      profile.age = undefined;
      profile.bodyWeight = undefined;
      profile.height = undefined;
      profile.trainingDaysPerWeek = 4;
      profile.sessionDuration = '60 Min';
      profile.equipment = 'Full Gym';
      profile.trainingLocation = 'Mixed';
      profile.dietBudget = 'moderate';
      profile.dietPreference = 'veg';
      profile.isWheyFree = false;
      profile.competitionDate = undefined;
      profile.customSchedule = [];
      profile.updatedAt = Date.now();
      await profile.save();
    }
    res.json({ message: 'Profile preferences reset to defaults successfully', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST Log Completed Workout Session
router.post('/workout/complete', auth, async (req, res) => {
  try {
    const { planId, planName, category, durationMinutes, completedExercises } = req.body;
    if (!planId) {
      return res.status(400).json({ message: 'planId is required' });
    }

    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }

    const completionRecord = {
      planId,
      planName: planName || 'Workout Session',
      category: category || 'general',
      completedAt: new Date(),
      durationMinutes: durationMinutes ? Number(durationMinutes) : 0,
      completedExercises: Array.isArray(completedExercises) ? completedExercises : []
    };

    profile.completedWorkouts.push(completionRecord);
    await profile.save();

    res.json({ message: 'Workout completed and logged successfully', completionRecord, totalCompleted: profile.completedWorkouts.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST Save Custom Schedule Updates
router.post('/schedule/update', auth, async (req, res) => {
  try {
    const { schedule } = req.body;
    if (!Array.isArray(schedule)) {
      return res.status(400).json({ message: 'schedule must be an array of day objects' });
    }

    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }

    profile.customSchedule = schedule;
    profile.updatedAt = Date.now();
    await profile.save();

    res.json({ message: 'Custom schedule saved successfully', customSchedule: profile.customSchedule });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST Log Daily Readiness
router.post('/readiness', auth, async (req, res) => {
  try {
    const { sleepHours, sleepQuality, soreness, fatigue, motivation } = req.body;

    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }

    // Calculate readiness score (0-100)
    // Sleep: (hours/8 * 25) max 25 + (quality/5 * 25) max 25 = max 50
    // Soreness: (6 - soreness)/5 * 15 max 15
    // Fatigue: (6 - fatigue)/5 * 15 max 15
    // Motivation: (motivation/5) * 20 max 20
    const sleepScore = Math.min(25, (Number(sleepHours) / 8) * 25) + (Number(sleepQuality) / 5) * 25;
    const sorenessScore = ((6 - Number(soreness)) / 5) * 15;
    const fatigueScore = ((6 - Number(fatigue)) / 5) * 15;
    const motivationScore = (Number(motivation) / 5) * 20;
    const totalScore = Math.round(Math.min(100, Math.max(0, sleepScore + sorenessScore + fatigueScore + motivationScore)));

    const newLog = {
      date: new Date(),
      sleepHours: Number(sleepHours),
      sleepQuality: Number(sleepQuality),
      soreness: Number(soreness),
      fatigue: Number(fatigue),
      motivation: Number(motivation),
      readinessScore: totalScore
    };

    profile.readinessLogs.push(newLog);
    // Keep last 30 logs
    if (profile.readinessLogs.length > 30) {
      profile.readinessLogs = profile.readinessLogs.slice(-30);
    }

    await profile.save();
    res.json({ profile, latestLog: newLog });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Toggle completed schedule item
router.post('/schedule/toggle', auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }

    const idx = profile.completedScheduleItems.indexOf(itemId);
    if (idx > -1) {
      profile.completedScheduleItems.splice(idx, 1);
    } else {
      profile.completedScheduleItems.push(itemId);
    }

    await profile.save();
    res.json({ completedItems: profile.completedScheduleItems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET Athlete Performance Progress
router.get('/progress', auth, async (req, res) => {
  try {
    const logs = await AthleteProgress.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST Log Athlete Performance Progress
router.post('/progress', auth, async (req, res) => {
  try {
    const { metricType, value, unit, exerciseName, notes } = req.body;

    if (!metricType || value === undefined || !unit) {
      return res.status(400).json({ message: 'Missing required metric fields' });
    }

    const newLog = await AthleteProgress.create({
      userId: req.user.id,
      metricType,
      value: Number(value),
      unit,
      exerciseName,
      notes
    });

    res.json(newLog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE Athlete Performance Log
router.delete('/progress/:id', auth, async (req, res) => {
  try {
    const log = await AthleteProgress.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!log) return res.status(404).json({ message: 'Metric record not found' });
    res.json({ message: 'Metric record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
