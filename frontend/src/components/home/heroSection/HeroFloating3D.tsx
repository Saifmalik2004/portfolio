import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import circle from '/assets/images/circle.avif';
import square from '/assets/images/square.avif';
import cylinder from '/assets/images/bigsylinder.avif';
import oval from '/assets/images/cylinder.avif';
import triangle from '/assets/images/triangle.avif';
import star from '/assets/images/star.avif';

const HeroFloating3D = () => {
  const { scrollYProgress } = useScroll();

  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -2000]);
  const smoothScrollY = useSpring(scrollY, { stiffness: 50, damping: 20 });

  const leftImages = [
    {
      id: 1,
      src: triangle,
      alt: '3D Design 1',
      position: 'top-[40px] left-[200px]',
      size: 'w-[280px] h-[280px]',
      delay: 0
    },
    {
      id: 2,
      src: circle,
      alt: '3D Design 2',
      position: 'top-1/3 left-[100px]',
      size: 'w-[280px] h-[280px]',
      delay: 0.5
    },
    {
      id: 3,
      src: cylinder,
      alt: '3D Design 3',
      position: 'bottom-[-10px] left-[200px]',
      size: 'w-[280px] h-[280px]',
      delay: 1
    }
  ];

  const rightImages = [
    {
      id: 4,
      src: oval,
      alt: '3D Design 4',
      position: 'top-1/3 right-[100px]',
      size: 'w-[280px] h-[280px]',
      delay: 1.5
    },
    {
      id: 5,
      src: star,
      alt: '3D Design 5',
      position: 'bottom-[-10px] right-[200px]',
      size: 'w-[280px] h-[280px]',
      delay: 2
    },
    {
      id: 6,
      src: square,
      alt: '3D Design 6',
      position: 'top-[40px] right-[200px]',
      size: 'w-[280px] h-[280px]',
      delay: 2.5
    }
  ];

  const allImages = [...leftImages, ...rightImages];

  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
      {allImages.map((image) => (
        <motion.div
          key={image.id}
          className={`absolute ${image.position} ${image.size}`}
          style={{ y: smoothScrollY }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            
          }}
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: image.delay
            }}
            className="w-full h-full rounded-full overflow-visible drop-shadow-xl"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default HeroFloating3D;
