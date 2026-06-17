import { describe, it, expect } from 'vitest';
import {
  toDisplayDate,
  toApiDate,
  calculateWeightLossWeekly,
  calculateBPAverage,
  calculateWeightTotalLoss,
} from './metrics';
import type { WeightLog, BPLog } from './metrics';

describe('Metrics date conversions', () => {
  it('should convert API date to display date', () => {
    expect(toDisplayDate('1988-02-13')).toBe('13/02/1988');
    expect(toDisplayDate('2026-12-31')).toBe('31/12/2026');
    expect(toDisplayDate('')).toBe('');
    expect(toDisplayDate('invalid-date')).toBe('invalid-date');
  });

  it('should convert display date to API date', () => {
    expect(toApiDate('13/02/1988')).toBe('1988-02-13');
    expect(toApiDate('31/12/2026')).toBe('2026-12-31');
    expect(toApiDate('')).toBe('');
    expect(toApiDate('invalid-date')).toBe('invalid-date');
  });
});

describe('calculateWeightLossWeekly', () => {
  const refDate = new Date('2026-06-17T12:00:00Z');

  it('should return null for empty logs', () => {
    expect(calculateWeightLossWeekly([])).toBeNull();
  });

  it('should return 0 for a single log entry', () => {
    const logs: WeightLog[] = [{ weight: 80.0, loggedAt: '2026-06-17T10:00:00Z' }];
    expect(calculateWeightLossWeekly(logs, 7, refDate)).toBe(0);
  });

  it('should compute exact match on start date (7d)', () => {
    const logs: WeightLog[] = [
      { weight: 80.0, loggedAt: '2026-06-10T08:00:00Z' }, // 7 days ago
      { weight: 79.0, loggedAt: '2026-06-17T10:00:00Z' }, // today
    ];
    // Loss = 80 - 79 = 1kg over 7 days. Weekly average change = -1kg/week
    expect(calculateWeightLossWeekly(logs, 7, refDate)).toBe(-1);
  });

  it('should compute exact match on start date (30d)', () => {
    const logs: WeightLog[] = [
      { weight: 85.0, loggedAt: '2026-05-18T08:00:00Z' }, // 30 days ago
      { weight: 81.0, loggedAt: '2026-06-17T10:00:00Z' }, // today
    ];
    // Loss = 85 - 81 = 4kg over 30 days. Weekly average change = -(4 / 30) * 7 = -0.9333...
    const result = calculateWeightLossWeekly(logs, 30, refDate);
    expect(result).toBeCloseTo(-0.9333, 4);
  });

  it('should use closest earlier date fallback if exact start date is missing', () => {
    const logs: WeightLog[] = [
      { weight: 82.0, loggedAt: '2026-06-08T08:00:00Z' }, // 9 days ago (earliest before 7 days ago)
      { weight: 79.0, loggedAt: '2026-06-17T10:00:00Z' }, // today
    ];
    // Start date threshold is 2026-06-10 (7d ago). No record on 10th.
    // Linear interpolation at 10th resolves to 81.3333...
    // Weight change = 79.0 - 81.3333... = -2.3333...
    const result = calculateWeightLossWeekly(logs, 7, refDate);
    expect(result).toBeCloseTo(-2.3333, 4);
  });

  it('should use closest later date fallback if exact and earlier dates are missing', () => {
    const logs: WeightLog[] = [
      { weight: 80.0, loggedAt: '2026-06-12T08:00:00Z' }, // 5 days ago (later than 7 days ago)
      { weight: 78.0, loggedAt: '2026-06-17T10:00:00Z' }, // today
    ];
    // Start date threshold is 2026-06-10.
    // Intersection start date is 2026-06-12 (D_min). End date is 17th. Days diff = 5.
    // Weight change = 78.0 - 80.0 = -2kg over 5 days. Weekly rate = (-2 / 5) * 7 = -2.8
    const result = calculateWeightLossWeekly(logs, 7, refDate);
    expect(result).toBeCloseTo(-2.8, 1);
  });

  it('should find the lowest weight of the day for calculations', () => {
    const logs: WeightLog[] = [
      { weight: 81.0, loggedAt: '2026-06-10T08:00:00Z' },
      { weight: 80.0, loggedAt: '2026-06-10T18:00:00Z' }, // lowest of start date is 80.0
      { weight: 79.5, loggedAt: '2026-06-17T09:00:00Z' },
      { weight: 79.0, loggedAt: '2026-06-17T15:00:00Z' }, // lowest of end date is 79.0
    ];
    // Weight change = 79.0 - 80.0 = -1.0kg over 7 days. Weekly change = -1.0
    expect(calculateWeightLossWeekly(logs, 7, refDate)).toBe(-1);
  });

  it('should return 0 when start date resolved matches end date resolved (diffDays = 0)', () => {
    const logs: WeightLog[] = [
      { weight: 80.0, loggedAt: '2026-06-17T08:00:00Z' },
      { weight: 79.0, loggedAt: '2026-06-17T18:00:00Z' },
    ];
    expect(calculateWeightLossWeekly(logs, 7, refDate)).toBe(0);
  });
});

describe('calculateBPAverage', () => {
  const refDate = new Date('2026-06-17T12:00:00Z');

  it('should return nulls for empty logs', () => {
    expect(calculateBPAverage([])).toEqual({ avgSystolic: null, avgDiastolic: null });
  });

  it('should average all records if no daysAgo threshold is given', () => {
    const logs: BPLog[] = [
      { systolic: 120, diastolic: 80, loggedAt: '2026-05-01T12:00:00Z' },
      { systolic: 130, diastolic: 86, loggedAt: '2026-06-17T12:00:00Z' },
    ];
    expect(calculateBPAverage(logs)).toEqual({ avgSystolic: 125, avgDiastolic: 83 });
  });

  it('should filter logs outside the time threshold', () => {
    const logs: BPLog[] = [
      { systolic: 140, diastolic: 90, loggedAt: '2026-06-05T12:00:00Z' }, // 12 days ago (excluded for 7d)
      { systolic: 120, diastolic: 80, loggedAt: '2026-06-15T12:00:00Z' }, // 2 days ago (included)
      { systolic: 110, diastolic: 70, loggedAt: '2026-06-16T12:00:00Z' }, // 1 day ago (included)
    ];
    expect(calculateBPAverage(logs, 7, refDate)).toEqual({ avgSystolic: 115, avgDiastolic: 75 });
  });

  it('should return nulls if no records fall in the timeframe', () => {
    const logs: BPLog[] = [{ systolic: 140, diastolic: 90, loggedAt: '2026-06-05T12:00:00Z' }];
    expect(calculateBPAverage(logs, 7, refDate)).toEqual({ avgSystolic: null, avgDiastolic: null });
  });
});

describe('calculateWeightTotalLoss', () => {
  it('should return null for empty logs', () => {
    expect(calculateWeightTotalLoss([])).toBeNull();
  });

  it('should return 0.0 for a single log entry', () => {
    const logs: WeightLog[] = [{ weight: 80.0, loggedAt: '2026-06-17T10:00:00Z' }];
    expect(calculateWeightTotalLoss(logs)).toBe(0);
  });

  it('should compute total weight loss correctly (negative value)', () => {
    const logs: WeightLog[] = [
      { weight: 80.0, loggedAt: '2026-06-10T08:00:00Z' }, // first record
      { weight: 78.0, loggedAt: '2026-06-12T10:00:00Z' },
      { weight: 75.0, loggedAt: '2026-06-17T12:00:00Z' }, // last day
    ];
    // 75.0 (current) - 80.0 (first) = -5.0
    expect(calculateWeightTotalLoss(logs)).toBe(-5.0);
  });

  it('should compute total weight gain correctly (positive value)', () => {
    const logs: WeightLog[] = [
      { weight: 80.0, loggedAt: '2026-06-10T08:00:00Z' }, // first record
      { weight: 81.0, loggedAt: '2026-06-12T10:00:00Z' },
      { weight: 83.0, loggedAt: '2026-06-17T12:00:00Z' }, // last day
    ];
    // 83.0 (current) - 80.0 (first) = +3.0
    expect(calculateWeightTotalLoss(logs)).toBe(3.0);
  });

  it('should use the lowest weight of the last day for currentWeight', () => {
    const logs: WeightLog[] = [
      { weight: 80.0, loggedAt: '2026-06-10T08:00:00Z' }, // first record
      { weight: 76.0, loggedAt: '2026-06-17T09:00:00Z' },
      { weight: 75.0, loggedAt: '2026-06-17T15:00:00Z' }, // lowest of last day is 75.0
    ];
    // 75.0 (current) - 80.0 (first) = -5.0
    expect(calculateWeightTotalLoss(logs)).toBe(-5.0);
  });
});
