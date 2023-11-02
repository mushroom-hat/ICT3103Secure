const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');
const requestLogger = require('../middleware/requestLogger');
const setDonatorRole = require('../middleware/setDonatorRole');
const bouncer = require('../middleware/bouncer.js');

router.route('/')
    .post(loginLimiter, authController.login);

router.route('/refresh')
    .get(authController.refresh);

router.route('/logout')
    .post(authController.logout);

router.route('/signup')
    .post(requestLogger, setDonatorRole, bouncer, authController.signup); // Apply the middlewares here

router.route('/activate/:token')
    .post(authController.activate);

router.route('/verify-login')
    .post(authController.verifyLogin)

router.route('/verify-login-code')
    .post(authController.verifyLoginCode)

module.exports = router;
