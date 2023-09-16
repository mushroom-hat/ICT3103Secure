// userSchema.js
const mongoose = require('mongoose');
const cardSchema = require('./cardSchema');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      enum: ['Admin', 'Donator', 'Organization'],
      default: 'User',
    },
  ],
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
  }, // Include the card schema here
});

module.exports = userSchema;
