const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bunnybook_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, dob } = req.body;

    if (!email || !password || (!firstName && !req.body.name)) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    // Support legacy name or firstName + lastName
    const fName = firstName || (req.body.name ? req.body.name.split(' ')[0] : 'User');
    const lName = lastName || (req.body.name ? req.body.name.split(' ').slice(1).join(' ') || ' ' : ' ');

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user (strictly student role for registration)
    const user = await User.create({
      firstName: fName,
      lastName: lName,
      email: email.toLowerCase(),
      password,
      mobile: mobile || '',
      dob: dob || '',
      role: 'student',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        dob: user.dob,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { firstName, lastName, mobile, dob, password } = req.body;

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (mobile !== undefined) user.mobile = mobile.trim();
    if (dob !== undefined) user.dob = dob.trim();

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = password;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        dob: user.dob,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all students with stats (Admin only)
// @route   GET /api/auth/students
const getAllStudents = async (req, res) => {
  try {
    const Borrow = require('../models/Borrow');
    const Reservation = require('../models/Reservation');

    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const borrowedCount = await Borrow.countDocuments({
          student: student._id,
          status: 'borrowed',
        });
        const reservationsCount = await Reservation.countDocuments({
          student: student._id,
          status: { $in: ['confirmed', 'approved', 'pending'] },
        });

        return {
          ...student.toObject(),
          name: `${student.firstName} ${student.lastName}`.trim(),
          borrowedCount,
          reservationsCount,
        };
      })
    );

    res.json({ success: true, count: studentsWithStats.length, students: studentsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, getAllStudents };
