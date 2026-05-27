import { promises as fs } from "node:fs";
import path from "node:path";

import { readJsonStore } from "@/lib/json-store";
import { withDatabase } from "@/lib/prisma";

export type IntroContent = {
  heading: string;
  lineOne: string;
  lineTwo: string;
  currentCompany: string;
  currentRole: string;
  heroImageUrl: string;
};

const defaultIntro: IntroContent = {
  heading: "Just another Software Engineer with an unique ability.",
  lineOne: "Building scalable systems, products, and small experiments.",
  lineTwo: "Also collecting snaps, randoms, notes, memories, and odd little ideas.",
  currentCompany: "google",
  currentRole: "Full Stack Developer",
  heroImageUrl: "",
};

const storePath = path.join(process.cwd(), "data", "profile.store.json");
const staleIntroHeadings = new Set([
  "Software engineer with a messy notebook and a clean build habit.",
]);

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(defaultIntro, null, 2), "utf8");
  }
}

export async function getIntroContent() {
  const dbIntro = await withDatabase(async (db) => {
    const existing = await db.profileContent.findUnique({ where: { id: 1 } });

    if (existing) {
      return existing;
    }

    const seedIntro = await readJsonStore<IntroContent>(
      "profile.store.json",
      defaultIntro,
    );

    return db.profileContent.create({
      data: {
        id: 1,
        ...defaultIntro,
        ...seedIntro,
      },
    });
  });

  if (dbIntro) {
    const intro = {
      heading: dbIntro.heading,
      lineOne: dbIntro.lineOne,
      lineTwo: dbIntro.lineTwo,
      currentCompany: dbIntro.currentCompany,
      currentRole: dbIntro.currentRole,
      heroImageUrl: dbIntro.heroImageUrl,
    };

    if (staleIntroHeadings.has(intro.heading)) {
      return updateIntroContent(defaultIntro);
    }

    return intro;
  }

  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");
  const intro = {
    ...defaultIntro,
    ...(JSON.parse(raw) as Partial<IntroContent>),
  };

  if (staleIntroHeadings.has(intro.heading)) {
    await updateIntroContent(defaultIntro);

    return defaultIntro;
  }

  return intro;
}

export async function updateIntroContent(content: IntroContent) {
  const intro = {
    ...defaultIntro,
    ...content,
  };

  const dbIntro = await withDatabase((db) =>
    db.profileContent.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        ...intro,
      },
      update: intro,
    }),
  );

  if (dbIntro) {
    return {
      heading: dbIntro.heading,
      lineOne: dbIntro.lineOne,
      lineTwo: dbIntro.lineTwo,
      currentCompany: dbIntro.currentCompany,
      currentRole: dbIntro.currentRole,
      heroImageUrl: dbIntro.heroImageUrl,
    };
  }

  await fs.writeFile(storePath, JSON.stringify(intro, null, 2), "utf8");

  return intro;
}
