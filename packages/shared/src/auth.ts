import { z } from 'zod';

export const roleSchema = z.enum(['admin', 'member']);
export type Role = z.infer<typeof roleSchema>;

/** Usuário da sessão atual (retornado por GET /api/auth/me). */
export const currentUserSchema = z.object({
  email: z.string().email(),
  role: roleSchema,
});
export type CurrentUser = z.infer<typeof currentUserSchema>;

/** Entrada da allowlist (retornada pela API de administração). */
export const allowlistEntrySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: roleSchema,
  createdAt: z.string(),
  createdBy: z.string().nullable(),
});
export type AllowlistEntryDto = z.infer<typeof allowlistEntrySchema>;

/** Corpo para adicionar um e-mail à allowlist. */
export const allowlistCreateSchema = z.object({
  email: z.string().email(),
  role: roleSchema.default('member'),
});
export type AllowlistCreateDto = z.infer<typeof allowlistCreateSchema>;
