import React, { useState } from 'react';
import { X, Calendar, MapPin, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/useAuth';
import Toast from '../common/Toast';

const ReadingSlots = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedZone, setSelectedZone] = useState('Zone A, Floor 1 (Quiet Sanctuary)');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const timeSlots = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'];
  const zones = [
    'Zone A, Floor 1 (Quiet Sanctuary)',
    'Zone B, Floor 2 (Silent Research Pods)',
    'Zone C, Ground (Computer & Media Lab)',
  ];

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSlot || !selectedDate) {
      setFeedback({ text: 'Please choose both a date and time slot.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await API.post('/reservations', {
        slotTime: selectedSlot,
        date: selectedDate,
        zone: selectedZone,
        seatNumber: 'Desk ' + (Math.floor(Math.random() * 30) + 1),
      });

      setFeedback({
        text: `Reading desk confirmed for ${selectedDate} at ${selectedSlot}!`,
        type: 'success',
      });

      setTimeout(() => {
        navigate('/student');
      }, 1500);
    } catch (err) {
      setFeedback({
        text: err.response?.data?.message || 'Could not complete reservation.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05051B] text-white flex flex-col relative">
      {/* Upper Right Corner Notification */}
      <Toast
        message={feedback.text}
        type={feedback.type}
        onClose={() => setFeedback({ text: '', type: '' })}
      />

      {/* Header with Close Action */}
      <div className="p-6 md:p-8 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A99AD3] rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Study Desk & Slot Reservation</h2>
            <p className="text-xs text-gray-400">Quiet, distraction-free reading environments.</p>
          </div>
        </div>
        <Link
          to={isAuthenticated ? (isAdmin ? '/admin' : '/student') : '/'}
          className="p-3 bg-[#755CBB]/10 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
        >
          <X size={22} />
        </Link>
      </div>

      {/* Main Reservation Body */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 pt-0">
        {/* Left Side: Slot & Date Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Date Picker */}
          <div>
            <label className="text-gray-400 font-bold text-xs uppercase tracking-widest block mb-2">
              Choose Date
            </label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/30 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-[#A99AD3] transition-all font-semibold [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
            />
          </div>

          {/* Zone Selector */}
          <div>
            <label className="text-gray-400 font-bold text-xs uppercase tracking-widest block mb-2">
              Select Reading Zone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {zones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    selectedZone === zone
                      ? 'border-[#A99AD3] bg-[#A99AD3]/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/[0.05]'
                  }`}
                >
                  {zone.split(' (')[0]}
                  <span className="block text-[10px] text-gray-500 font-normal mt-1">
                    {zone.includes('Quiet') ? 'Strict Silence' : 'Standard Study'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">
              Select a Time Frame
            </p>
            <div className="space-y-3">
              {timeSlots.map((time) => {
                const isSelected = selectedSlot === time;
                return (
                  <div
                    key={time}
                    onClick={() => setSelectedSlot(time)}
                    className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#A99AD3] bg-[#A99AD3]/10 shadow-lg shadow-[#A99AD3]/5'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <span
                        className={`text-3xl font-black ${
                          isSelected ? 'text-[#A99AD3]' : 'text-gray-600'
                        }`}
                      >
                        {time.split(' ')[0]}
                      </span>
                      <div>
                        <p className="font-bold text-lg text-white">{time.split(' ')[1]}</p>
                        <p className="text-gray-500 text-xs">2.5-Hour Focused Session</p>
                      </div>
                    </div>
                    <div
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-[#A99AD3] border-[#A99AD3]' : 'border-white/10'
                      }`}
                    >
                      {isSelected && <Check size={18} className="text-[#05051B] stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Confirmation */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-[#755CBB]/10 border border-[#A99AD3]/20 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden min-h-[450px]">
            <div className="relative z-10">
              <Calendar className="text-[#A99AD3] mb-4" size={36} />
              <h3 className="text-3xl font-bold mb-3 text-white">Your Session.</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Confirming your slot reserves a dedicated reading desk with high-speed Wi-Fi, power outlets, and ergonomic seating.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#A99AD3] shrink-0" />
                  <span className="font-medium text-sm text-gray-200">{selectedZone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#A99AD3] shrink-0" />
                  <span className="font-medium text-sm text-gray-200">Date: {selectedDate}</span>
                </div>

                {selectedSlot && (
                  <div className="pt-4 border-t border-[#A99AD3]/10">
                    <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Reserved Time</p>
                    <p className="text-[#A99AD3] text-4xl font-black mt-1">{selectedSlot}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 relative z-10">
              <button
                type="button"
                onClick={handleBook}
                disabled={!selectedSlot || loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all cursor-pointer ${
                  selectedSlot && !loading
                    ? 'bg-[#A99AD3] text-[#05051B] hover:bg-[#C4B5E6] hover:shadow-[0_0_30px_rgba(169,154,211,0.3)] active:scale-95'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                {loading ? 'Reserving...' : isAuthenticated ? 'CONFIRM RESERVATION' : 'SIGN IN TO RESERVE'}
              </button>
            </div>

            {/* Background Decorative Blur */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#A99AD3]/10 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingSlots;
