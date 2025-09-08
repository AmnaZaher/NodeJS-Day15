const express = require('express');
const { login } = require('../controllers/loginController');
const { register } = require('../controllers/registerController');
const { logout } = require('../controllers/logoutController');
const { sendOtp } = require('../controllers/sendOtpController');
const { newPassword } = require('../controllers/newPasswordController');

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// OTP & Password Reset routes
router.post('/send-otp', sendOtp);
router.post('/new-password', newPassword);

module.exports = router;
