// components/ImageSlider.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageUploadResponse } from '@/types/project';

interface ImageSliderProps {
  images: ImageUploadResponse[];
  title: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Touch/Swipe Handler
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) prevSlide();
    else if (info.offset.x < -threshold) nextSlide();
  };

  // Auto-play (optional — remove if not needed)
  // useEffect(() => {
  //   const timer = setInterval(nextSlide, 5000);
  //   return () => clearInterval(timer);
  // }, []);

  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
        <img
          src={images[0].url}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gray-100">
      {/* Main Slider */}
      <div className="relative w-full aspect-video">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <img
              src={images[currentIndex].url}
              alt={`${title} - ${currentIndex + 1}`}
              className="w-full h-full object-cover pointer-events-none"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Hidden on Mobile */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 backdrop-blur-sm rounded-full 
                     hover:bg-white transition-all shadow-lg 
                     hidden sm:flex items-center justify-center"
          aria-label="Previous"
        >
          <ChevronLeft size={22} className="text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 backdrop-blur-sm rounded-full 
                     hover:bg-white transition-all shadow-lg 
                     hidden sm:flex items-center justify-center"
          aria-label="Next"
        >
          <ChevronRight size={22} className="text-gray-700" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Dot Indicators - Mobile Friendly */}
      <div className="flex justify-center gap-2 mt-4 px-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-orange-500'
                : 'w-2 h-2 bg-white/60 hover:bg-white/90'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;