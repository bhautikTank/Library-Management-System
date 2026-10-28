const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservation,
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/auth');

// Reading slot reservation routes
router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.delete('/:id', protect, cancelReservation);
router.get('/all', protect, adminOnly, getAllReservations);
router.put('/:id', protect, adminOnly, updateReservation);

module.exports = router;
