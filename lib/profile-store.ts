import { promises as fs } from "node:fs";
import path from "node:path";

export type IntroContent = {
  heading: string;
  lineOne: string;
  lineTwo: string;
  currentCompany: string;
  currentRole: string;
};

const defaultIntro: IntroContent = {
  heading: "Software engineer with a messy notebook and a clean build habit.",
  lineOne: "Building scalable systems, products, and small experiments.",
  lineTwo: "Also collecting places, photos, notes, and odd little ideas.",
  currentCompany: "Takkada",
  currentRole: "Full Stack Developer Intern",
};

const storePath = path.join(process.cwd(), "data", "profile.store.json");

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(defaultIntro, null, 2), "utf8");
  }
}

export async function getIntroContent() {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as IntroContent;
}

export async function updateIntroContent(content: IntroContent) {
  await fs.writeFile(storePath, JSON.stringify(content, null, 2), "utf8");

  return content;
}
