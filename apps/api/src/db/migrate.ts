import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { env } from '../config/env';

// Aplica as migrations forward-only geradas pelo drizzle-kit (FR-006).
async function main() {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL não configurada.');
  const client = neon(env.DATABASE_URL);
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('[db] migrations aplicadas com sucesso.');
}

main().catch((err) => {
  console.error('[db] falha ao aplicar migrations:', err);
  process.exit(1);
});
