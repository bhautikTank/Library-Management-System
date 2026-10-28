import React, { useState } from 'react';
import Logo from '../../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="w-full bg-[#05051B] border-b border-[#A99AD3]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo section */}
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <img
            src={Logo}
            alt="BunnyBook Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-[#A99AD3] text-xl font-bold tracking-tight">
            Bunny Book
          </span>
        </Link>

        {/* Desktop Menu section */}
        <ul className="hidden md:flex items-center space-x-6 text-[#A99AD3] font-semibold text-sm">
          <li className="hover:text-white transition">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-white transition">
            <Link to="/search">Browse Books</Link>
          </li>
          <li className="hover:text-white transition">
            <Link to="/reserve-slot">Reserve Desk</Link>
          </li>
          <li className="hover:text-white transition">
            <Link to="/#about">About</Link>
          </li>
          <li className="hover:text-white transition">
            <Link to="/#testimonials">Testimonials</Link>
          </li>
          <li className="hover:text-white transition">
            <Link to="/#contactus">Contact</Link>
          </li>
        </ul>

        {/* Desktop Auth / Profile section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={isAdmin ? '/admin' : '/student'}
                className="px-4 py-2 bg-[#755CBB]/20 border border-[#A99AD3]/40 text-white rounded-lg hover:bg-[#755CBB]/40 transition text-sm font-semibold flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span>{user.firstName || 'Dashboard'}</span>
                <span className="text-[10px] uppercase tracking-wider bg-[#A99AD3] text-[#05051B] px-1.5 py-0.5 rounded font-bold">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="px-5 py-2 bg-[#A99AD3] text-[#05051B] active:scale-95 font-bold rounded-lg hover:bg-[#C4B5E6] transition cursor-pointer text-sm shadow-md">
                Login / Sign Up
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon section */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#A99AD3] text-2xl cursor-pointer border border-[#A99AD3]/40 px-2 py-0.5 rounded-lg hover:bg-[#755CBB]/20"
            aria-label="Toggle navigation menu"
          >
            &#8801;
          </button>
        </div>
      </div>

      {/* Mobile Dropdown section */}
      {isOpen && (
        <div className="md:hidden bg-[#05051B] border-t border-[#A99AD3]/10 px-4 pb-6 pt-3 space-y-3">
          <ul className="flex flex-col space-y-3 text-[#A99AD3] font-semibold text-sm">
            <li className="hover:text-white transition" onClick={() => setIsOpen(false)}>
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-white transition" onClick={() => setIsOpen(false)}>
              <Link to="/search">Browse Books</Link>
            </li>
            <li className="hover:text-white transition" onClick={() => setIsOpen(false)}>
              <Link to="/reserve-slot">Reserve Desk</Link>
            </li>
            <li className="hover:text-white transition" onClick={() => setIsOpen(false)}>
              <Link to="/#about">About</Link>
            </li>
            <li className="hover:text-white transition" onClick={() => setIsOpen(false)}>
              <Link to="/#testimonials">Testimonials</Link>
            </li>
            <li className="hover:text-white transition" onClick={() => setIsOpen(false)}>
              <Link to="/#contactus">Contact</Link>
            </li>
          </ul>

          <div className="pt-3 border-t border-[#A99AD3]/20">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={isAdmin ? '/admin' : '/student'}
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-2 bg-[#755CBB]/30 text-white font-semibold rounded-lg text-sm"
                >
                  Go to {isAdmin ? 'Admin' : 'Student'} Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="cursor-pointer w-full mt-2 px-4 py-2.5 active:scale-95 bg-[#A99AD3] text-[#05051B] font-bold rounded-lg hover:bg-[#C4B5E6] transition text-sm">
                  Login / Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
