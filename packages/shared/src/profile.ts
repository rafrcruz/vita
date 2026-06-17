import { z } from 'zod';

/**
 * Schema de entrada do Perfil do Usuário (fonte única entre web e api).
 * Todos os campos são opcionais nesta etapa (FR-014): o usuário pode salvar parcialmente.
 */
export const profileInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(120, { message: 'O nome completo deve ter no máximo 120 caracteres.' })
    .optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data de nascimento inválida (use AAAA-MM-DD).' })
    .refine(
      (value) => {
        const date = new Date(`${value}T00:00:00Z`);
        return !Number.isNaN(date.getTime());
      },
      { message: 'Data de nascimento inválida.' }
    )
    .refine(
      (value) => {
        const year = Number(value.slice(0, 4));
        return year >= 1900;
      },
      { message: 'O ano de nascimento deve ser a partir de 1900.' }
    )
    .refine(
      (value) => {
        const date = new Date(`${value}T00:00:00Z`);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return date.getTime() <= today.getTime();
      },
      { message: 'A data de nascimento não pode estar no futuro.' }
    )
    .optional(),
  heightCm: z
    .number({ invalid_type_error: 'A altura deve ser um número.' })
    .min(50, { message: 'A altura mínima é 50 cm.' })
    .max(250, { message: 'A altura máxima é 250 cm.' })
    .optional(),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;

/** Perfil retornado pela API (campos podem ser nulos quando ainda não preenchidos). */
export type UserProfile = {
  id: string;
  fullName: string | null;
  birthDate: string | null; // "YYYY-MM-DD"
  heightCm: number | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
