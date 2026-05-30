// @ts-nocheck
import path from "node:path";
import fs from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { defineConfig } from "prisma/config";

// Carga el .env en process.env antes de que Prisma evalúe la config
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").replace(/\r/g, "").split("\n")) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const dbUrl = process.env.DATABASE_URL!;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: { url: dbUrl },
  migrate: {
    adapter: () => new PrismaPg({ connectionString: dbUrl }),
  },
});
