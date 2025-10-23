
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import avtar1 from '/assets/images/avtar.png';
import avtar2 from '/assets/images/avtar2.png';
const testimonials = [
  {
    name: 'David Lee',
    role: 'CEO, Technovation Inc.',
    image: avtar1,
    content:
      "Working with Larry was a dream. He took the time to understand our business and target audience, and the website he designed perfectly reflects our brand identity. Larry's ongoing support also gives us peace of mind, knowing our website is always running smoothly.",
  },
  {
    name: 'David Lee',
    role: 'CEO, Technovation Inc.',
    image: avtar1,
    content:
      "Working with Larry was a dream. He took the time to understand our business and target audience, and the website he designed perfectly reflects our brand identity. Larry's ongoing support also gives us peace of mind, knowing our website is always running smoothly.",
  },
  {
    name: 'Sarah Jones',
    role: 'Marketing Manager, Green Earth Solar',
    image: avtar2,
    content:
      "Larry’s design transformed our website! It’s not just gorgeous, but it’s incredibly user-friendly too. We’ve seen a huge jump in leads since launch, and customers love the easy navigation. Larry truly exceeded our expectations!",
  },
];

export default function MinimalTestimonialSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const changeTestimonial = (i: number) => setIndex(i);

  return (
    <section className="pt-11 pb-20 bg-white text-center overflow-hidden w-full">
      <h2 className="text-3xl md:text-5xl font-semibold mb-10 text-gray-900">
        Kind words from Clients
      </h2>

      <div className="relative h-[260px] md:h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Avatar */}
            <div className="rounded-full flex items-center justify-center mb-6 shadow-md">
              <img
                src={testimonials[index].image}
                alt={testimonials[index].name}
                className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
              />
            </div>

            {/* Name and Role */}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
              {testimonials[index].name}
            </h3>
            <p className="text-gray-500 text-sm md:text-base mb-4">
              {testimonials[index].role}
            </p>

            {/* Quote */}
            <p className="italic text-gray-700 max-w-5xl px-6 text-base md:text-lg leading-relaxed">
              "{testimonials[index].content}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => changeTestimonial(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? 'bg-blue-500 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
