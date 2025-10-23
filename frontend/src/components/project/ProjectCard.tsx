import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ProjectResponse } from "../../types/project";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ProjectCardProps {
  project: ProjectResponse;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group relative rounded-2xl overflow-hidden 
                 bg-white/30 backdrop-blur-xl border border-white/20 
                 shadow-[0_8px_25px_-6px_rgba(0,0,0,0.15)]
                 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden">
        <img
          src={project.images[0].url}
          alt={project.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover buttons */}
        <div className="absolute top-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-md transition-all duration-200"
          >
            <FaGithub size={16} className="text-gray-800" />
          </a>
          <a
            href={project.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-md transition-all duration-200"
          >
            <ExternalLink size={16} className="text-gray-800" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-[11px] font-medium 
                 bg-gray-100 text-gray-700 
                 rounded-full border border-gray-200"
            >
              {tech}
            </span>
          ))}

          {/* ✅ More Count Badge */}
          {project.technologies.length > 3 && (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="px-2.5 py-1 text-[11px] font-medium 
                     bg-gray-200 text-gray-800 
                     rounded-full border border-gray-300 cursor-pointer"
        >
          +{project.technologies.length - 3} more
        </span>
      </TooltipTrigger>

      <TooltipContent className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg space-y-1">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {project.technologies.slice(4).map((t) => (
            <span
              key={t}
              className="px-2 py-[2px] text-[11px] bg-gray-100 border border-gray-200 rounded text-black"
            >
              {t}
            </span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)}

        </div>

        <Link
          to={`/projects/${project.slug}`}
          className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
        >
          Explore →
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
