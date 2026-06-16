import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import { env } from '../config/env';
import * as schema from './schema';

function requireDatabaseUrl(): string {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL não configurada (necessária a partir da US2).');
  }
  return env.DATABASE_URL;
}

// Driver HTTP serverless do Neon (sem pool persistente — ideal para funções efêmeras).
const client = neon(requireDatabaseUrl());

export const db = drizzle(client, { schema });

/** Ping de leitura para o health check. Retorna true se o banco responde. */
export async function checkDatabase(): Promise<boolean> {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}
