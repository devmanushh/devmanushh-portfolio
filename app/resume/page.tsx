import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="hand-section">
        <section className="paper-shell sketch-card p-8">
          <p className="text-xl text-[#59534b]">resume.</p>
          <h1 className="mt-2 text-5xl font-bold">{profile.name}</h1>
          <p className="mt-3 text-2xl text-[#4f4942]">{profile.role}</p>
          <a
            href={`mailto:${profile.email}`}
            className="scribble-underline mt-4 inline-block text-xl font-bold"
          >
            {profile.email}
          </a>

          <div className="mt-10 grid gap-8">
            <section>
              <h2 className="text-3xl font-bold">Experience</h2>
              <div className="mt-4 grid gap-4">
                {experience.map((item) => (
                  <article key={item.id}>
                    <h3 className="text-2xl font-bold">{item.role}</h3>
                    <p className="text-xl text-[#4f4942]">
                      {item.company} · {item.duration}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold">Projects</h2>
              <div className="mt-4 grid gap-4">
                {projects.map((project) => (
                  <article key={project.id}>
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <p className="text-xl leading-8 text-[#4f4942]">
                      {project.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
