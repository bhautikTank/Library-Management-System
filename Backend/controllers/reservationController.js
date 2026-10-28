const Reservation = require('../models/Reservation');

// @desc    Reserve a reading slot / desk
// @route   POST /api/reservations
const createReservation = async (req, res) => {
  try {
    const { slotTime, date, zone, seatNumber } = req.body;

    if (!slotTime || !date) {
      return res.status(400).json({ success: false, message: 'Slot time and date are required' });
    }

    // Check if user already booked this exact slot on this date
    const existing = await Reservation.findOne({
      student: req.user.id,
      date,
      slotTime,
      status: { $in: ['confirmed', 'approved', 'pending'] },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active reservation for this time slot on this date' });
    }

    const reservation = await Reservation.create({
      student: req.user.id,
      slotTime,
      date,
      zone: zone || 'Zone A, Floor 1 (Quiet Sanctuary)',
      seatNumber: seatNumber || 'Desk ' + (Math.floor(Math.random() * 30) + 1),
      status: 'pending', // Starts as pending for admin approval/confirmation
    });

    res.status(201).json({
      success: true,
      message: 'Reading desk reservation submitted! Awaiting confirmation ticket.',
      reservation,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's reservations
// @route   GET /api/reservations/my
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ student: req.user.id })
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reservations.length, reservations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Cancel a reservation
// @route   DELETE /api/reservations/:id
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (req.user.role !== 'admin' && reservation.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ success: true, message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations/all
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('student', 'firstName lastName email mobile')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reservations.length, reservations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update reservation status / resolve conflict (Admin only)
// @route   PUT /api/reservations/:id
const updateReservation = async (req, res) => {
  try {
    const { status, seatNumber, zone } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (status) reservation.status = status;
    if (seatNumber) reservation.seatNumber = seatNumber;
    if (zone) reservation.zone = zone;

    await reservation.save();

    const populated = await Reservation.findById(reservation._id).populate('student', 'firstName lastName email mobile');

    res.json({
      success: true,
      message: `Reservation status updated to ${reservation.status}!`,
      reservation: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservation,
};
