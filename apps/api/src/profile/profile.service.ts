import { db } from '../db/client';
import { eq, sql } from 'drizzle-orm';
import { userProfiles } from '../db/schema';
import { profileInputSchema, type UserProfile } from '@vita/shared';
import { AppError } from '../middleware/error';

function toDto(row: typeof userProfiles.$inferSelect): UserProfile {
  return {
    id: row.id,
    fullName: row.fullName ?? null,
    birthDate: row.birthDate ?? null,
    heightCm: row.heightCm ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Retorna o perfil do usuário autenticado, ou null quando ainda não existe. */
export async function getProfile(userEmail: string): Promise<UserProfile | null> {
  const [row] = await db
    .select()
    .from(userProfiles)
    .where(eq(sql`lower(${userProfiles.userEmail})`, userEmail.toLowerCase()))
    .limit(1);

  return row ? toDto(row) : null;
}

/** Cria ou atualiza (upsert) o perfil do usuário autenticado. Idempotente. */
export async function upsertProfile(userEmail: string, data: unknown): Promise<UserProfile> {
  const result = profileInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(
      400,
      'validation_error',
      result.error.errors[0]?.message || 'Dados de perfil inválidos.'
    );
  }

  const { fullName, birthDate, heightCm } = result.data;
  const now = new Date();

  const [existing] = await db
    .select({ id: userProfiles.id })
    .from(userProfiles)
    .where(eq(sql`lower(${userProfiles.userEmail})`, userEmail.toLowerCase()))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(userProfiles)
      .set({
        fullName: fullName ?? null,
        birthDate: birthDate ?? null,
        heightCm: heightCm ?? null,
        updatedAt: now,
      })
      .where(eq(userProfiles.id, existing.id))
      .returning();
    return toDto(updated!);
  }

  const [inserted] = await db
    .insert(userProfiles)
    .values({
      userEmail,
      fullName: fullName ?? null,
      birthDate: birthDate ?? null,
      heightCm: heightCm ?? null,
    })
    .returning();
  return toDto(inserted!);
}
