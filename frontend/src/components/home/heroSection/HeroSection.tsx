// components/home/heroSection/HeroSection.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import HeroFloating3D from "./HeroFloating3D";
import HeroScrollingText from "./HeroScrollingText";
import TextSlider from "./TextSlider";
import FlippingCard from "./FlipImage";

const HeroSection = () => {
  const handleWorkTogetherClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactElement = document.getElementById("Contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadResume = async () => {
    const response = await fetch("/assets/Resume.pdf");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Saif_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-16 overflow-hidden bg-white">
      <HeroScrollingText />
      <HeroFloating3D />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-0">
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold mt-6 mb-2 text-gray-900">
            Hi, I'm <span className="italic">Saif</span>!
          </h1>
          <TextSlider />
        </div>

        <FlippingCard />

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="#Contact"
            onClick={handleWorkTogetherClick}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <span>Let's Work Together!</span>
          </Link>

          <button
            onClick={handleDownloadResume}
            className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Download size={16} className="sm:w-5 sm:h-5" />
            <span>Download Resume</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;