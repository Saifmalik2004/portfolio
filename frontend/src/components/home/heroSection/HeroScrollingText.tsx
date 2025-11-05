// components/home/heroSection/HeroScrollingText.tsx

import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

const HeroScrollingText = () => {
  const text = "DEVELOPER DESIGNER CREATOR INNOVATOR ";
  const baseX = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationFrame(() => {
    if (ref.current) {
      const width = ref.current.offsetWidth / 2; // Since we duplicate the text
      baseX.set(baseX.get() - 1); // Adjust speed here (1px per frame ~60fps = 60px/s)
      if (Math.abs(baseX.get()) >= width) {
        baseX.jump(0); // Seamless reset
      }
    }
  });

  useEffect(() => {
    return controls;
  }, [controls]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 whitespace-nowrap will-change-transform">
        <motion.div
          ref={ref}
          style={{ x: baseX }}
          className="inline-flex text-[clamp(6rem,15vw,14rem)] font-black text-black select-none leading-none"
        >
          <span>{text}</span>
          <span>{text}</span> {/* Duplicate for seamless loop */}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroScrollingText;