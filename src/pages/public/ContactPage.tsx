import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { createMessage } from '../../services/messagesService';
import { Button } from '../../components/ui/Button';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cleanWhatsapp = (settings.whatsapp || '').replace(/[^\d]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please enter your name, phone number, and message.');
      return;
    }

    try {
      setSubmitting(true);
      await createMessage(form);
      setSubmitted(true);
      toast.success('Your message has been sent. We will get back to you shortly.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-2">
          Contact JM INTERIOR Studio
        </h1>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          Connect with K. Selvam and our interior team in Chennai. Whether you are beginning a new home renovation, seeking a custom modular kitchen, or need bespoke woodwork, we are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Chennai Studio & Office
            </h3>

            <div className="space-y-5 text-sm text-stone-700">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">Workshop & Studio Address</h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              {settings.phone && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Direct Telephone</h4>
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="text-xs sm:text-sm text-wood-700 hover:underline mt-0.5 block"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {cleanWhatsapp && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">WhatsApp Consultation</h4>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=Hi%20JM%20INTERIOR`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-emerald-700 hover:underline mt-0.5 block font-medium"
                    >
                      Click to chat directly with K. Selvam
                    </a>
                  </div>
                </div>
              )}

              {settings.email && (
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Email Address</h4>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-xs sm:text-sm text-wood-700 hover:underline mt-0.5 block"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3.5 pt-2 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900">Operating Hours</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Monday - Saturday: 9:00 AM – 7:30 PM <br />
                    Sunday: By appointment only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                Message Received
              </h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for contacting JM INTERIOR. K. Selvam and the studio team have received your details and will call you back shortly.
              </p>
              <div className="pt-4">
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Note
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  Send Us an Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Fill out your details below and we will contact you with project advice and estimates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Krishnan"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Project Details / Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your space (e.g. 3BHK flat in Velachery needing modular kitchen and custom TV unit)..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition resize-y"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={<Send className="w-4 h-4" />}
                className="w-full py-3.5 text-sm"
              >
                Submit Inquiry to JM INTERIOR
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
