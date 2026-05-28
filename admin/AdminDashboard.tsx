import { promises as fs } from "node:fs";
import path from "node:path";

import {
  createActivity,
  createExperience,
  createPlace,
  createProject,
  createTechStackItem,
  editActivity,
  editExperience,
  editPlace,
  editProject,
  editTechStackItem,
  removeActivity,
  removeExperience,
  removePlace,
  removeProject,
  removeTechStackItem,
  syncResumeTechStack,
  updateContact,
  updateHeroImage,
  updateIntro,
  updateResume,
  updateResumePdf,
} from "@/lib/admin-actions";
import { getActivities } from "@/lib/activities-store";
import { getContactContent } from "@/lib/contact-store";
import { getExperience } from "@/lib/experience-store";
import { getPlaces } from "@/lib/places-store";
import { getIntroContent } from "@/lib/profile-store";
import { getProjects } from "@/lib/projects-store";
import { getTechStack } from "@/lib/tech-stack-store";
import { profile } from "@/data/profile";

const resumePath = path.join(process.cwd(), "public", "profile", "resume.txt");
const formStyle = {
  display: "grid",
  gap: "12px",
  marginTop: "16px",
} as const;
const sectionStyle = {
  maxWidth: "980px",
  display: "grid",
  gap: "22px",
  paddingBottom: "44px",
} as const;
const itemStyle = {
  border: "1px solid #1a1a1a",
  borderRadius: "14px",
  padding: "18px",
} as const;

function FormActions({ label }: { label: string }) {
  return (
    <div className="admin-form-actions">
      <button type="submit">{label}</button>
      <button type="reset">Cancel</button>
    </div>
  );
}

async function getResumeContent() {
  try {
    return await fs.readFile(resumePath, "utf8");
  } catch {
    return "";
  }
}

export default async function AdminDashboard() {
  const [
    activities,
    intro,
    resume,
    projects,
    experience,
    techStack,
    places,
    contact,
  ] = await Promise.all([
    getActivities(),
    getIntroContent(),
    getResumeContent(),
    getProjects(),
    getExperience(),
    getTechStack(),
    getPlaces(),
    getContactContent(),
  ]);

  return (
    <div style={{ display: "grid", gap: "52px" }}>
      <section id="hero" style={sectionStyle}>
        <div>
          <h1>Portfolio Admin</h1>
          <p style={{ color: "#777", marginTop: "8px" }}>
            Edit every visible portfolio section from here.
          </p>
        </div>

        <h2>Hero Section</h2>
        <form action={updateIntro} style={formStyle}>
          <textarea
            name="heading"
            rows={3}
            defaultValue={intro.heading}
            placeholder="Hero heading"
            required
          />
          <input
            name="lineOne"
            defaultValue={intro.lineOne}
            placeholder="Introduction line one"
            required
          />
          <input
            name="lineTwo"
            defaultValue={intro.lineTwo}
            placeholder="Introduction line two"
            required
          />
          <input
            name="currentCompany"
            defaultValue={intro.currentCompany}
            placeholder="Currently working for"
            required
          />
          <input
            name="currentRole"
            defaultValue={intro.currentRole}
            placeholder="Current role"
            required
          />
          <input
            name="heroImageUrl"
            defaultValue={intro.heroImageUrl}
            placeholder="Hero image URL or /profile/hero-image.jpg"
          />
          <FormActions label="Save Hero Section" />
        </form>

        <form action={updateHeroImage} style={formStyle}>
          <input name="heroImage" type="file" accept="image/*" required />
          <FormActions label="Upload Hero Image" />
        </form>
      </section>

      <section id="nomadglobe" style={sectionStyle}>
        <h2>Nomad Globe</h2>
        <form action={createPlace} style={formStyle}>
          <input name="place" placeholder="Place" required />
          <input name="country" placeholder="Country" required />
          <input name="lat" placeholder="Latitude" required />
          <input name="lng" placeholder="Longitude" required />
          <FormActions label="Add Place" />
        </form>

        <div style={{ display: "grid", gap: "16px" }}>
          {places.map((place) => (
            <article key={place.id} style={itemStyle}>
              <form action={editPlace} style={formStyle}>
                <input type="hidden" name="id" value={place.id} />
                <input name="place" defaultValue={place.place} required />
                <input name="country" defaultValue={place.country} required />
                <input name="lat" defaultValue={place.lat} required />
                <input name="lng" defaultValue={place.lng} required />
                <FormActions label="Update Place" />
              </form>
              <form action={removePlace} style={{ marginTop: "10px" }}>
                <input type="hidden" name="id" value={place.id} />
                <button type="submit">Delete Place</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="engineering" style={sectionStyle}>
        <h2>Engineering Things</h2>

        <div style={itemStyle}>
          <h3>Resume</h3>
          <ol className="admin-steps">
            <li>Prepare your resume as a PDF file.</li>
            <li>Choose the PDF from your device.</li>
            <li>Upload it to update the public view and download links.</li>
          </ol>
          <form action={updateResumePdf} style={formStyle}>
            <input
              name="resumePdf"
              type="file"
              accept="application/pdf,.pdf"
              required
            />
            <FormActions label="Upload Resume PDF" />
          </form>
          <form action={updateResume} style={formStyle}>
            <textarea
              name="resume"
              rows={10}
              defaultValue={resume}
              placeholder="Paste resume content manually"
              required
            />
            <FormActions label="Save Resume" />
          </form>
          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            <a href={profile.resumeViewUrl}>View resume</a>
            <a href={profile.resumeDownloadUrl} download>
              Download resume
            </a>
          </div>
        </div>

        <div style={itemStyle}>
          <h3>Featured Projects</h3>
          <form action={createProject} style={formStyle}>
            <input name="title" placeholder="Project title" required />
            <input name="description" placeholder="Brief description" required />
            <textarea name="details" rows={3} placeholder="Project details" />
            <input name="github" placeholder="GitHub link" />
            <input name="techStack" placeholder="Tech stack, comma separated: Next.js, TypeScript, Prisma" />
            <FormActions label="Add Project" />
          </form>

          <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
            {projects.map((project) => (
              <article key={project.id} style={itemStyle}>
                <form action={editProject} style={formStyle}>
                  <input type="hidden" name="id" value={project.id} />
                  <input name="title" defaultValue={project.title} required />
                  <input
                    name="description"
                    defaultValue={project.description}
                    required
                  />
                  <textarea name="details" rows={3} defaultValue={project.details} />
                  <input name="github" defaultValue={project.github} />
                  <input
                    name="techStack"
                    defaultValue={project.techStack?.join(", ")}
                    placeholder="Tech stack, comma separated"
                  />
                  <FormActions label="Update Project" />
                </form>
                <form action={removeProject} style={{ marginTop: "10px" }}>
                  <input type="hidden" name="id" value={project.id} />
                  <button type="submit">Delete Project</button>
                </form>
              </article>
            ))}
          </div>
        </div>

        <div style={itemStyle}>
          <h3>Experience</h3>
          <form action={createExperience} style={formStyle}>
            <input name="company" placeholder="Company" required />
            <input name="role" placeholder="Position" required />
            <input name="duration" placeholder="Timeline" required />
            <textarea name="description" rows={3} placeholder="Internal notes" />
            <input name="github" placeholder="GitHub link" />
            <input name="linkedin" placeholder="LinkedIn link" />
            <FormActions label="Add Experience" />
          </form>

          <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
            {experience.map((item) => (
              <article key={item.id} style={itemStyle}>
                <form action={editExperience} style={formStyle}>
                  <input type="hidden" name="id" value={item.id} />
                  <input name="company" defaultValue={item.company} required />
                  <input name="role" defaultValue={item.role} required />
                  <input name="duration" defaultValue={item.duration} required />
                  <textarea name="description" rows={3} defaultValue={item.description} />
                  <input name="github" defaultValue={item.github} />
                  <input name="linkedin" defaultValue={item.linkedin} />
                  <FormActions label="Update Experience" />
                </form>
                <form action={removeExperience} style={{ marginTop: "10px" }}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit">Delete Experience</button>
                </form>
              </article>
            ))}
          </div>
        </div>

        <div style={itemStyle}>
          <h3>Tech Stack</h3>
          <p style={{ color: "#777", marginTop: "8px" }}>
            The public page shows one row first. Use these controls to add, update, delete, or restore the resume stack in the database.
          </p>
          <form action={syncResumeTechStack} style={formStyle}>
            <button type="submit">Sync Resume Tech Stack To DB</button>
          </form>
          <form action={createTechStackItem} style={formStyle}>
            <input name="id" placeholder="Unique id, e.g. next" required />
            <input name="label" placeholder="Label, e.g. Next.js" required />
            <input name="icon" placeholder="Icon key: next, typescript, tailwind, database, cube" required />
            <FormActions label="Add Tech" />
          </form>

          <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
            {techStack.map((item) => (
              <article key={item.id} style={itemStyle}>
                <form action={editTechStackItem} style={formStyle}>
                  <input type="hidden" name="currentId" value={item.id} />
                  <input name="id" defaultValue={item.id} required />
                  <input name="label" defaultValue={item.label} required />
                  <input name="icon" defaultValue={item.icon} required />
                  <FormActions label="Update Tech" />
                </form>
                <form action={removeTechStackItem} style={{ marginTop: "10px" }}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit">Delete Tech</button>
                </form>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="extra" style={sectionStyle}>
        <h2>Extra Activities</h2>
        <form action={createActivity} style={formStyle}>
          <input name="title" placeholder="Activity title" required />
          <input name="description" placeholder="Short description" required />
          <textarea name="details" placeholder="More details" rows={5} />
          <FormActions label="Add Extra Activity" />
        </form>

        <div style={{ display: "grid", gap: "16px" }}>
          {activities.map((activity) => (
            <article key={activity.id} style={itemStyle}>
              <form action={editActivity} style={formStyle}>
                <input type="hidden" name="id" value={activity.id} />
                <input name="title" defaultValue={activity.title} required />
                <input
                  name="description"
                  defaultValue={activity.description}
                  required
                />
                <textarea name="details" rows={4} defaultValue={activity.details} />
                <FormActions label="Update Activity" />
              </form>
              <form action={removeActivity} style={{ marginTop: "10px" }}>
                <input type="hidden" name="id" value={activity.id} />
                <button type="submit">Delete Activity</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" style={sectionStyle}>
        <h2>Contact</h2>
        <form action={updateContact} style={formStyle}>
          <div className="admin-readonly-panel">
            <span>Contact form heading</span>
            <strong>{contact.title}</strong>
          </div>
          <input type="hidden" name="title" value={contact.title} />
          <input type="hidden" name="namePlaceholder" value={contact.namePlaceholder} />
          <input type="hidden" name="emailPlaceholder" value={contact.emailPlaceholder} />
          <input type="hidden" name="messagePlaceholder" value={contact.messagePlaceholder} />
          <input type="hidden" name="buttonLabel" value={contact.buttonLabel} />
          <input name="subtitle" defaultValue={contact.subtitle} required />
          <input name="email" defaultValue={contact.email} required />
          <div className="admin-readonly-grid" aria-label="Fixed contact form labels">
            <span>{contact.namePlaceholder}</span>
            <span>{contact.emailPlaceholder}</span>
            <span>{contact.messagePlaceholder}</span>
            <span>{contact.buttonLabel}</span>
          </div>
          <input name="facebook" defaultValue={contact.facebook ?? ""} placeholder="Facebook profile URL" />
          <input name="instagram" defaultValue={contact.instagram ?? ""} placeholder="Instagram profile URL" />
          <input name="snapchat" defaultValue={contact.snapchat ?? ""} placeholder="Snapchat profile URL" />
          <input name="github" defaultValue={contact.github ?? ""} placeholder="GitHub profile URL" />
          <input name="x" defaultValue={contact.x ?? ""} placeholder="X profile URL" />
          <input name="linkedin" defaultValue={contact.linkedin ?? ""} placeholder="LinkedIn profile URL" />
          <input name="website" defaultValue={contact.website ?? ""} placeholder="Website or portfolio URL" />
          <FormActions label="Save Contact" />
        </form>
      </section>
    </div>
  );
}
