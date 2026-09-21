import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getProjects } from '../../services/projectsService';
import { getServices } from '../../services/servicesService';
import { getGalleryItems } from '../../services/galleryService';
import { getReviews } from '../../services/reviewsService';
import { Project, ServiceItem, GalleryItem, ReviewItem } from '../../types';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Lightbox } from '../../components/ui/Lightbox';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [allProjects, allServices, allGallery, allReviews] = await Promise.all([
          getProjects(true),
          getServices(true),
          getGalleryItems(true),
          getReviews(true),
        ]);

        const featured = allProjects.filter((p) => p.isFeatured);
        setFeaturedProjects(featured.length > 0 ? featured.slice(0, 3) : allProjects.slice(0, 3));
        setServices(allServices.slice(0, 4));
        setGallery(allGallery.slice(0, 6));
        setReviews(allReviews.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80'}
            alt="JM INTERIOR Chennai"
            className="w-full h-full object-cover object-center brightness-[0.45] scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-900/60" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wood-500/20 border border-wood-400/30 text-wood-300 text-xs sm:text-sm font-medium tracking-widest uppercase mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-wood-400" />
            <span>Chennai’s Premium Architectural Interior Studio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-100 tracking-tight leading-[1.15] max-w-4xl mx-auto"
          >
            {settings.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {settings.heroSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-wood-700 hover:bg-wood-800 text-stone-50 font-medium text-sm uppercase tracking-wider shadow-lg shadow-wood-950/50 hover:shadow-wood-900/60 transition-all border border-wood-600/50 active:scale-95"
            >
              <span>{settings.heroCtaPrimary || 'Explore Our Projects'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/appointment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-stone-900/80 hover:bg-stone-800/90 text-stone-100 font-medium text-sm uppercase tracking-wider backdrop-blur-md border border-stone-700 hover:border-wood-400 transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4 text-wood-400" />
              <span>{settings.heroCtaSecondary || 'Book Consultation'}</span>
            </Link>
          </motion.div>

          {/* Key Metrics Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-stone-800/80 pt-10 text-stone-300 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                {settings.experienceYears || '18+'}
              </div>
              <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                Years of Craftsmanship
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                350+
              </div>
              <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                Completed Interiors
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                100%
              </div>
              <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                BWP Marine Grade
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                Chennai
              </div>
              <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">
                Master Workshop
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED PROJECTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
              Curated Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
              Featured Spaces & Residences
            </h2>
            <p className="text-stone-600 text-sm mt-2 max-w-lg">
              Explore bespoke modular kitchens, living room wall transformations, and luxurious bedroom suites crafted across Chennai.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-wood-800 hover:text-wood-950 transition group"
          >
            <span>View All Projects</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-stone-900/80 backdrop-blur-sm text-stone-100 text-xs font-medium rounded-full uppercase tracking-wider border border-white/10">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-wood-700 transition">
                      {project.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span>{project.materials?.[0] || 'Custom Woodwork'}</span>
                    <span className="text-wood-700 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Explore Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. SERVICES PREVIEW */}
      <section className="bg-wood-50/60 py-20 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
              Artisanal Craftsmanship
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
              Comprehensive Interior Services
            </h2>
            <p className="text-stone-600 text-sm mt-3">
              From concept sketches to flawless on-site installation, JM INTERIOR delivers custom carpentry and turnkey interior styling under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {service.imageUrl && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-5 bg-stone-100">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5 mb-6">
                    {service.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-wood-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">
                    {service.startingPrice ? `From ${service.startingPrice}` : 'Custom Estimate'}
                  </span>
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-wood-800 hover:text-wood-950"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-wood-800 hover:bg-wood-900 text-stone-50 text-xs font-medium uppercase tracking-wider shadow-sm transition"
            >
              <span>Explore All Our Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ABOUT K. SELVAM & CRAFTSMANSHIP SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80"
                alt="Woodworking craftsmanship at JM INTERIOR"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            {/* Experience Card Overlay */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-stone-900 text-stone-100 p-6 rounded-2xl shadow-xl max-w-xs border border-wood-600/30">
              <Award className="w-8 h-8 text-wood-400 mb-2" />
              <div className="font-serif text-2xl font-bold text-stone-100">
                {settings.experienceYears || '18+'} Years Experience
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Directed on-site by K. Selvam in Chennai, ensuring precision joinery in every project.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
                About the Founder & Studio
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2 leading-tight">
                {settings.aboutTitle}
              </h2>
            </div>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {settings.aboutDescription}
            </p>

            <div className="p-5 rounded-xl bg-wood-50 border border-wood-200/80">
              <h4 className="font-serif font-semibold text-stone-900 text-sm mb-1">
                Our Design & Carpentry Philosophy
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                "{settings.designPhilosophy}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-wood-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Genuine Materials
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Certified 710 marine ply & natural veneers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-wood-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Chennai Workshop
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Direct factory joinery, no middlemen markups.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-wood-800 hover:text-wood-950"
              >
                <span>Read Full Studio Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISUAL GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
              Visual Craftsmanship
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
              Workshop & Site Gallery
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Click on any photograph to view high-resolution finishes and details.
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-wood-800 hover:text-wood-950 transition"
          >
            <span>Open Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {gallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-stone-200 shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[11px] font-medium text-stone-100 leading-tight line-clamp-1">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CLIENT REVIEWS / TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="bg-stone-100/70 py-20 border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
                Client Testimonials
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mt-2">
                Trusted by Homeowners Across Chennai
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-gold-500 mb-3">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      "{rev.reviewText}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-serif font-bold text-stone-900 text-sm">
                        {rev.customerName}
                      </div>
                      {rev.projectType && (
                        <div className="text-[11px] text-wood-700 font-medium">
                          {rev.projectType}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-stone-900 text-stone-100 overflow-hidden px-6 py-16 sm:px-12 sm:py-20 text-center shadow-2xl border border-stone-800">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs uppercase font-semibold tracking-widest text-wood-400">
              Start Your Interior Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight">
              Ready to Craft Your Dream Space?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Schedule a personalized consultation with K. Selvam. We provide on-site measurement, 3D visualization, transparent woodwork estimations, and timely delivery across Chennai.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/appointment"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-wood-700 hover:bg-wood-800 text-stone-50 font-medium text-xs uppercase tracking-wider shadow-lg transition active:scale-95"
              >
                Schedule Appointment
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs uppercase tracking-wider border border-stone-700 transition active:scale-95"
              >
                Contact Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for Gallery Preview */}
      <Lightbox
        isOpen={lightboxOpen}
        images={gallery.map((g) => ({ url: g.imageUrl, title: g.title, description: g.description }))}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
