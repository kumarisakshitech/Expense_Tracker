import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, TrendingDown, User,
  HelpCircle, LogOut, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/income', icon: TrendingUp, label: 'Income' },
  { to: '/expenses', icon: TrendingDown, label: 'Expenses' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-white ${mobile ? '' : 'border-r border-gray-200'}`}>
      {/* User profile */}
      <div className={`p-4 border-b border-gray-100 ${collapsed && !mobile ? 'px-3' : 'px-5'}`}>
        <div className={`flex items-center gap-3 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                collapsed && !mobile ? 'justify-center px-0 mx-1' : 'px-4'
              } ${isActive
                ? 'text-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-teal-700 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                {(!collapsed || mobile) && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-gray-100 p-2 ${collapsed && !mobile ? 'px-1' : ''}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 py-3 rounded-xl font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 w-full transition-all ${
            collapsed && !mobile ? 'justify-center px-0 mx-1' : 'px-4'
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-16 bottom-0 z-30 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="relative h-full">
          <SidebarContent />
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-10 z-20 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:text-teal-600 hover:border-teal-400 shadow-sm"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl rounded-r-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800">Expense Tracker</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Spacer for desktop layout */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`} />
    </>
  );
};

export default Sidebar;
