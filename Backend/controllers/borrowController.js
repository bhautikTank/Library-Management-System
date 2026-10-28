const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// @desc    Issue / Borrow a book
// @route   POST /api/borrows/issue
const issueBook = async (req, res) => {
  try {
    const { bookId, studentId, days = 14 } = req.body;
    const targetStudentId = studentId || req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'Sorry, no copies currently available to borrow' });
    }

    // Check if user already borrowed this book and hasn't returned it yet
    const alreadyBorrowed = await Borrow.findOne({
      book: bookId,
      student: targetStudentId,
      status: 'borrowed',
    });

    if (alreadyBorrowed) {
      return res.status(400).json({ success: false, message: 'You already have an active borrow for this book' });
    }

    // Set due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(days));

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // Create borrow record
    const borrow = await Borrow.create({
      book: bookId,
      student: targetStudentId,
      dueDate,
      status: 'borrowed',
    });

    const populatedBorrow = await Borrow.findById(borrow._id).populate('book').populate('student', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      borrow: populatedBorrow,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Return a borrowed book
// @route   POST /api/borrows/return/:id
const returnBook = async (req, res) => {
  try {
    const borrowId = req.params.id;
    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book has already been returned' });
    }

    // Ensure only the borrower or an admin can return
    if (req.user.role !== 'admin' && borrow.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to return this book' });
    }

    // Restore available copy
    const book = await Book.findById(borrow.book);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      await book.save();
    }

    // Check overdue and calculate fine (e.g. $1 per day overdue)
    const returnDate = new Date();
    let fine = 0;
    if (returnDate > borrow.dueDate) {
      const diffTime = Math.abs(returnDate - borrow.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 1;
    }

    borrow.status = 'returned';
    borrow.returnDate = returnDate;
    borrow.fine = fine;
    await borrow.save();

    res.json({
      success: true,
      message: fine > 0 ? `Book returned. Overdue fine: $${fine}` : 'Book returned successfully',
      borrow,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user's borrowed books
// @route   GET /api/borrows/my-books
const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ student: req.user.id })
      .populate('book')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: borrows.length, borrows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all borrow records (Admin)
// @route   GET /api/borrows/all
const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate('book')
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: borrows.length, borrows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
};

