'use client';

import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
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
  SiSpringsecurity
} from 'react-icons/si';
import { BiLogoPostgresql } from "react-icons/bi";
import { DiMysql } from 'react-icons/di';
import { IoLogoJavascript } from 'react-icons/io5';

const techIcons = [
  { icon: <FaHtml5 />, label: 'HTML' },
  { icon: <FaCss3Alt />, label: 'CSS' },
  { icon: <IoLogoJavascript />, label: 'JavaScript' },
  { icon: <SiTypescript />, label: 'TypeScript' },
  { icon: <FaReact />, label: 'React' },
  { icon: <SiNextdotjs />, label: 'Next.js' },
  { icon: <FaBootstrap />, label: 'Bootstrap' },
  { icon: <SiTailwindcss />, label: 'Tailwind CSS' },
  { icon: <FaJava />, label: 'Java' },
  { icon: <SiSpring />, label: 'Spring Core' },
  { icon: <SiSpringboot />, label: 'Spring Boot' },
  { icon: <SiSpringsecurity />, label: 'Spring Security' },
  { icon: <FaNodeJs />, label: 'Node.js' },
  { icon: <SiExpress />, label: 'ExpressJS' },
  { icon: <FaPython />, label: 'Python' },
  { icon: <SiMongodb />, label: 'MongoDB' },
  { icon: <DiMysql />, label: 'MySQL' },
  { icon: <BiLogoPostgresql />, label: 'PostgreSQL' },
  { icon: <FaGitAlt />, label: 'Git' },
  { icon: <FaGithub />, label: 'GitHub' },
];
// Generate a bouncing icon with independent physics
const BouncingIcon = ({ Icon, containerRef }: { Icon: React.ReactElement; containerRef: React.RefObject<HTMLDivElement> }) => {
  const x = useMotionValue(Math.random() * 400);
  const y = useMotionValue(Math.random() * 400);

  // Velocity direction
  const velocity = useRef({
    x: (Math.random() - 0.5) * 1.5,
    y: (Math.random() - 0.5) * 1.5,
  });

  useAnimationFrame(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = 40; // icon size

    const nextX = x.get() + velocity.current.x * 2;
    const nextY = y.get() + velocity.current.y * 2;

    // Bounce on edges
    if (nextX <= 0 || nextX + size >= rect.width) velocity.current.x *= -1;
    if (nextY <= 0 || nextY + size >= rect.height) velocity.current.y *= -1;

    x.set(x.get() + velocity.current.x * 2);
    y.set(y.get() + velocity.current.y * 2);
  });

  return (
    <motion.div
      style={{
        x,
        y,
        position: 'absolute',
        width: 40,
        height: 40,
        fontSize: '3rem',
        color: '#1f2937',
      }}
      whileHover={{ scale: 1.2, color: '#f97316' }}
    >
      {Icon}
    </motion.div>
  );
};

const FloatingTechIcons = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative pt-8 bg-white">
     
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl mx-auto h-[500px] border-[3px] border-orange-500 rounded-3xl overflow-hidden shadow-lg bg-white"
      >
        {techIcons.map((tech, index) => (
          <BouncingIcon key={index} Icon={tech.icon} containerRef={containerRef} />
        ))}
      </div>
    </section>
  );
};

export default FloatingTechIcons;
