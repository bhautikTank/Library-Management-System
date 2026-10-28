const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
} = require('../controllers/borrowController');
const { protect, adminOnly } = require('../middleware/auth');

// Borrow & return routes
router.post('/issue', protect, issueBook);
router.post('/return/:id', protect, returnBook);
router.get('/my-books', protect, getMyBorrows);
router.get('/all', protect, adminOnly, getAllBorrows);

module.exports = router;

