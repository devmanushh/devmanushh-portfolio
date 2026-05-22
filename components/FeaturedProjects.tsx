import { projects } from "@/data/projects";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";

export default function FeaturedProjects() {
  return (
    <section className="hand-section">
      <Container>
        <SectionTitle title="Featured projects." subtitle="engineering things" />

        <div className="grid max-w-3xl gap-8">
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
