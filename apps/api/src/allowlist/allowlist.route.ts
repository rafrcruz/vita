import { Router } from 'express';
import { allowlistCreateSchema, type AllowlistEntryDto } from '@vita/shared';
import { requireAdmin } from '../auth/middleware';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../middleware/error';
import { addEntry, listEntries, removeEntry } from './allowlist.service';
import type { AllowlistRow } from '../db/schema';

export const allowlistRouter: Router = Router();

function toDto(row: AllowlistRow): AllowlistEntryDto {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    createdBy: row.createdBy,
  };
}

// Todas as rotas exigem administrador.
allowlistRouter.use(requireAdmin);

allowlistRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await listEntries();
    res.json(rows.map(toDto));
  })
);

allowlistRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = allowlistCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'invalid_body', 'Dados inválidos.');
    }
    const row = await addEntry(parsed.data, req.user?.email ?? null);
    res.status(201).json(toDto(row));
  })
);

allowlistRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string' || id.length === 0) {
      throw new AppError(400, 'invalid_id', 'Identificador inválido.');
    }
    await removeEntry(id);
    res.status(204).end();
  })
);
