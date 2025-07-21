import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import ProjectCard from '../components/project/ProjectCard';
import { mockProjects } from '../data/mock';

const techList = [
  { name: 'Python', icon: '🐍' },
  { name: 'Java', icon: '☕' },
  { name: 'Spring Boot', icon: '🌱' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'MySQL', icon: '🐬' },
  { name: 'Spring Security', icon: '🔐' },
  { name: 'React', icon: '⚛️' },
  { name: 'Tailwind CSS', icon: '🌬️' },
  { name: 'Next.js', icon: '⏭️' },
  { name: 'Express.js', icon: '🚂' },
  { name: 'Node.js', icon: '🟢' },
];

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'personal' | 'client' | 'internship'>('all');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLiveOnly, setShowLiveOnly] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    let filtered = mockProjects.filter(project => project.is_published);

    if (activeFilter !== 'all') {
      filtered = filtered.filter(project => project.type === activeFilter);
    }

    if (selectedTech.length > 0) {
      filtered = filtered.filter(project =>
        selectedTech.every(tech => project.technologies.includes(tech))
      );
    }

    if (showLiveOnly) {
      filtered = filtered.filter(project => project.is_live);
    }

    return filtered;
  }, [activeFilter, selectedTech, showLiveOnly]);

  const typeFilters = [
    { key: 'all', label: 'All Projects' },
    { key: 'client', label: 'Client Work' },
    { key: 'personal', label: 'Personal' },
    { key: 'internship', label: 'Internship' },
  ] as const;

  const toggleTech = (tech: string) => {
    setSelectedTech(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setSelectedTech([]);
    setShowLiveOnly(false);
    setIsDropdownOpen(false);
  };

  return (
    <div className="pt-20 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Type Dropdown */}
            <div className="relative w-full sm:w-48">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-100 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all flex items-center justify-between"
              >
                <span>
                  {typeFilters.find(f => f.key === activeFilter)?.label || 'Select Type'} (
                  {mockProjects.filter(
                    p => p.type === activeFilter || (activeFilter === 'all' && p.is_published)
                  ).length}
                  )
                </span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-md border border-gray-100"
                  >
                    {typeFilters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => {
                          setActiveFilter(filter.key);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                          activeFilter === filter.key ? 'bg-orange-100 text-orange-600' : ''
                        }`}
                      >
                        {filter.label} (
                        {mockProjects.filter(
                          p => p.type === filter.key || (filter.key === 'all' && p.is_published)
                        ).length}
                        )
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Tech Filters */}
          <div className="relative mt-3">
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
              {techList.map((tech) => {
                const isSelected = selectedTech.includes(tech.name);
                return (
                  <button
                    key={tech.name}
                    onClick={() => toggleTech(tech.name)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border transition-all hover:shadow-sm ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-600'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <span>{tech.icon}</span>
                    <span>{tech.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>

          {/* Live Only Checkbox and Active Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showLiveOnly}
                onChange={(e) => setShowLiveOnly(e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              Live Only
            </label>

            {(selectedTech.length > 0 || showLiveOnly || activeFilter !== 'all') && (
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <Filter size={14} className="text-gray-400" />
                <span className="text-gray-500">Active filters:</span>
                {activeFilter !== 'all' && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                    Type: {activeFilter}
                  </span>
                )}
                {selectedTech.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Tech: {tech}
                  </span>
                ))}
                {showLiveOnly && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Live Projects
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span>
            {filteredProjects.length === 1 ? ' project' : ' projects'}
          </p>
        </div>

        {/* Projects Listing */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Filter size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 text-sm mb-3">Try adjusting your filters to find what you're looking for.</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;