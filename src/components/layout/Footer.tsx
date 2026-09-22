```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Shield,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const whatsapp = settings?.whatsapp || '';
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  const companyName = settings?.companyName || 'JM INTERIOR';
  const logoUrl = settings?.logoUrl || '';
  const description =
    settings?.footerText ||
    settings?.description ||
    'Premium interior design and custom architectural woodwork in Chennai, Tamil Nadu.';

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">

              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-10 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-stone-700 text-stone-100 font-serif font-bold flex items-center justify-center border border-stone-600">
                    JM
                  </div>

                  <span className="font-serif text-2xl font-bold text-stone-100">
                    {companyName}
                  </span>
                </div>
              )}

            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">

              {settings?.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}

              {settings?.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {settings?.socialYouTube && (
                <a
                  href={settings.socialYouTube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}

              {cleanWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-emerald-700 flex items-center justify-center transition"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}

            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-base font-semibold text-stone-100 mb-4">
              Explore
            </h4>

            <ul className="space-y-2.5 text-sm">

              <li>
                <Link to="/projects" className="hover:text-stone-100 transition">
                  Portfolio Projects
                </Link>
              </li>

              <li>
                <Link to="/gallery" className="hover:text-stone-100 transition">
                  Visual Gallery
                </Link>
              </li>

              <li>
                <Link to="/services" className="hover:text-stone-100 transition">
                  Interior Services
                </Link>
              </li>

              <li>
                <Link to="/materials" className="hover:text-stone-100 transition">
                  Wood & Materials
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-stone-100 transition">
                  About K. Selvam
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-base font-semibold text-stone-100 mb-4">
              Studio & Contact
            </h4>

            <div className="space-y-4">

              {settings?.address && (
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-1" />
                  <span>{settings.address}</span>
                </div>
              )}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2.5 text-sm hover:text-stone-100 transition"
                >
                  <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{settings.phone}</span>
                </a>
              )}

              {cleanWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm hover:text-emerald-400 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>WhatsApp Consultation</span>
                </a>
              )}

              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 text-sm hover:text-stone-100 transition"
                >
                  <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{settings.email}</span>
                </a>
              )}

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">

          <p>
            © {currentYear} {companyName}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <Link
              to="/contact"
              className="hover:text-stone-300 transition"
            >
              Inquire
            </Link>

            <Link
              to="/appointment"
              className="hover:text-stone-300 transition"
            >
              Book Visit
            </Link>

            <Link
              to="/admin/login"
              className="flex items-center gap-1 hover:text-stone-300 transition"
              title="Studio Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Portal</span>
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
```
