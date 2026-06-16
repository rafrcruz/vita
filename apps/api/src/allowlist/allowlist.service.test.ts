import { describe, it, expect } from 'vitest';
import { assertCanRemove } from './allowlist.service';
import { AppError } from '../middleware/error';

describe('assertCanRemove (proteção do último admin)', () => {
  it('lança 409 ao remover o último administrador', () => {
    try {
      assertCanRemove({ role: 'admin' }, 1);
      expect.unreachable('deveria ter lançado');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).status).toBe(409);
      expect((err as AppError).code).toBe('last_admin');
    }
  });

  it('permite remover admin quando há outros admins', () => {
    expect(() => assertCanRemove({ role: 'admin' }, 2)).not.toThrow();
  });

  it('permite remover um membro comum', () => {
    expect(() => assertCanRemove({ role: 'member' }, 1)).not.toThrow();
  });
});
