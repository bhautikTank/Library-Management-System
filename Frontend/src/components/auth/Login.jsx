import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Toast from '../common/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email || !formData.password) {
      return setError('Please enter both email and password');
    }

    try {
      setLoading(true);
      setError('');
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#A99AD3] flex items-center justify-center px-5 py-12 relative" id="login">
      {/* Upper Right Corner Notification */}
      <Toast
        message={error}
        type="error"
        onClose={() => setError('')}
      />

      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl space-y-8">
        {/* Title */}
        <h1 className="text-center text-4xl md:text-5xl font-bold text-[#05051B] tracking-tight">
          Login to BunnyBook
        </h1>

        {/* Form Card */}
        <div className="bg-[#05051B]/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/30 p-8 md:p-10 border border-[#A99AD3]/30">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="demo@email.com"
                className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-[#755CBB]/80 font-bold text-white placeholder:text-gray-300 border border-[#A99AD3]/60 rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-[#A99AD3] focus:ring-2 focus:ring-[#A99AD3]/40 focus:bg-[#755CBB]"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-[#A99AD3] text-[#05051B] font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-[#A99AD3]/30 hover:bg-[#C4B5E6] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {/* Sign Up link */}
            <div className="text-center mt-6 text-gray-300 text-sm flex justify-center gap-2">
              <p>Don't have an account?</p>
              <Link
                to="/registration"
                className="text-[#A99AD3] font-medium hover:text-[#C4B5E6] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
