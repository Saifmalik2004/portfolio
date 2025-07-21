import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import meh from '/assets/images/meh.png';
import mehi from '/assets/images/mehi.png';

const FlippingCard = () => {
  const [flipped, setFlipped] = useState(false);

  const { scrollYProgress } = useScroll();
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const smoothScrollY = useSpring(scrollY, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      className="w-[380px] h-[380px] mx-auto relative mb-8 cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
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
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FlippingCard;
