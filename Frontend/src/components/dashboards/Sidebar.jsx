import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, LogOut, Calendar, Ticket, Home, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Logo from '../../assets/Logo.png';
import ProfileModal from './ProfileModal';
import Toast from '../common/Toast';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminMenuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
    { name: 'Manage Books', icon: <BookOpen size={20} />, id: 'books' },
    { name: 'Manage Desks', icon: <Calendar size={20} />, id: 'desks' },
    { name: 'Manage Students', icon: <Users size={20} />, id: 'students' },
  ];

  const studentMenuItems = [
    { name: 'My Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
    { name: 'My Tickets', icon: <Ticket size={20} />, id: 'tickets' },
    { name: 'Search Library', icon: <BookOpen size={20} />, path: '/search' },
    { name: 'Reserve Desk', icon: <Calendar size={20} />, path: '/reserve-slot' },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <>
      <div className="w-64 bg-[#05051B] h-screen border-r border-[#A99AD3]/20 p-6 flex flex-col justify-between shrink-0 sticky top-0">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <img src={Logo} alt="BunnyBook" className="h-9 w-auto object-contain" />
            <div>
              <div className="text-xl font-bold text-[#A99AD3]">BunnyBook</div>
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                {role === 'admin' ? 'Admin Portal' : 'Student Portal'}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab ? activeTab === item.id : location.pathname === item.path;

              if (item.id && setActiveTab) {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#A99AD3] text-[#05051B] font-bold shadow-md shadow-[#A99AD3]/10'
                        : 'text-gray-400 hover:bg-[#755CBB]/20 hover:text-white'
                    }`}
                  >
                    {item.icon} <span>{item.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-[#A99AD3] text-[#05051B] font-bold shadow-md shadow-[#A99AD3]/10'
                      : 'text-gray-400 hover:bg-[#755CBB]/20 hover:text-white'
                  }`}
                >
                  {item.icon} <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Home website link only shown for students */}
            {role === 'student' && (
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:bg-[#755CBB]/20 hover:text-white transition-all"
              >
                <Home size={20} /> <span>Home Website</span>
              </Link>
            )}
          </nav>
        </div>

        {/* User profile card & Logout */}
        <div className="pt-6 border-t border-[#A99AD3]/10 space-y-4">
          {user && (
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-[#755CBB]/20 border border-transparent hover:border-[#A99AD3]/30 transition group text-left cursor-pointer"
              title="Click to view and edit your profile"
            >
              <div className="w-10 h-10 rounded-xl bg-[#755CBB]/30 border border-[#A99AD3]/30 flex items-center justify-center font-bold text-[#A99AD3] group-hover:scale-105 transition-transform shrink-0">
                {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
              <div className="truncate flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-[#A99AD3] transition-colors">
                    {user.name || `${user.firstName} ${user.lastName}`.trim()}
                  </p>
                  <Edit3 size={13} className="text-gray-500 group-hover:text-[#A99AD3] transition-colors shrink-0 ml-1" />
                </div>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-red-400 px-4 py-3 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer font-medium"
          >
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onNotify={(message, type) => setToast({ message, type })}
        />
      )}

      {/* Global upper-right notification toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </>
  );
};

export default Sidebar;
