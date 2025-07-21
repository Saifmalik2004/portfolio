'use client';

import React from 'react';
import {
  FaHtml5,
  FaCss3Alt,
  FaJava,
  FaPython,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaBootstrap,
} from 'react-icons/fa';
import {
  SiSpring,
  SiSpringboot,
  SiMongodb,
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiExpress,
} from 'react-icons/si';
import { DiMysql, DiPostgresql } from 'react-icons/di';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiSpringsecurity } from "react-icons/si";
import oval from '/assets/images/cylinder.avif';
import triangle from '/assets/images/triangle.avif';
import square from '/assets/images/square.avif';

const frontendSkills = [
  { name: 'HTML', icon: <FaHtml5 size={40} color="#E34F26" /> },
  { name: 'CSS', icon: <FaCss3Alt size={40} color="#1572B6" /> },
  { name: 'JavaScript', icon: <IoLogoJavascript size={40} color="#F7DF1E" /> },
  { name: 'TypeScript', icon: <SiTypescript size={40} color="#3178C6" /> },
  { name: 'React JS', icon: <FaReact size={40} color="#61DAFB" /> },
  { name: 'Next.js', icon: <SiNextdotjs size={40} color="#000000" /> },
  { name: 'Bootstrap', icon: <FaBootstrap size={40} color="#7952B3" /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss size={40} color="#38B2AC" /> },
];

const backendSkills = [
  { name: 'Java', icon: <FaJava size={40} color="#007396" /> },
  { name: 'Spring Core', icon: <SiSpring size={40} color="#6DB33F" /> },
  { name: 'Spring Boot', icon: <SiSpringboot size={40} color="#6DB33F" /> },
  { name: 'Spring Security', icon: <SiSpringsecurity size={40} color="#6DB33F" /> },
  
  { name: 'Node.js', icon: <FaNodeJs size={40} color="#339933" /> },
  { name: 'ExpressJS', icon: <SiExpress size={40} color="#000000" /> },
  { name: 'Python', icon: <FaPython size={40} color="#3776AB" /> },
  { name: 'MongoDB', icon: <SiMongodb size={40} color="#47A248" /> },
  { name: 'MySQL', icon: <DiMysql size={40} color="#4479A1" /> },
  { name: 'PostgreSQL', icon: <DiPostgresql size={40} color="#336791" /> },
];

const tools = [
  { name: 'Git', icon: <FaGitAlt size={40} color="#F05032" /> },
  { name: 'GitHub', icon: <FaGithub size={40} color="#181717" /> },
];

const SkillsSection = () => {
  const renderSkills = (skills: typeof frontendSkills) =>
    skills.map((skill, index) => (
      <div
        key={index}
        className="w-full max-w-[144px] h-36 rounded-xl bg-white/80 border border-gray-300 shadow-xl flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-300 transform hover:-translate-y-2 mx-auto"
      >
        {skill.icon}
        <p className="text-base text-gray-800 font-medium text-center mt-3">
          {skill.name}
        </p>
      </div>
    ));

  return (
    <section className="relative min-h-screen py-10 overflow-hidden">
      {/* ✅ Background Decorative Images */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img src={oval} alt="Oval" className="w-96 h-96 object-cover" />
        <img src={square} alt="Square" className="w-96 h-96 object-cover" />
        <img src={triangle} alt="Triangle" className="w-96 h-96 object-cover" />
      </div>

      {/* ✅ Foreground Content */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md rounded-xl max-w-7xl mx-auto p-8 shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Skills & Expertise</h2>

        <div className="container mx-auto px-4 space-y-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Frontend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {renderSkills(frontendSkills)}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Backend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {renderSkills(backendSkills)}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Tools</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {renderSkills(tools)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
