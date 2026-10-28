const mongoose = require('mongoose');

// Book Schema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please enter author name'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'Please enter ISBN'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please enter category/genre'],
      trim: true,
      default: 'General',
    },
    description: {
      type: String,
      default: '',
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    rackNumber: {
      type: String,
      default: 'A-1',
    },
    coverImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);

