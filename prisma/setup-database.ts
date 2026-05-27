import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  await prisma.adminUser.count();
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const databaseLabel = databaseUrl.startsWith("postgres")
    ? "PostgreSQL database"
    : "SQLite database at data/portfolio.db";

  console.log(`${databaseLabel} is ready`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
