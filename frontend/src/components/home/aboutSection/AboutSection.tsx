import React from 'react';
import { motion } from 'framer-motion';
import FloatingTechIcons from './IconFloating';
import RevealText from './RevealText';

const AboutSection = () => {
  return (
    <section className="mt-28 relative bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Section Title */}
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold  text-gray-900"
        >
          About Me
        </motion.h2>

        {/* Main Content */}
        <div className=" mt-0 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-left "
          >
             <RevealText />
          </motion.div>

          {/* Right Side - Tech Stack Cards */}
         <FloatingTechIcons/>
        </div>
      </div>

      
    </section>
  );
};

export default AboutSection;
