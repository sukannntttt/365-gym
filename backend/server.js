const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/workout', require('./routes/workout'));
app.use('/api/workout-log', require('./routes/workoutLog'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/bmi', require('./routes/bmi'));
app.use('/api/seed', require('./routes/seed'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
