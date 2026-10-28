import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/useAuth';
import Toast from '../common/Toast';

const Searchbooks = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const categories = ['All', 'Computer Science', 'Literature', 'Science', 'Business', 'Self-Help'];

  useEffect(() => {
    let isMounted = true;
    const loadCategoryBooks = async () => {
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        const res = await API.get('/books', { params });
        if (isMounted) {
          setBooks(res.data.books || []);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategoryBooks();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await API.get('/books', { params });
      setBooks(res.data.books || []);
    } catch (error) {
      console.error('Failed to search books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await API.post('/borrows/issue', { bookId });
      setFeedback({ text: 'Book borrowed successfully! You have 14 days to read.', type: 'success' });
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const res = await API.get('/books', { params });
      setBooks(res.data.books || []);
      setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
    } catch (error) {
      setFeedback({
        text: error.response?.data?.message || 'Could not borrow book.',
        type: 'error',
      });
      setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#05051B] text-white px-6 py-12 relative">
      {/* Upper Right Corner Notification */}
      <Toast
        message={feedback.text}
        type={feedback.type}
        onClose={() => setFeedback({ text: '', type: '' })}
      />

      <div className="max-w-6xl mx-auto">
        {/* Top Minimal Action Row */}
        <div className="flex justify-between items-center mb-12">
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/student') : '/'}
            className="group flex items-center gap-3 text-gray-400 hover:text-[#A99AD3] transition-all"
          >
            <div className="p-2 rounded-full border border-gray-800 group-hover:border-[#A99AD3]/50">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">
              Back to {isAuthenticated ? 'Dashboard' : 'Home'}
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-300 hidden sm:inline">
                {user?.name || user?.firstName}
              </span>
              <div className="h-10 w-10 rounded-2xl bg-[#755CBB]/20 border border-[#A99AD3]/20 flex items-center justify-center text-[#A99AD3] font-bold">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-bold text-[#A99AD3] hover:text-white px-4 py-2 rounded-xl bg-[#755CBB]/20 border border-[#A99AD3]/30 transition"
            >
              Sign In to Borrow
            </Link>
          )}
        </div>

        {/* Hero Search Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            Search <span className="text-[#A99AD3]">Library.</span>
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#755CBB] to-[#A99AD3] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-[#05051B] border border-[#A99AD3]/30 rounded-2xl p-2">
              <Search className="ml-4 md:ml-6 text-gray-500 shrink-0" size={24} />
              <input
                type="text"
                placeholder="Search by Title, Author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent px-4 md:px-6 py-4 outline-none text-base md:text-xl placeholder:text-gray-600 text-white"
              />
              <button
                type="submit"
                className="bg-[#A99AD3] text-[#05051B] font-black px-6 md:px-10 py-3.5 md:py-4 rounded-xl hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                FIND
              </button>
            </div>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#A99AD3] text-[#05051B] shadow-md'
                    : 'bg-[#755CBB]/20 text-gray-400 hover:text-white hover:bg-[#755CBB]/40 border border-[#A99AD3]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-lg">Searching library shelves...</div>
        ) : books.length === 0 ? (
          <div className="bg-[#755CBB]/5 border border-[#A99AD3]/10 rounded-3xl p-12 text-center text-gray-400">
            <p className="text-xl font-bold text-gray-300 mb-2">No matching books found</p>
            <p className="text-sm">Try searching with a different title, author name, or select "All" categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => {
              const inStock = book.availableCopies > 0;
              return (
                <div
                  key={book._id}
                  className="bg-[#755CBB]/5 border border-[#755CBB]/20 rounded-[2.5rem] p-8 hover:bg-[#755CBB]/10 hover:border-[#A99AD3]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-[#A99AD3]/10 rounded-2xl text-[#A99AD3]">
                        <Bookmark size={28} />
                      </div>
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                          inStock
                            ? 'text-green-400 bg-green-400/10 border-green-400/20'
                            : 'text-red-400 bg-red-400/10 border-red-400/20'
                        }`}
                      >
                        {inStock ? `${book.availableCopies} AVAILABLE` : 'OUT OF STOCK'}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 line-clamp-2 text-white group-hover:text-[#A99AD3] transition">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mb-2">{book.author}</p>
                    <p className="text-gray-500 text-xs mb-4">
                      {book.category} • Rack {book.rackNumber || 'A-1'} • ISBN: {book.isbn}
                    </p>

                    {book.description && (
                      <p className="text-gray-400 text-xs line-clamp-3 mb-6 leading-relaxed">
                        {book.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleBorrow(book._id)}
                    disabled={!inStock}
                    className={`w-full py-3.5 rounded-2xl font-bold transition-all shadow-lg cursor-pointer ${
                      inStock
                        ? 'bg-[#A99AD3] text-[#05051B] hover:bg-[#C4B5E6] active:scale-95 shadow-[#A99AD3]/10'
                        : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {inStock ? 'Borrow Book' : 'Currently Unavailable'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbooks;
