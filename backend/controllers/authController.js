const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, pwd } = req.body; // Change 'password' to 'pwd'

    if (!username || !pwd) { // Change 'password' to 'pwd'
        return res.status(400).json({ message: 'All fields are required' });
    }

    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const match = await bcrypt.compare(pwd, foundUser.pwd); // Change 'password' to 'pwd'

    if (!match) return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles,
                "id": foundUser._id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send accessToken containing username and roles
    res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const foundUser = await User.findOne({ username: decoded.username }).exec();

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles,
                        "id": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken });
        })
    );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie cleared' });
};

const signup = asyncHandler(async (req, res) => {
    const { name, username, email, pwd, roles, captchaValue } = req.body;  // Only extract the username and pwd
    console.log("Value: " + req.body.pwd)
    console.log("Value Name: " + name)
    console.log("Value Username: " + username)
    console.log("Value Email: " + email)
    console.log("Value Pwd: " + pwd)
    console.log("Value Roles: " + roles)
    console.log("Value Captcha: " + captchaValue)
    if (!name || !username || !email || !pwd) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify reCAPTCHA
    if (!captchaValue) {
        console.log("No reCAPTCHA...")
        return res.status(400).send("reCAPTCHA error!");
    }

    console.log("Validating reCAPTCHA...")

    const axios = require('axios');
    const verifyRecaptcha = async (recaptchaValue) => {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: '6Lc-y9AoAAAAAJYVWnolS1nHHMVhuRc870G1MvNp',
                response: recaptchaValue
            }
        });
        return response.data;
    };

    const { success, score } = await verifyRecaptcha(captchaValue);
    console.log("Captcha Success: " + success)
    if (!success) {
        // reCAPTCHA validation failed
        return res.status(400).send("reCAPTCHA verification failed");
    }

    console.log("Done validating reCAPTCHA...")

    // Check if the user already exists
    const userExists = await User.findOne({ username });
    const userExistsEmail = await User.findOne({ email });
    if (userExists || userExistsEmail) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Create the new user with the roles attribute set to 'Donator'
    const newUser = new User({
        name,
        username,
        email,
        pwd: hashedPwd,
        roles  // Hard-code the roles attribute to 'Donator'
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
});

module.exports = {
    login,
    refresh,
    logout,
    signup
};
