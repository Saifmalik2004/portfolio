import React, { useState, useEffect } from "react";
import skillService from "@/services/skillService";
import { Skill } from "@/types/skill";
import { ProjectRequest, ProjectResponse, ProjectType } from "@/types/project";
import projectService from "@/services/projectService";
import ProjectControls from "@/components/admin/project/ProjectControls";
import ProjectList from "@/components/admin/project/ProjectList";
import DeleteConfirmModal from "@/components/admin/project/DeleteConfirmModal";
import ProjectPreviewWrapper from "@/components/admin/project/ProjectPreviewWrapper";
import ProjectEditorWrapper from "@/components/admin/project/ProjectEditorWrapper";



// View Modes
type ViewMode = "list" | "add" | "edit" | "preview";

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [availableTechnologies, setAvailableTechnologies] = useState<Skill[]>([]);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [previewProject, setPreviewProject] = useState<ProjectResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ProjectType | "all">("all");
  const [filterTech, setFilterTech] = useState<string | "all">("all");
  const [showOnlyLive, setShowOnlyLive] = useState(false);
  const [, setError] = useState<string | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const types: (ProjectType | "all")[] = ["all", ...(Object.values(ProjectType) as ProjectType[])];

  // Fetch projects and technologies on mount
  useEffect(() => {
    const fetchAll = async () => {
      setIsFetching(true);
      try {
        const [projData, techData] = await Promise.all([
          projectService.getAllProjects(),
          skillService.getAllSkills?.(), // <-- You need to add this method in your service to fetch tech list
        ]);

        setProjects(projData);
        if (techData) setAvailableTechnologies(techData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch projects or technologies. Please try again.");
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAll();
  }, []);

  // Helper to update single project state immutably
  const updateProjectInState = (updated: ProjectResponse) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  // CRUD handlers
  const handleAddProject = () => {
    setSelectedProject(null);
    setViewMode("add");
  };

  const handleEditProject = (project: ProjectResponse) => {
    setSelectedProject(project);
    setViewMode("edit");
  };

  const handlePreviewProject = (project: ProjectResponse) => {
    setPreviewProject(project);
    setViewMode("preview");
  };

  const confirmDelete = async () => {
    if (projectToDelete === null) return;
    setIsDeleting(projectToDelete);
    try {
      await projectService.deleteProject(projectToDelete);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete));
      setError(null);
    } catch (err) {
      setError("Failed to delete project. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(null);
      setShowConfirmModal(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteProject = (projectId: number) => {
    setProjectToDelete(projectId);
    setShowConfirmModal(true);
  };

  const handleSaveProject = async (data: ProjectRequest) => {
    setIsSaving(true);
    try {
      if (selectedProject) {
        console.log(data)
        const updated = await projectService.updateProject(selectedProject.id, data);
        updateProjectInState(updated);
      } else {
        const created = await projectService.createProject(data);
        setProjects((prev) => [created, ...prev]);
      }
      setViewMode("list");
      setSelectedProject(null);
      setError(null);
    } catch (err) {
      setError("Failed to save project. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedProject(null);
    setPreviewProject(null);
  };

  // Toggle handlers for live/published/featured status
  const toggleFlag = async (
    projectId: number,
    flag: "live" | "published" | "featured"
  ) => {
    try {
      let updatedProject: ProjectResponse | null = null;
      if (flag === "live") {
        updatedProject = await projectService.toggleLive(projectId);
      } else if (flag === "published") {
        updatedProject = await projectService.togglePublished(projectId);
      } else if (flag === "featured") {
        updatedProject = await projectService.toggleFeatured(projectId);
      }
      if (updatedProject) updateProjectInState(updatedProject);
    } catch (err) {
      setError(`Failed to toggle ${flag}. Please try again.`);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {viewMode === "list" && (
        <>
          <ProjectControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterTech={filterTech}
            setFilterTech={setFilterTech}
            showOnlyLive={showOnlyLive}
            setShowOnlyLive={setShowOnlyLive}
            types={types}
            technologies={availableTechnologies}
            onAdd={handleAddProject}
            isSaving={isSaving}
          />
          <ProjectList
            projects={projects}
            searchTerm={searchTerm}
            filterType={filterType}
            filterTech={filterTech}
            showOnlyLive={showOnlyLive}
            isFetching={isFetching}
            isSaving={isSaving}
            isDeleting={isDeleting}
            onEdit={handleEditProject}
            onPreview={handlePreviewProject}
            onDelete={handleDeleteProject}
            onToggleFlag={toggleFlag} // pass toggler
          />
          <DeleteConfirmModal
            open={showConfirmModal}
            onOpenChange={setShowConfirmModal}
            onConfirm={confirmDelete}
            title="Delete Project"
            description="Are you sure you want to delete this project? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}

      {(viewMode === "add" || viewMode === "edit") && (
        <ProjectEditorWrapper
          project={selectedProject}
          onSave={handleSaveProject}
          onCancel={handleBackToList}
          onPreview={(p) => {
            setPreviewProject(p);
            setViewMode("preview");
          }}
          isSaving={isSaving}
          availableTechnologies={availableTechnologies} // pass tech list here, update your editor accordingly
        />
      )}

      {viewMode === "preview" && previewProject && (
        <ProjectPreviewWrapper
          project={previewProject}
          onBack={handleBackToList}
          onEdit={() => {
            setSelectedProject(previewProject);
            setViewMode("edit");
          }}
        />
      )}
    </div>
  );
};

export default ProjectManagement;
