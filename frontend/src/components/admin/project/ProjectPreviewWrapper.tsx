"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Clock,
} from "lucide-react";
import { ProjectResponse } from "@/types/project";
import ImageSlider from "@/components/project/ImageSlider"; // adjust path if needed

type ProjectPreviewWrapperProps = {
  project: ProjectResponse;
  onBack: () => void;
  onEdit: () => void;
};

const ProjectPreviewWrapper: React.FC<ProjectPreviewWrapperProps> = ({
  project,
  onBack,
  onEdit,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "client":
        return "bg-green-100 text-green-700 border-green-200";
      case "personal":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "internship":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-10 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back & Edit Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
          >
            Edit
          </button>
        </div>

        {/* Image Slider */}
        {project.images && project.images.length > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <ImageSlider images={project.images} title={project.title} />
          </motion.div>
        )}

        {/* Project Details */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(
                      project.type
                    )}`}
                  >
                    {project.type.charAt(0).toUpperCase() +
                      project.type.slice(1)}{" "}
                    Project
                  </span>
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                      project.live
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {project.live ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>{project.live ? "Live" : "In Development"}</span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  {project.title}
                </h1>

                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {project.live && project.liveDemoUrl && (
                    <motion.a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                    >
                      <ExternalLink size={20} />
                      <span>View Live Demo</span>
                    </motion.a>
                  )}

                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      <Github size={20} />
                      <span>View Source</span>
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                  <Star className="text-orange-500 mr-3" size={24} />
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.keyFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap">
                    {project.technologies.map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.07 }}
                        className="m-1 flex items-center justify-center 
                          px-4 py-2 bg-orange-100 text-orange-800 rounded-xl 
                          border-2 border-orange-300 shadow-sm 
                          hover:shadow-md hover:border-orange-400 hover:bg-orange-200 
                          transition-all duration-300 font-medium text-sm"
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-orange-500" size={16} />
                      <p className="text-gray-900 font-medium">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-orange-500" size={16} />
                      <p className="text-gray-900 font-medium">
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectPreviewWrapper;
