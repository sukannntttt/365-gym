const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    body('height').isFloat({ min: 0 }).withMessage('Height must be a positive number'),
    body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('goal').notEmpty().withMessage('Goal is required'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateDietPlan = [
    body('goal').notEmpty().withMessage('Goal is required'),
];

const validateWorkoutPlan = [
    body('goal').notEmpty().withMessage('Goal is required'),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateDietPlan,
    validateWorkoutPlan,
    validateRequest,
};