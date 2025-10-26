import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import avtar1 from "/assets/images/avtar.png";
import avtar2 from "/assets/images/avtar2.png"; // agar ek aur avatar chahiye to add kar lena

const testimonials = [
  {
    name: "sudhanshu Sharma",
    role: "Founder, CodeVerse India",
    image: avtar2,
    content:
      "Working with Saif was an absolute pleasure! He understood exactly what our startup needed and built a fast, responsive, and visually stunning web app. His full-stack skills with React and Spring Boot made everything seamless.",
  },
  {
    name: "Vikas Yadav",
    role: "Tech Lead, Innovix Solutions",
    image: avtar2,
    content:
      "Honestly, Saif Malik is one of the most talented developers I’ve worked with. He doesn’t just code — he brings creative ideas to the table. Our project saw a huge improvement in UI/UX and overall performance.",
  },
  {
    name: "Priya Mehta",
    role: "Entrepreneur, ShopEasy India",
    image: avtar1,
    content:
      "Saif ke saath kaam karna ek amazing experience tha. Unhone mere e-commerce website ko scratch se design kiya, aur ab conversions double ho gaye hain! Itna smooth aur aesthetic design maine pehli baar dekha.",
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
        Kind Words from Clients
      </h2>

      <div className="relative h-[280px] md:h-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
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
              “{testimonials[index].content}”
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
              i === index ? "bg-blue-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
