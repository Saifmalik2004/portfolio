"use client";

import type React from "react";
import { motion } from "framer-motion";
import { ProjectResponse } from "@/types/project";
import { Button } from "@/components/ui/button"; // ✅ import Shadcn button
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
    className={`relative transition-all duration-500 min-h-[600px] ${
      index === activeIndex ? "opacity-100" : "opacity-60"
    }`}
  >
    {/* Header */}
    <div className="mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-4xl font-bold text-black">—</span>
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">
            {project.title}
          </h2>
        </div>
      </div>
      <p className="text-lg text-black leading-relaxed mb-6 line-clamp-3">
  {project.description}
</p>

    </div>

    {/* Key Features */}
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Key Features
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {project.keyFeatures.slice(0, 4).map((feature, featureIndex) => (
          <motion.div
            key={featureIndex}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: featureIndex * 0.05 }}
            className="flex items-start space-x-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-orange-400 transition-all"
          >
            {/* Icon */}
            <div className="w-6 h-6 bg-gradient-to-tr from-green-500 to-green-400 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-lg font-bold">✓</span>
            </div>

            {/* Feature Text */}
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-relaxed">
              {feature}
            </p>
          </motion.div>
        ))}

        {/* extra features indicator */}
        {project.keyFeatures.length > 4 && (
          <div className="flex items-center justify-start text-sm text-gray-500 dark:text-gray-400 px-2">
            +{project.keyFeatures.length - 4} more...
          </div>
        )}
      </div>
    </div>

    <TechnologiesSection technologies={project.technologies} />

    {/* Buttons */}
    <div className="flex flex-wrap gap-3 mb-8">
      {/* View Details */}
      <Button
        asChild
        className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white"
      >
        <a href={`/projects/${project.slug}`}>View Details</a>
      </Button>

      {/* Live Demo */}
      {project.live && project.liveDemoUrl && (
        <Button
          asChild
          variant="outline"
          className="text-black hover:bg-gray-100 hover:text-gray-900"
        >
          <a
            href={project.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Demo
          </a>
        </Button>
      )}

      {/* Source Code */}
      {project.githubUrl && (
        <Button
          asChild
          variant="outline"
          className="text-black hover:bg-gray-100 hover:text-gray-900"
        >
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            Source Code
          </a>
        </Button>
      )}
    </div>

    {/* Divider */}
    {index < totalProjects - 1 && (
      <div className="mt-8 pt-8">
        <div className="w-12 h-1 bg-gradient-to-r from-orange-200 to-orange-500 rounded-full mx-auto" />
      </div>
    )}
  </motion.div>
);
