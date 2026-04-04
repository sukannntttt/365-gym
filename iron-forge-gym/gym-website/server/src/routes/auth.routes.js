const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../utils/validators');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', getMe);

module.exports = router;