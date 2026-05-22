import { promises as fs } from "node:fs";
import path from "node:path";

import { updateIntro, updateResume } from "@/app/admin/settings/actions";
import { profile } from "@/data/profile";
import { getIntroContent } from "@/lib/profile-store";

const resumePath = path.join(process.cwd(), "public", "profile", "resume.txt");

async function getResumeContent() {
  try {
    return await fs.readFile(resumePath, "utf8");
  } catch {
    return "";
  }
}

export default async function AdminSettingsPage() {
  const [resume, intro] = await Promise.all([
    getResumeContent(),
    getIntroContent(),
  ]);

  return (
    <div>
      <h1>Settings</h1>

      <section style={{ marginTop: "28px", maxWidth: "760px" }}>
        <h2>Introduction</h2>
        <p style={{ color: "#777", marginTop: "8px" }}>
          Update the hero introduction and the currently working for line.
        </p>

        <form
          action={updateIntro}
          style={{
            display: "grid",
            gap: "16px",
            marginTop: "18px",
          }}
        >
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
          <button type="submit">Save Introduction</button>
        </form>
      </section>

      <section style={{ marginTop: "28px", maxWidth: "760px" }}>
        <h2>Resume</h2>
        <p style={{ color: "#777", marginTop: "8px" }}>
          Paste your resume content here. It updates the download file and the
          resume view page.
        </p>

        <form
          action={updateResume}
          style={{
            display: "grid",
            gap: "16px",
            marginTop: "18px",
          }}
        >
          <textarea
            name="resume"
            rows={14}
            defaultValue={resume}
            placeholder="Paste resume content manually"
            required
          />
          <button type="submit">Save Resume</button>
        </form>

        <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
          <a href={profile.resumeViewUrl}>View resume</a>
          <a href={profile.resumeDownloadUrl} download>
            Download resume
          </a>
        </div>
      </section>
    </div>
  );
}
