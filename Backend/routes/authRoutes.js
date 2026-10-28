const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getAllStudents } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/students', protect, adminOnly, getAllStudents);

module.exports = router;
