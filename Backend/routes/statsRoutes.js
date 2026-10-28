const express = require('express');
const router = express.Router();
const { getAdminStats, getStudentStats } = require('../controllers/statsController');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard statistics routes
router.get('/admin', protect, adminOnly, getAdminStats);
router.get('/student', protect, getStudentStats);

module.exports = router;

