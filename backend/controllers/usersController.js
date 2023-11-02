const User = require('../models/User');
const Donation = require('../models/Donation'); // Import the Donation model
const Card = require('../models/Card'); // Import the Card model if needed

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const Article = require('../models/Article');

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-pwd').lean();
    if (!users || users.length === 0) {npm 
        return res.status(404).json({ message: 'No users found' });
    }
    res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId).select('-pwd').lean();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
});
//@desc Get all organizations
//@route GET /users/organizations
//@access Public
const getAllOrganizations = asyncHandler(async (req, res) => {
    const organizations = await User.find({ roles: 'Organization' }).select('username').lean();
    if (!organizations || organizations.length === 0) {
        return res.status(404).json({ message: 'No organizations found' });
    }
    res.json(organizations);
});

//@desc Create new users
//@route POST /users
//@access Private
const createNewUsers = asyncHandler(async (req, res) => {
    const { name, username, email, pwd, roles, isActive } = req.body;

    console.log(req.body);
    const token = 'NA'
    const tokenKey = 'NA'

    // Confirm data
    if (!name || !username || !email || !pwd || !roles || !isActive ) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    console.log("Checking for duplicate username")
    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate user' });
    }
    
    console.log("Done checking for duplicate username")

    // Hash password
    const hashedPwd = await bcrypt.hash(pwd, 10); // salt rounds
    const userObject = { name, username, email, pwd: hashedPwd, roles, isActive, token, tokenKey };
    console.log(userObject);
    // Create and store the new user
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

//@desc Update a user
//@route PUT /users/:id
//@access Private
//@desc Update a user
//@route PUT /users/:id
//@access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, name, username, email, pwd, roles, card } = req.body; // Include 'card' in the destructuring

    // Check if the user exists to update based on the _id
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate username (except for the current user)
    if (username && username !== user.username) {
        const duplicate = await User.findOne({ username }).lean().exec();
        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate username' });
        }
    }

    // Update user fields if provided in the request body
    if (username) {
        user.username = username;
    }
    if (roles) {
        user.roles = roles;
    }
    if (card) {
        user.card = card; // Update the 'card' field
    }
    
    if (pwd) {
        // Hash password
        user.pwd = await bcrypt.hash(pwd, 10); // salt rounds
    }

    // Handle the 'donation' field if needed (similar to 'card')

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});


//@desc Delete a user
//@route DELETE /users/:id
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Check if the user exists to delete based on the _id
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check if the user has written articles (if needed)
    const articles = await Article.findOne({ user: user._id }).lean().exec();
    if (articles?.length) {
        return res.status(400).json({ message: 'User has written articles' });
    }

    const result = await user.deleteOne();
    const reply = `Username ${result.username} with ID ${result._id} deleted`;
    res.json(reply);
});

//@desc Add a donation to a user
//@route POST /users/:id/donations
//@access Private
const addDonationToUser = asyncHandler(async (req, res) => {
    const { id, donation } = req.body;

    // Check if the user exists to add a donation based on the _id
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Create a new donation
    const newDonation = new Donation({
        user: user._id,
        amount: donation.amount,
        // Add other donation details as needed
    });

    // Save the donation
    await newDonation.save();

    // Update the user's donation reference
    user.donation = newDonation._id;
    await user.save();

    res.json({ message: 'Donation added to the user' });
});

module.exports = {
    getAllUsers,
    getAllOrganizations,
    createNewUsers,
    updateUser,
    deleteUser,
    addDonationToUser, // Export the new function to add a donation]
    getUserById
};
