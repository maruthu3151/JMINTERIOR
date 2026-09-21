import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { createAppointment } from '../../services/appointmentsService';
import { Button } from '../../components/ui/Button';

const PROJECT_TYPES = [
  'Modular Kitchen & Pantry',
  'Living Hall & TV Wall Paneling',
  'Master Bedroom & Wardrobes',
  'Full Home Turnkey Interior',
  'Custom Woodwork & Pooja Unit',
  'Commercial / Office Interior',
  'Other Custom Project',
];

const TIME_SLOTS = [
  'Morning (10:00 AM – 1:00 PM)',
  'Afternoon (2:00 PM – 5:00 PM)',
  'Evening (5:00 PM – 7:30 PM)',
];

export const AppointmentPage: React.FC = () => {
  const { settings } = useSettings();
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: TIME_SLOTS[0],
    projectType: PROJECT_TYPES[0],
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.preferredDate) {
      toast.error('Please provide your name, phone number, and preferred date.');
      return;
    }

    try {
      setSubmitting(true);
      await createAppointment(form);
      setBooked(true);
      toast.success('Consultation booked successfully! We will confirm your time shortly.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
          Personalized Consultation
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-2">
          Book an Interior Consultation
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
          {settings.appointmentNotice || 'Schedule a dedicated one-on-one session with master craftsman K. Selvam to discuss material choices, floor plans, and custom woodwork execution.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Informative Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-wood-50 rounded-3xl p-6 sm:p-8 border border-wood-200/80 space-y-5">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              What to Expect
            </h3>
            
            <ul className="space-y-4 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                <span>On-site space inspection or studio blueprint review in Chennai.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                <span>Direct consultation with K. Selvam regarding timber and finish choices.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                <span>Transparent estimate with itemized material specifications.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                <span>Zero obligation initial discussion.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-wood-200 flex items-center gap-2 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-wood-700 shrink-0" />
              <span>Available throughout Chennai & surrounding areas.</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm">
          {booked ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                Appointment Requested!
              </h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{form.name}</strong>. We have logged your request for <strong>{form.preferredDate}</strong> ({form.preferredTime}). Our team will reach out via phone to confirm final timing.
              </p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBooked(false);
                    setForm({
                      name: '',
                      phone: '',
                      email: '',
                      preferredDate: '',
                      preferredTime: TIME_SLOTS[0],
                      projectType: PROJECT_TYPES[0],
                      message: '',
                    });
                  }}
                >
                  Book Another Session
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="e.g. Meenakshi"
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
                    placeholder="e.g. +91 98400 12345"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. meenakshi@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    Preferred Time Slot
                  </label>
                  <select
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition bg-white"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Project Type
                </label>
                <select
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition bg-white"
                >
                  {PROJECT_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Space Location & Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Location in Chennai (e.g. Adyar, Anna Nagar, OMR, Velachery) and any specific requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition resize-y"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={<Calendar className="w-4 h-4 text-wood-300" />}
                className="w-full py-3.5 text-sm"
              >
                Confirm Appointment Booking
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
