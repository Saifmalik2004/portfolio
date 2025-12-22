import { useState, useEffect, useMemo } from "react";
import skillService from "@/services/skillService";
import projectService from "@/services/projectService";
import ProjectFilters from "@/components/project/ProjectFilter";
import ProjectList from "@/components/project/ProjectList";
import { PaginatedProjectResponse } from "@/types/project";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PROJECTS_PER_PAGE = 6;

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] =
    useState<"all" | "personal" | "client" | "internship">("all");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [availableSkills, setAvailableSkills] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<PaginatedProjectResponse>({
    content: [],
    page: 0,
    size: PROJECTS_PER_PAGE,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);

  // ✅ Fetch skills + projects
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [skills, pagedProjects] = await Promise.all([
          skillService.getAllSkills(),
          projectService.getPaginatedSimpleProjects(
            currentPage,
            PROJECTS_PER_PAGE
          ),
        ]);

        setAvailableSkills(skills.map((s) => ({ name: s.name })));
        setProjects(pagedProjects);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // ✅ Reset page on filter change (important UX fix)
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter, selectedTech, showLiveOnly]);

  // ✅ Client-side filtering
  const filteredProjects = useMemo(() => {
    let data = projects.content.filter((p) => p.published);

    if (activeFilter !== "all") {
      data = data.filter(
        (p) => p.type.toLowerCase() === activeFilter
      );
    }

    if (selectedTech) {
      data = data.filter((p) =>
        p.technologies.includes(selectedTech)
      );
    }

    if (showLiveOnly) {
      data = data.filter((p) => p.live);
    }

    return data;
  }, [projects, activeFilter, selectedTech, showLiveOnly]);

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

        {/* Filters */}
        <ProjectFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedTech={selectedTech}
          toggleTech={toggleTech}
          clearFilters={clearFilters}
          showLiveOnly={showLiveOnly}
          setShowLiveOnly={setShowLiveOnly}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          availableSkills={availableSkills}
          loadingSkills={loading}
          projects={projects.content}
        />

        {/* Info */}
        <p className="text-sm text-gray-600 mb-6">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredProjects.length}
          </span>{" "}
          projects
        </p>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <ProjectList
            viewMode={viewMode}
            loadingProjects={loading}
            filteredProjects={filteredProjects}
            clearFilters={clearFilters}
          />
        )}

        {/* Pagination */}
        {!loading && projects.totalPages > 1 && (
          <Pagination className="mt-12 text-black">
            <PaginationContent className="justify-center">

              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((p) => Math.max(p - 1, 0))
                  }
                  aria-disabled={currentPage === 0}
                  className={
                    currentPage === 0
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                />
              </PaginationItem>

              {[...Array(projects.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i)}
                    isActive={currentPage === i}
                    className={
                      currentPage === i
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "hover:bg-gray-100"
                    }
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(p + 1, projects.totalPages - 1)
                    )
                  }
                  aria-disabled={currentPage === projects.totalPages - 1}
                  className={
                    currentPage === projects.totalPages - 1
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
