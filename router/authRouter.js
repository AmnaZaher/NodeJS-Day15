const express = require('express');
const { login, logout, newPassword, register, sendOtp} = require('../controllers/userController')

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// OTP & Password Reset routes
router.post('/send-otp', sendOtp);
router.post('/new-password', newPassword);

module.exports = router;
