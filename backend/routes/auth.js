const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const { OAuth2Client } = require('google-auth-library');
const { auth, adminAuth, superAdminAuth } = require('../middleware/auth');
const { noteAuthFailure, noteAuthSuccess } = require('../middleware/rateLimit');
const {
  validators, handleValidationErrors,
} = require('../middleware/validation');
const { body, param } = require('express-validator');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------- Register ----------
router.post('/register', [
  validators.name,
  validators.email,
  validators.password,
  body('age').optional().isInt({ min: 13, max: 100 }).toInt(),
  body('height').optional().isInt({ min: 50, max: 250 }).toInt(),
  body('weight').optional().isFloat({ min: 20, max: 300 }).toInt(),
  body('goal').optional().trim().isLength({ min: 1, max: 100 }),
  body('dietPreference').optional().isIn(['veg', 'non-veg']),
], handleValidationErrors, async (req, res) => {
  const { name, email, password, age, height, weight, goal, dietPreference } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    const role = email.toLowerCase() === 'sukantrai826@gmail.com' ? 'admin' : 'member';
    user = new User({
      name, email, password: hashed, age, height, weight, goal,
      dietPreference: dietPreference || 'veg', role, authProvider: 'local',
    });
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, goal: user.goal, dietPreference: user.dietPreference } });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// ---------- Login ----------
router.post('/login', [
  validators.email,
  body('password').notEmpty().withMessage('Password is required'),
], handleValidationErrors, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      noteAuthFailure(req);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.authProvider === 'google' && !user.password) {
      noteAuthFailure(req);
      return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please use the Google button to log in.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      noteAuthFailure(req);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    noteAuthSuccess(req);
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// ---------- Google OAuth ----------
router.post('/google', [
  body('credential').notEmpty().withMessage('Google credential is required'),
], handleValidationErrors, async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      const role = email.toLowerCase() === 'sukantrai826@gmail.com' ? 'admin' : 'member';
      user = new User({
        name, email, googleId, avatar: picture, authProvider: 'google',
        role, dietPreference: 'veg',
      });
      await user.save();
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token, isNewUser: !user.goal });
  } catch (err) {
    console.error('Google auth error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
});

// ---------- Me (protected) ----------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    console.error('Me error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load profile' });
  }
});

// ---------- Forgot password ----------
router.post('/forgotpassword', [
  validators.email,
], handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Do not reveal whether the email exists
      return res.json({ success: true, message: 'If that email exists, a reset link was sent.' });
    }

    const rawToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `https://365-fitness-gym.netlify.app/reset-password.html?token=${rawToken}`;
    const message = `You requested a password reset for 365 FITNESS GYM.\n\nClick this link to set a new password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: '365 FITNESS GYM Password Reset',
      text: message,
    });

    return res.json({ success: true, message: 'If that email exists, a reset link was sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error setting up email.' });
  }
});

// ---------- Reset password ----------
router.post('/resetpassword/:token', [
  param('token').trim().isLength({ min: 1 }).withMessage('Invalid reset token'),
  validators.password,
], handleValidationErrors, async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful!' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    return res.status(500).json({ success: false, message: 'Password reset failed' });
  }
});

// ---------- Update profile ----------
router.put('/profile', auth, [
  validators.optionalName,
  body('goal').optional().trim().isLength({ min: 1, max: 100 }),
  body('height').optional().isInt({ min: 50, max: 250 }).toInt(),
  body('weight').optional().isFloat({ min: 20, max: 300 }).toInt(),
  body('age').optional().isInt({ min: 13, max: 100 }).toInt(),
  body('dietPreference').optional().isIn(['veg', 'non-veg']),
], handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, goal, height, weight, age, dietPreference } = req.body;
    if (name) user.name = name;
    if (goal) user.goal = goal;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (age) user.age = age;
    if (dietPreference) user.dietPreference = dietPreference;

    await user.save();
    return res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Profile update error:', err.message);
    return res.status(500).json({ success: false, message: 'Profile update failed' });
  }
});

// ---------- Request email change ----------
router.post('/email/request', auth, [
  body('newEmail').isEmail().withMessage('Valid email is required').normalizeEmail(),
], handleValidationErrors, async (req, res) => {
  try {
    const { newEmail } = req.body;
    const exists = await User.findOne({ email: newEmail.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: 'Email is already in use.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const rawToken = crypto.randomBytes(20).toString('hex');
    user.emailChangeToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.emailChangeExpire = Date.now() + 15 * 60 * 1000;
    user.pendingEmail = newEmail.toLowerCase();
    await user.save();

    const verifyUrl = `https://365-fitness-gym.netlify.app/verify-email.html?token=${rawToken}`;
    const message = `You requested to change your 365 FITNESS GYM email to ${user.pendingEmail}.\n\nClick this link to authorize the change:\n${verifyUrl}\n\nIf you did not request this, please secure your account.`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: '365 FITNESS GYM Email Change Authorization',
      text: message,
    });

    return res.json({ success: true, message: 'Authorization email sent to your CURRENT address. Please confirm it is you.' });
  } catch (err) {
    console.error('Email change request error:', err.message);
    return res.status(500).json({ success: false, message: 'Email change request failed' });
  }
});

// ---------- Verify email change ----------
router.post('/email/verify/:token', [
  param('token').trim().isLength({ min: 1 }).withMessage('Invalid token'),
], handleValidationErrors, async (req, res) => {
  try {
    const emailChangeToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailChangeToken,
      emailChangeExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired authorization link.' });

    user.email = user.pendingEmail;
    user.emailChangeToken = undefined;
    user.emailChangeExpire = undefined;
    user.pendingEmail = undefined;
    await user.save();

    return res.json({ success: true, message: 'Email successfully changed!' });
  } catch (err) {
    console.error('Email verify error:', err.message);
    return res.status(500).json({ success: false, message: 'Email verification failed' });
  }
});

module.exports = router;
