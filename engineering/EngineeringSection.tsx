"use client";

import {
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandTypescript,
  IconCube,
  IconDatabase,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, Eye, EyeOff, FileText, Plus, Radar, Rocket } from "lucide-react";
import { useMemo, useState } from "react";
import { FaGithub } from "react-icons/fa";

import { profile } from "@/data/profile";
import type { Experience } from "@/types/experience";
import type { Project } from "@/types/project";
import type { TechStackItem } from "@/types/tech-stack";

const minimumProjects = 2;
const minimumExperience = 1;

const iconMap = {
  next: IconBrandNextjs,
  typescript: IconBrandTypescript,
  tailwind: IconBrandTailwind,
  database: IconDatabase,
  cube: IconCube,
};

function EngineeringResume() {
  return (
    <motion.section
      className="resume-module holo-panel"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.72 }}
    >
      <div className="resume-icon">
        <FileText size={26} />
      </div>
      <div>
        <span className="module-kicker">identity file</span>
        <h3>My resume</h3>
        <p>A quick view of my engineering experience, projects, and contact details.</p>
      </div>
      <div className="resume-actions">
        <a className="holo-button ghost-button" href={profile.resumeViewUrl}>
          <Eye size={18} />
          view
        </a>
        <a className="holo-button" href={profile.resumeDownloadUrl} download>
          <Download size={18} />
          download
        </a>
      </div>
    </motion.section>
  );
}

function EngineeringProjects({ projects }: { projects: Project[] }) {
  const [visibleProjects, setVisibleProjects] = useState(
    Math.min(minimumProjects, projects.length),
  );
  const shownProjects = useMemo(
    () => projects.slice(0, visibleProjects),
    [projects, visibleProjects],
  );

  return (
    <section className="mission-section">
      <div className="module-heading">
        <span className="section-eyebrow">mission modules</span>
        <h2>Featured Projects</h2>
      </div>

      <div className="project-grid">
        <AnimatePresence initial={false}>
          {shownProjects.map((project, index) => (
            <motion.article
              key={project.id}
              className="project-card holo-panel magnetic-card"
              initial={{ opacity: 0, y: 34, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.52, delay: index * 0.045 }}
              whileHover={{ y: -10, rotateX: 2, rotateY: index % 2 ? -2 : 2 }}
            >
              <div className="card-orbit" />
              <div className="project-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="project-icon">
                <Rocket size={22} />
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.details ? <span className="project-detail">{project.details}</span> : null}
              {project.github ? (
                <a href={project.github} target="_blank" rel="noreferrer" className="project-link">
                  <FaGithub size={18} />
                  github
                  <ExternalLink size={15} />
                </a>
              ) : null}
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <div className="module-controls">
        <button
          type="button"
          className="holo-button"
          onClick={() => setVisibleProjects((count) => Math.min(projects.length, count + 1))}
          disabled={visibleProjects >= projects.length}
        >
          <Plus size={18} />
          expand
        </button>
        <button
          type="button"
          className="holo-button ghost-button"
          onClick={() => setVisibleProjects(Math.min(minimumProjects, projects.length))}
          disabled={visibleProjects <= minimumProjects}
        >
          <EyeOff size={18} />
          hide
        </button>
      </div>
    </section>
  );
}

function EngineeringExperience({ experience }: { experience: Experience[] }) {
  const [visibleExperience, setVisibleExperience] = useState(
    Math.min(minimumExperience, experience.length),
  );
  const shownExperience = useMemo(
    () => experience.slice(0, visibleExperience),
    [experience, visibleExperience],
  );

  return (
    <section className="experience-module">
      <div className="module-heading">
        <span className="section-eyebrow">AI mission logs</span>
        <h2>Experience</h2>
      </div>

      <div className="experience-timeline">
        <AnimatePresence initial={false}>
          {shownExperience.map((item, index) => (
            <motion.article
              key={item.id}
              className="experience-log holo-panel"
              initial={{ opacity: 0, x: -22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 22 }}
              transition={{ duration: 0.48, delay: index * 0.05 }}
            >
              <div className="timeline-node">
                <Radar size={18} />
              </div>
              <div>
                <span className="module-kicker">{item.duration}</span>
                <h3>{item.company}</h3>
                <p>{item.role}</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <div className="module-controls">
        <button
          type="button"
          className="holo-button"
          onClick={() => setVisibleExperience((count) => Math.min(experience.length, count + 1))}
          disabled={visibleExperience >= experience.length}
        >
          <Plus size={18} />
          expand
        </button>
        <button
          type="button"
          className="holo-button ghost-button"
          onClick={() => setVisibleExperience(Math.min(minimumExperience, experience.length))}
          disabled={visibleExperience <= minimumExperience}
        >
          <EyeOff size={18} />
          hide
        </button>
      </div>
    </section>
  );
}

function EngineeringTechStack({ engineeringTech }: { engineeringTech: TechStackItem[] }) {
  return (
    <section className="tech-module">
      <div className="module-heading">
        <span className="section-eyebrow">tool constellation</span>
        <h2>Tech Stack</h2>
      </div>

      <div className="tech-orbit-grid">
        {engineeringTech.map((tech, index) => {
          const Icon = iconMap[tech.icon as keyof typeof iconMap] ?? IconCube;

          return (
            <motion.div
              key={tech.id}
              className="tech-chip"
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.035, duration: 0.48 }}
              whileHover={{ y: -8, scale: 1.045 }}
            >
              <span className="tech-icon">
                <Icon size={24} stroke={2.2} />
              </span>
              <span>{tech.label}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default function EngineeringSection({
  projects,
  experience,
  techStack,
}: {
  projects: Project[];
  experience: Experience[];
  techStack: TechStackItem[];
}) {
  return (
    <section id="projects" className="engineering-stage">
      <div className="section-frame">
        <motion.div
          className="engineering-intro"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: 0.75 }}
        >
          <span className="section-eyebrow">Engineering mission stack</span>
          {/* <h2 className="section-title">Robotics-minded software systems with orbital polish.</h2> */}
          <p className="section-subtitle">
            A focused view of my resume, projects, experience, and tools arranged like mission modules.
          </p>
        </motion.div>

        <EngineeringResume />
        <EngineeringProjects projects={projects} />
        <EngineeringExperience experience={experience} />
        <EngineeringTechStack engineeringTech={techStack} />
      </div>
    </section>
  );
}
