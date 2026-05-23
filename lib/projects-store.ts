import { promises as fs } from "node:fs";
import path from "node:path";

import { projects as defaultProjects } from "@/data/projects";
import type { Project } from "@/types/project";

const storePath = path.join(process.cwd(), "data", "projects.store.json");

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(defaultProjects, null, 2), "utf8");
  }
}

export async function getProjects(): Promise<Project[]> {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as Project[];
}

export async function addProject(input: Omit<Project, "id">) {
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
  const projects = await getProjects();
  const nextProjects = projects.filter((project) => project.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextProjects, null, 2), "utf8");

  return nextProjects.length !== projects.length;
}
