import { db } from '../db/client';
import { gte, and, eq, asc } from 'drizzle-orm';
import { weightLogs, bloodPressureLogs } from '../db/schema';
import { weightLogInputSchema, bpLogInputSchema } from '@vita/shared';
import { AppError } from '../middleware/error';

export function parseDecimalInput(value: string | number): number | null {
  if (typeof value === 'number') return value;
  if (!value) return null;
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

export async function createWeightLog(userEmail: string, data: any) {
  // Handle string input parsing before schema validation
  if (typeof data.weight === 'string') {
    const parsed = parseDecimalInput(data.weight);
    if (parsed === null) {
      throw new AppError(400, 'validation_error', 'O peso deve ser um número válido.');
    }
    data.weight = parsed;
  }

  const result = weightLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'validation_error', result.error.errors[0]?.message || 'Dados de peso inválidos.');
  }

  const [inserted] = await db.insert(weightLogs).values({
    userEmail,
    weight: result.data.weight,
    loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : new Date(),
  }).returning();

  return inserted;
}

export async function createBPLog(userEmail: string, data: any) {
  const result = bpLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'validation_error', result.error.errors[0]?.message || 'Dados de pressão inválidos.');
  }

  const [inserted] = await db.insert(bloodPressureLogs).values({
    userEmail,
    systolic: result.data.systolic,
    diastolic: result.data.diastolic,
    loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : new Date(),
  }).returning();

  return inserted;
}

function getFilterDate(timeframe: string): Date | null {
  const now = new Date();
  if (timeframe === '7d') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (timeframe === '30d') {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  return null;
}

export async function getWeightHistory(userEmail: string, timeframe = 'all') {
  const filterDate = getFilterDate(timeframe);
  const conditions = [eq(weightLogs.userEmail, userEmail)];
  if (filterDate) {
    conditions.push(gte(weightLogs.loggedAt, filterDate));
  }
  return db
    .select({
      id: weightLogs.id,
      weight: weightLogs.weight,
      loggedAt: weightLogs.loggedAt,
    })
    .from(weightLogs)
    .where(and(...conditions))
    .orderBy(asc(weightLogs.loggedAt));
}

export async function getBPHistory(userEmail: string, timeframe = 'all') {
  const filterDate = getFilterDate(timeframe);
  const conditions = [eq(bloodPressureLogs.userEmail, userEmail)];
  if (filterDate) {
    conditions.push(gte(bloodPressureLogs.loggedAt, filterDate));
  }
  return db
    .select({
      id: bloodPressureLogs.id,
      systolic: bloodPressureLogs.systolic,
      diastolic: bloodPressureLogs.diastolic,
      loggedAt: bloodPressureLogs.loggedAt,
    })
    .from(bloodPressureLogs)
    .where(and(...conditions))
    .orderBy(asc(bloodPressureLogs.loggedAt));
}

export async function updateWeightLog(id: string, userEmail: string, data: any) {
  if (typeof data.weight === 'string') {
    const parsed = parseDecimalInput(data.weight);
    if (parsed === null) {
      throw new AppError(400, 'validation_error', 'O peso deve ser um número válido.');
    }
    data.weight = parsed;
  }

  const result = weightLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'validation_error', result.error.errors[0]?.message || 'Dados inválidos.');
  }

  const [updated] = await db
    .update(weightLogs)
    .set({
      weight: result.data.weight,
      loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : undefined,
    })
    .where(and(eq(weightLogs.id, id), eq(weightLogs.userEmail, userEmail)))
    .returning();

  if (!updated) {
    throw new AppError(404, 'not_found', 'Registro de peso não encontrado.');
  }

  return updated;
}

export async function deleteWeightLog(id: string, userEmail: string) {
  const [deleted] = await db
    .delete(weightLogs)
    .where(and(eq(weightLogs.id, id), eq(weightLogs.userEmail, userEmail)))
    .returning();

  if (!deleted) {
    throw new AppError(404, 'not_found', 'Registro de peso não encontrado.');
  }

  return deleted;
}

export async function updateBPLog(id: string, userEmail: string, data: any) {
  const result = bpLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'validation_error', result.error.errors[0]?.message || 'Dados inválidos.');
  }

  const [updated] = await db
    .update(bloodPressureLogs)
    .set({
      systolic: result.data.systolic,
      diastolic: result.data.diastolic,
      loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : undefined,
    })
    .where(and(eq(bloodPressureLogs.id, id), eq(bloodPressureLogs.userEmail, userEmail)))
    .returning();

  if (!updated) {
    throw new AppError(404, 'not_found', 'Registro de pressão arterial não encontrado.');
  }

  return updated;
}

export async function deleteBPLog(id: string, userEmail: string) {
  const [deleted] = await db
    .delete(bloodPressureLogs)
    .where(and(eq(bloodPressureLogs.id, id), eq(bloodPressureLogs.userEmail, userEmail)))
    .returning();

  if (!deleted) {
    throw new AppError(404, 'not_found', 'Registro de pressão arterial não encontrado.');
  }

  return deleted;
}
