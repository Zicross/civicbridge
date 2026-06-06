import type { Config as DrizzleConfig } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "src/server/db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "postgres://postgres:***@localhost:5432/constiuint",
  },
} as DrizzleConfig;
