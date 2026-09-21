import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Image as ImageIcon } from 'lucide-react';
import { getGalleryItems } from '../../services/galleryService';
import { GalleryItem, GalleryCategory } from '../../types';
import { Lightbox } from '../../components/ui/Lightbox';
import { EmptyState } from '../../components/ui/EmptyState';

const CATEGORIES: GalleryCategory[] = [
  'All',
  'Kitchen',
  'Bedroom',
  'Living Hall',
  'Office',
  'Other',
];

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getGalleryItems(true);
        setItems(data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const openLightboxAt = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
          Visual Craftsmanship
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-2">
          Interior & Carpentry Gallery
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
          An ongoing showcase of custom woodwork, luxury kitchens, designer living partitions, and residential suites handcrafted by JM INTERIOR.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
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

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-stone-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="w-8 h-8 text-wood-600" />}
          title="Gallery Coming Soon"
          description={`No published photos in the "${selectedCategory}" category yet.`}
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => openLightboxAt(idx)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-stone-100 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover overlay with title & zoom icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-between">
                  <div className="self-end p-2 rounded-full bg-white/20 text-white backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-wood-300 font-semibold">
                      {item.category}
                    </span>
                    <h3 className="text-white font-serif font-semibold text-sm line-clamp-2 mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={filteredItems.map((f) => ({
          url: f.imageUrl,
          title: f.title,
          category: f.category,
          description: f.description,
        }))}
        currentIndex={currentIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setCurrentIndex(idx)}
      />
    </div>
  );
};
