const Book = require('../models/Book');

// @desc    Get all books with optional search & filter
// @route   GET /api/books
const getAllBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: books.length, books });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add a new book (Admin only)
// @route   POST /api/books
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, description, totalCopies, rackNumber, coverImage } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({ success: false, message: 'Title, author, and ISBN are required' });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    const copies = Number(totalCopies) || 1;

    const book = await Book.create({
      title,
      author,
      isbn,
      category: category || 'General',
      description: description || '',
      totalCopies: copies,
      availableCopies: copies,
      rackNumber: rackNumber || 'A-1',
      coverImage: coverImage || '',
    });

    res.status(201).json({ success: true, message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update book details (Admin only)
// @route   PUT /api/books/:id
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // If totalCopies is changed, automatically adjust availableCopies
    if (req.body.totalCopies !== undefined) {
      const diff = Number(req.body.totalCopies) - book.totalCopies;
      req.body.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a book (Admin only)
// @route   DELETE /api/books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ success: true, message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};

