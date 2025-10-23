import { motion } from "framer-motion";
import FloatingTechIcons from "./IconFloating";
import BlurText from "@/components/ui/BlurText";

const text =
  "I’m a fullstack developer with a strong passion for Java and crafting scalable, efficient systems. While backend development is where I feel most at home I also have a genuine interest in frontend development. I understand the importance of how backend and frontend work hand in hand to build great products.";
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
        <div className=" mt-0 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Side - Text */}

          <BlurText
            text={text}
            delay={100}
            animateBy="words"
            direction="top"
            className="text-3xl leading-relaxed  text-wrap  text-black font-semibold "
          />

          {/* Right Side - Tech Stack Cards */}
          <FloatingTechIcons />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
