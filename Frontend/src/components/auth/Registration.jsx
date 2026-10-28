import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Toast from '../common/Toast';

const Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return setError('Please fill in all required fields');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      setError('');
      await register({
        ...formData,
        role: 'student',
      });
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#A99AD3] flex items-center justify-center px-5 py-12 relative" id="register">
      {/* Upper Right Corner Notification */}
      <Toast
        message={error}
        type="error"
        onClose={() => setError('')}
      />

      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#05051B] tracking-tight">
            Create Student Account
          </h1>
          <p className="text-[#05051B]/80 font-medium text-sm">
            Join BunnyBook to borrow books and reserve quiet study desks
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#05051B]/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/30 p-8 md:p-10 border border-[#A99AD3]/30">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name + Last Name row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                  className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
                />
              </div>

              <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                  className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
                />
              </div>
            </div>

            {/* Mobile + DOB row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
                />
              </div>

              <div>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  placeholder="Date Of Birth"
                  value={formData.dob}
                  onChange={handleChange}
                  autoComplete="bday"
                  className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB] [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
              />
            </div>

            {/* Create Password */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create Password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
              />
            </div>

            {/* Re-enter Password */}
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-[#A99AD3] text-[#05051B] font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-[#A99AD3]/30 hover:bg-[#C4B5E6] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating Student Account...' : 'Register as Student'}
              </button>
            </div>

            {/* Sign In link */}
            <div className="text-center mt-6 text-gray-300 text-sm flex justify-center gap-2">
              <p>Already have an account?</p>
              <Link
                to="/login"
                className="text-[#A99AD3] font-medium hover:text-[#C4B5E6] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
