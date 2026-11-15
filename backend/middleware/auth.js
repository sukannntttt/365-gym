const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

function auth(req, res, next) {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Token is not valid' });
  }
}

/**
 * Role-based access control middleware. Factory that returns middleware
 * requiring one of the allowed roles.
 *
 * Usage: router.get('/', auth, roleAllowed('admin', 'superAdmin'), handler)
 */
function roleAllowed(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const userRole = req.user.role || req.user.roleName;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
}

const adminAuth = roleAllowed('admin', 'superAdmin');
const superAdminAuth = roleAllowed('superAdmin');
const staffAuth = roleAllowed('admin', 'superAdmin', 'trainer');

module.exports = { auth, roleAllowed, adminAuth, superAdminAuth, staffAuth };
