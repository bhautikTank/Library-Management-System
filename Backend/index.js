const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/borrows', require('./routes/borrowRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Backward compatibility for original /register endpoint
const { register } = require('./controllers/authController');
app.post('/register', register);

// Health check & welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'BunnyBook Library Management System API',
    status: 'Online',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      borrows: '/api/borrows',
      reservations: '/api/reservations',
      contact: '/api/contact',
      stats: '/api/stats',
    },
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Centralized Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
