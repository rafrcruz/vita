import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

// Carrega o .env da raiz do monorepo (em produção/serverless as variáveis são
// injetadas pela plataforma e nenhum arquivo .env existe — o load é best-effort).
const rootEnv = resolve(process.cwd(), '../../.env');
if (existsSync(rootEnv)) {
  loadDotenv({ path: rootEnv });
} else {
  loadDotenv();
}

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
  // Obrigatório desde o MVP — usado para assinar o JWT de sessão.
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter ao menos 32 caracteres'),
  SESSION_COOKIE_NAME: z.string().min(1).default('vita_session'),

  // Opcionais agora; tornam-se necessários nas suas respectivas user stories.
  DATABASE_URL: z.string().url().optional(), // US2 (Neon)
  GOOGLE_CLIENT_ID: z.string().optional(), // US3
  GOOGLE_CLIENT_SECRET: z.string().optional(), // US3
  OAUTH_REDIRECT_URI: z.string().url().optional(), // US3
  ADMIN_EMAILS: z.string().optional(), // US3
  SENTRY_DSN: z.string().optional(), // US4
});

export type Env = z.infer<typeof EnvSchema>;

/** Valida uma fonte de variáveis de ambiente (string vazia é tratada como ausente). */
export function parseEnv(source: NodeJS.ProcessEnv) {
  const cleaned = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [key, value === '' ? undefined : value])
  );
  return EnvSchema.safeParse(cleaned);
}

function loadEnv(): Env {
  const parsed = parseEnv(process.env);
  if (!parsed.success) {
    // Fail-fast: configuração inválida impede o boot (FR-007).
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    console.error(`\n[config] Variáveis de ambiente inválidas:\n${issues}\n`);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
export const isProduction = env.NODE_ENV === 'production';
