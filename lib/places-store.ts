import { promises as fs } from "node:fs";
import path from "node:path";

import { mapPlaces as defaultMapPlaces } from "@/data/mapPlaces";
import { readJsonStore } from "@/lib/json-store";
import { withDatabase } from "@/lib/prisma";
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
  const dbPlaces = await withDatabase((db) =>
    db.mapPlace.findMany({ orderBy: { id: "asc" } }),
  );

  if (dbPlaces) {
    if (dbPlaces.length > 0) {
      return dbPlaces;
    }

    const seedPlaces = await readJsonStore<MapPlace[]>(
      "places.store.json",
      defaultMapPlaces,
    );

    await withDatabase((db) =>
      db.mapPlace.createMany({
        data: seedPlaces.map(({ id: _id, ...place }) => place),
      }),
    );

    const seededPlaces = await withDatabase((db) =>
      db.mapPlace.findMany({ orderBy: { id: "asc" } }),
    );

    if (seededPlaces) {
      return seededPlaces;
    }
  }

  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return JSON.parse(raw) as MapPlace[];
}

export async function addPlace(input: Omit<MapPlace, "id">) {
  const dbPlace = await withDatabase((db) => db.mapPlace.create({ data: input }));

  if (dbPlace) {
    return dbPlace;
  }

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
  const dbPlace = await withDatabase((db) =>
    db.mapPlace.update({ where: { id }, data: input }),
  );

  if (dbPlace) {
    return [dbPlace];
  }

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
  const dbDeleted = await withDatabase(async (db) => {
    await db.mapPlace.delete({ where: { id } });

    return true;
  });

  if (dbDeleted) {
    return true;
  }

  const places = await getPlaces();
  const nextPlaces = places.filter((place) => place.id !== id);

  await fs.writeFile(storePath, JSON.stringify(nextPlaces, null, 2), "utf8");

  return nextPlaces.length !== places.length;
}
