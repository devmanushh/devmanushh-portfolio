import "dotenv/config";

import { promises as fs } from "node:fs";
import path from "node:path";

import { hash } from "bcryptjs";

import { activities as defaultActivities } from "../data/activities";
import { engineeringTech as defaultTechStack } from "../data/engineeringTech";
import { experience as defaultExperience } from "../data/experience";
import { mapPlaces as defaultMapPlaces } from "../data/mapPlaces";
import { profile } from "../data/profile";
import { projects as defaultProjects } from "../data/projects";
import { prisma } from "../lib/prisma";
import type { Activity } from "../types/activity";
import type { ContactContent } from "../types/contact";
import type { Experience } from "../types/experience";
import type { MapPlace } from "../types/map-place";
import type { Project } from "../types/project";
import type { TechStackItem } from "../types/tech-stack";

const defaultIntro = {
  heading: "Just another Software Engineer with an unique ability.",
  lineOne: "Building scalable systems, products, and small experiments.",
  lineTwo: "Also collecting snaps, randoms, notes, memories, and odd little ideas.",
  currentCompany: "google",
  currentRole: "Full Stack Developer",
  heroImageUrl: "",
};

const defaultContact: ContactContent = {
  title: "Contact details.",
  subtitle: "say hello",
  namePlaceholder: "your name",
  emailPlaceholder: "your email",
  messagePlaceholder: "your message",
  buttonLabel: "send message",
  email: profile.email,
  facebook: "",
  instagram: "",
  snapchat: "",
  github: "",
  x: "",
  linkedin: "",
  website: "",
};

async function readJsonStore<T>(filename: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", filename), "utf8");

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function seedCollection<T>(
  count: () => Promise<number>,
  seed: (items: T[]) => Promise<unknown>,
  items: T[],
) {
  if ((await count()) === 0) {
    await seed(items);
  }
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-this-password";
  const passwordHash = await hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const activities = await readJsonStore<Activity[]>(
    "activities.store.json",
    defaultActivities,
  );
  const projects = await readJsonStore<Project[]>("projects.store.json", defaultProjects);
  const experience = await readJsonStore<Experience[]>(
    "experience.store.json",
    defaultExperience,
  );
  const places = await readJsonStore<MapPlace[]>("places.store.json", defaultMapPlaces);
  const techStack = await readJsonStore<TechStackItem[]>(
    "tech-stack.store.json",
    defaultTechStack,
  );
  const intro = await readJsonStore<typeof defaultIntro>(
    "profile.store.json",
    defaultIntro,
  );
  const contact = await readJsonStore<ContactContent>(
    "contact.store.json",
    defaultContact,
  );

  await seedCollection(
    () => prisma.activity.count(),
    (items) =>
      prisma.activity.createMany({
        data: items.map(({ id: _id, ...item }) => item),
      }),
    activities,
  );

  await seedCollection(
    () => prisma.project.count(),
    (items) =>
      prisma.project.createMany({
        data: items.map(({ id: _id, ...item }) => ({
          ...item,
          techStack: JSON.stringify(item.techStack ?? []),
        })),
      }),
    projects,
  );

  await seedCollection(
    () => prisma.experience.count(),
    (items) =>
      prisma.experience.createMany({
        data: items.map(({ id: _id, ...item }) => item),
      }),
    experience,
  );

  await seedCollection(
    () => prisma.mapPlace.count(),
    (items) =>
      prisma.mapPlace.createMany({
        data: items.map(({ id: _id, ...item }) => item),
      }),
    places,
  );

  await seedCollection(
    () => prisma.techStackItem.count(),
    (items) => prisma.techStackItem.createMany({ data: items }),
    techStack,
  );

  await prisma.profileContent.upsert({
    where: { id: 1 },
    update: {
      ...defaultIntro,
      ...intro,
    },
    create: {
      id: 1,
      ...defaultIntro,
      ...intro,
    },
  });

  await prisma.contactContent.upsert({
    where: { id: 1 },
    update: {
      ...defaultContact,
      ...contact,
    },
    create: {
      id: 1,
      ...defaultContact,
      ...contact,
    },
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
