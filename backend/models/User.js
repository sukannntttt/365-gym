const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar: { type: String },
  age: Number,
  height: Number,
  weight: Number,
  goal: String,
  dietPreference: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
  role: { type: String, default: 'user' },
  membershipTier: { type: String, enum: ['Free', 'Pro', 'Elite'], default: 'Free' },
  pendingTier: { type: String, enum: ['Pro', 'Elite'] },
  feeDueDate: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailChangeToken: String,
  emailChangeExpire: Date,
  pendingEmail: String,
  pendingTxnId: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);