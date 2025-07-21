import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, Eye, EyeOff, Clock, Tag, Star } from 'lucide-react';
import { getProjectBySlug } from '../data/mock';
import ImageSlider from '../components/project/ImageSlider';

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = slug ? getProjectBySlug(slug) : null;

  if (!project) {
    return (
      <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
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
      case 'client':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'personal':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'internship':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Technology icons mapping
  const getTechIcon = (tech: string) => {
    const techIcons: { [key: string]: string } = {
      'React': '⚛️',
      'TypeScript': '📘',
      'JavaScript': '🟨',
      'Node.js': '🟢',
      'Express': '🚀',
      'MongoDB': '🍃',
      'PostgreSQL': '🐘',
      'Python': '🐍',
      'Django': '🎯',
      'Vue.js': '💚',
      'Next.js': '▲',
      'TensorFlow': '🧠',
      'Docker': '🐳',
      'AWS': '☁️',
      'Firebase': '🔥',
      'Redux': '🔄',
      'Tailwind CSS': '🎨',
      'HTML5': '🌐',
      'CSS3': '🎨',
      'Stripe': '💳',
      'Web3': '🌐',
      'Solidity': '💎',
      'Ethers.js': '⚡',
      'MetaMask': '🦊',
      'IPFS': '📁',
      'Hardhat': '⚒️',
      'Laravel': '🔴',
      'Redis': '🔴',
      'Chart.js': '📊',
      'D3.js': '📈',
      'FastAPI': '⚡',
      'Jest': '🃏',
      'Expo': '📱',
      'React Native': '📱',
      'MQTT': '📡',
      'Arduino': '🔧',
      'Raspberry Pi': '🥧'
    };
    return techIcons[tech] || '🔧';
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
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(project.type)}`}>
                    {project.type.charAt(0).toUpperCase() + project.type.slice(1)} Project
                  </span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                    project.is_live 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {project.is_live ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>{project.is_live ? 'Live' : 'In Development'}</span>
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
                  {project.is_live && project.live_demo_url && (
                    <motion.a
                      href={project.live_demo_url}
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
                  
                  {project.github_url && (
                    <motion.a
                      href={project.github_url}
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
                  {project.key_features.map((feature, index) => (
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
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Technologies Used</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {project.technologies.map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
                      >
                        <span className="text-xl">{getTechIcon(tech)}</span>
                        <span className="text-sm text-gray-900 font-medium">{tech}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Project Meta */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Project Type</p>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(project.type)}`}>
                      {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                      project.is_live 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {project.is_live ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{project.is_live ? 'Live & Active' : 'In Development'}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Created</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-orange-500" size={16} />
                      <p className="text-gray-900 font-medium">{formatDate(project.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-orange-500" size={16} />
                      <p className="text-gray-900 font-medium">{formatDate(project.updated_at)}</p>
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