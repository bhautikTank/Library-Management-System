import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import API from '../../api/axios';
import {
  BookOpen,
  Users,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  Pencil,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import Toast from '../common/Toast';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [stats, setStats] = useState({
    totalBooks: 0,
    activeStudents: 0,
    activeBorrows: 0,
    pendingReturns: 0,
  });
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refresh spinner states
  const [isRefreshingBooks, setIsRefreshingBooks] = useState(false);
  const [isRefreshingBorrows, setIsRefreshingBorrows] = useState(false);
  const [isRefreshingDesks, setIsRefreshingDesks] = useState(false);
  const [isRefreshingStudents, setIsRefreshingStudents] = useState(false);

  // Search & Filter states
  const [bookSearch, setBookSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [deskFilter, setDeskFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);

  const [editBook, setEditBook] = useState(null);
  const [reassignDeskData, setReassignDeskData] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: 3,
    rackNumber: 'A-1',
    description: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      try {
        const [statsRes, borrowsRes, booksRes, reservationsRes, studentsRes] = await Promise.all([
          API.get('/stats/admin'),
          API.get('/borrows/all'),
          API.get('/books'),
          API.get('/reservations/all'),
          API.get('/auth/students'),
        ]);

        if (isMounted) {
          if (statsRes.data.stats) setStats(statsRes.data.stats);
          setBorrows(borrowsRes.data.borrows || []);
          setBooks(booksRes.data.books || []);
          setReservations(reservationsRes.data.reservations || []);
          setStudents(studentsRes.data.students || []);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Handle Add Book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await API.post('/books', newBook);
      setFeedback({ text: 'New book added to library inventory!', type: 'success' });
      setShowAddModal(false);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        category: 'Computer Science',
        totalCopies: 3,
        rackNumber: 'A-1',
        description: '',
      });
      setRefreshKey((k) => k + 1);
    } catch (error) {
      setFeedback({
        text: error.response?.data?.message || 'Failed to add book',
        type: 'error',
      });
    }
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (book) => {
    setEditBook({
      _id: book._id,
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || 'Computer Science',
      totalCopies: book.totalCopies || 1,
      rackNumber: book.rackNumber || 'A-1',
      description: book.description || '',
    });
    setShowEditModal(true);
  };

  // Handle Update Book
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/books/${editBook._id}`, editBook);
      setFeedback({ text: `"${editBook.title}" updated successfully!`, type: 'success' });
      setShowEditModal(false);
      setEditBook(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      setFeedback({
        text: error.response?.data?.message || 'Failed to update book',
        type: 'error',
      });
    }
  };

  // Handle Delete Book
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await API.delete(`/books/${bookId}`);
      setFeedback({ text: 'Book removed from library', type: 'success' });
      setRefreshKey((k) => k + 1);
    } catch {
      setFeedback({ text: 'Failed to delete book', type: 'error' });
    }
  };

  // Handle Return Book
  const handleReturnBook = async (borrowId) => {
    try {
      const res = await API.post(`/borrows/return/${borrowId}`);
      setFeedback({ text: res.data.message || 'Book marked as returned!', type: 'success' });
      setRefreshKey((k) => k + 1);
    } catch {
      setFeedback({ text: 'Failed to return book', type: 'error' });
    }
  };

  // Refresh Specific Datasets
  const handleRefreshInventory = async () => {
    try {
      setIsRefreshingBooks(true);
      const [booksRes, statsRes] = await Promise.all([
        API.get('/books'),
        API.get('/stats/admin'),
      ]);
      setBooks(booksRes.data.books || []);
      if (statsRes.data.stats) setStats(statsRes.data.stats);
      setFeedback({ text: 'Library books inventory refreshed!', type: 'success' });
    } catch {
      setFeedback({ text: 'Failed to refresh books', type: 'error' });
    } finally {
      setIsRefreshingBooks(false);
    }
  };

  const handleRefreshBorrows = async () => {
    try {
      setIsRefreshingBorrows(true);
      const [borrowsRes, statsRes] = await Promise.all([
        API.get('/borrows/all'),
        API.get('/stats/admin'),
      ]);
      setBorrows(borrowsRes.data.borrows || []);
      if (statsRes.data.stats) setStats(statsRes.data.stats);
      setFeedback({ text: 'Circulation and loans records refreshed!', type: 'success' });
    } catch {
      setFeedback({ text: 'Failed to refresh loans', type: 'error' });
    } finally {
      setIsRefreshingBorrows(false);
    }
  };

  const handleRefreshDesks = async () => {
    try {
      setIsRefreshingDesks(true);
      const res = await API.get('/reservations/all');
      setReservations(res.data.reservations || []);
      setFeedback({ text: 'Desk reservations updated!', type: 'success' });
    } catch {
      setFeedback({ text: 'Failed to refresh desk reservations', type: 'error' });
    } finally {
      setIsRefreshingDesks(false);
    }
  };

  const handleRefreshStudents = async () => {
    try {
      setIsRefreshingStudents(true);
      const res = await API.get('/auth/students');
      setStudents(res.data.students || []);
      setFeedback({ text: 'Students list updated!', type: 'success' });
    } catch {
      setFeedback({ text: 'Failed to refresh students list', type: 'error' });
    } finally {
      setIsRefreshingStudents(false);
    }
  };

  // Reservation Status Update (Approve / Deny / Cancel)
  const handleUpdateReservationStatus = async (id, status) => {
    try {
      await API.put(`/reservations/${id}`, { status });
      setFeedback({ text: `Reservation marked as ${status}!`, type: 'success' });
      setRefreshKey((k) => k + 1);
    } catch (error) {
      setFeedback({
        text: error.response?.data?.message || 'Failed to update reservation',
        type: 'error',
      });
    }
  };

  // Reassign Desk / Resolve Conflict
  const handleSaveReassignedDesk = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/reservations/${reassignDeskData._id}`, {
        seatNumber: reassignDeskData.seatNumber,
        zone: reassignDeskData.zone,
        status: reassignDeskData.status,
      });
      setFeedback({ text: 'Desk reassigned and conflict resolved!', type: 'success' });
      setShowReassignModal(false);
      setReassignDeskData(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      setFeedback({
        text: error.response?.data?.message || 'Failed to reassign desk',
        type: 'error',
      });
    }
  };

  // Detect time slot conflicts
  const getConflictWarning = (reservation) => {
    if (reservation.status === 'cancelled' || reservation.status === 'denied') return null;
    const sameSlotCount = reservations.filter(
      (r) =>
        r._id !== reservation._id &&
        r.date === reservation.date &&
        r.slotTime === reservation.slotTime &&
        r.zone === reservation.zone &&
        r.status !== 'cancelled' &&
        r.status !== 'denied'
    ).length;

    return sameSlotCount > 0 ? `${sameSlotCount + 1} students requested this slot` : null;
  };

  // Filtered views
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.mobile && s.mobile.includes(studentSearch))
  );

  const filteredReservations = reservations.filter((r) => {
    if (deskFilter === 'all') return true;
    return r.status === deskFilter;
  });

  const statCards = [
    { label: 'Total Books', value: stats.totalBooks, icon: <BookOpen size={24} />, color: 'bg-[#755CBB]' },
    { label: 'Active Students', value: stats.activeStudents, icon: <Users size={24} />, color: 'bg-[#755CBB]' },
    { label: 'Currently Issued', value: stats.activeBorrows, icon: <Clock size={24} />, color: 'bg-[#755CBB]' },
    { label: 'Overdue Returns', value: stats.pendingReturns, icon: <AlertTriangle size={24} />, color: 'bg-[#A99AD3]' },
  ];

  return (
    <div className="flex bg-[#05051B] min-h-screen text-white relative">
      {/* Upper Right Corner Notification */}
      <Toast
        message={feedback.text}
        type={feedback.type}
        onClose={() => setFeedback({ text: '', type: '' })}
      />

      {/* Admin Sidebar */}
      <Sidebar role="admin" activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#A99AD3]/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {activeTab === 'dashboard' && 'Admin & Circulation Overview'}
                {activeTab === 'books' && 'Manage Books & Inventory'}
                {activeTab === 'desks' && 'Manage Student Desk Reservations'}
                {activeTab === 'students' && 'Manage Registered Students'}
              </h1>
            </div>
            <p className="text-gray-400 mt-1">
              {activeTab === 'dashboard' && 'Live stats, active loans, and circulation operations.'}
              {activeTab === 'books' && 'Add, edit details, track copies, and manage library inventory.'}
              {activeTab === 'desks' && 'Approve or deny student seat bookings and resolve desk conflicts.'}
              {activeTab === 'students' && 'View student profiles, borrowed books count, and reservation history.'}
            </p>
          </div>

          {/* Quick Tab Actions */}
          <div className="flex items-center gap-3">
            {activeTab === 'books' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-[#A99AD3] text-[#05051B] font-bold px-5 py-2.5 rounded-xl hover:bg-[#C4B5E6] transition active:scale-95 cursor-pointer shadow-lg text-sm"
              >
                <Plus size={18} /> Add New Book
              </button>
            )}
          </div>
        </header>

        {/* ----------------- TAB 1: DASHBOARD & CIRCULATION ----------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className={`${stat.color} p-6 rounded-2xl shadow-xl shadow-black/20 text-[#05051B] flex items-center justify-between`}
                >
                  <div>
                    <p className="font-bold uppercase text-xs tracking-wider opacity-80">{stat.label}</p>
                    <p className="text-3xl font-extrabold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-black/10 rounded-xl">{stat.icon}</div>
                </div>
              ))}
            </div>

            {/* Book Circulation & Loans Section */}
            <div className="bg-[#755CBB]/10 border border-[#A99AD3]/20 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Book Circulation & Loans</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Tracking all active and returned student loans.</p>
                </div>
                <button
                  onClick={handleRefreshBorrows}
                  disabled={isRefreshingBorrows}
                  className="flex items-center gap-2 text-xs font-bold text-[#05051B] bg-[#A99AD3] hover:bg-[#C4B5E6] px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md disabled:opacity-50"
                  title="Refresh circulation data"
                >
                  <RefreshCw size={14} className={isRefreshingBorrows ? 'animate-spin' : ''} />
                  <span>{isRefreshingBorrows ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-gray-400">Loading loans data...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-[#A99AD3]/10">
                        <th className="py-3 px-4">Book Title</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#A99AD3]/10">
                      {borrows.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-6 text-center text-gray-500">
                            No circulation records found
                          </td>
                        </tr>
                      ) : (
                        borrows.map((b) => (
                          <tr key={b._id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                              {b.book?.title || 'Unknown Title'}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {b.student ? `${b.student.firstName} ${b.student.lastName}` : 'Student'}
                              <div className="text-xs text-gray-500">{b.student?.email}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-400">{new Date(b.issueDate).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-gray-400">{new Date(b.dueDate).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              {b.status === 'returned' ? (
                                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                                  Returned
                                </span>
                              ) : new Date() > new Date(b.dueDate) ? (
                                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                                  Overdue
                                </span>
                              ) : (
                                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
                                  Active Loan
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {b.status === 'borrowed' && (
                                <button
                                  onClick={() => handleReturnBook(b._id)}
                                  className="text-xs font-bold text-[#A99AD3] hover:text-white px-3 py-1 bg-[#755CBB]/30 hover:bg-[#755CBB]/60 rounded-lg transition cursor-pointer"
                                >
                                  Mark Returned
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: MANAGE BOOKS ----------------- */}
        {activeTab === 'books' && (
          <div className="bg-[#755CBB]/10 border border-[#A99AD3]/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    placeholder="Search books by title, author, ISBN..."
                    className="w-full bg-[#05051B] border border-[#A99AD3]/30 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-[#A99AD3]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefreshInventory}
                  disabled={isRefreshingBooks}
                  className="flex items-center gap-2 text-xs font-bold text-[#05051B] bg-[#A99AD3] hover:bg-[#C4B5E6] px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md disabled:opacity-50"
                  title="Reload library inventory"
                >
                  <RefreshCw size={14} className={isRefreshingBooks ? 'animate-spin' : ''} />
                  <span>{isRefreshingBooks ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-[#A99AD3]/10">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">ISBN</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Available / Total</th>
                    <th className="py-3 px-4">Rack</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A99AD3]/10">
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-400">
                        No books matching your query
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => (
                      <tr key={book._id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-4 font-bold text-white max-w-xs">
                          <p className="truncate" title={book.title}>{book.title}</p>
                          {book.description && (
                            <p className="text-xs text-gray-400 font-normal truncate mt-0.5">{book.description}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-300">{book.author}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs font-mono">{book.isbn}</td>
                        <td className="py-3 px-4">
                          <span className="bg-[#755CBB]/30 text-[#A99AD3] px-2 py-0.5 rounded text-xs">
                            {book.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          <span className={book.availableCopies > 0 ? 'text-green-400' : 'text-red-400'}>
                            {book.availableCopies}
                          </span>{' '}
                          / {book.totalCopies}
                        </td>
                        <td className="py-3 px-4 text-gray-400">{book.rackNumber || 'A-1'}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(book)}
                              className="text-[#A99AD3] hover:text-white p-2 rounded-lg hover:bg-[#755CBB]/30 transition cursor-pointer"
                              title="Edit Book Details"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                              title="Delete Book"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: MANAGE DESKS ----------------- */}
        {activeTab === 'desks' && (
          <div className="bg-[#755CBB]/10 border border-[#A99AD3]/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'approved', 'denied', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setDeskFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                      deskFilter === status
                        ? 'bg-[#A99AD3] text-[#05051B]'
                        : 'bg-[#755CBB]/20 text-gray-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRefreshDesks}
                disabled={isRefreshingDesks}
                className="flex items-center gap-2 text-xs font-bold text-[#05051B] bg-[#A99AD3] hover:bg-[#C4B5E6] px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshingDesks ? 'animate-spin' : ''} />
                <span>{isRefreshingDesks ? 'Refreshing...' : 'Refresh Desks'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-[#A99AD3]/10">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Session Date & Time</th>
                    <th className="py-3 px-4">Desk & Zone</th>
                    <th className="py-3 px-4">Status & Conflict Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A99AD3]/10">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">
                        No desk reservations found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => {
                      const conflictWarning = getConflictWarning(res);
                      return (
                        <tr key={res._id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 px-4">
                            <p className="font-bold text-white">
                              {res.student ? `${res.student.firstName} ${res.student.lastName}` : 'Student'}
                            </p>
                            <p className="text-xs text-gray-400">{res.student?.email}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 font-semibold text-[#A99AD3]">
                              <Calendar size={14} />
                              <span>{res.date}</span>
                            </div>
                            <p className="text-xs text-gray-300 font-bold mt-0.5">{res.slotTime}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-white px-2 py-0.5 bg-[#755CBB]/30 rounded text-xs border border-[#A99AD3]/20">
                              {res.seatNumber || 'Unassigned'}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">{res.zone}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                  res.status === 'approved' || res.status === 'confirmed'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : res.status === 'denied'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : res.status === 'cancelled'
                                    ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}
                              >
                                {res.status}
                              </span>

                              {conflictWarning && (
                                <span className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                                  <AlertCircle size={12} /> {conflictWarning}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Reassign / Resolve Conflict */}
                              <button
                                onClick={() => {
                                  setReassignDeskData(res);
                                  setShowReassignModal(true);
                                }}
                                className="text-xs px-2.5 py-1.5 rounded-lg bg-[#755CBB]/30 text-[#A99AD3] hover:text-white hover:bg-[#755CBB]/50 transition cursor-pointer font-semibold"
                                title="Resolve Conflict or Change Desk"
                              >
                                Reassign
                              </button>

                              {/* Approve */}
                              {res.status !== 'approved' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res._id, 'approved')}
                                  className="text-xs px-2.5 py-1.5 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition cursor-pointer font-semibold flex items-center gap-1"
                                  title="Approve Reservation"
                                >
                                  <CheckCircle2 size={13} /> Approve
                                </button>
                              )}

                              {/* Deny */}
                              {res.status !== 'denied' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res._id, 'denied')}
                                  className="text-xs px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition cursor-pointer font-semibold flex items-center gap-1"
                                  title="Deny Reservation"
                                >
                                  <XCircle size={13} /> Deny
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: MANAGE STUDENTS ----------------- */}
        {activeTab === 'students' && (
          <div className="bg-[#755CBB]/10 border border-[#A99AD3]/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students by name, email, mobile..."
                  className="w-full bg-[#05051B] border border-[#A99AD3]/30 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-[#A99AD3]"
                />
              </div>

              <button
                onClick={handleRefreshStudents}
                disabled={isRefreshingStudents}
                className="flex items-center gap-2 text-xs font-bold text-[#05051B] bg-[#A99AD3] hover:bg-[#C4B5E6] px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshingStudents ? 'animate-spin' : ''} />
                <span>{isRefreshingStudents ? 'Refreshing...' : 'Refresh Students'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-[#A99AD3]/10">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Date of Birth</th>
                    <th className="py-3 px-4">Active Loans</th>
                    <th className="py-3 px-4">Desk Bookings</th>
                    <th className="py-3 px-4 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A99AD3]/10">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        No students found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr key={st._id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#755CBB]/40 border border-[#A99AD3]/30 flex items-center justify-center font-bold text-[#A99AD3] text-xs">
                            {st.firstName ? st.firstName[0].toUpperCase() : 'S'}
                          </div>
                          <span>{st.name || `${st.firstName} ${st.lastName}`}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{st.email}</td>
                        <td className="py-3 px-4 text-gray-400">{st.mobile || 'Not provided'}</td>
                        <td className="py-3 px-4 text-gray-400">{st.dob || 'Not provided'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              st.borrowedCount > 0 ? 'bg-purple-500/20 text-purple-300' : 'text-gray-500'
                            }`}
                          >
                            {st.borrowedCount} Books
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              st.reservationsCount > 0 ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500'
                            }`}
                          >
                            {st.reservationsCount} Desks
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-400 text-xs">
                          {new Date(st.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- MODAL: ADD BOOK ----------------- */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#05051B] border border-[#A99AD3]/30 rounded-2xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-white">Add New Book to Library</h2>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="e.g. Design Patterns"
                    className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="e.g. Erich Gamma"
                    className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                      placeholder="978-0201633610"
                      className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newBook.category}
                      onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                      className="w-full bg-[#05051B] border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Literature">Literature</option>
                      <option value="Science">Science</option>
                      <option value="Business">Business</option>
                      <option value="Self-Help">Self-Help</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Total Copies
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newBook.totalCopies}
                      onChange={(e) => setNewBook({ ...newBook, totalCopies: Number(e.target.value) })}
                      className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Rack Number
                    </label>
                    <input
                      type="text"
                      value={newBook.rackNumber}
                      onChange={(e) => setNewBook({ ...newBook, rackNumber: e.target.value })}
                      placeholder="CS-105"
                      className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Book Description
                  </label>
                  <textarea
                    rows={3}
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    placeholder="Write a brief overview of the book..."
                    className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3] resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 font-semibold hover:bg-gray-900 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#A99AD3] text-[#05051B] font-bold hover:bg-[#C4B5E6] transition cursor-pointer"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- MODAL: EDIT BOOK ----------------- */}
        {showEditModal && editBook && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#05051B] border border-[#A99AD3]/30 rounded-2xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-white">Edit Book Details</h2>
              <form onSubmit={handleUpdateBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editBook.title}
                    onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                    className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    required
                    value={editBook.author}
                    onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                    className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      required
                      value={editBook.isbn}
                      onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
                      className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={editBook.category}
                      onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
                      className="w-full bg-[#05051B] border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Literature">Literature</option>
                      <option value="Science">Science</option>
                      <option value="Business">Business</option>
                      <option value="Self-Help">Self-Help</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Total Copies
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editBook.totalCopies}
                      onChange={(e) => setEditBook({ ...editBook, totalCopies: Number(e.target.value) })}
                      className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Rack Number
                    </label>
                    <input
                      type="text"
                      value={editBook.rackNumber || ''}
                      onChange={(e) => setEditBook({ ...editBook, rackNumber: e.target.value })}
                      className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Book Description
                  </label>
                  <textarea
                    rows={3}
                    value={editBook.description || ''}
                    onChange={(e) => setEditBook({ ...editBook, description: e.target.value })}
                    placeholder="Write a brief overview of the book..."
                    className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3] resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditBook(null);
                    }}
                    className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 font-semibold hover:bg-gray-900 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#A99AD3] text-[#05051B] font-bold hover:bg-[#C4B5E6] transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- MODAL: REASSIGN DESK / RESOLVE CONFLICT ----------------- */}
        {showReassignModal && reassignDeskData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#05051B] border border-[#A99AD3]/30 rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-white">Reassign Desk & Resolve Conflict</h2>
              <p className="text-xs text-gray-400 mb-6">
                Change the allocated desk number or zone for{' '}
                <span className="text-white font-bold">
                  {reassignDeskData.student?.firstName} {reassignDeskData.student?.lastName}
                </span>{' '}
                on {reassignDeskData.date} at {reassignDeskData.slotTime}.
              </p>

              <form onSubmit={handleSaveReassignedDesk} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Seat / Desk Number
                  </label>
                  <input
                    type="text"
                    required
                    value={reassignDeskData.seatNumber}
                    onChange={(e) =>
                      setReassignDeskData({ ...reassignDeskData, seatNumber: e.target.value })
                    }
                    placeholder="e.g. Desk 12"
                    className="w-full bg-[#755CBB]/20 border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Study Zone
                  </label>
                  <select
                    value={reassignDeskData.zone}
                    onChange={(e) => setReassignDeskData({ ...reassignDeskData, zone: e.target.value })}
                    className="w-full bg-[#05051B] border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                  >
                    <option value="Zone A, Floor 1 (Quiet Sanctuary)">Zone A, Floor 1 (Quiet Sanctuary)</option>
                    <option value="Zone B, Floor 2 (Silent Research Pods)">Zone B, Floor 2 (Silent Research Pods)</option>
                    <option value="Zone C, Ground (Computer & Media Lab)">Zone C, Ground (Computer & Media Lab)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Approval Status
                  </label>
                  <select
                    value={reassignDeskData.status}
                    onChange={(e) => setReassignDeskData({ ...reassignDeskData, status: e.target.value })}
                    className="w-full bg-[#05051B] border border-[#A99AD3]/40 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#A99AD3]"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReassignModal(false);
                      setReassignDeskData(null);
                    }}
                    className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 font-semibold hover:bg-gray-900 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#A99AD3] text-[#05051B] font-bold hover:bg-[#C4B5E6] transition cursor-pointer"
                  >
                    Apply Reassignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
