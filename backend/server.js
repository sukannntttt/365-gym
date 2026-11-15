const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
require('dotenv').config({ path: __dirname + '/.env' });

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');
const { authLimiter, publicLimiter, userLimiter, adminLimiter } = require('./middleware/rateLimit');

const app = express();

// Trust proxy (Render/Netlify front a reverse proxy; needed for accurate rate-limit IPs)
app.set('trust proxy', 1);

// ---------- Security headers (Helmet) ----------
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
    connectSrc: ["'self'", process.env.BACKEND_URL || 'https://gym-backend-aukv.onrender.com'],
  },
}));
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

// ---------- CORS (restricted to known frontends) ----------
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
if (allowedOrigins.length === 0) {
  // Safe dev-only fallback; production must set CORS_ORIGINS explicitly
  allowedOrigins.push('http://localhost:5500', 'http://127.0.0.1:5500');
}
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser (curl, mobile)
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
}));

// ---------- Request size limits ----------
app.use(express.json({
  limit: process.env.MAX_REQUEST_BODY || '100kb',
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_REQUEST_BODY || '100kb' }));

// ---------- NoSQL injection & parameter pollution protection ----------
app.use(mongoSanitize());
app.use(hpp());

// ---------- Rate limiting ----------
// Stricter on auth routes (per-IP + per-account, exponential backoff via authLimiter)
app.use('/api/auth', authLimiter);
// Moderate on public endpoints
app.use('/api/diet', publicLimiter);
app.use('/api/bmi', publicLimiter);
app.use('/api/analytics', publicLimiter);
// Looser on authenticated user actions
app.use('/api/workout', userLimiter);
app.use('/api/workout-log', userLimiter);
app.use('/api/progress', userLimiter);
app.use('/api/athlete', userLimiter);
app.use('/api/payment', userLimiter);
// Admin routes: strict
app.use('/api/admin', adminLimiter);

// ---------- Routes ----------
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
app.use('/api/athlete', require('./routes/athlete'));

// ---------- 404 ----------
app.use(notFound);

// ---------- Centralized error handler (no leakage to client) ----------
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
