import { promises as fs } from "node:fs";
import path from "node:path";

import { engineeringTech as defaultTechStack } from "@/data/engineeringTech";
import type { TechStackItem } from "@/types/tech-stack";

const storePath = path.join(process.cwd(), "data", "tech-stack.store.json");

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(
      storePath,
      JSON.stringify(defaultTechStack, null, 2),
      "utf8",
    );
  }
}

export async function getTechStack(): Promise<TechStackItem[]> {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as TechStackItem[];
}

export async function addTechStackItem(input: TechStackItem) {
  const techStack = await getTechStack();

  await fs.writeFile(
    storePath,
    JSON.stringify([...techStack, input], null, 2),
    "utf8",
  );

  return input;
}

export async function updateTechStackItem(id: string, input: TechStackItem) {
  const techStack = await getTechStack();
  const nextTechStack = techStack.map((item) => (item.id === id ? input : item));

  await fs.writeFile(storePath, JSON.stringify(nextTechStack, null, 2), "utf8");

  return nextTechStack;
}

export async function deleteTechStackItem(id: string) {
  const techStack = await getTechStack();
  const nextTechStack = techStack.filter((item) => item.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextTechStack, null, 2), "utf8");

  return nextTechStack.length !== techStack.length;
}
