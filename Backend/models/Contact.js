const mongoose = require('mongoose');

// Contact Message Schema
const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter your first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contact', contactSchema);

