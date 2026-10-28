import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// Main Website Layout Components
import Navbar from './components/Main-layout/Navbar';
import Home from './components/Main-layout/Home';
import Aboutus from './components/Main-layout/Aboutus';
import Testimonials from './components/Main-layout/Testimonials';
import Contactus from './components/Main-layout/Contactus';
import Footer from './components/Main-layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';

// Feature Components
import Searchbooks from './components/features/Searchbooks';
import ReadingSlots from './components/features/ReadingSlots';

// Dashboard Components & Route Guard
import Student from './components/dashboards/Student';
import Admin from './components/dashboards/Admin';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  const { hash, pathname } = useLocation();

  // Scroll to section when anchor hash changes
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  // Dashboards have their own integrated sidebar, so hide the global navbar on dashboards
  const isDashboard = pathname.startsWith('/student') || pathname.startsWith('/admin');

  return (
    <div className="bg-[#05051B] min-h-screen text-white font-sans antialiased selection:bg-[#A99AD3] selection:text-[#05051B]">
      {!isDashboard && <Navbar />}

      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <Aboutus />
              <Testimonials />
              <Contactus />
              <Footer />
            </>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Feature Routes */}
        <Route path="/search" element={<Searchbooks />} />
        <Route path="/reserve-slot" element={<ReadingSlots />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Home */}
        <Route
          path="*"
          element={
            <>
              <Home />
              <Aboutus />
              <Testimonials />
              <Contactus />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
