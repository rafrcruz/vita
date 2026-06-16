import { eq, sql } from 'drizzle-orm';
import type { Role } from '@vita/shared';
import { db } from '../db/client';
import { allowlist, type AllowlistRow } from '../db/schema';
import { AppError } from '../middleware/error';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Regra de negócio (pura, testável): impede remover o último administrador,
 * evitando lockout e garantindo que a allowlist nunca permita acesso irrestrito (FR-014).
 */
export function assertCanRemove(entry: Pick<AllowlistRow, 'role'>, adminCount: number): void {
  if (entry.role === 'admin' && adminCount <= 1) {
    throw new AppError(409, 'last_admin', 'Não é possível remover o último administrador.');
  }
}

export async function listEntries(): Promise<AllowlistRow[]> {
  return db.select().from(allowlist).orderBy(allowlist.createdAt);
}

export async function isAllowed(email: string): Promise<boolean> {
  const rows = await db
    .select({ id: allowlist.id })
    .from(allowlist)
    .where(sql`lower(${allowlist.email}) = ${normalizeEmail(email)}`)
    .limit(1);
  return rows.length > 0;
}

export async function getRole(email: string): Promise<Role | null> {
  const rows = await db
    .select({ role: allowlist.role })
    .from(allowlist)
    .where(sql`lower(${allowlist.email}) = ${normalizeEmail(email)}`)
    .limit(1);
  return rows[0]?.role ?? null;
}

export async function addEntry(
  input: { email: string; role: Role },
  createdBy: string | null
): Promise<AllowlistRow> {
  try {
    const [row] = await db
      .insert(allowlist)
      .values({ email: normalizeEmail(input.email), role: input.role, createdBy })
      .returning();
    return row!;
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
      throw new AppError(409, 'email_exists', 'Este e-mail já está na allowlist.');
    }
    throw err;
  }
}

async function countAdmins(): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(allowlist)
    .where(eq(allowlist.role, 'admin'));
  return rows[0]?.n ?? 0;
}

export async function removeEntry(id: string): Promise<void> {
  const [entry] = await db.select().from(allowlist).where(eq(allowlist.id, id)).limit(1);
  if (!entry) {
    throw new AppError(404, 'not_found', 'Entrada não encontrada.');
  }
  assertCanRemove(entry, await countAdmins());
  await db.delete(allowlist).where(eq(allowlist.id, id));
}
