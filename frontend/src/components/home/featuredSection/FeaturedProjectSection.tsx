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

  // 🔹 Fetch featured projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await projectService.getAllFeaturedProjects();
        setProjects(data); // sirf published projects
      } catch (error) {
        console.error("❌ Failed to load featured projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

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

  // 🔹 IntersectionObserver for scrolling
  useEffect(() => {
    if (!projects.length) return;
    let debounceTimeout: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          let bestEntry: Element | null = null;
          let highestRatio = 0;

          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.intersectionRatio > highestRatio
            ) {
              highestRatio = entry.intersectionRatio;
              bestEntry = entry.target;
            }
          });

          if (bestEntry && highestRatio > 0.6) {
            const index = projectRefs.current.findIndex(
              (ref) => ref === bestEntry
            );
            if (index !== -1) updateActiveIndex(index);
          }
        }, 200);
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0.4, 0.6, 0.8],
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
      className="relative py-32 bg-white min-h-screen scroll-mt-24"
      id="featured-projects"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 text-gray-800">
            Featured Projects
          </h1>
          <GradientText
            colors={[
 "#ff8c00", // pure white
  "#2f2f2f" 


]}

            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            Scroll through my portfolio to explore each project in detail
          </GradientText>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto"></p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {loading ? (
          <p className="text-center text-gray-500">
            Loading featured projects...
          </p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-500">
            No featured projects available.
          </p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left (details panel) */}
            <div className="lg:sticky lg:top-36 lg:h-[70vh] lg:flex lg:items-center">
              <motion.div
                key={`project-details-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {currentProject?.title}
                  </h2>
                </div>

                <ProjectImageCarousel
                  images={currentProject?.images}
                  title={currentProject?.title}
                />

                <ProjectBadges
                  type={currentProject?.type}
                  isLive={currentProject?.live}
                />
              </motion.div>
            </div>

            {/* Right (projects list) */}
            <div className="space-y-20">
              {projects.map((project, index) => (
                <motion.div key={project.id}>
                  <div
                    className={`${
                      activeIndex === index ? "opacity-100" : "opacity-60"
                    } transition-opacity duration-300`}
                  >
                    <ProjectCard
                      project={project}
                      index={index}
                      activeIndex={activeIndex}
                      projectRefs={projectRefs}
                      totalProjects={projects.length}
                    />
                  </div>
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
