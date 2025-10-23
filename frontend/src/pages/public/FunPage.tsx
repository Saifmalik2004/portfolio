import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Gamepad2, Sparkles } from 'lucide-react';
import TerminalInterface from '../../components/fun/TerminalInterface';

type ActiveFeature = 'terminal' | null;

const FunPage = () => {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>(null);

  const features = [
    {
      id: 'terminal' as const,
      title: 'Interactive Terminal',
      description: 'Explore my portfolio through command-line interface',
      icon: Terminal,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
  ];

  const handleFeatureSelect = (featureId: ActiveFeature) => {
    setActiveFeature(featureId);
  };

  const handleExit = () => {
    setActiveFeature(null);
  };

  // Full-screen feature view
  if (activeFeature) {
    const feature = features.find(f => f.id === activeFeature);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Header with exit button */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${feature?.color} rounded-full flex items-center justify-center`}>
                {feature?.icon && <feature.icon size={20} className="text-white" />}
              </div>
              <div>
                <h3 className="text-white font-medium">{feature?.title}</h3>
                <p className="text-gray-400 text-sm">{feature?.description}</p>
              </div>
            </div>
            <motion.button
              onClick={handleExit}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
              title="Exit (or type 'exit' command)"
            >
              ✕
            </motion.button>
          </div>
        </div>

        {/* Feature content */}
        <div className="pt-20 h-full">
          {activeFeature === 'terminal' && <TerminalInterface onExit={handleExit} />}
        </div>
      </motion.div>
    );
  }

  // Main Fun page with feature selection
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-4"
            >
              <Gamepad2 size={32} className="text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold text-gray-900">
              Interactive <span className="text-orange-500">Playground</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore my portfolio in a fun and interactive way! Choose from different experiences below.
          </p>
        </motion.div>

        {/* Feature Selection Cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group cursor-pointer bg-white rounded-2xl p-8 border-2 ${feature.borderColor} hover:shadow-xl transition-all duration-300`}
                onClick={() => handleFeatureSelect(feature.id)}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={40} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center space-x-2 px-6 py-3 ${feature.bgColor} ${feature.textColor} rounded-xl font-medium border ${feature.borderColor} group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 transition-all`}
                  >
                    <span>Launch Experience</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works - only terminal now */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="text-orange-500 mr-2" size={24} />
                <h3 className="text-xl font-bold text-gray-900">How It Works</h3>
                <Sparkles className="text-orange-500 ml-2" size={24} />
              </div>
              
              <div className="flex items-start space-x-3 justify-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Terminal size={16} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Terminal Experience</h4>
                  <p className="text-gray-600 text-sm">
                    Click to open a full-screen terminal. Use commands like <code className="bg-gray-100 px-1 rounded">-help</code>, <code className="bg-gray-100 px-1 rounded">-about</code>, <code className="bg-gray-100 px-1 rounded">-skills</code>. Type <code className="bg-gray-100 px-1 rounded">exit</code> to return.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Interactive Features', value: '1', icon: '🎮' },
              { label: 'Terminal Commands', value: '10+', icon: '💻' },
              { label: 'AI Responses', value: '∞', icon: '🤖' },
              { label: 'Fun Level', value: '100%', icon: '🚀' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-orange-500 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FunPage;
