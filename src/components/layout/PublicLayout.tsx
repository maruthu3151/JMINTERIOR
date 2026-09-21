import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const PublicLayout: React.FC = () => {
  const { settings } = useSettings();
  const cleanWhatsapp = (settings.whatsapp || '').replace(/[^\d]/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Quick Connect Button */}
      {cleanWhatsapp && (
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=Hi%20JM%20INTERIOR,%20I%20would%20like%20to%20inquire%20about%20interior%20design%20and%20woodwork%20services.`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-emerald-500/50"
          aria-label="Direct WhatsApp message"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold uppercase tracking-wider">
            Chat on WhatsApp
          </span>
        </a>
      )}
    </div>
  );
};
