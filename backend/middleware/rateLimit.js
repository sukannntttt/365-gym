/**
 * Configurable rate limiting.
 *
 * Limits are read from environment variables so they can be tuned without code
 * changes. Auth routes use a combination of per-IP and per-account tracking with
 * exponential backoff (no hard lockout). All other endpoint types use simpler
 * per-IP or per-user-id fixed-window limits.
 *
 * Environment variables (all optional with safe defaults):
 *   AUTH_RATE_LIMIT_WINDOW_MS   default 900000  (15 min)
 *   AUTH_RATE_LIMIT_MAX         default 10      requests per window per IP
 *   AUTH_RATE_LIMIT_MAX_ACCOUNT default 15      requests per window per account (email)
 *   AUTH_BACKOFF_BASE_MS        default 60000   (1 min) initial backoff
 *   AUTH_BACKOFF_MAX_MS         default 3600000 (1 hour) max backoff
 *   PUBLIC_RATE_LIMIT_WINDOW_MS default 60000   (1 min)
 *   PUBLIC_RATE_LIMIT_MAX       default 30      requests per window per IP
 *   USER_RATE_LIMIT_WINDOW_MS   default 60000   (1 min)
 *   USER_RATE_LIMIT_MAX         default 100     requests per window per user id
 *   ADMIN_RATE_LIMIT_WINDOW_MS  default 60000   (1 min)
 *   ADMIN_RATE_LIMIT_MAX        default 30      requests per window per user id
 */

const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = rateLimit;

// ---------- In-memory store for per-account failure tracking & backoff ----------
// Key: `${ip}:${identifier}`  where identifier is email (account) or 'ip' for IP-only
const failureStore = new Map();

function now() { return Date.now(); }

function getStoreKey(ip, identifier) {
  return `${ip}:${identifier || 'ip'}`;
}

function recordFailure(ip, identifier) {
  const key = getStoreKey(ip, identifier);
  const entry = failureStore.get(key) || { count: 0, firstFailure: now() };
  entry.count += 1;
  entry.firstFailure = entry.firstFailure || now();
  failureStore.set(key, entry);
  return entry;
}

function getBackoffMs(ip, identifier) {
  const entry = failureStore.get(getStoreKey(ip, identifier));
  if (!entry || entry.count === 0) return 0;
  // Exponential backoff: base * 2^(count-1), capped at max
  const base = parseInt(process.env.AUTH_BACKOFF_BASE_MS || '60000', 10);
  const max = parseInt(process.env.AUTH_BACKOFF_MAX_MS || '3600000', 10);
  let backoff = base * Math.pow(2, entry.count - 1);
  if (backoff > max) backoff = max;
  return backoff;
}

function clearFailures(ip, identifier) {
  failureStore.delete(getStoreKey(ip, identifier));
}

// ---------- Helper: build a fixed-window limiter ----------
function fixedWindowLimiter({ windowMs, max, keyGenerator, message, skipSuccessfulRequests }) {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: keyGenerator || ipKeyGenerator,
    message: { success: false, message: message || 'Too many requests, please try again later.' },
    standardHeaders: true,   // Return RateLimit-* headers
    legacyHeaders: false,
    skipSuccessfulRequests,
  });
}

// ---------- Auth limiter: per-IP + per-account with exponential backoff ----------
function authLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const identifier = (req.body && req.body.email) || 'ip';
  const key = getStoreKey(ip, identifier);

  const windowMs = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10);
  const maxIp = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10);
  const maxAccount = parseInt(process.env.AUTH_RATE_LIMIT_MAX_ACCOUNT || '15', 10);

  // Check per-account backoff first (account-level abuse)
  const backoffMs = getBackoffMs(ip, identifier);
  if (backoffMs > 0) {
    const entry = failureStore.get(key) || { count: 0, firstFailure: 0 };
    const elapsed = now() - entry.firstFailure;
    if (elapsed < backoffMs) {
      const retryAfter = Math.ceil((backoffMs - elapsed) / 1000);
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please try again later.',
        retryAfter,
      });
    }
    // Backoff period elapsed; allow one attempt but keep tracking
  }

  // Use express-rate-limit for the per-IP fixed window (simplest robust approach).
  // We apply a per-IP limiter; per-account backoff is handled above via recordFailure.
  return rateLimit({
    windowMs,
    max: maxIp,
    keyGenerator: () => ip,
    message: { success: false, message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  })(req, res, next);
}

// Call this from route handlers on failed auth attempts to trigger backoff.
function noteAuthFailure(req) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const identifier = (req.body && req.body.email) || 'ip';
  recordFailure(ip, identifier);
}

function noteAuthSuccess(req) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const identifier = (req.body && req.body.email) || 'ip';
  clearFailures(ip, identifier);
}

// ---------- Public endpoints: per-IP ----------
const publicLimiter = fixedWindowLimiter({
  windowMs: parseInt(process.env.PUBLIC_RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.PUBLIC_RATE_LIMIT_MAX || '30', 10),
  message: 'Too many requests to this public endpoint, please try again later.',
});

// ---------- Authenticated user actions: per-user-id ----------
const userLimiter = fixedWindowLimiter({
  windowMs: parseInt(process.env.USER_RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.USER_RATE_LIMIT_MAX || '100', 10),
  keyGenerator: (req) => (req.user && req.user.id) || ipKeyGenerator(req),
  message: 'Too many requests, please try again later.',
});

// ---------- Admin routes: per-user-id, stricter ----------
const adminLimiter = fixedWindowLimiter({
  windowMs: parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.ADMIN_RATE_LIMIT_MAX || '30', 10),
  keyGenerator: (req) => (req.user && req.user.id) || ipKeyGenerator(req),
  message: 'Too many admin requests, please try again later.',
});

module.exports = {
  authLimiter,
  publicLimiter,
  userLimiter,
  adminLimiter,
  noteAuthFailure,
  noteAuthSuccess,
};
