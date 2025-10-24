import { useEffect, useState } from "react";
import skillService from "../../services/skillService";
import { Skill } from "../../types/skill";
import TrueFocus from "../ui/TrueFocus";

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
        className="w-full max-w-[130px] sm:max-w-[144px] h-32 sm:h-36 rounded-2xl 
                   bg-[#f9f9f9] 
                   shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] 
                   flex flex-col items-center justify-center p-3 sm:p-4 
                   transition-all duration-300 transform 
                   hover:-translate-y-1 
                   hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
      >
        <img
          src={skill.iconUrl}
          alt={skill.name}
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
        <p className="text-sm sm:text-base text-gray-700 font-medium text-center mt-2 sm:mt-3">
          {skill.name}
        </p>
      </div>
    ));

  return (
    <section className="relative min-h-screen py-12 sm:py-16 bg-[#f5f6fa]">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Keep TrueFocus as it is */}
        <TrueFocus
          sentence="Skills & Expertise"
          manualMode={true}
          blurAmount={3}
          borderColor="red"
          animationDuration={2}
          pauseBetweenAnimations={1}
        />

        <div className="container mx-auto px-2 sm:px-4 space-y-12 sm:space-y-16">
          {/* Frontend */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center md:text-left">
              Frontend Development
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-10 justify-items-center">
              {renderSkills(frontendSkills)}
            </div>
          </div>

          {/* Backend */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center md:text-left">
              Backend Development
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-10 justify-items-center">
              {renderSkills(backendSkills)}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center md:text-left">
              Tools & Technologies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-10 justify-items-center">
              {renderSkills(tools)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
