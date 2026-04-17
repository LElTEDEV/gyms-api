import "dotenv/config";

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { Environment } from "vitest/environments";

import { prisma } from "../../src/database/prisma";

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL env variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  viteEnvironment: "ssr",
  async setup() {
    // Essa função será executada no início dos nossos testes E2E (Criar o banco de teste)
    const schema = randomUUID();
    const databaseUrl = generateDatabaseURL(schema);

    console.log(databaseUrl);
    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma db push");

    return {
      async teardown() {
        // Essa função será executada no final dos nossos testes E2E (Apagar o banco de teste)

        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
