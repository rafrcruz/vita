export interface WeightLog {
  id?: string;
  weight: number;
  loggedAt: string | Date;
}

export interface BPLog {
  id?: string;
  systolic: number;
  diastolic: number;
  loggedAt: string | Date;
}

export interface BPAverage {
  avgSystolic: number | null;
  avgDiastolic: number | null;
}

/**
 * Converte data de API (YYYY-MM-DD) para exibição (DD/MM/YYYY)
 */
export function toDisplayDate(apiDate: string): string {
  if (!apiDate) return '';
  const clean = apiDate.trim();
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return clean;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

/**
 * Converte data de exibição (DD/MM/YYYY) para API (YYYY-MM-DD)
 */
export function toApiDate(displayDate: string): string {
  if (!displayDate) return '';
  const clean = displayDate.trim();
  const match = clean.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return clean;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

/**
 * Retorna string no formato local YYYY-MM-DD
 */
export function getLocalDayString(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calcula a perda média de peso semanal (Total, 30d, 7d)
 * seguindo as regras de fallback especificadas.
 */
export function calculateWeightLossWeekly(
  logs: WeightLog[],
  daysAgo?: number | null,
  referenceDateInput?: Date | string
): number | null {
  if (!logs || logs.length === 0) return null;

  const referenceDate = referenceDateInput ? new Date(referenceDateInput) : new Date();
  const referenceMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  // 1. Ordenar por data crescente
  const sortedLogs = [...logs].map(log => ({
    ...log,
    loggedAt: new Date(log.loggedAt)
  })).sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());

  // 2. Agrupar por dia (fuso local) e achar o menor peso de cada dia
  const dayGroups: { [day: string]: { date: Date; minWeight: number } } = {};
  for (const log of sortedLogs) {
    const dayStr = getLocalDayString(log.loggedAt);
    if (!dayGroups[dayStr] || log.weight < dayGroups[dayStr].minWeight) {
      dayGroups[dayStr] = { date: log.loggedAt, minWeight: log.weight };
    }
  }

  const dailyMinLogs = Object.keys(dayGroups)
    .map(dayStr => {
      const group = dayGroups[dayStr];
      if (!group) {
        throw new Error('Unreachable');
      }
      return {
        dayStr,
        date: group.date,
        minWeight: group.minWeight
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (dailyMinLogs.length === 0) return null;

  const firstRecord = dailyMinLogs[0];
  const lastRecord = dailyMinLogs[dailyMinLogs.length - 1];
  if (!firstRecord || !lastRecord) return null;

  const D_min = new Date(firstRecord.date.getFullYear(), firstRecord.date.getMonth(), firstRecord.date.getDate());
  const D_max = new Date(lastRecord.date.getFullYear(), lastRecord.date.getMonth(), lastRecord.date.getDate());

  // Build daily timeline from D_min to D_max
  const timeline = new Map<string, number>();
  const current = new Date(D_min);
  while (current <= D_max) {
    const dayStr = getLocalDayString(current);
    const exactLog = dailyMinLogs.find(log => log.dayStr === dayStr);

    if (exactLog) {
      timeline.set(dayStr, exactLog.minWeight);
    } else {
      const prevLog = [...dailyMinLogs].reverse().find(log => log.dayStr < dayStr);
      const nextLog = dailyMinLogs.find(log => log.dayStr > dayStr);

      if (prevLog && nextLog) {
        const prevDate = new Date(prevLog.date.getFullYear(), prevLog.date.getMonth(), prevLog.date.getDate());
        const nextDate = new Date(nextLog.date.getFullYear(), nextLog.date.getMonth(), nextLog.date.getDate());
        const totalDays = Math.round((nextDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysFromPrev = Math.round((current.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        const weight = prevLog.minWeight + (nextLog.minWeight - prevLog.minWeight) * (daysFromPrev / totalDays);
        timeline.set(dayStr, weight);
      }
    }
    current.setDate(current.getDate() + 1);
  }

  // Define intersection bounds [D_1, D_2]
  let D_1 = D_min;
  const D_2 = D_max;

  if (daysAgo !== undefined && daysAgo !== null) {
    const D_start = new Date(referenceMidnight.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    D_1 = new Date(Math.max(D_start.getTime(), D_min.getTime()));
  }

  const diffDays = Math.round((D_2.getTime() - D_1.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 1) {
    return 0;
  }

  const startWeight = timeline.get(getLocalDayString(D_1));
  const endWeight = timeline.get(getLocalDayString(D_2));

  if (startWeight === undefined || endWeight === undefined) {
    return 0;
  }

  return ((endWeight - startWeight) / diffDays) * 7;
}

/**
 * Calcula a média aritmética de pressão sistólica e diastólica para o período.
 */
export function calculateBPAverage(
  logs: BPLog[],
  daysAgo?: number | null,
  referenceDateInput?: Date | string
): BPAverage {
  if (!logs || logs.length === 0) {
    return { avgSystolic: null, avgDiastolic: null };
  }

  let filtered = logs;
  if (daysAgo !== undefined && daysAgo !== null) {
    const referenceDate = referenceDateInput ? new Date(referenceDateInput) : new Date();
    const threshold = referenceDate.getTime() - daysAgo * 24 * 60 * 60 * 1000;
    filtered = logs.filter(log => new Date(log.loggedAt).getTime() >= threshold);
  }

  if (filtered.length === 0) {
    return { avgSystolic: null, avgDiastolic: null };
  }

  const totalSystolic = filtered.reduce((sum, log) => sum + log.systolic, 0);
  const totalDiastolic = filtered.reduce((sum, log) => sum + log.diastolic, 0);

  return {
    avgSystolic: Math.round(totalSystolic / filtered.length),
    avgDiastolic: Math.round(totalDiastolic / filtered.length)
  };
}
