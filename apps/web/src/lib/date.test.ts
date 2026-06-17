import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDateTimeMask,
  validateDateTimeString,
  parseDateTimeToISO,
  formatISOToDateTimeMask,
} from './date';

describe('date utility mask and validators', () => {
  beforeEach(() => {
    // Trava o tempo do sistema em 17/06/2026 às 12:00 para os testes de data futura
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 17, 12, 0, 0)); // Mês 5 é Junho no JS
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDateTimeMask', () => {
    it('should format numbers progressively', () => {
      expect(formatDateTimeMask('1')).toBe('1');
      expect(formatDateTimeMask('12')).toBe('12');
      expect(formatDateTimeMask('120')).toBe('12/0');
      expect(formatDateTimeMask('1206')).toBe('12/06');
      expect(formatDateTimeMask('12062')).toBe('12/06/2');
      expect(formatDateTimeMask('12062026')).toBe('12/06/2026');
      expect(formatDateTimeMask('120620260')).toBe('12/06/2026 0');
      expect(formatDateTimeMask('1206202601')).toBe('12/06/2026 01');
      expect(formatDateTimeMask('12062026013')).toBe('12/06/2026 01:3');
      expect(formatDateTimeMask('120620260130')).toBe('12/06/2026 01:30');
    });

    it('should ignore non-digits', () => {
      expect(formatDateTimeMask('12-06-2026 abc 01:30')).toBe('12/06/2026 01:30');
    });

    it('should slice at 12 digits maximum', () => {
      expect(formatDateTimeMask('12062026013099999')).toBe('12/06/2026 01:30');
    });
  });

  describe('validateDateTimeString', () => {
    it('should validate correct past/present dates', () => {
      expect(validateDateTimeString('12/06/2026 01:30')).toBe(true);
      expect(validateDateTimeString('17/06/2026 12:00')).toBe(true);
    });

    it('should reject future dates', () => {
      // 17/06/2026 às 12:01 é no futuro (1 minuto após o fake time)
      expect(validateDateTimeString('17/06/2026 12:01')).toBe(false);
      expect(validateDateTimeString('18/06/2026 10:00')).toBe(false);
    });

    it('should reject invalid formats', () => {
      expect(validateDateTimeString('12/06/26 01:30')).toBe(false);
      expect(validateDateTimeString('120620260130')).toBe(false);
      expect(validateDateTimeString('12/06/2026')).toBe(false);
    });

    it('should validate leap years', () => {
      // 2024 é bissexto
      expect(validateDateTimeString('29/02/2024 12:00')).toBe(true);
      // 2025 não é bissexto
      expect(validateDateTimeString('29/02/2025 12:00')).toBe(false);
    });

    it('should reject out of bound parts', () => {
      expect(validateDateTimeString('32/01/2026 12:00')).toBe(false); // dia inválido
      expect(validateDateTimeString('12/13/2026 12:00')).toBe(false); // mês inválido
      expect(validateDateTimeString('12/01/2026 24:00')).toBe(false); // hora inválida
      expect(validateDateTimeString('12/01/2026 12:60')).toBe(false); // minuto inválido
      expect(validateDateTimeString('12/01/1899 12:00')).toBe(false); // ano muito antigo
    });
  });

  describe('parseDateTimeToISO and formatISOToDateTimeMask', () => {
    it('should parse formatted mask string to ISO format and format it back', () => {
      const formatted = '12/06/2026 01:30';
      const iso = parseDateTimeToISO(formatted);

      // A string ISO gerada depende do fuso horário local de quem roda o teste.
      // Vamos validar formatando de volta.
      expect(formatISOToDateTimeMask(iso)).toBe(formatted);
    });
  });
});
