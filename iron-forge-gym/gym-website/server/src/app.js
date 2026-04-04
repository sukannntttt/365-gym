const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const dietRoutes = require('./routes/diet.routes');
const workoutRoutes = require('./routes/workout.routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/workout', workoutRoutes);

module.exports = app;