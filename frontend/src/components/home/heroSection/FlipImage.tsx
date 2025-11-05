// components/home/heroSection/FlipImage.tsx

import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import meh from '/assets/images/meh.webp';
import mehi from '/assets/images/mehi.webp';

const FlippingCard = () => {
  const [flipped, setFlipped] = useState(false);

  const { scrollYProgress } = useScroll();
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const smoothScrollY = useSpring(scrollY, { stiffness: 50, damping: 20 });

  const handleFlip = () => setFlipped((prev) => !prev); // For mobile tap

  return (
    <motion.div
      className="w-[min(380px,90vw)] h-[min(380px,90vw)] mx-auto relative mb-8 cursor-pointer will-change-transform"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTap={handleFlip} // Add tap for mobile
      style={{
        perspective: '1000px',
        y: smoothScrollY,
      }}
    >
      <div
        className="w-full h-full transition-transform duration-700 rounded-3xl relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full rounded-3xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={meh}
            alt="Front"
            className="w-full h-full object-contain"
            loading="lazy" // Optimize loading
          />
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full rounded-3xl flex items-center justify-center"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <img
            src={mehi}
            alt="Back"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FlippingCard;