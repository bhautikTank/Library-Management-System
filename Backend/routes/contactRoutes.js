const express = require('express');
const router = express.Router();
const { submitContact, getAllMessages } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

// Contact routes
router.post('/', submitContact);
router.get('/', protect, adminOnly, getAllMessages);

module.exports = router;

