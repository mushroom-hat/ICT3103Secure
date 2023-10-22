const User = require('../models/User');
const Donation = require('../models/Donation'); // Import the Donation model
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

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

//@desc Create new users
//@route POST /users
//@access Private
const createNewUsers = asyncHandler(async (req, res) => {
    const { username, pwd, roles } = req.body;

    // Confirm data
    if (!username || !pwd || !roles ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(pwd, 10); // salt rounds
    const userObject = { username, pwd: hashedPwd, roles };

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
const updateUser = asyncHandler(async (req, res) => {
    const { _id, username, pwd, roles } = req.body;

    // Check if the user exists to update based on the _id
    const user = await User.findById(_id).exec();

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
        user.card = card;
    }
    
    if (pwd) {
        // Hash password
        user.pwd = await bcrypt.hash(pwd, 10); // salt rounds
    }

    if (donation) {
        // Update donation reference
        user.donation = donation;
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});

//@desc Delete a user
//@route DELETE /users/:id
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    // Check if the user exists to delete based on the _id
    const user = await User.findById(_id).exec();

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
    const { _id, donation } = req.body;

    // Check if the user exists to add a donation based on the _id
    const user = await User.findById(_id).exec();

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
    createNewUsers,
    updateUser,
    deleteUser,
    addDonationToUser // Export the new function to add a donation
};
