const mongoose = require('mongoose');
const Card = require('./Card');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  pwd: {
    type: String,
    required: true
  },
  roles:
    {
      type: String,
      enum: ['Admin', 'Donator', 'Organization']
    },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card', // Reference to the Card schema
    required: false
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: false
  },
  isActive: {
    type: Boolean,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  tokenKey: {
    type: String,
    required: true
  },
  verificationCode: {
    code: {
      type: String,
      required: true
    },
    expirationTime: {
      type: Date,
      required: true
    }}
  // Additional fields can be added here
});

module.exports = mongoose.model('User', userSchema);