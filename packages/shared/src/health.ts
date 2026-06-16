import { z } from 'zod';

export const weightLogInputSchema = z.object({
  weight: z.number({ required_error: 'O peso é obrigatório.' })
    .min(20, { message: 'O peso mínimo é 20 kg.' })
    .max(350, { message: 'O peso máximo é 350 kg.' }),
  loggedAt: z.string().datetime({ message: 'Data inválida.' }).optional(),
});

export type WeightLogInput = z.infer<typeof weightLogInputSchema>;

export const bpLogInputSchema = z.object({
  systolic: z.number({ required_error: 'A pressão sistólica é obrigatória.' })
    .int()
    .min(40, { message: 'A pressão sistólica mínima é 40 mmHg.' })
    .max(300, { message: 'A pressão sistólica máxima é 300 mmHg.' }),
  diastolic: z.number({ required_error: 'A pressão diastólica é obrigatória.' })
    .int()
    .min(30, { message: 'A pressão diastólica mínima é 30 mmHg.' })
    .max(200, { message: 'A pressão diastólica máxima é 200 mmHg.' }),
  loggedAt: z.string().datetime({ message: 'Data inválida.' }).optional(),
});

export type BPLogInput = z.infer<typeof bpLogInputSchema>;
