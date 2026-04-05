const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI environment variable is not set.');
    process.exit(1);
  }

  try {
    // mongoose v6+ uses sensible defaults for parser and topology options
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  }
};