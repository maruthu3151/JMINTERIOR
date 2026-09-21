import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, ShieldCheck, Hammer, Users, CheckCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { Button } from '../../components/ui/Button';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
          The Craft, The Heritage, The Team
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
          {settings.aboutTitle || 'Mastery in Woodwork, Excellence in Interior Design'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Led by master craftsman <strong>{settings.ownerName}</strong>, JM INTERIOR has spent {settings.experienceYears || '18+'} years engineering custom timber structures, luxury modular cabinetry, and enduring living environments across Chennai.
        </p>
      </div>

      {/* 2. Story Grid with Founder Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
              alt={`${settings.ownerName} - Founder JM INTERIOR`}
              className="w-full aspect-[4/5] object-cover object-center"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-wood-900 text-stone-100 p-6 rounded-2xl shadow-xl max-w-xs border border-wood-700">
            <h4 className="font-serif text-lg font-bold">{settings.ownerName}</h4>
            <p className="text-xs text-wood-300">Founder & Master Craftsman</p>
            <p className="text-[11px] text-stone-300 mt-2 leading-relaxed">
              Personally overseeing fabrication, wood seasoning, and client installations in Chennai.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
            Founder's Journey & Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
            An Uncompromising Dedication to Authentic Joinery
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {settings.aboutDescription}
          </p>

          <div className="p-6 rounded-2xl bg-wood-50 border border-wood-200">
            <h4 className="font-serif font-bold text-stone-900 text-base mb-1">
              Our Core Design & Craft Philosophy
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
              "{settings.designPhilosophy}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-wood-700 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Direct Factory Joinery</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manufactured in our Chennai facility with calibrated precision tools.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-wood-700 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Chennai Weather Resistance</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Treated for high humidity, anti-termite, and boiling water proof standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Principles & Highlights */}
      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-stone-200 shadow-sm space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
            Why Homeowners Choose JM INTERIOR
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
            The Standards We Stand By
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center">
              <Hammer className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-stone-900">
              True Artisanal Craft
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              While mass-produced modular cabinets often rely on inferior particle boards, our shop fabricates exclusively with heavy calibrated marine ply and authentic hardwood joinery.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Spatial Ergonomics
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every kitchen layout, wardrobe division, and TV unit distance is planned around how families naturally move, live, cook, and relax.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-wood-100 text-wood-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Honest & Transparent Estimates
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              No sudden hidden costs or inflated sub-contractor fees. We explain every material grade and hardware spec in writing before starting work.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Consultation CTA */}
      <div className="text-center py-6">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-4">
          Meet K. Selvam for Your Project
        </h3>
        <p className="text-stone-600 text-sm max-w-lg mx-auto mb-6">
          Schedule a direct site inspection or visit our studio in Chennai to view live timber veneer samples and hardware displays.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/appointment">
            <Button variant="primary">Book Appointment</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
