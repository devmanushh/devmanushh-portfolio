import { promises as fs } from "node:fs";
import path from "node:path";

import { engineeringTech as defaultTechStack } from "@/data/engineeringTech";
import { readJsonStore } from "@/lib/json-store";
import { withDatabase } from "@/lib/prisma";
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
  const dbTechStack = await withDatabase((db) =>
    db.techStackItem.findMany({ orderBy: { createdAt: "asc" } }),
  );

  if (dbTechStack) {
    if (dbTechStack.length > 0) {
      return dbTechStack;
    }

    const seedTechStack = await readJsonStore<TechStackItem[]>(
      "tech-stack.store.json",
      defaultTechStack,
    );

    await withDatabase((db) =>
      db.techStackItem.createMany({ data: seedTechStack }),
    );

    const seededTechStack = await withDatabase((db) =>
      db.techStackItem.findMany({ orderBy: { createdAt: "asc" } }),
    );

    if (seededTechStack) {
      return seededTechStack;
    }
  }

  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as TechStackItem[];
}

export async function addTechStackItem(input: TechStackItem) {
  const dbTechStackItem = await withDatabase((db) =>
    db.techStackItem.create({ data: input }),
  );

  if (dbTechStackItem) {
    return dbTechStackItem;
  }

  const techStack = await getTechStack();

  await fs.writeFile(
    storePath,
    JSON.stringify([...techStack, input], null, 2),
    "utf8",
  );

  return input;
}

export async function updateTechStackItem(id: string, input: TechStackItem) {
  const dbTechStackItem = await withDatabase((db) =>
    db.techStackItem.update({ where: { id }, data: input }),
  );

  if (dbTechStackItem) {
    return [dbTechStackItem];
  }

  const techStack = await getTechStack();
  const nextTechStack = techStack.map((item) => (item.id === id ? input : item));

  await fs.writeFile(storePath, JSON.stringify(nextTechStack, null, 2), "utf8");

  return nextTechStack;
}

export async function deleteTechStackItem(id: string) {
  const dbDeleted = await withDatabase(async (db) => {
    await db.techStackItem.delete({ where: { id } });

    return true;
  });

  if (dbDeleted) {
    return true;
  }

  const techStack = await getTechStack();
  const nextTechStack = techStack.filter((item) => item.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextTechStack, null, 2), "utf8");

  return nextTechStack.length !== techStack.length;
}

export async function replaceTechStackWithDefaults() {
  const dbSynced = await withDatabase(async (db) => {
    const currentItems = await db.techStackItem.findMany({
      orderBy: { createdAt: "asc" },
    });

    for (const item of currentItems) {
      await db.techStackItem.delete({ where: { id: item.id } });
    }

    await db.techStackItem.createMany({ data: defaultTechStack });

    return true;
  });

  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(defaultTechStack, null, 2), "utf8");

  return Boolean(dbSynced);
}
