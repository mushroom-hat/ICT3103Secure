const Spending = require('../models/Spending');
const User = require('../models/User'); // Import the User model
const asyncHandler = require('express-async-handler');

//@desc Get all spending records
//@route GET /spending
//@access Public
const getAllSpending = asyncHandler(async (req, res) => {
    const spending = await Spending.find().populate('organization', 'username').lean();
    if (!spending || spending.length === 0) {
        return res.status(404).json({ message: 'No spending records found' });
    }
    res.json(spending);
});

//@desc Create a new spending record
//@route POST /spending
//@access Private
const createNewSpending = asyncHandler(async (req, res) => {
    const { organization, amount } = req.body;

    // Confirm data
    if (!organization || !amount) {
        return res.status(400).json({ message: 'Organization and amount are required' });
    }

    // Check if the organization (user) exists
    const user = await User.findById(organization).exec();

    if (!user) {
        return res.status(400).json({ message: 'Organization not found' });
    }

    // Create and store the new spending record
    const spendingRecord = await Spending.create({ organization, amount });

    if (spendingRecord) {
        res.status(201).json({ message: 'New spending record created' });
    } else {
        res.status(400).json({ message: 'Invalid spending data received' });
    }
});

//@desc Delete a spending record
//@route DELETE /spending/:id
//@access Private
const deleteSpending = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    // Check if the spending record exists
    const spendingRecord = await Spending.findById(_id).exec();

    if (!spendingRecord) {
        return res.status(400).json({ message: 'Spending record not found' });
    }

    const result = await spendingRecord.deleteOne();
    const reply = `Spending record with ID ${result._id} deleted`;
    res.json(reply);
});

module.exports = {
    getAllSpending,
    createNewSpending,
    deleteSpending,
};
