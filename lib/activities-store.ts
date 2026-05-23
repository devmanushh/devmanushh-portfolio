import { promises as fs } from "node:fs";
import path from "node:path";

import { activities as defaultActivities } from "@/data/activities";
import type { Activity } from "@/types/activity";

const storePath = path.join(process.cwd(), "data", "activities.store.json");

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(
      storePath,
      JSON.stringify(defaultActivities, null, 2),
      "utf8",
    );
  }
}

export async function getActivities(): Promise<Activity[]> {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as Activity[];
}

export async function addActivity(input: Omit<Activity, "id">) {
  const activities = await getActivities();
  const nextId =
    activities.reduce((highest, activity) => Math.max(highest, activity.id), 0) +
    1;
  const activity = {
    id: nextId,
    ...input,
  };

  await fs.writeFile(
    storePath,
    JSON.stringify([...activities, activity], null, 2),
    "utf8",
  );

  return activity;
}

export async function deleteActivity(id: number) {
  const activities = await getActivities();
  const nextActivities = activities.filter((activity) => activity.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextActivities, null, 2), "utf8");

  return nextActivities.length !== activities.length;
}

export async function updateActivity(
  id: number,
  input: Omit<Activity, "id">,
) {
  const activities = await getActivities();
  const nextActivities = activities.map((activity) =>
    activity.id === id
      ? {
          id,
          ...input,
        }
      : activity,
  );

  await fs.writeFile(storePath, JSON.stringify(nextActivities, null, 2), "utf8");

  return nextActivities;
}
