"use client";

import {
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandTypescript,
  IconCube,
  IconDatabase,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, Eye, EyeOff, FileText, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { FaGithub } from "react-icons/fa";

import { profile } from "@/data/profile";
import type { Experience } from "@/types/experience";
import type { Project } from "@/types/project";
import type { TechStackItem } from "@/types/tech-stack";

const minimumProjects = 2;
const minimumExperience = 1;
const minimumTechStack = 7;

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
        <span className="section-eyebrow">Featured Projects...</span>
        {/* <h2>mission modules  </h2> */}
      </div>

      <div className="project-grid">
        <AnimatePresence initial={false}>
          {shownProjects.map((project, index) => (
            <motion.article
              key={project.id}
              className="project-card holo-panel magnetic-card"
              initial={{ opacity: 0, y: 34, rotateX: 8, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.52, delay: index * 0.045 }}
              whileHover={{
                y: -16,
                rotateX: 5,
                rotateY: index % 2 ? -4 : 4,
                scale: 1.018,
                z: 28,
              }}
            >
              <span className="project-corner project-corner-one" />
              <span className="project-corner project-corner-two" />
              <span className="project-corner project-corner-three" />
              <span className="project-corner project-corner-four" />
              <span className="project-shine" />
              <span className="project-3d-rim project-3d-rim-top" />
              <span className="project-3d-rim project-3d-rim-bottom" />
              <span className="project-3d-corner project-3d-corner-left" />
              <span className="project-3d-corner project-3d-corner-right" />
              <div className="card-orbit" />
              <div className="project-topline">
                <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
                {/* <span className="project-status">mission module</span> */}
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.techStack?.length ? (
                <div className="project-tech-tags">
                  {project.techStack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              ) : null}
              <div className="project-divider" />
              <div className="project-card-footer">
                {project.github ? (
                  <a href={project.github} target="_blank" rel="noreferrer" className="project-link">
                    <FaGithub size={17} />
                    github
                  </a>
                ) : (
                  <span />
                )}
                {project.github ? (
                  <a href={project.github} target="_blank" rel="noreferrer" className="project-launch">
                    launch
                    <ExternalLink size={15} />
                  </a>
                ) : null}
              </div>
              {project.details ? <span className="project-detail">{project.details}</span> : null}
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
        <span className="section-eyebrow">Experience... (coz that matters)</span>
      </div>

      <div className="experience-timeline">
        <AnimatePresence initial={false}>
          {shownExperience.map((item, index) => (
            <motion.article
              key={item.id}
              className="experience-log"
              initial={{ opacity: 0, x: -28, rotateZ: -1.2, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, rotateZ: index % 2 ? 0.55 : -0.45, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 22 }}
              transition={{ duration: 0.58, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, rotateZ: 0, scale: 1.012 }}
            >
              <span className="experience-cable experience-cable-left-one" />
              <span className="experience-cable experience-cable-left-two" />
              <span className="experience-cable experience-cable-right-one" />
              <span className="experience-cable experience-cable-right-two" />
              <span className="experience-glass-scan" />
              <span className="experience-wood-grain" />
              <span className="experience-screw experience-screw-left" />
              <span className="experience-screw experience-screw-right" />
              <div className="experience-content">
                <div className="experience-company-line">
                  <span className="experience-dot" />
                  <h3>{item.company}</h3>
                </div>
                <p>{item.role}</p>
              </div>
              <span className="experience-duration">{item.duration}</span>
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
  const [visibleTech, setVisibleTech] = useState(
    Math.min(minimumTechStack, engineeringTech.length),
  );
  const shownTech = useMemo(
    () => engineeringTech.slice(0, visibleTech),
    [engineeringTech, visibleTech],
  );

  return (
    <section className="tech-module">
      <div className="module-heading">
        <span className="section-eyebrow">Tech Stack... </span>
      </div>

      <div className="tech-orbit-grid">
        <AnimatePresence initial={false}>
        {shownTech.map((tech, index) => {
          const Icon = iconMap[tech.icon as keyof typeof iconMap] ?? IconCube;

          return (
            <motion.div
              key={tech.id}
              className="tech-chip"
              initial={{ opacity: 0, y: 18, scale: 0.92, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, scale: 0.94 }}
              transition={{ delay: index * 0.035, duration: 0.48 }}
              whileHover={{ y: -10, scale: 1.055, rotateX: 5, rotateY: index % 2 ? -4 : 4 }}
            >
              <span className="tech-chip-orbit" />
              <span className="tech-chip-scan" />
              <span className="tech-chip-node tech-chip-node-one" />
              <span className="tech-chip-node tech-chip-node-two" />
              <span className="tech-icon">
                <Icon size={24} stroke={2.2} />
              </span>
              <span>{tech.label}</span>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>

      <div className="module-controls">
        <button
          type="button"
          className="holo-button"
          onClick={() => setVisibleTech((count) => Math.min(engineeringTech.length, count + 7))}
          disabled={visibleTech >= engineeringTech.length}
        >
          <Plus size={18} />
          expand
        </button>
        <button
          type="button"
          className="holo-button ghost-button"
          onClick={() => setVisibleTech(Math.min(minimumTechStack, engineeringTech.length))}
          disabled={visibleTech <= minimumTechStack}
        >
          <EyeOff size={18} />
          hide
        </button>
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
