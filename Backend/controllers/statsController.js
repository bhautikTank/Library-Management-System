const Book = require('../models/Book');
const User = require('../models/User');
const Borrow = require('../models/Borrow');
const Reservation = require('../models/Reservation');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/stats/admin
const getAdminStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const activeStudents = await User.countDocuments({ role: 'student' });
    const activeBorrows = await Borrow.countDocuments({ status: 'borrowed' });
    
    // Check pending/overdue returns
    const now = new Date();
    const pendingReturns = await Borrow.countDocuments({
      status: 'borrowed',
      dueDate: { $lt: now },
    });

    // Recent borrows
    const recentBorrows = await Borrow.find()
      .populate('book', 'title author')
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalBooks,
        activeStudents,
        activeBorrows,
        pendingReturns,
      },
      recentBorrows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get Student Dashboard Stats
// @route   GET /api/stats/student
const getStudentStats = async (req, res) => {
  try {
    const issuedCount = await Borrow.countDocuments({
      student: req.user.id,
      status: 'borrowed',
    });

    const activeReservationsCount = await Reservation.countDocuments({
      student: req.user.id,
      status: 'confirmed',
    });

    res.json({
      success: true,
      stats: {
        issuedCount,
        activeReservationsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAdminStats, getStudentStats };

