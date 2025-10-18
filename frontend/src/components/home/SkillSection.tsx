import { useEffect, useState } from "react";
import skillService from "../../services/skillService";
import { Skill } from "../../types/skill";

const SkillsSection = () => {
  const [frontendSkills, setFrontendSkills] = useState<Skill[]>([]);
  const [backendSkills, setBackendSkills] = useState<Skill[]>([]);
  const [tools, setTools] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const [frontend, backend, tool] = await Promise.all([
          skillService.getSkillsByCategory("frontend"),
          skillService.getSkillsByCategory("backend"),
          skillService.getSkillsByCategory("tool"),
        ]);
        setFrontendSkills(frontend);
        setBackendSkills(backend);
        setTools(tool);
      } catch (error) {
        console.error("Error fetching skills", error);
      }
    };

    fetchSkills();
  }, []);

  const renderSkills = (skills: Skill[]) =>
    skills.map((skill) => (
      <div
        key={skill.id}
        className="w-full max-w-[144px] h-36 rounded-2xl 
                   bg-[#f9f9f9] 
                   shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] 
                   flex flex-col items-center justify-center p-4 
                   transition-all duration-300 transform 
                   hover:-translate-y-1 
                   hover:shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff]"
      >
        <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
        <p className="text-base text-gray-700 font-medium text-center mt-3">{skill.name}</p>
      </div>
    ));

  return (
    <section className="relative min-h-screen py-16 bg-[#f5f6fa]">
      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Gradient main heading for premium touch */}
       <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-800 tracking-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.05)]">
          Skills & Expertise
        </h2>

        <div className="container mx-auto px-4 space-y-16">
          {/* Frontend */}
          <div>
            <h3 className="text-3xl font-semibold text-gray-900 mb-8 text-center md:text-left">
              Frontend Development
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 justify-items-center">
              {renderSkills(frontendSkills)}
            </div>
          </div>

          {/* Backend */}
          <div>
            <h3 className="text-3xl font-semibold text-gray-900 mb-8 text-center md:text-left">
              Backend Development
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 justify-items-center">
              {renderSkills(backendSkills)}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-3xl font-semibold text-gray-900 mb-8 text-center md:text-left">
              Tools & Technologies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 justify-items-center">
              {renderSkills(tools)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
