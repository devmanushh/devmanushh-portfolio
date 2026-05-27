import { mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";

import { Pool } from "pg";

type RecordValue = string | number | null | undefined;
type DataRecord = Record<string, RecordValue>;
type DatabaseRow = Record<string, never> & {
  id: never;
  email: never;
  passwordHash: never;
  tokenHash: never;
  expiresAt: never;
  usedAt: never;
  createdAt: never;
  updatedAt: never;
  title: never;
  subtitle: never;
  description: never;
  details: never;
  github: never;
  imageUrl: never;
  techStack: never;
  company: never;
  role: never;
  duration: never;
  linkedin: never;
  place: never;
  country: never;
  lat: never;
  lng: never;
  label: never;
  icon: never;
  heading: never;
  lineOne: never;
  lineTwo: never;
  currentCompany: never;
  currentRole: never;
  heroImageUrl: never;
  namePlaceholder: never;
  emailPlaceholder: never;
  messagePlaceholder: never;
  buttonLabel: never;
  facebook: never;
  instagram: never;
  snapchat: never;
  x: never;
  website: never;
};
type DatabaseModel = {
  count: (args?: unknown) => Promise<number>;
  findMany: (args?: unknown) => Promise<DatabaseRow[]>;
  findUnique: (args: { where: DataRecord }) => Promise<DatabaseRow | null>;
  create: (args: { data: DataRecord }) => Promise<DatabaseRow | null>;
  createMany: (args: { data: DataRecord[] }) => Promise<{ count: number }>;
  update: (args: { where: DataRecord; data: DataRecord }) => Promise<DatabaseRow | null>;
  delete: (args: { where: DataRecord }) => Promise<DatabaseRow | null>;
  upsert: (args: {
    where: DataRecord;
    create: DataRecord;
    update: DataRecord;
  }) => Promise<DatabaseRow | null>;
};
type DatabaseClient = Record<
  | "adminUser"
  | "adminPasswordResetToken"
  | "project"
  | "experience"
  | "activity"
  | "mapPlace"
  | "techStackItem"
  | "profileContent"
  | "contactContent",
  DatabaseModel
>;

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/portfolio.db";
const isPostgres = databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://");
const require = createRequire(import.meta.url);

function normalizePostgresSslMode(url: string) {
  return url.replace(/([?&]sslmode=)(prefer|require|verify-ca)(?=(&|$))/u, "$1verify-full");
}

export function hashAdminResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cleanData(data: DataRecord) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | null>;
}

function quoted(column: string) {
  return `"${column}"`;
}

function createSqliteClient() {
  const { DatabaseSync } = require("node:sqlite") as typeof import("node:sqlite");
  const databasePath = path.join(process.cwd(), "data", "portfolio.db");
  mkdirSync(path.dirname(databasePath), { recursive: true });

  const sqlite = new DatabaseSync(databasePath);

  sqlite.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS AdminUser (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS AdminPasswordResetToken (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      tokenHash TEXT NOT NULL UNIQUE,
      expiresAt TEXT NOT NULL,
      usedAt TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Project (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      details TEXT,
      github TEXT,
      imageUrl TEXT,
      techStack TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      duration TEXT NOT NULL,
      description TEXT,
      github TEXT,
      linkedin TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      details TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS MapPlace (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place TEXT NOT NULL,
      country TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS TechStackItem (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ProfileContent (
      id INTEGER PRIMARY KEY DEFAULT 1,
      heading TEXT NOT NULL,
      lineOne TEXT NOT NULL,
      lineTwo TEXT NOT NULL,
      currentCompany TEXT NOT NULL,
      currentRole TEXT NOT NULL,
      heroImageUrl TEXT NOT NULL,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ContactContent (
      id INTEGER PRIMARY KEY DEFAULT 1,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      namePlaceholder TEXT NOT NULL,
      emailPlaceholder TEXT NOT NULL,
      messagePlaceholder TEXT NOT NULL,
      buttonLabel TEXT NOT NULL,
      email TEXT NOT NULL,
      facebook TEXT,
      instagram TEXT,
      snapchat TEXT,
      github TEXT,
      x TEXT,
      linkedin TEXT,
      website TEXT,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    sqlite.exec("ALTER TABLE AdminUser ADD COLUMN updatedAt TEXT");
    sqlite.exec("UPDATE AdminUser SET updatedAt = CURRENT_TIMESTAMP WHERE updatedAt IS NULL");
  } catch {
    // Column already exists.
  }

  function insert(table: string, data: DataRecord) {
    const cleaned = cleanData(data);
    const columns = Object.keys(cleaned);
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((column) => cleaned[column]);

    sqlite
      .prepare(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`)
      .run(...values);

    return Number(sqlite.prepare("SELECT last_insert_rowid() AS id").get()?.id);
  }

  function update(table: string, where: DataRecord, data: DataRecord) {
    const cleaned = cleanData(data);
    const whereCleaned = cleanData(where);
    const setColumns = Object.keys(cleaned);
    const whereColumns = Object.keys(whereCleaned);
    const setClause = [
      ...setColumns.map((column) => `${column} = ?`),
      "updatedAt = CURRENT_TIMESTAMP",
    ].join(", ");
    const whereClause = whereColumns.map((column) => `${column} = ?`).join(" AND ");

    sqlite
      .prepare(`UPDATE ${table} SET ${setClause} WHERE ${whereClause}`)
      .run(
        ...setColumns.map((column) => cleaned[column]),
        ...whereColumns.map((column) => whereCleaned[column]),
      );
  }

  function first(table: string, where: DataRecord): DatabaseRow | undefined {
    const cleaned = cleanData(where);
    const columns = Object.keys(cleaned);
    const clause = columns.map((column) => `${column} = ?`).join(" AND ");

    return sqlite
      .prepare(`SELECT * FROM ${table} WHERE ${clause} LIMIT 1`)
      .get(...columns.map((column) => cleaned[column])) as DatabaseRow | undefined;
  }

  function createModel(table: string, defaultOrder = "id ASC"): DatabaseModel {
    return {
      count: async () => Number(sqlite.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get()?.count ?? 0),
      findMany: async () =>
        sqlite.prepare(`SELECT * FROM ${table} ORDER BY ${defaultOrder}`).all() as DatabaseRow[],
      findUnique: async ({ where }: { where: DataRecord }) => first(table, where) ?? null,
      create: async ({ data }: { data: DataRecord }) => {
        const id = insert(table, data);

        return first(table, { id }) ?? first(table, data) ?? null;
      },
      createMany: async ({ data }: { data: DataRecord[] }) => {
        sqlite.exec("BEGIN");

        try {
          for (const item of data) {
            insert(table, item);
          }

          sqlite.exec("COMMIT");
        } catch (error) {
          sqlite.exec("ROLLBACK");
          throw error;
        }

        return { count: data.length };
      },
      update: async ({ where, data }: { where: DataRecord; data: DataRecord }) => {
        update(table, where, data);

        return first(table, where) ?? null;
      },
      delete: async ({ where }: { where: DataRecord }) => {
        const existing = first(table, where);
        const cleaned = cleanData(where);
        const columns = Object.keys(cleaned);
        const clause = columns.map((column) => `${column} = ?`).join(" AND ");

        sqlite
          .prepare(`DELETE FROM ${table} WHERE ${clause}`)
          .run(...columns.map((column) => cleaned[column]));

        return existing ?? null;
      },
      upsert: async ({
        where,
        create,
        update: updateData,
      }: {
        where: DataRecord;
        create: DataRecord;
        update: DataRecord;
      }) => {
        const existing = first(table, where);

        if (existing) {
          update(table, where, updateData);

          return first(table, where) ?? null;
        }

        insert(table, create);

        return first(table, where) ?? first(table, create) ?? null;
      },
    };
  }

  return {
    adminUser: createModel("AdminUser"),
    adminPasswordResetToken: createModel("AdminPasswordResetToken"),
    project: createModel("Project"),
    experience: createModel("Experience"),
    activity: createModel("Activity"),
    mapPlace: createModel("MapPlace"),
    techStackItem: createModel("TechStackItem", "createdAt ASC"),
    profileContent: createModel("ProfileContent"),
    contactContent: createModel("ContactContent"),
  };
}

function createPostgresClient() {
  if (databaseUrl.includes("USER:PASSWORD@HOST")) {
    const placeholderError = new Error(
      "DATABASE_URL is still a placeholder. Replace USER, PASSWORD, HOST, and database name in .env with your real PostgreSQL connection string.",
    );
    const ready = Promise.reject(placeholderError);
    ready.catch(() => {});

    async function fail(): Promise<never> {
      await ready;
      throw placeholderError;
    }

    return {
      adminUser: createFailingModel(fail),
      adminPasswordResetToken: createFailingModel(fail),
      project: createFailingModel(fail),
      experience: createFailingModel(fail),
      activity: createFailingModel(fail),
      mapPlace: createFailingModel(fail),
      techStackItem: createFailingModel(fail),
      profileContent: createFailingModel(fail),
      contactContent: createFailingModel(fail),
    };
  }

  const pool = new Pool({
    connectionString: normalizePostgresSslMode(databaseUrl),
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  const ready = pool.query(`
    CREATE TABLE IF NOT EXISTS "AdminUser" (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "AdminPasswordResetToken" (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      "tokenHash" TEXT NOT NULL UNIQUE,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "usedAt" TIMESTAMPTZ,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "Project" (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      details TEXT,
      github TEXT,
      "imageUrl" TEXT,
      "techStack" TEXT NOT NULL DEFAULT '[]',
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "Experience" (
      id SERIAL PRIMARY KEY,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      duration TEXT NOT NULL,
      description TEXT,
      github TEXT,
      linkedin TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "Activity" (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      details TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "MapPlace" (
      id SERIAL PRIMARY KEY,
      place TEXT NOT NULL,
      country TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "TechStackItem" (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "ProfileContent" (
      id INTEGER PRIMARY KEY DEFAULT 1,
      heading TEXT NOT NULL,
      "lineOne" TEXT NOT NULL,
      "lineTwo" TEXT NOT NULL,
      "currentCompany" TEXT NOT NULL,
      "currentRole" TEXT NOT NULL,
      "heroImageUrl" TEXT NOT NULL,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "ContactContent" (
      id INTEGER PRIMARY KEY DEFAULT 1,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      "namePlaceholder" TEXT NOT NULL,
      "emailPlaceholder" TEXT NOT NULL,
      "messagePlaceholder" TEXT NOT NULL,
      "buttonLabel" TEXT NOT NULL,
      email TEXT NOT NULL,
      facebook TEXT,
      instagram TEXT,
      snapchat TEXT,
      github TEXT,
      x TEXT,
      linkedin TEXT,
      website TEXT,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  async function query(sql: string, values: Array<string | number | null> = []) {
    await ready;

    return pool.query(sql, values);
  }

  async function first(table: string, where: DataRecord) {
    const cleaned = cleanData(where);
    const columns = Object.keys(cleaned);
    const clause = columns.map((column, index) => `${quoted(column)} = $${index + 1}`).join(" AND ");
    const result = await query(
      `SELECT * FROM ${quoted(table)} WHERE ${clause} LIMIT 1`,
      columns.map((column) => cleaned[column]),
    );

    return result.rows[0] ?? null;
  }

  function createModel(table: string, defaultOrder = "id ASC"): DatabaseModel {
    return {
      count: async () => {
        const result = await query(`SELECT COUNT(*) AS count FROM ${quoted(table)}`);

        return Number(result.rows[0]?.count ?? 0);
      },
      findMany: async () => {
        const result = await query(`SELECT * FROM ${quoted(table)} ORDER BY ${defaultOrder}`);

        return result.rows as DatabaseRow[];
      },
      findUnique: async ({ where }: { where: DataRecord }) => first(table, where),
      create: async ({ data }: { data: DataRecord }) => {
        const cleaned = cleanData(data);
        const columns = Object.keys(cleaned);
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
        const result = await query(
          `INSERT INTO ${quoted(table)} (${columns.map(quoted).join(", ")}) VALUES (${placeholders}) RETURNING *`,
          columns.map((column) => cleaned[column]),
        );

        return (result.rows[0] as DatabaseRow | undefined) ?? null;
      },
      createMany: async ({ data }: { data: DataRecord[] }) => {
        for (const item of data) {
          await prisma[tableKey(table)].create({ data: item });
        }

        return { count: data.length };
      },
      update: async ({ where, data }: { where: DataRecord; data: DataRecord }) => {
        const cleaned = cleanData(data);
        const whereCleaned = cleanData(where);
        const setColumns = Object.keys(cleaned);
        const whereColumns = Object.keys(whereCleaned);
        const values = [
          ...setColumns.map((column) => cleaned[column]),
          ...whereColumns.map((column) => whereCleaned[column]),
        ];
        const setClause = [
          ...setColumns.map((column, index) => `${quoted(column)} = $${index + 1}`),
          `"updatedAt" = NOW()`,
        ].join(", ");
        const whereClause = whereColumns
          .map((column, index) => `${quoted(column)} = $${setColumns.length + index + 1}`)
          .join(" AND ");
        const result = await query(
          `UPDATE ${quoted(table)} SET ${setClause} WHERE ${whereClause} RETURNING *`,
          values,
        );

        return (result.rows[0] as DatabaseRow | undefined) ?? null;
      },
      delete: async ({ where }: { where: DataRecord }) => {
        const cleaned = cleanData(where);
        const columns = Object.keys(cleaned);
        const clause = columns.map((column, index) => `${quoted(column)} = $${index + 1}`).join(" AND ");
        const result = await query(
          `DELETE FROM ${quoted(table)} WHERE ${clause} RETURNING *`,
          columns.map((column) => cleaned[column]),
        );

        return (result.rows[0] as DatabaseRow | undefined) ?? null;
      },
      upsert: async ({
        where,
        create,
        update,
      }: {
        where: DataRecord;
        create: DataRecord;
        update: DataRecord;
      }) => {
        const existing = await first(table, where);

        if (existing) {
          return prisma[tableKey(table)].update({ where, data: update });
        }

        return prisma[tableKey(table)].create({ data: create });
      },
    };
  }

  const prisma: DatabaseClient = {
    adminUser: createModel("AdminUser"),
    adminPasswordResetToken: createModel("AdminPasswordResetToken"),
    project: createModel("Project"),
    experience: createModel("Experience"),
    activity: createModel("Activity"),
    mapPlace: createModel("MapPlace"),
    techStackItem: createModel("TechStackItem", '"createdAt" ASC'),
    profileContent: createModel("ProfileContent"),
    contactContent: createModel("ContactContent"),
  };

  return prisma;
}

function createFailingModel(fail: () => Promise<never>): DatabaseModel {
  return {
    count: fail,
    findMany: fail,
    findUnique: fail,
    create: fail,
    createMany: fail,
    update: fail,
    delete: fail,
    upsert: fail,
  };
}

function tableKey(table: string): keyof DatabaseClient {
  const keys: Record<string, keyof DatabaseClient> = {
    AdminUser: "adminUser",
    AdminPasswordResetToken: "adminPasswordResetToken",
    Project: "project",
    Experience: "experience",
    Activity: "activity",
    MapPlace: "mapPlace",
    TechStackItem: "techStackItem",
    ProfileContent: "profileContent",
    ContactContent: "contactContent",
  };

  return keys[table];
}

export const prisma: DatabaseClient = isPostgres ? createPostgresClient() : createSqliteClient();

export async function withDatabase<Result>(operation: (db: DatabaseClient) => Promise<Result>) {
  try {
    return await operation(prisma);
  } catch (error) {
    console.warn("Database operation failed; falling back to JSON store.", error);

    return null;
  }
}
