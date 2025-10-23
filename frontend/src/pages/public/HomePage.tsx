// src/pages/HomePage.jsx
import HeroSection from "../../components/home/heroSection/HeroSection";
import AboutSection from "../../components/home/aboutSection/AboutSection";
import SkillsSection from "../../components/home/SkillSection";
import FeaturedProjectsSection from "../../components/home/featuredSection/FeaturedProjectSection";
import TestimonialsSection from "../../components/home/TestinomialSection";
import ContactSection from "../../components/home/contactSection/ContactSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <FeaturedProjectsSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;