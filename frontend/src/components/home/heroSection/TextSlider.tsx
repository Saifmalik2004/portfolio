// components/home/heroSection/TextSlider.tsx

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const rotatingTexts = [
  "Full Stack Developer",
  "UI/UX Designer",
  "Creative Coder",
  "Full Stack Developer", // Duplicate first for seamless loop back
];

const TextSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % rotatingTexts.length;
        if (next === 0) {
          // When looping back, skip animation or instant reset, but since duplicated, it flows
          return next;
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 sm:h-10 lg:h-12 overflow-hidden">
      <motion.div
        key={rotatingTexts[index]}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="absolute w-full text-center text-lg sm:text-xl lg:text-2xl text-gray-600"
      >
        {rotatingTexts[index]}
      </motion.div>
    </div>
  );
};

export default TextSlider;