const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const AthleteProfile = require('../models/AthleteProfile');
const AthleteProgress = require('../models/AthleteProgress');
const { body, param, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(e => ({ field: e.path || e.param, message: e.msg })),
    });
  }
  next();
}

// ---------- GET Athlete Profile ----------
router.get('/profile', auth, async (req, res) => {
  try {
    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await AthleteProfile.create({ userId: req.user.id });
    }
    return res.json({ success: true, profile });
  } catch (err) {
    console.error('Get athlete profile error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load profile' });
  }
});

// ---------- PUT / POST Athlete Profile ----------
router.post('/profile', auth, [
  body('sport').optional().trim().isLength({ min: 1, max: 50 }),
  body('secondarySport').optional().trim().isLength({ max: 50 }),
  body('positionOrEvent').optional().trim().isLength({ max: 50 }),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('primaryGoal').optional().trim().isLength({ min: 1, max: 200 }),
  body('secondaryGoals').optional().isArray({ max: 10 }),
  body('age').optional().isInt({ min: 10, max: 100 }).toInt(),
  body('bodyWeight').optional().isFloat({ min: 20, max: 300 }).toFloat(),
  body('height').optional().isInt({ min: 50, max: 250 }).toInt(),
  body('trainingDaysPerWeek').optional().isInt({ min: 1, max: 7 }).toInt(),
  body('sessionDuration').optional().trim().isLength({ max: 50 }),
  body('equipment').optional().trim().isLength({ max: 100 }),
  body('trainingLocation').optional().trim().isLength({ max: 100 }),
  body('dietBudget').optional().isIn(['low', 'moderate', 'high']),
  body('dietPreference').optional().isIn(['veg', 'non-veg', 'egg', 'vegan']),
  body('isWheyFree').optional().isBoolean(),
  body('competitionDate').optional().isISO8601(),
], handleValidationErrors, async (req, res) => {
  try {
    const {
      sport, secondarySport, positionOrEvent, level, primaryGoal, secondaryGoals,
      age, bodyWeight, height, trainingDaysPerWeek, sessionDuration, equipment,
      trainingLocation, dietBudget, dietPreference, isWheyFree, competitionDate,
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
    if (age !== undefined) profile.age = age;
    if (bodyWeight !== undefined) profile.bodyWeight = bodyWeight;
    if (height !== undefined) profile.height = height;
    if (trainingDaysPerWeek !== undefined) profile.trainingDaysPerWeek = trainingDaysPerWeek;
    if (sessionDuration !== undefined) profile.sessionDuration = sessionDuration;
    if (equipment !== undefined) profile.equipment = equipment;
    if (trainingLocation !== undefined) profile.trainingLocation = trainingLocation;
    if (dietBudget !== undefined) profile.dietBudget = dietBudget;
    if (dietPreference !== undefined) profile.dietPreference = dietPreference;
    if (isWheyFree !== undefined) profile.isWheyFree = isWheyFree;
    if (competitionDate !== undefined) profile.competitionDate = new Date(competitionDate);
    profile.updatedAt = Date.now();

    await profile.save();
    return res.json({ success: true, profile });
  } catch (err) {
    console.error('Update athlete profile error:', err.message);
    return res.status(500).json({ success: false, message: 'Profile update failed' });
  }
});

// ---------- POST Reset Athlete Profile Preferences ----------
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
    return res.json({ success: true, message: 'Profile preferences reset to defaults successfully', profile });
  } catch (err) {
    console.error('Reset athlete profile error:', err.message);
    return res.status(500).json({ success: false, message: 'Profile reset failed' });
  }
});

// ---------- POST Log Completed Workout Session ----------
router.post('/workout/complete', auth, [
  body('planId').trim().isLength({ min: 1, max: 100 }).withMessage('planId is required'),
  body('planName').optional().trim().isLength({ max: 200 }),
  body('category').optional().trim().isLength({ max: 100 }),
  body('durationMinutes').optional().isInt({ min: 1, max: 1440 }).toInt(),
  body('completedExercises').optional().isArray({ max: 100 }),
], handleValidationErrors, async (req, res) => {
  try {
    const { planId, planName, category, durationMinutes, completedExercises } = req.body;

    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }

    const completionRecord = {
      planId,
      planName: planName || 'Workout Session',
      category: category || 'general',
      completedAt: new Date(),
      durationMinutes: durationMinutes || 0,
      completedExercises: Array.isArray(completedExercises) ? completedExercises : [],
    };

    profile.completedWorkouts.push(completionRecord);
    await profile.save();

    return res.json({ success: true, message: 'Workout completed and logged successfully', completionRecord, totalCompleted: profile.completedWorkouts.length });
  } catch (err) {
    console.error('Complete workout error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to log workout' });
  }
});

// ---------- POST Save Custom Schedule Updates ----------
router.post('/schedule/update', auth, [
  body('schedule').isArray({ max: 500 }).withMessage('schedule must be an array of day objects'),
], handleValidationErrors, async (req, res) => {
  try {
    const { schedule } = req.body;
    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }
    profile.customSchedule = schedule;
    profile.updatedAt = Date.now();
    await profile.save();
    return res.json({ success: true, message: 'Custom schedule saved successfully', customSchedule: profile.customSchedule });
  } catch (err) {
    console.error('Save schedule error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to save schedule' });
  }
});

// ---------- POST Log Daily Readiness ----------
router.post('/readiness', auth, [
  body('sleepHours').optional().isFloat({ min: 0, max: 24 }).toFloat(),
  body('sleepQuality').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('soreness').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('fatigue').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('motivation').optional().isInt({ min: 1, max: 5 }).toInt(),
], handleValidationErrors, async (req, res) => {
  try {
    const { sleepHours, sleepQuality, soreness, fatigue, motivation } = req.body;

    let profile = await AthleteProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AthleteProfile({ userId: req.user.id });
    }

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
      readinessScore: totalScore,
    };

    profile.readinessLogs.push(newLog);
    if (profile.readinessLogs.length > 30) {
      profile.readinessLogs = profile.readinessLogs.slice(-30);
    }
    await profile.save();
    return res.json({ success: true, profile, latestLog: newLog });
  } catch (err) {
    console.error('Readiness log error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to log readiness' });
  }
});

// ---------- Toggle completed schedule item ----------
router.post('/schedule/toggle', auth, [
  body('itemId').trim().isLength({ min: 1, max: 100 }),
], handleValidationErrors, async (req, res) => {
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
    return res.json({ success: true, completedItems: profile.completedScheduleItems });
  } catch (err) {
    console.error('Toggle schedule error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to toggle schedule item' });
  }
});

// ---------- GET Athlete Performance Progress ----------
router.get('/progress', auth, async (req, res) => {
  try {
    const logs = await AthleteProgress.find({ userId: req.user.id }).sort({ date: -1 });
    return res.json({ success: true, logs });
  } catch (err) {
    console.error('Get athlete progress error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load progress' });
  }
});

// ---------- POST Log Athlete Performance Progress ----------
router.post('/progress', auth, [
  body('metricType').trim().isLength({ min: 1, max: 100 }).withMessage('metricType is required'),
  body('value').isFloat().withMessage('value must be a number'),
  body('unit').trim().isLength({ min: 1, max: 50 }).withMessage('unit is required'),
  body('exerciseName').optional().trim().isLength({ max: 200 }),
  body('notes').optional().trim().isLength({ max: 1000 }),
], handleValidationErrors, async (req, res) => {
  try {
    const { metricType, value, unit, exerciseName, notes } = req.body;
    const newLog = await AthleteProgress.create({
      userId: req.user.id, metricType, value: Number(value), unit, exerciseName, notes,
    });
    return res.json({ success: true, log: newLog });
  } catch (err) {
    console.error('Create athlete progress error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to log progress' });
  }
});

// ---------- DELETE Athlete Performance Log ----------
router.delete('/progress/:id', auth, [
  param('id').isMongoId().withMessage('Invalid ID format'),
], handleValidationErrors, async (req, res) => {
  try {
    const log = await AthleteProgress.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!log) return res.status(404).json({ success: false, message: 'Metric record not found' });
    return res.json({ success: true, message: 'Metric record deleted successfully' });
  } catch (err) {
    console.error('Delete athlete progress error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to delete progress record' });
  }
});

module.exports = router;
