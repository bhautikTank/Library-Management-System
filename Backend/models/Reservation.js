const mongoose = require('mongoose');

// Reading Slot / Seat Reservation Schema
const reservationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      default: 'Zone A, Floor 1',
    },
    seatNumber: {
      type: String,
      default: 'North Wing Desk',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'approved', 'denied', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);

