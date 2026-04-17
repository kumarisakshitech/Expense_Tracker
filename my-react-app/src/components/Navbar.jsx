import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Expense Tracker</span>
        </div>

        {/* User menu */}
        {user && (
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{user.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute top-14 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="p-1.5">
                  <button onClick={() => { navigate('/profile'); setOpen(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-3 rounded-lg">
                    <User className="w-4 h-4" /> Profile
                  </button>
                </div>
                <div className="p-1.5 border-t border-gray-100">
                  <button onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 rounded-lg">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
