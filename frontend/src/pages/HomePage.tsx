import { motion } from "framer-motion";
import HeroSection from "../components/home/heroSection/HeroSection";
import AboutSection from "../components/home/aboutSection/AboutSection";
import SkillsSection from "../components/home/SkillSection";
import FeaturedProjectsSection from "../components/home/featuredSection/FeaturedProjectSection";
import TestimonialsSection from "../components/home/TestinomialSection";
import ContactSection from "../components/home/contactSection/ContactSection";

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-white"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Featured Section */}
      <FeaturedProjectsSection />

      {/* Testinomial Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />
    </motion.div>
  );
};

export default HomePage;
