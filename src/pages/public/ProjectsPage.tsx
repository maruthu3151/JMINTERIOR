import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';
import { getProjects } from '../../services/projectsService';
import { Project, ProjectCategory } from '../../types';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Interior Design',
  'Kitchen',
  'Living Hall',
  'Bedroom',
  'Office',
  'Others',
];

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjects(true);
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
          Our Portfolio
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-2">
          Architectural Projects & Interiors
        </h1>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          Explore curated interior transformations and custom woodwork commissions completed across Chennai with meticulous attention to form, function, and durability.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-wood-800 text-stone-50 shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-8 h-8 text-wood-600" />}
          title="Projects Coming Soon"
          description={`No published projects currently under the "${selectedCategory}" category.`}
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-stone-900/85 backdrop-blur-sm text-stone-100 text-xs font-medium rounded-full uppercase tracking-wider border border-white/10">
                      {project.category}
                    </div>

                    {project.status && (
                      <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-stone-100/90 text-stone-800 text-[11px] font-semibold rounded-md backdrop-blur-sm">
                        {project.status}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-wood-700 transition">
                        {project.title}
                      </h3>
                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-500">
                      <span>{project.materials?.[0] || 'Custom Joinery'}</span>
                      <span className="text-wood-800 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
