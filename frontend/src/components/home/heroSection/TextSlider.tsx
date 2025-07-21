import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const rotatingTexts = [
  "Full Stack Developer",
  "UI/UX Designer",
  "Creative Coder",
];

const TextSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % rotatingTexts.length);
    }, 3000); // 3 seconds delay
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-10 sm:h-12 overflow-hidden ">
      <AnimatePresence mode="wait">
        <motion.p
          key={rotatingTexts[index]}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute w-full text-center text-xl text-gray-600"
        >
          {rotatingTexts[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default TextSlider;
