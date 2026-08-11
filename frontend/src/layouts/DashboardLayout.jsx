import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  User,
  LogOut,
  TrendingUp,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Profile', href: '/profile', icon: User },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';
    
  const getImageUrl = (path) => {
    if (!path) return null;
    return `http://localhost:5000${path}`;
  };

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
          <TrendingUp size={18} className="text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-slate-900 block leading-tight">Expense</span>
          <span className="text-xs font-semibold text-primary-600 block leading-tight">Tracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navigation.map(({ name, href, icon: Icon }) => (
          <NavLink
            key={name}
            to={href}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="flex-1">{name}</span>
                {isActive && <ChevronRight size={14} className="text-primary-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
            {user?.profilePicture ? (
              <img src={getImageUrl(user.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-primary-700">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 w-full group"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30">
        <SidebarContent onNavClick={undefined} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Expense Tracker</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarContent onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 h-14">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 hidden lg:block" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border border-slate-200">
                {user?.profilePicture ? (
                  <img src={getImageUrl(user.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-primary-700">{initials}</span>
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700">
                {user?.fullName?.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
