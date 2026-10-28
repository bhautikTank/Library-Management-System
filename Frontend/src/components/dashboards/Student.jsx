import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import API from '../../api/axios';
import { useAuth } from '../../context/useAuth';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  RotateCcw,
  Ticket,
  QrCode,
  Printer,
  XCircle,
  AlertCircle,
  MapPin,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Toast from '../common/Toast';

const Student = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [borrows, setBorrows] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [borrowsRes, reservationsRes] = await Promise.all([
          API.get('/borrows/my-books'),
          API.get('/reservations/my'),
        ]);

        if (isMounted) {
          setBorrows(borrowsRes.data.borrows || []);
          setReservations(reservationsRes.data.reservations || []);
        }
      } catch (error) {
        console.error('Failed to load student data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleReturnBook = async (borrowId) => {
    try {
      const res = await API.post(`/borrows/return/${borrowId}`);
      setFeedback({ text: res.data.message || 'Book returned successfully!', type: 'success' });
      setRefreshKey((k) => k + 1);
    } catch (error) {
      setFeedback({
        text: error.response?.data?.message || 'Failed to return book',
        type: 'error',
      });
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await API.delete(`/reservations/${reservationId}`);
      setFeedback({ text: 'Reservation cancelled successfully', type: 'success' });
      setRefreshKey((k) => k + 1);
    } catch {
      setFeedback({ text: 'Failed to cancel reservation', type: 'error' });
    }
  };

  const activeBorrows = borrows.filter((b) => b.status === 'borrowed');
  const activeReservations = reservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'approved' || r.status === 'pending'
  );

  return (
    <div className="flex bg-[#05051B] min-h-screen text-white relative">
      {/* Upper Right Corner Notification */}
      <Toast
        message={feedback.text}
        type={feedback.type}
        onClose={() => setFeedback({ text: '', type: '' })}
      />

      {/* Student Sidebar with Active Tab sync */}
      <Sidebar role="student" activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#A99AD3]/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {activeTab === 'dashboard'
                ? `Welcome Back, ${user?.firstName || 'Student'}!`
                : 'My Reading Desk Tickets'}
            </h1>
            <p className="text-gray-400 mt-1">
              {activeTab === 'dashboard'
                ? 'Track your borrowed books, due dates, and study desk reservations.'
                : 'View your official study desk entry passes, seat numbers, and live approval status.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch buttons */}
            <div className="flex bg-[#755CBB]/20 p-1 rounded-xl border border-[#A99AD3]/20">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#A99AD3] text-[#05051B] shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'tickets'
                    ? 'bg-[#A99AD3] text-[#05051B] shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Ticket size={14} /> My Tickets ({reservations.length})
              </button>
            </div>

            <Link
              to="/reserve-slot"
              className="bg-[#A99AD3] text-[#05051B] font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#C4B5E6] transition active:scale-95 shadow-md hidden sm:inline-block"
            >
              Book Desk
            </Link>
          </div>
        </header>

        {/* ---------------- TAB 1: STUDENT DASHBOARD OVERVIEW ---------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#755CBB]/10 border border-[#A99AD3]/20 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Books Currently Borrowed</p>
                  <p className="text-3xl font-extrabold text-[#A99AD3] mt-2">{activeBorrows.length}</p>
                </div>
                <div className="p-4 bg-[#755CBB]/20 rounded-2xl text-[#A99AD3]">
                  <BookOpen size={30} />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('tickets')}
                className="bg-[#755CBB]/10 border border-[#A99AD3]/20 p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#A99AD3]/50 transition group"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold group-hover:text-[#A99AD3] transition">
                    Active Desk Tickets
                  </p>
                  <p className="text-3xl font-extrabold text-[#A99AD3] mt-2">{activeReservations.length}</p>
                </div>
                <div className="p-4 bg-[#755CBB]/20 rounded-2xl text-[#A99AD3] group-hover:scale-105 transition">
                  <Ticket size={30} />
                </div>
              </div>

              <div className="bg-[#755CBB]/10 border border-[#A99AD3]/20 p-6 rounded-2xl flex items-center justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Total History Record</p>
                  <p className="text-3xl font-extrabold text-[#A99AD3] mt-2">{borrows.length}</p>
                </div>
                <div className="p-4 bg-[#755CBB]/20 rounded-2xl text-[#A99AD3]">
                  <CheckCircle2 size={30} />
                </div>
              </div>
            </div>

            {/* My Borrowed Books Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">My Borrowed Books</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Books checked out on your library card.</p>
                </div>
                <Link to="/search" className="text-sm font-semibold text-[#A99AD3] hover:underline">
                  Search More Books &rarr;
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading your books...</div>
              ) : activeBorrows.length === 0 ? (
                <div className="bg-[#755CBB]/5 border border-[#A99AD3]/10 rounded-2xl p-10 text-center">
                  <BookOpen className="mx-auto text-gray-500 mb-3" size={40} />
                  <p className="text-lg font-semibold text-gray-300">No books currently borrowed</p>
                  <p className="text-sm text-gray-500 mt-1 mb-6">
                    Explore our catalog to find books on programming, science, literature, and more.
                  </p>
                  <Link
                    to="/search"
                    className="bg-[#A99AD3] text-[#05051B] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#C4B5E6] transition inline-block shadow-md"
                  >
                    Browse Catalog
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeBorrows.map((borrow) => (
                    <div
                      key={borrow._id}
                      className="bg-[#755CBB]/10 border border-[#A99AD3]/20 rounded-2xl p-6 flex flex-col justify-between hover:border-[#A99AD3]/50 transition-all"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#755CBB]/40 text-[#A99AD3] px-2.5 py-1 rounded-md">
                          {borrow.book?.category || 'General'}
                        </span>
                        <h3 className="text-xl font-bold mt-3 mb-1 line-clamp-1">
                          {borrow.book?.title || 'Book Title'}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">{borrow.book?.author || 'Unknown Author'}</p>

                        <div className="space-y-1.5 text-xs text-gray-300 border-t border-[#A99AD3]/10 pt-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Borrowed On:</span>
                            <span>{new Date(borrow.issueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-400">Due Date:</span>
                            <span className={new Date() > new Date(borrow.dueDate) ? 'text-red-400' : 'text-[#A99AD3]'}>
                              {new Date(borrow.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReturnBook(borrow._id)}
                        className="mt-6 w-full py-2.5 bg-[#A99AD3] text-[#05051B] font-bold rounded-xl text-sm hover:bg-[#C4B5E6] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <RotateCcw size={16} /> Return Book
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ---------------- TAB 2: MY TICKETS SECTION ---------------- */}
        {activeTab === 'tickets' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Ticket className="text-[#A99AD3]" size={24} /> My Desk Reservation Tickets
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Present your digital ticket at the library reception or entrance gate for desk verification.
                </p>
              </div>

              <Link
                to="/reserve-slot"
                className="bg-[#A99AD3] text-[#05051B] font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-[#C4B5E6] transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Calendar size={14} /> Reserve Another Desk
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading your tickets...</div>
            ) : reservations.length === 0 ? (
              <div className="bg-[#755CBB]/5 border border-[#A99AD3]/10 rounded-2xl p-12 text-center">
                <Ticket className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-xl font-bold text-gray-300">No Desk Tickets Found</p>
                <p className="text-sm text-gray-400 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
                  You haven't reserved any reading desks yet. Book a session to get your official entrance ticket!
                </p>
                <Link
                  to="/reserve-slot"
                  className="bg-[#A99AD3] text-[#05051B] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#C4B5E6] transition inline-block shadow-lg"
                >
                  Book a Desk Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {reservations.map((ticket) => {
                  const isApproved = ticket.status === 'approved' || ticket.status === 'confirmed';
                  const isPending = ticket.status === 'pending';
                  const isDenied = ticket.status === 'denied';
                  const isCancelled = ticket.status === 'cancelled';

                  const ticketRef = `#BB-TKT-${ticket._id.slice(-6).toUpperCase()}`;

                  return (
                    <div
                      key={ticket._id}
                      className="bg-gradient-to-br from-[#0c0c2a] to-[#181135] border border-[#A99AD3]/30 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between group hover:border-[#A99AD3]/60 transition-all duration-300"
                    >
                      {/* Top Header Strip */}
                      <div className="bg-[#221248]/80 border-b border-[#A99AD3]/20 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#A99AD3] animate-pulse"></div>
                          <span className="font-mono text-xs font-bold text-[#A99AD3] tracking-widest">
                            {ticketRef}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            isApproved
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : isPending
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : isDenied
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {isApproved && <CheckCircle2 size={13} />}
                          {isPending && <Clock size={13} />}
                          {isDenied && <XCircle size={13} />}
                          {isCancelled && <AlertCircle size={13} />}
                          {isApproved
                            ? 'Approved / Valid'
                            : isPending
                            ? 'Pending Approval'
                            : isDenied
                            ? 'Denied by Librarian'
                            : 'Cancelled'}
                        </span>
                      </div>

                      {/* Ticket Body Content */}
                      <div className="p-6 md:p-8 space-y-6">
                        {/* Desk & Student Main Info */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                              Reserved Desk
                            </span>
                            <h3 className="text-3xl font-extrabold text-white mt-0.5 tracking-tight">
                              {ticket.seatNumber || 'North Wing Desk'}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-[#A99AD3] font-medium mt-1">
                              <MapPin size={14} />
                              <span>{ticket.zone}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                              Pass Holder
                            </span>
                            <div className="flex items-center gap-1.5 text-white font-bold text-sm mt-0.5 justify-end">
                              <User size={14} className="text-[#A99AD3]" />
                              <span>{user?.name || `${user?.firstName} ${user?.lastName}`}</span>
                            </div>
                            <p className="text-[11px] text-gray-400">{user?.email}</p>
                          </div>
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid grid-cols-2 gap-4 bg-[#755CBB]/10 border border-[#A99AD3]/20 rounded-2xl p-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Date</span>
                            <div className="flex items-center gap-1.5 text-white font-bold text-base mt-1">
                              <Calendar size={16} className="text-[#A99AD3]" />
                              <span>{ticket.date}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Time Session</span>
                            <div className="flex items-center gap-1.5 text-[#A99AD3] font-extrabold text-base mt-1">
                              <Clock size={16} />
                              <span>{ticket.slotTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Perforation Notch Decorator */}
                      <div className="relative border-t-2 border-dashed border-[#A99AD3]/20 px-6 py-4 bg-[#05051B]/60 flex items-center justify-between">
                        {/* Left cut-out circle */}
                        <div className="absolute -left-3 top-[-12px] w-6 h-6 bg-[#05051B] rounded-full border-r border-[#A99AD3]/30"></div>
                        {/* Right cut-out circle */}
                        <div className="absolute -right-3 top-[-12px] w-6 h-6 bg-[#05051B] rounded-full border-l border-[#A99AD3]/30"></div>

                        {/* QR Code preview */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg text-black">
                            <QrCode size={28} />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gate Check</p>
                            <p className="text-xs font-mono text-[#A99AD3]">Scan to Enter North Wing</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="p-2 rounded-xl bg-[#755CBB]/20 hover:bg-[#755CBB]/40 text-[#A99AD3] hover:text-white transition cursor-pointer text-xs flex items-center gap-1"
                            title="Print Pass"
                          >
                            <Printer size={15} />
                          </button>

                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleCancelReservation(ticket._id)}
                              className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Student;
