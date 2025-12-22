import React from "react";
import { ProjectResponse, ProjectType } from "../../../types/project";
import ProjectCard from "./projectCard";

type ProjectListProps = {
  projects: ProjectResponse[];
  // If provided, `renderProjects` will be rendered directly (useful for server/client pagination)
  renderProjects?: ProjectResponse[];
  searchTerm: string;
  filterType: ProjectType | "all";
  filterTech: string | "all";
  showOnlyLive: boolean;
  isFetching: boolean;
  isSaving: boolean;
  isDeleting: number | null;
  onToggleFlag: (projectId: number, flag: "live" | "published" | "featured") => void;
  onEdit: (project: ProjectResponse) => void;
  onPreview: (project: ProjectResponse) => void;
  onDelete: (id: number) => void;
};

const SkeletonProjectCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-40 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
    </div>
  </div>
);

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  renderProjects,
  searchTerm,
  filterType,
  filterTech,
  showOnlyLive,
  isFetching,
  isSaving,
  isDeleting,
  onEdit,
  onPreview,
  onDelete,
  onToggleFlag,
}) => {
  // If renderProjects supplied, use it directly (already filtered/paged)
  const filtered = renderProjects
    ? renderProjects
    : projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || project.type === filterType;
    const matchesTech =
      filterTech === "all" ||
      project.technologies.some((t) =>
        typeof t === "string" ? t.toLowerCase() === String(filterTech).toLowerCase() : false
      );
    const matchesLive = !showOnlyLive || project.live;
    return matchesSearch && matchesType && matchesTech && matchesLive;
  });

  if (isFetching)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonProjectCard key={i} />
        ))}
      </div>
    );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No projects found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => onEdit(project)}
          onPreview={() => onPreview(project)}
          onDelete={() => onDelete(project.id)}
          isSaving={isSaving}
          isDeleting={isDeleting === project.id}
          onToggleFlag={onToggleFlag} // Pass the toggle handler properly
        />
      ))}
    </div>
  );
};

export default ProjectList;
