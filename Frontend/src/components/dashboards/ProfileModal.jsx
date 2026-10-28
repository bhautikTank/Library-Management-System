import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Lock, Shield, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const ProfileModal = ({ isOpen, onClose, onNotify }) => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    dob: user?.dob || '',
    password: '',
    confirmPassword: '',
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      onNotify('First name and last name are required', 'error');
      return;
    }

    if (showPasswordChange && formData.password) {
      if (formData.password.length < 6) {
        onNotify('New password must be at least 6 characters long', 'error');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        onNotify('Passwords do not match', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobile: formData.mobile.trim(),
        dob: formData.dob,
      };

      if (showPasswordChange && formData.password) {
        payload.password = formData.password;
      }

      const res = await updateProfile(payload);
      if (res?.success) {
        onNotify('Profile updated successfully!', 'success');
        onClose();
      } else {
        onNotify(res?.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      onNotify(err.response?.data?.message || err.message || 'Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user.firstName ? user.firstName[0].toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#05051B] border border-[#A99AD3]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Profile Banner */}
        <div className="relative bg-gradient-to-r from-[#221248] via-[#755CBB]/40 to-[#05051B] p-6 pb-5 border-b border-[#A99AD3]/20">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#755CBB]/40 border-2 border-[#A99AD3] flex items-center justify-center text-2xl font-black text-[#A99AD3] shadow-lg shadow-[#755CBB]/30 shrink-0">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    user.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                <Mail size={13} className="text-[#A99AD3]" /> {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-[#A99AD3]" /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-[#221248]/40 border border-[#A99AD3]/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#A99AD3] transition"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-[#A99AD3]" /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-[#221248]/40 border border-[#A99AD3]/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#A99AD3] transition"
                placeholder="Last Name"
              />
            </div>
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-[#A99AD3]" /> Registered Email
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wide">Cannot be changed</span>
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-[#221248]/20 border border-[#A99AD3]/10 rounded-xl px-3.5 py-2.5 text-gray-400 text-sm cursor-not-allowed"
            />
          </div>

          {/* Mobile & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Phone size={13} className="text-[#A99AD3]" /> Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-[#221248]/40 border border-[#A99AD3]/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#A99AD3] transition"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#A99AD3]" /> Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-[#221248]/40 border border-[#A99AD3]/30 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#A99AD3] transition [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Password Security Toggle Section */}
          <div className="pt-2 border-t border-[#A99AD3]/10">
            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="flex items-center gap-2 text-xs font-semibold text-[#A99AD3] hover:text-white transition py-1 cursor-pointer"
            >
              <Lock size={13} />
              <span>{showPasswordChange ? 'Cancel Password Change' : 'Change Password?'}</span>
            </button>

            {showPasswordChange && (
              <div className="mt-3 p-4 bg-[#221248]/30 border border-[#A99AD3]/20 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-1">
                  <Shield size={13} />
                  <span>Leave blank if you do not want to change your password</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#05051B] border border-[#A99AD3]/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#A99AD3] transition"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#05051B] border border-[#A99AD3]/30 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#A99AD3] transition"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent font-medium text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#755CBB] hover:bg-[#A99AD3] text-[#05051B] font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#755CBB]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
