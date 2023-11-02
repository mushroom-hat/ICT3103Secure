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
        return res.status(401).json({ message: 'No User Resgistered.' });
    }
    // compare the password with the hashed password stored in the database
    const match = await bcrypt.compare(pwd, foundUser.pwd);

    if (!match){
        // Update user logon fail attempts
        foundUser.lockOutAttempts.passwordAttempts = foundUser.lockOutAttempts.passwordAttempts + 1;
        foundUser.save();
        return res.status(402).json({ message: 'Unauthorized. Invalid password.', error: "Invalid password.", attempts: foundUser.lockOutAttempts.passwordAttempts });
    };

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
    console.log("Login success.")
    res.json({ accessToken, username: foundUser.username, roles: foundUser.roles });
});

// Verify Login using 6 digit Email Verification
const verifyLogin = asyncHandler(async (req, res) => {
    try {
        console.log("Verifying login...")
        // Generate a 6 digit code
        const crypto = require('crypto');
        const verificationCode = crypto.randomInt(100000, 999999);
        console.log("Verification Code: " + verificationCode);
        // Get the user's email address from username
        const { username } = req.body;
        console.log("Retrieving Username: " + username);

        const foundUser = await User.findOne({ username }).exec();

        // Check if the user exists
        if (!foundUser) {
            console.log("User not found.")
            return res.status(401).json({ message: 'Unauthorized', error: "User not found." });
        } else if (foundUser.isActive === false) {
            console.log("User not activated.")
            return res.status(401).json({ message: 'Unauthorized', error: "User not activated." });
        } else {
            console.log("Found User: " + foundUser.username);
            const emailAddr = foundUser.email;
            console.log("Email Address: " + emailAddr);

            // Send the 6 digit code to the user's email address
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                secure: true,
                requireTLS: true,
                port: 465,
                secured: true,
                service: 'gmail',
                auth: {
                    user: 'ssdsecuresoftware@gmail.com',
                    pass: 'xtyr bfet oftx jxtc'
                }
            });

            const emailTemplate = {
                from: 'ssdsecuresoftware@gmail.com',
                to: emailAddr, // Replace with the user's email address
                subject: 'Login Verification Code (Charity)',
                html: `
                        <p>Your Code: ${verificationCode}</p>`
            };

            console.log("Sending email verification...")
            console.log("Email: " + emailTemplate.to)

            transporter.sendMail(emailTemplate, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Email Internal server error', error: "Email Internal server error" });
                } else {
                    console.log('Email Verification Code sent:', info.response);

                    // Save the verification code and expiration time to the database
                    foundUser.verificationCode.code = verificationCode;
                    foundUser.verificationCode.expirationTime = Date.now() + 90000;
                    foundUser.save();

                    // Return a success message
                    return res.status(200).json({ message: 'Email Verification Code sent successfully.', success: "Email Verification Code sent successfully." });
                }
            });

            console.log("Email Verication Code sent successfully.")
            console.log("Verification Code Sent.")
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal login verification server error.', error: "Internal login verification server error." });
    }


});

// Verify 6 digit Email Verification Code
const verifyLoginCode = asyncHandler(async (req, res) => {
    console.log("Verifying login code...")
    // Get the user's email address from username
    const { username, verificationCode } = req.body;
    console.log("Retrieving Username with Code: " + username + " " + verificationCode);

    // Find the user in the database
    const foundUser = await User.findOne({ username }).exec();
    const verificationCodeDB = foundUser.verificationCode.code;
    const expirationTime = foundUser.verificationCode.expirationTime;

    // Check if the verification code is correct
    if (verificationCodeDB !== verificationCode) {
        console.log("Invalid verification code.")
        // Update user verification attempts
        foundUser.lockOutAttempts.emailVerificationAttempts = foundUser.lockOutAttempts.emailVerificationAttempts + 1;
        foundUser.save();
        return res.status(401).json({ message: 'Invalid verification code.', error: "Invalid verification code." , attempts: foundUser.lockOutAttempts.emailVerificationAttempts});
    } else if (Date.now() > expirationTime) {
        console.log("Verification code expired.")
        // Update user verification attempts
        foundUser.lockOutAttempts.attempts = foundUser.lockOutAttempts.attempts + 1;
        foundUser.save();
        return res.status(401).json({ message: 'Verification code expired.', error: "Verification code expired." , attempts: foundUser.lockOutAttempts.emailVerificationAttempts});
    } else {
        console.log("Verification code correct.")
        foundUser.lockOutAttempts.emailVerificationAttempts = 0;
        foundUser.save();
        return res.status(200).json({ message: 'Verification code verified successfully.', success: "Verification code correct." });
    }
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

function generateActivationToken(userID, username, secretKey) {
    const data = `${userID}-${username}`;
    const crypto = require('crypto');
    const token = crypto.createHmac('sha256', secretKey).update(data).digest('hex');
    return token;
}


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
    // if (!captchaValue) {
    //     console.log("No reCAPTCHA...")
    //     return res.status(400).send("reCAPTCHA error!");
    // }

    console.log("Validating reCAPTCHA...")

    const axios = require('axios');
    const verifyRecaptcha = async (recaptchaValue) => {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaValue
            }
        });
        return response.data;
    };

    const { success, score } = await verifyRecaptcha(captchaValue);
    console.log("Captcha Success: " + success)
    // if (!success) {
    //     // reCAPTCHA validation failed
    //     return res.status(400).send("reCAPTCHA verification failed");
    // }

    // Email Verification Initialization
    const crypto = require('crypto');
    const secretKey = crypto.randomBytes(64).toString('hex');
    unique_token = generateActivationToken(name, username, secretKey);
    const combinedString = `${username}${name}`
    // Convert the combined string to base64
    const base64Key = Buffer.from(combinedString).toString('base64');

    // Encrypt the unique token using the generated base64 key
    const CryptoJS = require('crypto-js');
    const encryptedToken = CryptoJS.AES.encrypt(unique_token, base64Key).toString();
    const isActive = false;

    console.log("Done validating reCAPTCHA...")
    console.log("Adding' user...")

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ username });
        const userExistsEmail = await User.findOne({ email });
        if (userExists || userExistsEmail) {
            return res.status(400).json({ message: 'Username already taken', error: 'Username already taken' });
        }
    } catch (error) {
        console.log("Error: " + error)
        return res.status(500).json({ message: 'Internal server error', error: "Internal server error" });
    }


    // Hash the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Create the new user with the roles attribute set to 'Donator'
    const newUser = new User({
        name,
        username,
        email,
        pwd: hashedPwd,
        roles,  // Hard-code the roles attribute to 'Donator'
        isActive,
        token: encryptedToken,
        tokenKey: unique_token
    });

    if (await newUser.save()) {
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            secure: true,
            requireTLS: true,
            port: 465,
            secured: true,
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        const activationURL = `https://wazpplabs.com/auth/activate/${encodeURIComponent(encryptedToken)}`;
        console.log("Activation URL: " + activationURL);
        const emailTemplate = {
            from: 'ssdsecuresoftware@gmail.com',
            to: email, // Replace with the user's email address
            subject: 'Activate Your Account',
            html: `
              <p>Dear "${name}",</p>
              <p>Click the following button to activate your account:</p>
              <a href="https://wazpplabs.com/landing-page?token=${encodeURIComponent(encryptedToken)}" style="display: inline-block; padding: 10px 20px; background-color: blue; color: white; text-decoration: none;">
                Activate Your Account
              </a>
            `
        };

        console.log("Sending email...")
        console.log("Email: " + emailTemplate.to)

        transporter.sendMail(emailTemplate, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Email Internal server error', error: "Email Internal server error" });
            } else {
                console.log('Email sent:', info.response);
            }
        });

        console.log("Email sent successfully.")
        console.log("User added successfully.")

    }
    res.status(201).json({ message: 'User registered successfully', success: 'User registered successfully' });
});

const activate = asyncHandler(async (req, res) => {
    console.log("Activating user...");

    // Extract the encryptedToken from the URL parameter and decode it
    const encryptedToken = decodeURIComponent(req.body.encryptedToken);



    console.log("Decoded Encrypted Token: " + encryptedToken);
    console.log("Finding user...");

    try {
        const user = await User.findOne({ token: encryptedToken }).select('token tokenKey username name');

        if (!user) {
            console.log("User not found.");
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log("User found: " + user.username);
        console.log("User token: " + user.token);

        // Decrypt the token
        const CryptoJS = require('crypto-js');
        const base64Key = Buffer.from(`${user.username}${user.name}`).toString('base64');
        const decryptedToken = CryptoJS.AES.decrypt(user.token, base64Key).toString(CryptoJS.enc.Utf8);

        console.log("Token key: " + user.tokenKey);
        console.log("Decrypted token: " + decryptedToken);
        if (decryptedToken !== user.tokenKey) {
            console.log("Invalid token.");
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
            // Activate the user
            // Check if the user is already activated
            if (user.isActive) {
                console.log("User is already activated.");
                return res.status(200).json({ message: 'User is already activated.' });
            }
            // Update the user's isActive attribute to true
            user.isActive = true;
            await user.save();
            if (await user.save()) {
                // Send an HTML response to the client with a hyperlink
                return res.status(200).json({ message: 'User activated successfully' });
            }
        }

        // Perform activation logic here...

        res.send('Account activated successfully');
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {
    login,
    verifyLogin,
    verifyLoginCode,
    refresh,
    logout,
    signup,
    activate
};