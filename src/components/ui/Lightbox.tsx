import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  url: string;
  title?: string;
  category?: string;
  description?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentImage = images[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/95 backdrop-blur-md cursor-zoom-out"
          />

          {/* Top Bar with counter & close */}
          <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 text-stone-300">
            <div className="text-xs font-mono tracking-wider">
              {currentIndex + 1} / {images.length}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-stone-200 hover:text-white transition border border-stone-700/50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-stone-200 hover:text-white transition border border-stone-700/50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Content */}
          <div className="relative z-40 max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
            <motion.img
              key={currentImage.url}
              src={currentImage.url}
              alt={currentImage.title || 'Enlarged view'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-stone-800"
            />

            {(currentImage.title || currentImage.description) && (
              <div className="mt-4 text-center max-w-2xl px-4">
                {currentImage.title && (
                  <h4 className="text-stone-100 font-serif text-lg font-medium">
                    {currentImage.title}
                  </h4>
                )}
                {currentImage.description && (
                  <p className="text-stone-400 text-xs mt-1">
                    {currentImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
