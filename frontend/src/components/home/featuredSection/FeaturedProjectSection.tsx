

import type React from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ProjectImageCarousel } from "./ProjectImageCarousel";
import { ProjectBadges } from "./ProjectBadges";
import { ProjectCard } from "./ProjectCard";
import projectService from "@/services/projectService";
import { ProjectResponse } from "@/types/project";
import GradientText from "@/components/ui/GardientText";

const FeaturedProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // 🔹 Fetch featured projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await projectService.getAllFeaturedProjects();
        setProjects(data || []);
      } catch (error) {
        console.error("❌ Failed to load featured projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // 🔹 Update active project on scroll
  const updateActiveIndex = useCallback(
    (newIndex: number) => {
      const now = Date.now();
      if (newIndex !== activeIndex && now - lastUpdateTime > 300) {
        setActiveIndex(newIndex);
        setLastUpdateTime(now);
      }
    },
    [activeIndex, lastUpdateTime]
  );

  // 🔹 Observe which project is visible
 // 🔹 Observe which project is visible
useEffect(() => {
  if (!projects.length) return;
  let debounceTimeout: NodeJS.Timeout;

  const observer = new IntersectionObserver(
    (entries) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        let bestEntry: Element | null = null;
        let highestRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            bestEntry = entry.target;
          }
        });

        if (bestEntry && highestRatio > 0.3) {
          const index = projectRefs.current.findIndex((ref) => ref === bestEntry);
          if (index !== -1) updateActiveIndex(index);
        }
      }, 200);
    },
    {
      root: null,
      rootMargin: "-10% 0px -10% 0px",
      threshold: [0.2, 0.4, 0.6, 0.8],
    }
  );

  projectRefs.current.forEach((ref) => ref && observer.observe(ref));

  return () => {
    observer.disconnect();
    clearTimeout(debounceTimeout);
  };
}, [projects, updateActiveIndex]);

  const currentProject = projects[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-white dark:bg-gray-950 min-h-screen scroll-mt-24"
      id="featured-projects"
    >
      {/* 🔸 Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 dark:text-white">
            Featured Projects
          </h1>
          <GradientText
            colors={["#ff8c00", "#2f2f2f"]}
            animationSpeed={3}
            showBorder={false}
            className="text-lg md:text-xl font-medium"
          >
            Scroll through my portfolio to explore each project in detail
          </GradientText>
        </div>
      </div>

      {/* 🔸 Projects Layout */}
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading featured projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-500">No featured projects available.</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Sticky Image Section (Desktop only) */}
            <div className="hidden lg:flex lg:sticky lg:top-36 lg:h-[70vh] lg:items-center">
              {currentProject ? (
                <motion.div
                  key={`project-details-${currentProject.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 w-full hover:shadow-2xl transition-shadow duration-300"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    {currentProject.title}
                  </h2>

                  {currentProject.images && currentProject.images.length > 0 ? (
                    <ProjectImageCarousel
                      images={currentProject.images}
                      title={currentProject.title}
                    />
                  ) : (
                    <div className="h-96 flex items-center justify-center text-gray-400">
                      No images available
                    </div>
                  )}

                  <div className="mt-6">
                    <ProjectBadges
                      type={currentProject.type}
                      isLive={currentProject.live}
                    />
                  </div>
                </motion.div>
              ) : (
                <p className="text-gray-400">Select a project to view details</p>
              )}
            </div>

            {/* Right Column (Project List) */}
<div className="space-y-12 sm:space-y-16 lg:space-y-20">
  {projects.map((project, index) => (
    <motion.div
      key={project.id}
      ref={(el) => (projectRefs.current[index] = el)}
      className={`transition-all duration-500 ease-out ${
        activeIndex === index ? "opacity-100 scale-[1.02]" : "opacity-90 scale-[1]"
      }`}
    >
      {/* Mobile Carousel */}
      <div className="lg:hidden mt-6">
        {project.images && project.images.length > 0 ? (
          <ProjectImageCarousel images={project.images} title={project.title} />
        ) : (
          <div className="h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      <ProjectCard
        project={project}
        index={index}
        activeIndex={activeIndex}
        projectRefs={projectRefs}
        totalProjects={projects.length}
      />
    </motion.div>
  ))}
</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
