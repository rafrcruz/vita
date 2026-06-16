import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit roda fora do app: carrega o .env da raiz do monorepo manualmente.
const rootEnv = resolve(process.cwd(), '../../.env');
if (existsSync(rootEnv)) loadDotenv({ path: rootEnv });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
