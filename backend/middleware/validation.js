/**
 * Shared validation helpers using express-validator.
 *
 * All validators REJECT invalid input (400) rather than sanitizing/escpaing.
 * Use validationResult(req) in route handlers to return field-specific errors.
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Return 400 with field-specific error messages if validation failed.
 * Never exposes internal details.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map(e => ({
        field: e.path || e.param,
        message: e.msg,
      })),
    });
  }
  next();
}

// Reusable field validators
const validators = {
  email: body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  password: body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be 8–128 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character'),
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
    .matches(/^[A-Za-z\s.'-]+$/).withMessage('Name contains invalid characters'),
  optionalName: body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
    .matches(/^[A-Za-z\s.'-]+$/).withMessage('Name contains invalid characters'),
  mongoId: param('id')
    .isMongoId().withMessage('Invalid ID format'),
  mongoIdQuery: query('id')
    .isMongoId().withMessage('Invalid ID format'),
  pagination: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
};

module.exports = {
  validators,
  ...validators,
  handleValidationErrors,
};
