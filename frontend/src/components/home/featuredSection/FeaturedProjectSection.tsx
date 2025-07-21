"use client";

import { Link } from "react-router-dom";
import { mockProjects } from "../../../data/mock";
import ShowcaseCard from "./FeaturesCard";

import bgDecor from "/assets/images/star.avif"; 

const FeaturedProjectsSection = () => {
  const featuredProjects = mockProjects.filter(
    (project) => project.is_featured
  );

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Featured Projects
        </h2>
        
         <img
          src={bgDecor}
          alt="Background Star"
          className="absolute top-66 left-1/4  w-[800px]  z-0 pointer-events-none blur-md"
        />

        <div className="grid sm:grid-cols-2 gap-8 relative z-10">
          {featuredProjects.map((project) => (
            <ShowcaseCard
              key={project.slug}
              slug={project.slug}
              github_url={project.github_url}
              title={project.title}
              image={project.images[0]}
              live_demo_url={project.live_demo_url}
            />
          ))}
        </div>

        

        {featuredProjects.length > 0 && (
          <div className="text-center mt-12 relative z-10">
            <Link
              to="/projects"
              className="inline-block px-8 py-3 rounded-full border-4 border-[#f1f0ff] bg-white text-black font-semibold text-base hover:shadow-md transition-all duration-300"
            >
              View More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
