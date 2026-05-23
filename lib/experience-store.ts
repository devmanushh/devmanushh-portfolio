import { promises as fs } from "node:fs";
import path from "node:path";

import { experience as defaultExperience } from "@/data/experience";
import type { Experience } from "@/types/experience";

const storePath = path.join(process.cwd(), "data", "experience.store.json");

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(
      storePath,
      JSON.stringify(defaultExperience, null, 2),
      "utf8",
    );
  }
}

export async function getExperience(): Promise<Experience[]> {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as Experience[];
}

export async function addExperience(input: Omit<Experience, "id">) {
  const experience = await getExperience();
  const nextId =
    experience.reduce((highest, item) => Math.max(highest, item.id), 0) + 1;
  const item = {
    id: nextId,
    ...input,
  };

  await fs.writeFile(
    storePath,
    JSON.stringify([...experience, item], null, 2),
    "utf8",
  );

  return item;
}

export async function updateExperience(
  id: number,
  input: Omit<Experience, "id">,
) {
  const experience = await getExperience();
  const nextExperience = experience.map((item) =>
    item.id === id
      ? {
          id,
          ...input,
        }
      : item,
  );

  await fs.writeFile(storePath, JSON.stringify(nextExperience, null, 2), "utf8");

  return nextExperience;
}

export async function deleteExperience(id: number) {
  const experience = await getExperience();
  const nextExperience = experience.filter((item) => item.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextExperience, null, 2), "utf8");

  return nextExperience.length !== experience.length;
}
