import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, Grid, List } from "lucide-react";

interface ProjectFiltersProps {
  activeFilter: "all" | "personal" | "client" | "internship";
  setActiveFilter: (val: any) => void;
  selectedTech: string | null;
  toggleTech: (tech: string) => void;
  clearFilters: () => void;
  showLiveOnly: boolean;
  setShowLiveOnly: (val: boolean) => void;
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  availableSkills: { name: string }[];
  loadingSkills: boolean;
  projects: any[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  activeFilter,
  setActiveFilter,
  selectedTech,
  toggleTech,
  clearFilters,
  showLiveOnly,
  setShowLiveOnly,
  viewMode,
  setViewMode,
  isDropdownOpen,
  setIsDropdownOpen,
  availableSkills,
  loadingSkills,
  projects,
}) => {
  const typeFilters = [
    { key: "all", label: "All Projects" },
    { key: "client", label: "Client Work" },
    { key: "personal", label: "Personal" },
    { key: "internship", label: "Internship" },
  ] as const;

  const SkeletonTechPill = () => (
  <div className="w-20 h-6 bg-gray-300 rounded-full animate-pulse" />
);


  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      {/* Top Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Type Dropdown */}
        <div className="relative w-full sm:w-48">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gray-100 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-200 focus:ring-2 focus:ring-orange-500 transition-all flex items-center justify-between"
          >
            <span>
              {typeFilters.find((f) => f.key === activeFilter)?.label} (
              {
                projects.filter(
                  (p) =>
                    p.type.toLowerCase() === activeFilter ||
                    (activeFilter === "all" && p.published)
                ).length
              }
              )
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
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
                    className={`w-full text-left px-3 py-2 text-sm font-medium hover:bg-orange-50 transition-colors ${
                      activeFilter === filter.key
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-700"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md ${
              viewMode === "grid"
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md ${
              viewMode === "list"
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Tech Pills */}
      <div className="relative mt-3">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-slim">
          {loadingSkills
            ? [...Array(6)].map((_, idx) => <SkeletonTechPill key={idx} />)
            : availableSkills.map((tech) => {
                const isSelected = selectedTech === tech.name;
                return (
                  <button
                    key={tech.name}
                    onClick={() => toggleTech(tech.name)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
        </div>
        <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showLiveOnly}
            onChange={(e) => setShowLiveOnly(e.target.checked)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          Live Only
        </label>

        {(selectedTech || showLiveOnly || activeFilter !== "all") && (
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <Filter size={14} className="text-gray-400" />
            <span className="text-gray-500">Active filters:</span>
            {activeFilter !== "all" && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                Type: {activeFilter}
              </span>
            )}
            {selectedTech && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Tech: {selectedTech}
              </span>
            )}
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
  );
};

export default ProjectFilters;
