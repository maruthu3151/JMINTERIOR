import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, IndianRupee, Layers, CheckCircle2 } from 'lucide-react';
import { getProjectBySlug } from '../../services/projectsService';
import { Project } from '../../types';
import { BeforeAfterSlider } from '../../components/ui/BeforeAfterSlider';
import { Lightbox } from '../../components/ui/Lightbox';
import { Button } from '../../components/ui/Button';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      if (!slug) return;
      try {
        const data = await getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-stone-200 rounded" />
        <div className="h-10 w-2/3 bg-stone-200 rounded" />
        <div className="aspect-[16/9] w-full bg-stone-200 rounded-2xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-3">Project Not Found</h2>
        <p className="text-stone-600 mb-8">
          The requested project might have been updated or removed.
        </p>
        <Link to="/projects">
          <Button variant="primary">Return to Projects</Button>
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.galleryImages || []),
  ];

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-wood-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Project Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-wood-100 text-wood-800 text-xs font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          {project.status && (
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium">
              {project.status}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-6 pt-2 text-xs text-stone-500 font-medium">
          {project.budget && (
            <div className="flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-wood-700" />
              <span>Investment: <strong className="text-stone-800">{project.budget}</strong></span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-wood-700" />
            <span>Chennai Workshop Handcrafted</span>
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl border border-stone-200">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Story & Materials Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Story */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            About This Commission
          </h2>
          <div className="text-stone-700 text-base leading-relaxed space-y-4 whitespace-pre-line">
            {project.description}
          </div>

          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-4">
            <Link to="/appointment" className="w-full sm:w-auto">
              <Button variant="primary" icon={<Calendar className="w-4 h-4 text-wood-300" />}>
                Request Similar Design
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline">Consult with K. Selvam</Button>
            </Link>
          </div>
        </div>

        {/* Materials Specification Sidebar */}
        <div className="bg-wood-50/70 p-6 sm:p-8 rounded-2xl border border-wood-200/80 space-y-5">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Materials & Finishes Used
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All timber and sheet goods are hand-inspected for grain alignment, durability, and humidity resistance in Chennai's climate.
          </p>

          <ul className="space-y-3 pt-2">
            {(project.materials || []).map((mat, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                <span>{mat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Before & After Transformation Slider (if provided) */}
      {project.beforeImage && project.afterImage && (
        <section className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
              Visual Transformation
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Before & After Comparison
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Drag the interactive handle across the frame to inspect the interior transformation.
            </p>
          </div>

          <BeforeAfterSlider
            beforeImage={project.beforeImage}
            afterImage={project.afterImage}
            beforeLabel="Before Renovation"
            afterLabel="JM INTERIOR Finish"
          />
        </section>
      )}

      {/* Project Photo Gallery */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Commission Gallery
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Click any photograph to inspect joinery details in high definition.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setLightboxIndex(idx + 1); // +1 because cover is at 0
                  setLightboxOpen(true);
                }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-stone-100 border border-stone-200 shadow-sm"
              >
                <img
                  src={imgUrl}
                  alt={`${project.title} detail ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-stone-900/80 text-stone-100 text-xs font-medium backdrop-blur-sm">
                    View Fullscreen
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox for Project Photos */}
      <Lightbox
        isOpen={lightboxOpen}
        images={allImages.map((url) => ({ url, title: project.title }))}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </article>
  );
};
