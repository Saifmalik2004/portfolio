import React from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface ShowcaseCardProps {
  title: string;
  image: string;
  github_url: string;
  live_demo_url: string;
  slug: string;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  title,
  image,
  github_url,
  live_demo_url,
  slug,
}) => {
  return (
    <div className="space-y-4">
      <Link to={`/projects/${slug}`}>
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="rest"
          className="relative rounded-[2rem] overflow-hidden w-full h-[350px] cursor-pointer
            border-[10px] border-white/20 bg-white/10 backdrop-blur-3xl transition-all duration-300 shadow-lg"
        >
          {/* Optional glass inner glow layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-[2rem] z-0" />

          <div className="relative group w-full h-full z-10">
            {/* Project Image */}
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-[1.5rem]"
            />

            {/* Hover Buttons */}
            <motion.div
              variants={{
                rest: { opacity: 0, y: 10 },
                hover: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="absolute top-4 right-4 flex space-x-2 z-20"
              onClick={(e) => e.preventDefault()}
            >
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/30 backdrop-blur-lg rounded-full hover:bg-white/50 transition"
              >
                <FaGithub size={16} className="text-black" />
              </a>
              <a
                href={live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/30 backdrop-blur-lg rounded-full hover:bg-white/50 transition"
              >
                <ExternalLink size={16} className="text-black" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </Link>

      {/* Title */}
      <div className="px-2">
        <p className="text-2xl font-semibold text-black text-left">{title}</p>
      </div>
    </div>
  );
};

export default ShowcaseCard;
