import { body, validationResult } from 'express-validator';

export const validateUserRegistration = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const validateUserLogin = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('password')
        .isString()
        .withMessage('Password must be a string'),
];

export const validateBMIInput = [
    body('weight')
        .isFloat({ gt: 0 })
        .withMessage('Weight must be a positive number'),
    body('height')
        .isFloat({ gt: 0 })
        .withMessage('Height must be a positive number'),
];

export const validateTrainingPlanInput = [
    body('goal')
        .isString()
        .withMessage('Goal must be a string')
        .isIn(['weight_loss', 'muscle_gain', 'maintenance'])
        .withMessage('Goal must be one of the following: weight_loss, muscle_gain, maintenance'),
];

export const validateDietPlanInput = [
    body('calories')
        .isInt({ gt: 0 })
        .withMessage('Calories must be a positive integer'),
    body('dietType')
        .isString()
        .withMessage('Diet type must be a string')
        .isIn(['keto', 'vegan', 'paleo', 'balanced'])
        .withMessage('Diet type must be one of the following: keto, vegan, paleo, balanced'),
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};