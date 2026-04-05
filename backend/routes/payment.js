const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Submit UPI Transaction ID for verification
router.post('/submit-txn', auth, async (req, res) => {
  try {
    const { txnId, tier } = req.body;
    if (!txnId) {
      return res.status(400).json({ message: 'Transaction ID is required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.pendingTxnId = txnId;
    if (tier) user.pendingTier = tier; // Save the selected tier
    await user.save();

    res.json({ message: 'Transaction ID submitted! Waiting for Admin approval.' });
  } catch (err) {
    console.error('Submit Txn Error:', err);
    res.status(500).json({ message: 'Could not submit transaction: ' + err.message });
  }
});

module.exports = router;
