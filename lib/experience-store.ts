import { promises as fs } from "node:fs";
import path from "node:path";

import { experience as defaultExperience } from "@/data/experience";
import { readJsonStore } from "@/lib/json-store";
import { withDatabase } from "@/lib/prisma";
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
  const dbExperience = await withDatabase((db) =>
    db.experience.findMany({ orderBy: { id: "asc" } }),
  );

  if (dbExperience) {
    if (dbExperience.length > 0) {
      return dbExperience.map((item: Experience) => ({
        ...item,
        description: item.description ?? undefined,
        github: item.github ?? undefined,
        linkedin: item.linkedin ?? undefined,
      }));
    }

    const seedExperience = await readJsonStore<Experience[]>(
      "experience.store.json",
      defaultExperience,
    );

    await withDatabase((db) =>
      db.experience.createMany({
        data: seedExperience.map(({ id: _id, ...item }) => item),
      }),
    );

    const seededExperience = await withDatabase((db) =>
      db.experience.findMany({ orderBy: { id: "asc" } }),
    );

    if (seededExperience) {
      return seededExperience.map((item: Experience) => ({
        ...item,
        description: item.description ?? undefined,
        github: item.github ?? undefined,
        linkedin: item.linkedin ?? undefined,
      }));
    }
  }

  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as Experience[];
}

export async function addExperience(input: Omit<Experience, "id">) {
  const dbExperience = await withDatabase((db) =>
    db.experience.create({ data: input }),
  );

  if (dbExperience) {
    return {
      ...dbExperience,
      description: dbExperience.description ?? undefined,
      github: dbExperience.github ?? undefined,
      linkedin: dbExperience.linkedin ?? undefined,
    };
  }

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
  const dbExperience = await withDatabase((db) =>
    db.experience.update({ where: { id }, data: input }),
  );

  if (dbExperience) {
    return [
      {
        ...dbExperience,
        description: dbExperience.description ?? undefined,
        github: dbExperience.github ?? undefined,
        linkedin: dbExperience.linkedin ?? undefined,
      },
    ];
  }

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
  const dbDeleted = await withDatabase(async (db) => {
    await db.experience.delete({ where: { id } });

    return true;
  });

  if (dbDeleted) {
    return true;
  }

  const experience = await getExperience();
  const nextExperience = experience.filter((item) => item.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextExperience, null, 2), "utf8");

  return nextExperience.length !== experience.length;
}
