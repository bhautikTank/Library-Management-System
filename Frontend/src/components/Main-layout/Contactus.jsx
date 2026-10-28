import React, { useState } from 'react';
import API from '../../api/axios';
import Toast from '../common/Toast';

const Contactus = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setStatus({ loading: false, success: false, error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      return setStatus({ loading: false, success: false, error: 'Please fill in all fields' });
    }

    try {
      setStatus({ loading: true, success: false, error: '' });
      const res = await API.post('/contact', formData);
      if (res.data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <div id="contactus" className="bg-[#05051B] relative">
      {/* Upper Right Corner Notification */}
      <Toast
        message={status.success ? 'Thank you! Your message has been received by our librarian team.' : status.error}
        type={status.success ? 'success' : 'error'}
        onClose={() => setStatus((prev) => ({ ...prev, success: false, error: '' }))}
      />

      <div className="container mx-auto px-5 py-24">
        {/* Title */}
        <h1 className="text-center text-3xl md:text-5xl font-bold mb-4 text-white">
          Contact Us
        </h1>
        <p className="text-center text-gray-400 mb-12 max-w-md mx-auto text-sm">
          Have questions about memberships, book donations, or study reservations? Send us a note!
        </p>

        {/* Centered form container */}
        <div className="lg:w-1/2 md:w-2/3 mx-auto bg-[#A99AD3] rounded-2xl p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap">
              {/* First Name input */}
              <div className="p-2 w-full md:w-1/2">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#221248] rounded-xl border border-[#05051B] focus:border-[#05051B] focus:ring-2 focus:ring-[#05051B]/40 text-base outline-none text-white py-3 px-4 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Last Name input */}
              <div className="p-2 w-full md:w-1/2">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#221248] rounded-xl border border-[#05051B] focus:border-[#05051B] focus:ring-2 focus:ring-[#05051B]/40 text-base outline-none text-white py-3 px-4 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Email input */}
              <div className="p-2 w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="demo@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#221248] rounded-xl border border-[#05051B] focus:border-[#05051B] focus:ring-2 focus:ring-[#05051B]/40 text-base outline-none text-white py-3 px-4 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Message input */}
              <div className="p-2 w-full">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your message here..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#221248] rounded-xl border border-[#05051B] focus:border-[#05051B] focus:ring-2 focus:ring-[#05051B]/40 text-base outline-none text-white py-3 px-4 resize-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <div className="p-2 w-full pt-4">
                <button
                  type="submit"
                  disabled={status.loading}
                  className="flex mx-auto bg-[#05051B] text-[#A99AD3] hover:bg-black hover:text-white active:scale-95 px-10 py-3.5 rounded-xl font-bold text-lg cursor-pointer transition-all shadow-lg disabled:opacity-50"
                >
                  {status.loading ? 'Sending...' : 'Submit Message'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
