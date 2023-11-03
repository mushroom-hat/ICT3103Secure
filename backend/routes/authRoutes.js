const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');
const requestLogger = require('../middleware/requestLogger');
const setDonatorRole = require('../middleware/setDonatorRole');
const bouncer = require('../middleware/bouncer.js');
const bouncerlogin = require('../middleware/bouncerlogin.js');
const bouncersignup = require('../middleware/bouncersignup.js');

router.route('/')
    .post(loginLimiter, bouncerlogin, authController.login);

router.route('/refresh')
    .get(authController.refresh);

router.route('/logout')
    .post(authController.logout);

router.route('/signup')
    .post(requestLogger, setDonatorRole, bouncersignup, authController.signup); // Apply the middlewares here

router.route('/activate/:token')
    .post(authController.activate);

router.route('/verify-login')
    .post(authController.verifyLogin)

router.route('/verify-login-code')
    .post(authController.verifyLoginCode)

router.route('/send-verification-email')
    .post(authController.sendActivationEmail)

module.exports = router;
