const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/auth');
const { check } = require('express-validator');

router.post('/sign-up', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

router.post(
    '/reset-password', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        check('token', 'Token is required').exists()
    ],
    authController.resetPassword
);

module.exports = router;
