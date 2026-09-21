import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, CheckCircle2, Image as ImageIcon, Building, Phone, Home, User, Share2, FileText } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { updateSiteSettings } from '../../services/settingsService';
import { SiteSettings } from '../../types';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Button } from '../../components/ui/Button';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings, updateLocalSettings } = useSettings();
  const toast = useToast();

  const [form, setForm] = useState<SiteSettings>(settings);
  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'home' | 'about' | 'social' | 'footer'>('branding');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await updateSiteSettings(form);
      updateLocalSettings(form);
      await refreshSettings();
      toast.success('Website settings saved successfully to Cloud Firestore.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update website settings.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'branding', name: 'Branding & Logo', icon: ImageIcon },
    { id: 'contact', name: 'Contact & Studio', icon: Phone },
    { id: 'home', name: 'Homepage & Hero', icon: Home },
    { id: 'about', name: 'About & Owner', icon: User },
    { id: 'social', name: 'Social Links', icon: Share2 },
    { id: 'footer', name: 'Footer & Booking', icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Website Site Settings
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Updates here reflect globally across the public site for all visitors.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Save className="w-4 h-4 text-wood-300" />}
          loading={saving}
          onClick={() => handleSave()}
        >
          Save Website Settings
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                active
                  ? 'bg-wood-800 text-stone-50 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
          {/* TAB 1: BRANDING & LOGO */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Logo & Visual Identity
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Upload a transparent PNG logo. It will be stored in Firebase Storage and dynamically displayed in the Navbar and Footer across all devices.
                </p>
              </div>

              <div className="max-w-md">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Website Logo (PNG / SVG)
                </label>
                <ImageUploader
                  value={form.logoUrl}
                  onChange={(url) => handleChange('logoUrl', url)}
                  storagePath="logos"
                  aspectRatio="auto"
                  accept="image/png, image/svg+xml, image/webp"
                  helpText="Upload PNG or SVG format with transparent background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Short Business Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT & STUDIO */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Chennai Studio & Contact Details
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  These numbers and addresses are used for direct telephone calls, WhatsApp links, and foot traffic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 74012 79764"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="+917401279764"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="selvam@jminterior.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Workshop & Studio Address (Chennai)
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="No. 24, Gandhi Road, Velachery, Chennai, Tamil Nadu - 600042"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOMEPAGE & HERO */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Homepage Hero Banner
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Adjust the primary headline, intro pitch, and hero interior background.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Hero Headline *
                </label>
                <input
                  type="text"
                  required
                  value={form.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition font-serif text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Hero Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={form.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Hero Background Photograph (Firebase Storage)
                </label>
                <ImageUploader
                  value={form.heroImage}
                  onChange={(url) => handleChange('heroImage', url)}
                  storagePath="site"
                  aspectRatio="wide"
                  helpText="High-resolution panoramic interior visual (1920x1080 recommended)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.heroCtaPrimary}
                    onChange={(e) => handleChange('heroCtaPrimary', e.target.value)}
                    placeholder="Explore Projects"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.heroCtaSecondary}
                    onChange={(e) => handleChange('heroCtaSecondary', e.target.value)}
                    placeholder="Book Consultation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT & OWNER */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  About JM INTERIOR & K. Selvam
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Control the founder credentials, experience counters, and design philosophy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Owner / Master Craftsman Name
                  </label>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    placeholder="K. Selvam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Years of Experience Counter
                  </label>
                  <input
                    type="text"
                    value={form.experienceYears}
                    onChange={(e) => handleChange('experienceYears', e.target.value)}
                    placeholder="18+"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  About Section Headline
                </label>
                <input
                  type="text"
                  value={form.aboutTitle}
                  onChange={(e) => handleChange('aboutTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition font-serif font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  About Story Description
                </label>
                <textarea
                  rows={4}
                  value={form.aboutDescription}
                  onChange={(e) => handleChange('aboutDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Design & Craftsmanship Philosophy
                </label>
                <textarea
                  rows={3}
                  value={form.designPhilosophy}
                  onChange={(e) => handleChange('designPhilosophy', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SOCIAL CHANNELS */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Social Media Profiles
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Links displayed in the website footer and contact channels.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={form.socialInstagram}
                    onChange={(e) => handleChange('socialInstagram', e.target.value)}
                    placeholder="https://instagram.com/jminterior"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={form.socialFacebook}
                    onChange={(e) => handleChange('socialFacebook', e.target.value)}
                    placeholder="https://facebook.com/jminterior"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={form.socialYouTube}
                    onChange={(e) => handleChange('socialYouTube', e.target.value)}
                    placeholder="https://youtube.com/@jminterior"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FOOTER & BOOKING */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Footer & Booking Instructions
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Footer Description Text
                </label>
                <textarea
                  rows={3}
                  value={form.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Appointment Page Notice / Instructions
                </label>
                <textarea
                  rows={3}
                  value={form.appointmentNotice}
                  onChange={(e) => handleChange('appointmentNotice', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Bottom Save Action Bar */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              Last saved: {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : 'Not yet saved'}
            </span>

            <Button
              type="submit"
              variant="primary"
              loading={saving}
              icon={<Save className="w-4 h-4 text-wood-300" />}
            >
              Save Website Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
