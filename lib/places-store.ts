import { promises as fs } from "node:fs";
import path from "node:path";

import { mapPlaces as defaultMapPlaces } from "@/data/mapPlaces";
import type { MapPlace } from "@/types/map-place";

const storePath = path.join(process.cwd(), "data", "places.store.json");

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(
      storePath,
      JSON.stringify(defaultMapPlaces, null, 2),
      "utf8",
    );
  }
}

export async function getPlaces(): Promise<MapPlace[]> {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as MapPlace[];
}

export async function addPlace(input: Omit<MapPlace, "id">) {
  const places = await getPlaces();
  const nextId =
    places.reduce((highest, place) => Math.max(highest, place.id), 0) + 1;
  const place = {
    id: nextId,
    ...input,
  };

  await fs.writeFile(
    storePath,
    JSON.stringify([...places, place], null, 2),
    "utf8",
  );

  return place;
}

export async function updatePlace(id: number, input: Omit<MapPlace, "id">) {
  const places = await getPlaces();
  const nextPlaces = places.map((place) =>
    place.id === id
      ? {
          id,
          ...input,
        }
      : place,
  );

  await fs.writeFile(storePath, JSON.stringify(nextPlaces, null, 2), "utf8");

  return nextPlaces;
}

export async function deletePlace(id: number) {
  const places = await getPlaces();
  const nextPlaces = places.filter((place) => place.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextPlaces, null, 2), "utf8");

  return nextPlaces.length !== places.length;
}
