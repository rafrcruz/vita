import { describe, it, expect } from 'vitest';
import pino from 'pino';
import { REDACT_PATHS } from './logging';

describe('Redação de logs (sem segredos)', () => {
  it('remove authorization, cookie e senha dos logs', () => {
    const lines: string[] = [];
    const stream = { write: (s: string) => void lines.push(s) };
    const log = pino({ redact: { paths: REDACT_PATHS, remove: true } }, stream as never);

    log.info(
      {
        req: {
          headers: {
            authorization: 'Bearer TOKEN_SECRETO',
            cookie: 'vita_session=COOKIE_SECRETO',
          },
          body: { password: 'SENHA_SECRETA' },
        },
      },
      'requisição'
    );

    const out = lines.join('');
    expect(out).not.toContain('TOKEN_SECRETO');
    expect(out).not.toContain('COOKIE_SECRETO');
    expect(out).not.toContain('SENHA_SECRETA');
  });
});
