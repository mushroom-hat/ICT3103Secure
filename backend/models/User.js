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
    required: false,
    default: null
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: false
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false
  },
  token: {
    type: String,
    required: true,
    default: "NaN"
  },
  tokenKey: {
    type: String,
    required: true,
    default: "NaN"
  },
  verificationCode: {
    code: {
      type: String,
      required: true,
      default: "000000"
    },
    expirationTime: {
      type: Date,
      required: true,
      default: Date.now()
    }},
    lockOutAttempts: {
      passwordAttempts: {
        type: Number,
        required: true,
        default: 0
      },
      emailVerificationAttempts: {
        type: Number,
        required: true,
        default: 0
      }}
  // Additional fields can be added here
});

module.exports = mongoose.model('User', userSchema);