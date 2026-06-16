import { db } from './client';
import { allowlist } from './schema';
import { env } from '../config/env';

// Semeia o(s) administrador(es) inicial(is) a partir de ADMIN_EMAILS (idempotente).
// Garante que uma allowlist vazia nunca conceda acesso irrestrito (FR-014).
async function main() {
  const emails = (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (emails.length === 0) {
    console.warn('[db] ADMIN_EMAILS vazio — nenhum administrador semeado.');
    return;
  }

  for (const email of emails) {
    await db.insert(allowlist).values({ email, role: 'admin' }).onConflictDoNothing();
  }
  console.log(`[db] admin(s) semeado(s): ${emails.join(', ')}`);
}

main().catch((err) => {
  console.error('[db] falha no seed:', err);
  process.exit(1);
});
