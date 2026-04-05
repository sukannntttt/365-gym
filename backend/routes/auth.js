const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const auth = require('../middleware/auth');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);

// register
router.post('/register', async (req, res) => {
  const { name, email, password, age, height, weight, goal } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const role = email.toLowerCase() === 'sukantrai826@gmail.com' ? 'admin' : 'user';
    user = new User({ name, email, password: hashed, age, height, weight, goal, role });
    await user.save();
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, goal: user.goal } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// me (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// forgot-password
router.post('/forgotpassword', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Don't leak that the email doesn't exist, just say email sent
      return res.json({ message: 'If that email exists, a reset link was sent.' });
    }

    const rawToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetUrl = `https://gymfrontend0925.netlify.app/reset-password.html?token=${rawToken}`;
    const message = `You requested a password reset for 365 FITNESS GYM.\n\nClick this link to set a new password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: '365 FITNESS GYM Password Reset',
      text: message
    });

    res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error setting up email.' });
  }
});

// reset-password
router.post('/resetpassword/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile (Name, Goal, Height, Weight, Age)
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Only allow updating specific fields
    const { name, goal, height, weight, age } = req.body;
    if (name) user.name = name;
    if (goal) user.goal = goal;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (age) user.age = age;
    
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request Email Change
router.post('/email/request', auth, async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ message: 'New email is required.' });

    // Ensure the new email doesn't already belong to someone else
    const exists = await User.findOne({ email: newEmail.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email is already in use.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate secure token
    const rawToken = crypto.randomBytes(20).toString('hex');
    user.emailChangeToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.emailChangeExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    user.pendingEmail = newEmail.toLowerCase();
    await user.save();

    const verifyUrl = `https://gymfrontend0925.netlify.app/verify-email.html?token=${rawToken}`;
    const message = `You requested to change your 365 FITNESS GYM email to ${user.pendingEmail}.\n\nClick this link to authorize the change:\n${verifyUrl}\n\nIf you did not request this, please secure your account.`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email, // Send to CURRENT email
      subject: '365 FITNESS GYM Email Change Authorization',
      text: message
    });
    
    res.json({ message: 'Authorization email sent to your CURRENT address. Please confirm it is you.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Email Change
router.post('/email/verify/:token', async (req, res) => {
  try {
    const emailChangeToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailChangeToken,
      emailChangeExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired authorization link.' });

    // Change the email definitively
    user.email = user.pendingEmail;
    
    // Clear out tokens
    user.emailChangeToken = undefined;
    user.emailChangeExpire = undefined;
    user.pendingEmail = undefined;
    await user.save();

    res.json({ message: 'Email successfully changed!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;