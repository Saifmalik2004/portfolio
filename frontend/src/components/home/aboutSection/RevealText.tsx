'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useScroll } from 'framer-motion';

const RevealText = () => {
  const containerRef = useRef(null);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false); // track first-time animation

  const text =
    "I’m a fullstack developer with a strong passion for Java and crafting scalable, efficient systems. While backend development is where I feel most at home I also have a genuine interest in frontend development. I understand the importance of how backend and frontend work hand in hand to build great products.";
  const words = text.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  useEffect(() => {
    const animateWords = async () => {
      await controls.start({ opacity: 0.2, filter: 'blur(10px)' });

      for (let i = 0; i < words.length; i++) {
        await controls.start((index) => ({
          opacity: index <= i ? 1 : 0.2,
          filter: index <= i ? 'blur(0px)' : 'blur(10px)',
          transition: { duration: 0.05 },
        }));
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    };

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      if (progress > 0 && progress <= 1 && !hasAnimated) {
        animateWords();
        setHasAnimated(true); // prevent re-animation
      }
    });

    return () => unsubscribe();
  }, [controls, scrollYProgress, hasAnimated, words.length]);

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-white"
      style={{
        height: '100vh',
      }}
    >
      <p className="text-3xl text-gray-800 leading-relaxed flex flex-wrap gap-2 max-w-4xl mx-auto font-semibold">
        {words.map((word, index) => (
          <motion.span
            key={index}
            custom={index}
            animate={controls}
            initial={{ opacity: 0.2, filter: 'blur(10px)' }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
};

export default RevealText;
