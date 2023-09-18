const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    alias: '_id', // Rename _id to userId
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
  roles:
    {
      type: String,
      enum: ['Admin', 'Donator', 'Organization'],
    },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card', // Reference to the Card schema
  },
  // Additional fields can be added here
});

module.exports = mongoose.model('User', userSchema);
