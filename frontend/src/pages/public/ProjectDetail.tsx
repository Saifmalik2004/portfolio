import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Eye,
  EyeOff,
  Clock,
  Star,
} from "lucide-react";
import projectService from "../../services/projectService"; // adjust path
import ImageSlider from "../../components/project/ImageSlider";
import { ProjectResponse } from "@/types/project";
const ProjectDetailSkeleton = () => (
  <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Back Button */}
      <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>

      {/* Image Slider */}
      <div className="h-[400px] bg-gray-200 rounded-2xl mb-12"></div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-40 bg-gray-200 rounded"></div>
            <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-5 w-full bg-gray-200 rounded"></div>
            <div className="h-5 w-5/6 bg-gray-200 rounded"></div>
            <div className="flex gap-4 mt-6">
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded mt-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProjectDetail = () => {
  const { slug } = useParams<string>();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjectBySlug(slug);
        setProject(data);
        setError(null);
      } catch (err) {
        setError("Project not found or failed to fetch");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <ProjectDetailSkeleton/>
    );
  }

  if (error || !project) {
    return (
      <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error ||
              "The project you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </Link>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <ImageSlider images={project.images} title={project.title} />
          </div>
        </motion.div>

        {/* Project Info Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2">
              {/* Project Header */}
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
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                  <Star className="text-orange-500 mr-3" size={24} />
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.keyFeatures.map((feature: string, index: number) => (
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

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap">
                    {project.technologies.map((tech: string, index: number) => (
                      <motion.div
                        key={tech}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.07 }}
                        className="
          m-1 flex items-center justify-center 
          px-4 py-2 
          bg-orange-100 text-orange-800 rounded-xl 
          border-2 border-orange-300 
          shadow-md 
          hover:shadow-lg hover:border-orange-400 hover:bg-orange-200 
          transition-all duration-300
          select-none
          font-medium
          text-sm
        "
                      >
                        <span>{tech}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Project Meta */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Project Type</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(
                        project.type
                      )}`}
                    >
                      {project.type.charAt(0).toUpperCase() +
                        project.type.slice(1)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                        project.live
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {project.live ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>
                        {project.live ? "Live & Active" : "In Development"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">featured</p>
                    <div
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                        project.featured
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      <span>
                        {project.featured ? "Featured" : "Not Featured"}
                      </span>
                    </div>
                  </div>

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

export default ProjectDetail;
