import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Project } from "../../types/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.1 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0px 12px 24px rgba(0,0,0,0.1)",
      }}
      className="group relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg transition-all duration-200"
    >
      <div className="bg-white rounded-2xl">
        <div className="relative overflow-hidden">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-56 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-200" />

          <div className="absolute top-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition-all duration-200 shadow-sm"
            >
              <FaGithub size={18} className="text-white" />
            </a>
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition-all duration-200 shadow-sm"
            >
              <ExternalLink size={18} className="text-white" />
            </a>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-full border border-orange-100 hover:bg-orange-100 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-700 font-semibold text-sm transition-colors duration-200"
          >
            <span>Explore Project</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
