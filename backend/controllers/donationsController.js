const Donation = require('../models/Donation');
const User = require('../models/User'); // Import the User model
const asyncHandler = require('express-async-handler');

//@desc Get all donations
//@route GET /donations
//@access Private
const getAllDonations = asyncHandler(async (req, res) => {
    const donations = await Donation.find().populate('user', 'username').lean();
    if (!donations || donations.length === 0) {
        return res.status(404).json({ message: 'No donations found' });
    }
    res.json(donations);
});
//@desc Create a new donation
//@route POST /donations
//@access Private
const createNewDonation = asyncHandler(async (req, res) => {
    // console.log("Inside createNewDonation");
    const { userId, organizationId, amount } = req.body;
    // console.log(userId);
    // console.log(organizationId);
    // console.log(amount);

    // Confirm data
    if (!userId || !organizationId || !amount  ) {
        return res.status(400).json({ message: 'User ID, amount, and donationDescription are required' });
    }

    // Check if the user exists
    const user = await User.findById(userId).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Create and store the new donation
    const donation = await Donation.create({ user: userId, organization: organizationId, amount });

    if (donation) {
        res.status(201).json({ message: 'New donation created' });
    } else {
        res.status(400).json({ message: 'Invalid donation data received' });
    }
});


//@desc Delete a donation
//@route DELETE /donations/:id
//@access Private
const deleteDonation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the donation exists
    const donation = await Donation.findById(id).exec();

    if (!donation) {
        return res.status(400).json({ message: 'Donation not found' });
    }

    const result = await donation.deleteOne();
    const reply = `Donation with ID ${result._id} deleted`;
    res.json(reply);
});

const getDonationsByOrganization = asyncHandler(async (req, res) => {
    const { organizationId } = req.body;

    // Check if the organizationId is valid (you might want to add additional validation)
    if (!organizationId) {
        return res.status(400).json({ message: 'Invalid organization ID' });
    }

    const donations = await Donation.find({ organization: organizationId })
        .lean();
        

    if (!donations || donations.length === 0) {
        return res.status(404).json({ message: 'No donations found for this organization' });
    }
    
    res.json(donations);
});

module.exports = {
    getAllDonations,
    getDonationsByOrganization,
    createNewDonation,
    deleteDonation
};
