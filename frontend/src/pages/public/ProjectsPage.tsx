import { useState, useMemo, useEffect } from "react";
import skillService from "../../services/skillService";
import projectService from "../../services/projectService";
import ProjectFilters from "@/components/project/ProjectFilter";
import ProjectList from "@/components/project/ProjectList";


const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "personal" | "client" | "internship"
  >("all");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [availableSkills, setAvailableSkills] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSkills(true);
      setLoadingProjects(true);
      try {
        const [skills, proj] = await Promise.all([
          skillService.getAllSkills(),
          projectService.getAllSimpleProjects(),
        ]);
        setAvailableSkills(skills.map((s) => ({ name: s.name })));
        setProjects(proj);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoadingSkills(false);
        setLoadingProjects(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (loadingProjects) return [];
    let filtered = projects.filter((p) => p.published);
    if (activeFilter !== "all")
      filtered = filtered.filter(
        (p) => p.type.toLowerCase() === activeFilter
      );
    if (selectedTech)
      filtered = filtered.filter((p) => p.technologies.includes(selectedTech));
    if (showLiveOnly) filtered = filtered.filter((p) => p.live);
    return filtered;
  }, [activeFilter, selectedTech, showLiveOnly, projects, loadingProjects]);

  const toggleTech = (tech: string) =>
    setSelectedTech((prev) => (prev === tech ? null : tech));

  const clearFilters = () => {
    setActiveFilter("all");
    setSelectedTech(null);
    setShowLiveOnly(false);
    setIsDropdownOpen(false);
  };

  return (
    <div className="pt-20 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectFilters
          {...{
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
          }}
        />

        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredProjects.length}
            </span>{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <ProjectList
          {...{
            viewMode,
            loadingProjects,
            filteredProjects,
            clearFilters,
          }}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
