const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const Reservation = require('../models/Reservation');

const sampleBooks = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    description: 'A handbook of agile software craftsmanship with best practices for writing readable, maintainable code.',
    totalCopies: 5,
    availableCopies: 4,
    rackNumber: 'CS-101',
  },
  {
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'David Thomas & Andrew Hunt',
    isbn: '978-0135957059',
    category: 'Computer Science',
    description: 'Timeless advice on modern software engineering, architecture, and coding philosophies.',
    totalCopies: 4,
    availableCopies: 4,
    rackNumber: 'CS-102',
  },
  {
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Computer Science',
    description: 'Comprehensive textbook covering modern algorithms, graph theory, dynamic programming, and complexity.',
    totalCopies: 6,
    availableCopies: 5,
    rackNumber: 'CS-201',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    category: 'Literature',
    description: 'A classic portrayal of the Roaring Twenties, exploring themes of decadence, idealism, and social upheaval.',
    totalCopies: 3,
    availableCopies: 2,
    rackNumber: 'LIT-12',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0060935467',
    category: 'Literature',
    description: 'Pulitzer Prize-winning masterpiece addressing justice, empathy, and racial inequality in the American South.',
    totalCopies: 4,
    availableCopies: 4,
    rackNumber: 'LIT-14',
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '978-0553380163',
    category: 'Science',
    description: 'Explores cosmology, the Big Bang, black holes, and the mysteries of the universe in accessible language.',
    totalCopies: 3,
    availableCopies: 3,
    rackNumber: 'SCI-05',
  },
  {
    title: 'Zero to One: Notes on Startups',
    author: 'Peter Thiel',
    isbn: '978-0804139298',
    category: 'Business',
    description: 'Insights into building innovative companies that create brand new things instead of copying what already exists.',
    totalCopies: 5,
    availableCopies: 5,
    rackNumber: 'BIZ-30',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    category: 'Self-Help',
    description: 'An easy, proven framework for improving every day through tiny changes and remarkable results.',
    totalCopies: 6,
    availableCopies: 6,
    rackNumber: 'SH-01',
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bunnybook';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Book.deleteMany();
    await Borrow.deleteMany();
    await Reservation.deleteMany();

    console.log('Cleared existing data.');

    // Create Admin User
    const admin = await User.create({
      firstName: 'Library',
      lastName: 'Admin',
      email: 'admin@bunnybook.com',
      password: 'admin123', // Will be hashed by pre-save hook
      mobile: '+1 555-0199',
      dob: '1990-01-01',
      role: 'admin',
    });

    // Create Student User
    const student = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'student@bunnybook.com',
      password: 'student123', // Will be hashed by pre-save hook
      mobile: '+1 555-0144',
      dob: '2002-05-15',
      role: 'student',
    });

    console.log('Created default users:');
    console.log('  Admin:   admin@bunnybook.com   / admin123');
    console.log('  Student: student@bunnybook.com / student123');

    // Insert Books
    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`Inserted ${createdBooks.length} sample books.`);

    // Create a sample active borrow
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    await Borrow.create({
      book: createdBooks[0]._id,
      student: student._id,
      dueDate,
      status: 'borrowed',
    });

    // Create a sample seat reservation
    await Reservation.create({
      student: student._id,
      slotTime: '09:00 AM',
      date: new Date().toISOString().split('T')[0],
      zone: 'Zone A, Floor 1',
      seatNumber: 'Desk-04',
      status: 'confirmed',
    });

    console.log('Created sample borrow and reading slot reservation.');
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();

