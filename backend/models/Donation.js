const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the donor
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  // Additional donation details can be added here
});

module.exports = mongoose.model('Donation', donationSchema);
