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
                secret: '6Lc-y9AoAAAAAJYVWnolS1nHHMVhuRc870G1MvNp',
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
    const secretKey = "aa53acbe9ef36849b2172ba54b021cb7fad26cf582b1f25913b409db8f4277f911f4519c0ee31fad6307fb95a0ed97efa7216cff0cd846da94dce69a6a3d1a8a34cc90f5cddcd9f93de9e823a1b8c2c0331050d61d6fd04dfae972495a146b34c37d8edb3adf61225fffc0492eb856e4640865b9c747ce605a27658f4a78da9282745c5f6cd94a080b91692ca8d137a91fe7ad4962f60a53a056e358b4f548e2a23049372d925093d299c5ed9a44fe6511dce053910f03f60caa0cb5146e85cc6bf883f9f289a64891556885675732fb641b289eaa492de59190c82cec4b57451961d3d21bb25b0268a748409a7f306c6a299ac82542666fd4ce278c77212ec1be094bf4865517dba5fdecea41ef58b40ac32d7f91adfe236f50402e03c6c6537adb1b4e55e96a7d8b595c0fbdc455b58d4314dd00cd4d61e774bcc30fb74c0f"
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
        roles,  // Hard-code the roles attribute to 'Donator'
        isActive,
        token: encryptedToken,
        tokenKey: unique_token
    });

    if (await newUser.save()) {
        const nodemailer = require('nodemailer');


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ssdsecuresoftware@gmail.com',
                pass: 'xtyr bfet oftx jxtc'
            }
        });
        const activationURL = `wazpplabs.com/auth/activate/${encodeURIComponent(encryptedToken)}`;
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
            } else {
                console.log('Email sent:', info.response);
            }
        });

        console.log("Email sent successfully.")
        console.log("User added successfully.")

    }



    res.status(201).json({ message: 'User registered successfully' });
});

const activate = asyncHandler(async (req, res) => {
    console.log("Activating user...");

    // Extract the encryptedToken from the URL parameter and decode it
    const encryptedToken = decodeURIComponent(req.params.encryptedToken);



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
    refresh,
    logout,
    signup,
    activate
};
