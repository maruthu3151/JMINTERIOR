import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleStopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleStopDrag);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleStopDrag);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleStopDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleStopDrag);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleStopDrag]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden select-none cursor-ew-resize shadow-lg border border-stone-200 ${className}`}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After transformation"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-stone-900/75 backdrop-blur-sm text-stone-100 text-xs font-semibold uppercase tracking-wider rounded-md border border-white/10 pointer-events-none">
        {afterLabel}
      </div>

      {/* Before Image (Clipped Overlay) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImage}
          alt="Before transformation"
          className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
            height: '100%',
          }}
        />
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-stone-900/75 backdrop-blur-sm text-stone-100 text-xs font-semibold uppercase tracking-wider rounded-md border border-white/10 pointer-events-none">
          {beforeLabel}
        </div>
      </div>

      {/* Vertical Slider Divider */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none transition-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-0 bottom-0 -ml-[1px] w-[2px] bg-white shadow-lg" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-stone-800 border border-stone-200 transition-transform hover:scale-110 active:scale-95">
          <ChevronsLeftRight className="w-4 h-4 text-wood-700" />
        </div>
      </div>
    </div>
  );
};
