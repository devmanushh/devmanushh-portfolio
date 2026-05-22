import { Download, Eye } from "lucide-react";

import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";

export default function FeaturedProjects() {
  return (
    <section id="projects" className="hand-section scroll-mt-28">
      <Container>
        <SectionTitle title="Featured projects." subtitle="engineering things" />

        <div className="grid max-w-4xl gap-8">
          <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
            <article className="sketch-card p-6">
              <h3 className="text-3xl font-bold">My resume</h3>
              <p className="mt-4 text-xl leading-8 text-[#4f4942]">
                A quick view of my engineering experience, projects, and contact
                details.
              </p>
            </article>

            <div className="grid content-start gap-3">
              <a
                href={profile.resumeViewUrl}
                className="ink-frame inline-flex items-center justify-center gap-2 bg-[#fffaf0] px-4 py-3 text-xl font-bold"
              >
                <Eye size={20} />
                view
              </a>
              <a
                href={profile.resumeDownloadUrl}
                download
                className="ink-frame inline-flex items-center justify-center gap-2 bg-[#181614] px-4 py-3 text-xl font-bold text-[#fffaf0]"
              >
                <Download size={20} />
                download
              </a>
            </div>
          </div>

          {projects.map((project) => (
            <article key={project.id} className="sketch-card p-6">
              <h3 className="text-3xl font-bold">{project.title}</h3>
              <p className="mt-4 text-xl leading-8 text-[#4f4942]">
                {project.description}
              </p>
              {project.github ? (
                <a
                  href={project.github}
                  className="scribble-underline mt-6 inline-block text-xl font-bold"
                >
                  github
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
