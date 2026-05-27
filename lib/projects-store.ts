import { promises as fs } from "node:fs";
import path from "node:path";

import { projects as defaultProjects } from "@/data/projects";
import { readJsonStore } from "@/lib/json-store";
import { withDatabase } from "@/lib/prisma";
import type { Project } from "@/types/project";

const storePath = path.join(process.cwd(), "data", "projects.store.json");

function serializeTechStack(techStack?: string[]) {
  return JSON.stringify(techStack ?? []);
}

function parseTechStack(techStack?: string | null) {
  if (!techStack) {
    return [];
  }

  try {
    const parsed = JSON.parse(techStack);

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function toProject(project: {
  id: number;
  title: string;
  description: string;
  details: string | null;
  github: string | null;
  imageUrl: string | null;
  techStack: string;
}): Project {
  return {
    ...project,
    details: project.details ?? undefined,
    github: project.github ?? undefined,
    imageUrl: project.imageUrl ?? undefined,
    techStack: parseTechStack(project.techStack),
  };
}

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(defaultProjects, null, 2), "utf8");
  }
}

export async function getProjects(): Promise<Project[]> {
  const dbProjects = await withDatabase((db) =>
    db.project.findMany({ orderBy: { id: "asc" } }),
  );

  if (dbProjects) {
    if (dbProjects.length > 0) {
      return dbProjects.map(toProject);
    }

    const seedProjects = await readJsonStore<Project[]>(
      "projects.store.json",
      defaultProjects,
    );

    await withDatabase((db) =>
      db.project.createMany({
        data: seedProjects.map(({ id: _id, ...project }) => ({
          ...project,
          techStack: serializeTechStack(project.techStack),
        })),
      }),
    );

    const seededProjects = await withDatabase((db) =>
      db.project.findMany({ orderBy: { id: "asc" } }),
    );

    if (seededProjects) {
      return seededProjects.map(toProject);
    }
  }

  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return (JSON.parse(raw) as Project[]).map((project) => ({
    ...project,
    techStack: project.techStack ?? [],
  }));
}

export async function addProject(input: Omit<Project, "id">) {
  const dbProject = await withDatabase((db) =>
    db.project.create({
      data: {
        ...input,
        techStack: serializeTechStack(input.techStack),
      },
    }),
  );

  if (dbProject) {
    return toProject(dbProject);
  }

  const projects = await getProjects();
  const nextId =
    projects.reduce((highest, project) => Math.max(highest, project.id), 0) + 1;
  const project = {
    id: nextId,
    ...input,
  };

  await fs.writeFile(
    storePath,
    JSON.stringify([...projects, project], null, 2),
    "utf8",
  );

  return project;
}

export async function updateProject(id: number, input: Omit<Project, "id">) {
  const dbProject = await withDatabase((db) =>
    db.project.update({
      where: { id },
      data: {
        ...input,
        techStack: serializeTechStack(input.techStack),
      },
    }),
  );

  if (dbProject) {
    return [toProject(dbProject)];
  }

  const projects = await getProjects();
  const nextProjects = projects.map((project) =>
    project.id === id
      ? {
          id,
          ...input,
        }
      : project,
  );

  await fs.writeFile(storePath, JSON.stringify(nextProjects, null, 2), "utf8");

  return nextProjects;
}

export async function deleteProject(id: number) {
  const dbDeleted = await withDatabase(async (db) => {
    await db.project.delete({ where: { id } });

    return true;
  });

  if (dbDeleted) {
    return true;
  }

  const projects = await getProjects();
  const nextProjects = projects.filter((project) => project.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextProjects, null, 2), "utf8");

  return nextProjects.length !== projects.length;
}
