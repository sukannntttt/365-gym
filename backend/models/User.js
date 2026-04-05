const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  height: Number,
  weight: Number,
  goal: String,
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
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);