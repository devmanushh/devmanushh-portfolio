import { promises as fs } from "node:fs";
import path from "node:path";

export async function readJsonStore<T>(filename: string, fallback: T): Promise<T> {
  const storePath = path.join(process.cwd(), "data", filename);

  try {
    const raw = await fs.readFile(storePath, "utf8");

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
