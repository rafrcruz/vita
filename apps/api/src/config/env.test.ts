import { describe, it, expect } from 'vitest';
import { parseEnv } from './env';

const validBase = {
  NODE_ENV: 'test',
  JWT_SECRET: 'x'.repeat(32),
};

describe('parseEnv (validação fail-fast)', () => {
  it('falha quando JWT_SECRET está ausente', () => {
    const result = parseEnv({ NODE_ENV: 'test' });
    expect(result.success).toBe(false);
  });

  it('falha quando JWT_SECRET é curto demais', () => {
    const result = parseEnv({ ...validBase, JWT_SECRET: 'curto' });
    expect(result.success).toBe(false);
  });

  it('trata string vazia como ausente (opcionais permanecem válidas)', () => {
    const result = parseEnv({ ...validBase, DATABASE_URL: '' });
    expect(result.success).toBe(true);
  });

  it('falha quando DATABASE_URL é uma URL inválida', () => {
    const result = parseEnv({ ...validBase, DATABASE_URL: 'não-é-url' });
    expect(result.success).toBe(false);
  });

  it('aceita configuração mínima válida', () => {
    const result = parseEnv(validBase);
    expect(result.success).toBe(true);
  });
});
