# 📚 BunnyBook — Library Management System

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-purple.svg)](LICENSE)

**BunnyBook** is a modern, production-grade Library Management System designed with an elegant dark theme, signature lavender accents, intuitive user experience, and a robust RESTful API backend.

---

## 🌟 Key Highlights & Philosophy

- **Simplicity First**: Code is straightforward, well-organized, and self-documenting. No bloated abstractions or confusing boilerplate.
- **Aesthetic Identity**: Signature color palette featuring deep void (`#05051B`), rich indigo (`#221248`), electric purple (`#755CBB`), and soft lilac (`#A99AD3`).
- **Complete End-to-End Workflow**: Everything from user registration and book catalog search to seat reservation and librarian circulation tracking works seamlessly.
- **Production-Ready**: Role-based access control (Admin & Student), JWT authentication, bcrypt password hashing, MongoDB database with indexes, and responsive client-side routing.

---

## 🚀 Features

### 1. 🔐 Authentication & Role-Based Access Control
- **Dual Role System**: Separate capabilities for **Students** and **Librarians/Admins**.
- **Secure Credentials**: Passwords salted and hashed with `bcryptjs`, authenticated via JWT bearer tokens.
- **Student Registration**: Clean, focused registration specifically designed for library students.
- **Route Guards**: Protected routes (`/student`, `/admin`) preventing unauthorized access.
- **Interactive Profile Card**: Clickable user profile card at the bottom corner of the sidebar allowing both Admins and Students to view and edit their profile details (First Name, Last Name, Phone, Date of Birth, and Password) on the fly with instant upper-right toast notifications.

### 2. 📖 Library Catalog & Live Search
- **Instant Search**: Search books by **Title**, **Author**, or **ISBN**.
- **Category Filtering**: Quickly filter across *Computer Science*, *Literature*, *Science*, *Business*, and *Self-Help*.
- **Real-Time Stock Tracking**: Visual badges indicating `IN STOCK` (with live copy count) vs `OUT OF STOCK`.
- **One-Click Borrowing**: Students can instantly borrow available books with automated 14-day loan duration.

### 3. 🪑 Reading Desk & Slot Reservation
- **Sanctuary Booking**: Reserve quiet study desks in designated zones (*Zone A Quiet Sanctuary*, *Zone B Silent Pods*, *Zone C Media Lab*).
- **Time Slots**: 2.5-hour focused sessions (`09:00 AM`, `12:00 PM`, `03:00 PM`, `06:00 PM`).
- **Date Selection**: Book upcoming dates with immediate confirmation and desk assignment.
- **Cancel Anytime**: Cancel active reservations directly from the student dashboard.

### 4. 📊 Admin & Librarian Portal (`/admin`)
- **Real-Time Analytics**:
  - Total books in inventory
  - Total registered students
  - Active book circulation count
  - Overdue return alerts
- **Inventory Management**: Add new books with ISBN, category, copies, and rack number; remove old books with 1 click.
- **Circulation Control**: Live ledger of all borrowed books, borrower details, due dates, and instant "Mark Returned" status update.

### 5. 🎓 Student Dashboard (`/student`)
- **Personalized Overview**: Active loans count, study desk reservations, and total borrowing history.
- **Active Loans Table**: Track due dates, view book details, and return books anytime.
- **Upcoming Desk Bookings**: View reserved study slots and manage cancellations.

### 6. 💬 Landing Page & Contact System
- **Hero & Mission**: Animated welcome screen with quick links to explore books or reserve desks.
- **Interactive Testimonials**: Community feedback carousel.
- **Contact Inquiries**: Fully working contact form saving inquiries directly to the database.

---

## 🏗️ Project Architecture & Structure

```
BunnyBook/
├── .agents/
│   └── rules/
│       └── user_style.md            # Preserved developer coding style & personality
├── GEMINI.md                        # Workspace rules & coding conventions
├── README.md                        # Project documentation
│
├── Backend/                         # Node.js + Express + MongoDB REST API
│   ├── config/
│   │   └── db.js                    # Database connection with graceful error handling
│   ├── controllers/
│   │   ├── authController.js        # User registration, login, and profile
│   │   ├── bookController.js        # CRUD operations for library books
│   │   ├── borrowController.js      # Book issue, return, and fine tracking
│   │   ├── contactController.js     # Contact inquiries handling
│   │   ├── reservationController.js # Study desk slot bookings
│   │   └── statsController.js       # Dashboard metric aggregates
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & adminOnly guard
│   ├── models/
│   │   ├── Book.js                  # Book schema
│   │   ├── Borrow.js                # Circulation record schema
│   │   ├── Contact.js               # Contact form message schema
│   │   ├── Reservation.js           # Reading desk reservation schema
│   │   └── User.js                  # User schema with bcrypt hooks
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── reservationRoutes.js
│   │   └── statsRoutes.js
│   ├── seeds/
│   │   └── seed.js                  # Database seeder with sample books & demo accounts
│   ├── .env                         # Server environment configuration
│   ├── .env.example                 # Example environment template
│   ├── index.js                     # Server entry point
│   └── package.json
│
└── Frontend/                        # React 19 + Vite + Tailwind CSS v4 Client
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js             # Configured Axios client with JWT auto-injection
    │   ├── assets/                  # Logos, icons, and hero photography
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx        # Login page with demo fills
    │   │   │   └── Registration.jsx # Sign up page with role selection
    │   │   ├── common/
    │   │   │   └── ProtectedRoute.jsx # Client-side route authentication guard
    │   │   ├── dashboards/
    │   │   │   ├── Admin.jsx        # Librarian portal with live stats & book management
    │   │   │   ├── Sidebar.jsx      # Navigation sidebar for portals
    │   │   │   └── Student.jsx      # Student dashboard with loans & returns
    │   │   ├── features/
    │   │   │   ├── ReadingSlots.jsx # Desk reservation interface
    │   │   │   └── Searchbooks.jsx  # Live searchable book catalog
    │   │   └── Main-layout/
    │   │       ├── AboutSection.jsx
    │   │       ├── Aboutus.jsx
    │   │       ├── Contactus.jsx
    │   │       ├── Footer.jsx
    │   │       ├── Home.jsx
    │   │       ├── Navbar.jsx
    │   │       ├── Testimonials.jsx
    │   │       └── TestimonialsSection.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx      # Authentication provider
    │   │   ├── authContextInstance.js # React Context instance
    │   │   └── useAuth.js           # Custom authentication hook
    │   ├── App.jsx                  # Main routing configuration
    │   ├── main.jsx                 # Client entry point with AuthProvider
    │   └── index.css                # Tailwind CSS v4 directives & smooth scroll
    ├── package.json
    └── vite.config.js
```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new student account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Get current authenticated user profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile (name, mobile, DOB, password) |
| `GET` | `/api/auth/students` | Admin | Get list of all registered students with stats |

### 📚 Books Catalog (`/api/books`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Public | List books with `?search=` and `?category=` filter |
| `GET` | `/api/books/:id` | Public | Get single book details |
| `POST` | `/api/books` | Admin | Add a new book to the library |
| `PUT` | `/api/books/:id` | Admin | Update book information |
| `DELETE` | `/api/books/:id` | Admin | Remove a book from inventory |

### 🔄 Circulation & Borrows (`/api/borrows`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/borrows/issue` | Protected | Borrow a book (checks stock, sets 14-day due date) |
| `POST` | `/api/borrows/return/:id` | Protected | Return borrowed book (updates stock, calculates fine) |
| `GET` | `/api/borrows/my-books` | Student | Get books currently borrowed by logged-in student |
| `GET` | `/api/borrows/all` | Admin | View all circulation records |

### 🪑 Desk Reservations (`/api/reservations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reservations` | Protected | Reserve reading slot & desk |
| `GET` | `/api/reservations/my` | Student | View student's upcoming reservations |
| `DELETE` | `/api/reservations/:id` | Protected | Cancel a reservation |
| `GET` | `/api/reservations/all` | Admin | View all seat bookings |

### 📊 Dashboard Stats (`/api/stats`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats/admin` | Admin | Total books, active students, loans, overdue |
| `GET` | `/api/stats/student` | Student | Personal loan count & active reservations |

### ✉️ Contact Inquiries (`/api/contact`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Public | Submit contact form inquiry |
| `GET` | `/api/contact` | Admin | View contact inquiries |

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection URI)

---

### 1. Backend Setup

1. Open your terminal and navigate to `Backend`:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (a default `.env` is already created):
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/bunnybook
   JWT_SECRET=bunnybook_super_secret_jwt_key_2026
   CLIENT_URL=http://localhost:5173
   ```
4. **Seed the Database** with sample books and demo accounts:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   > Server runs at `http://localhost:5001`

---

### 2. Frontend Setup

1. In a new terminal tab, navigate to `Frontend`:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > Client will run at `http://localhost:5173`

---

## 🔑 Pre-Configured Demo Accounts

After running `npm run seed`, you can immediately test all features using:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Librarian / Admin** | `admin@bunnybook.com` | `admin123` |
| **Student** | `student@bunnybook.com` | `student123` |

*(Admins are pre-stored in the database; new registrations are strictly for Students).*

---

## 🎨 Color Palette Reference

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Void Dark** | `#05051B` | Primary page & canvas background |
| **Indigo Container** | `#221248` | Cards, hero containers, and section blocks |
| **Electric Purple** | `#755CBB` | Interactive borders, accents, and badge badges |
| **Soft Lilac / Lavender** | `#A99AD3` | Buttons, highlighted titles, icons, and focus rings |
| **Light Lavender** | `#C4B5E6` | Hover states and interactive micro-interactions |
| **Lilac Text** | `#D0BCFC` | Display headlines and hero typography |

---

## 📦 Production Build

To generate an optimized production bundle:

```bash
# In Frontend/
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).

