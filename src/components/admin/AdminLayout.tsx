import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Image as ImageIcon,
  Wrench,
  Layers,
  Calendar,
  Mail,
  Star,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const AdminLayout: React.FC = () => {
  const { user, loading, logout, adminProfile } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-wood-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-wood-400 font-semibold">
            Authenticating Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Logged out successfully.');
      navigate('/admin/login');
    } catch (err: any) {
      toast.error('Failed to log out.');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Materials', path: '/admin/materials', icon: Layers },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
    { name: 'Admin Security', path: '/admin/security', icon: ShieldCheck },
  ];

  const isNavActive = (itemPath: string, exact?: boolean) => {
    if (exact) return location.pathname === itemPath;
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  return (
    <div className="min-h-screen flex bg-stone-100 text-stone-900 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-stone-900 text-stone-300 border-r border-stone-800 shrink-0 select-none">
        {/* Top Brand */}
        <div className="p-6 border-b border-stone-800">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-wood-700 text-stone-100 font-serif font-bold text-base flex items-center justify-center border border-wood-500/40">
              JM
            </div>
            <div>
              <span className="font-serif font-bold text-base text-stone-100 block leading-tight">
                {settings.companyName || 'JM INTERIOR'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-wood-400 font-semibold">
                Studio CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isNavActive(item.path, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? 'bg-wood-700 text-stone-100 shadow-sm border border-wood-600/40'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-stone-800 text-wood-400 flex items-center justify-center text-xs font-bold border border-stone-700">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-stone-200 truncate">
                {adminProfile?.username || 'SELVAM'}
              </div>
              <div className="text-[10px] text-wood-400 font-mono truncate">
                Administrator
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-red-950/80 hover:text-red-300 text-stone-300 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif font-bold text-lg text-stone-900 hidden sm:block">
              Studio Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </Link>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-64 max-w-[80vw] bg-stone-900 text-stone-300 flex flex-col z-10 shadow-2xl">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <span className="font-serif font-bold text-base text-stone-100">
                JM INTERIOR
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isNavActive(item.path, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? 'bg-wood-700 text-stone-100'
                        : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-stone-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
