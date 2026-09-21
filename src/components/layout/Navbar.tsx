import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Navbar: React.FC = () => {
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'Materials', path: '/materials' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-stone-50/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3'
          : 'bg-stone-50/80 backdrop-blur-sm border-b border-stone-200/50 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.companyName || 'JM INTERIOR'}
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-wood-900 border border-wood-600/40 flex items-center justify-center text-stone-100 font-serif font-bold text-base shadow-sm">
                JM
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-stone-900 leading-tight">
                  {settings.companyName || 'JM INTERIOR'}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-wood-700 font-semibold">
                  Chennai • Woodwork
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-wood-900 bg-wood-100/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {settings.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-wood-800 px-3 py-2 rounded-lg hover:bg-stone-100 transition"
            >
              <Phone className="w-3.5 h-3.5 text-wood-600" />
              <span>{settings.phone}</span>
            </a>
          )}

          <Link
            to="/appointment"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-wood-800 hover:bg-wood-900 text-stone-50 text-xs font-medium uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5 text-wood-300" />
            <span>Book Appointment</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 focus:outline-none transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-stone-800" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-stone-50/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition ${
                    active
                      ? 'bg-wood-100 text-wood-900 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col gap-2.5">
            <Link
              to="/appointment"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-wood-800 text-stone-50 font-medium text-sm shadow-sm active:scale-[0.98] transition"
            >
              <Calendar className="w-4 h-4 text-wood-300" />
              <span>Book An Appointment</span>
            </Link>

            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-100 transition"
              >
                <Phone className="w-4 h-4 text-wood-700" />
                <span>Call {settings.phone}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
