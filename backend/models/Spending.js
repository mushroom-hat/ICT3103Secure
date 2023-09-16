const mongoose = require('mongoose');

const spendingSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the organization
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  spendingDate: {
    type: Date,
    default: Date.now,
  },
  // Additional spending details can be added here
});

module.exports = mongoose.model('Spending', spendingSchema);
