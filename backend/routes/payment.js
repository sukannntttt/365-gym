const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Submit UPI Transaction ID for verification
router.post('/submit-txn', auth, async (req, res) => {
  try {
    const { txnId, tier } = req.body;
    if (!txnId || typeof txnId !== 'string') {
      return res.status(400).json({ success: false, message: 'Transaction ID is required.' });
    }
    // UTR reference: alphanumeric, 12–22 characters
    if (!/^[A-Z0-9]{12,22}$/.test(txnId.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Invalid transaction reference format.' });
    }
    const validTiers = ['Free', 'Pro', 'Elite'];
    if (tier && !validTiers.includes(tier)) {
      return res.status(400).json({ success: false, message: 'Invalid membership tier.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.pendingTxnId = txnId.toUpperCase();
    if (tier) user.pendingTier = tier;
    await user.save();

    return res.json({ success: true, message: 'Transaction ID submitted! Waiting for Admin approval.' });
  } catch (err) {
    console.error('Submit Txn Error:', err.message);
    return res.status(500).json({ success: false, message: 'Could not submit transaction' });
  }
});

module.exports = router;
