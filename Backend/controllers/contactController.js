const Contact = require('../models/Contact');

// @desc    Submit a contact inquiry
// @route   POST /api/contact
const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all contact inquiries (Admin only)
// @route   GET /api/contact
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { submitContact, getAllMessages };

