const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');
const requestLogger = require('../middleware/requestLogger');
const setDonatorRole = require('../middleware/setDonatorRole');

router.route('/')
    .post(loginLimiter, authController.login);

router.route('/refresh')
    .get(authController.refresh);

router.route('/logout')
    .post(authController.logout);

router.route('/signup')
    .post(requestLogger, setDonatorRole, authController.signup); // Apply the middlewares here

router.route('/activate/:encryptedToken')
    .post(authController.activate);

module.exports = router;
