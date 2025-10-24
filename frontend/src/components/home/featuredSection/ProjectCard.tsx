

import type React from "react";
import { motion } from "framer-motion";
import { ProjectResponse } from "@/types/project";
import { Button } from "@/components/ui/button";
import { TechnologiesSection } from "./Tech";

export const ProjectCard: React.FC<{
  project: ProjectResponse;
  index: number;
  activeIndex: number;
  projectRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  totalProjects: number;
}> = ({ project, index, activeIndex, projectRefs, totalProjects }) => (
  <motion.div
    key={project.id}
    ref={(el) => (projectRefs.current[index] = el)}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20%" }}
    className={`relative transition-all duration-500 min-h-[500px] sm:min-h-[600px] ${
      index === activeIndex ? "opacity-100" : "opacity-60"
    }`}
  >
    {/* Header */}
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
        <span className="text-3xl sm:text-4xl font-bold text-black">—</span>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            {project.title}
          </h2>
        </div>
      </div>
      <p className="text-base sm:text-lg text-black leading-relaxed mb-6 line-clamp-3">
        {project.description}
      </p>
    </div>

    {/* Key Features */}
    <div className="mb-8">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        Key Features
      </h3>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {project.keyFeatures.slice(0, 4).map((feature, featureIndex) => (
          <motion.div
            key={featureIndex}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: featureIndex * 0.05 }}
            className="flex items-start space-x-3 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:border-orange-400 transition-all"
          >
            <div className="w-6 h-6 bg-gradient-to-tr from-green-500 to-green-400 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-sm font-bold">✓</span>
            </div>
            <p className="text-gray-800 text-sm font-medium leading-relaxed">
              {feature}
            </p>
          </motion.div>
        ))}
        {project.keyFeatures.length > 4 && (
          <div className="flex items-center text-sm text-gray-500 px-2">
            +{project.keyFeatures.length - 4} more...
          </div>
        )}
      </div>
    </div>

    <TechnologiesSection technologies={project.technologies} />

    {/* Buttons */}
    <div className="flex flex-wrap gap-3 mb-8">
      <Button
        asChild
        className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
      >
        <a href={`/projects/${project.slug}`}>View Details</a>
      </Button>

      {project.live && project.liveDemoUrl && (
        <Button
          asChild
          variant="outline"
          className="text-black hover:bg-gray-100 text-sm sm:text-base"
        >
          <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
            Live Demo
          </a>
        </Button>
      )}

      {project.githubUrl && (
        <Button
          asChild
          variant="outline"
          className="text-black hover:bg-gray-100 text-sm sm:text-base"
        >
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            Source Code
          </a>
        </Button>
      )}
    </div>

    {index < totalProjects - 1 && (
      <div className="mt-8 pt-8">
        <div className="w-12 h-1 bg-gradient-to-r from-orange-200 to-orange-500 rounded-full mx-auto" />
      </div>
    )}
  </motion.div>
);
