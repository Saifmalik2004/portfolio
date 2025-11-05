import { Filter } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  viewMode: "grid" | "list";
  loadingProjects: boolean;
  filteredProjects: any[];
  clearFilters: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  viewMode,
  loadingProjects,
  filteredProjects,
  clearFilters,
}) => {

    const SkeletonProjectCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 rounded-t-2xl" />
    <div className="p-6 border border-gray-100 rounded-b-2xl">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

  return (
    <>
      <div
        className={
          viewMode === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "space-y-6"
        }
      >
        {loadingProjects ? (
          [...Array(6)].map((_, idx) => <SkeletonProjectCard key={idx} />)
        ) : (
          filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))
        )}
      </div>

      {filteredProjects.length === 0 && !loadingProjects && (
        <div className="text-center py-12">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Filter size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Try adjusting your filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;
