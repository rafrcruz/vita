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

  // 3. Peso final é o menor peso do último dia com dados
  const endRecord = dailyMinLogs[dailyMinLogs.length - 1];
  if (!endRecord) return null;
  const endWeight = endRecord.minWeight;
  const endDate = endRecord.date;

  // 4. Determinar data de início alvo
  let targetStartDateStr: string;
  if (daysAgo !== undefined && daysAgo !== null) {
    const startThreshold = new Date(referenceDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    targetStartDateStr = getLocalDayString(startThreshold);
  } else {
    // Período total: usa o dia do primeiríssimo registro
    const firstRecord = dailyMinLogs[0];
    if (!firstRecord) return null;
    targetStartDateStr = firstRecord.dayStr;
  }

  // 5. Encontrar registro de início usando as prioridades de fallback
  let startRecord: { dayStr: string; date: Date; minWeight: number } | null = null;

  // Prioridade 1: correspondência exata do dia
  const exactMatch = dailyMinLogs.find(r => r.dayStr === targetStartDateStr);
  if (exactMatch) {
    startRecord = exactMatch;
  } else {
    // Prioridade 2: dia anterior mais próximo
    const earlierRecords = dailyMinLogs.filter(r => r.dayStr < targetStartDateStr);
    if (earlierRecords.length > 0) {
      startRecord = earlierRecords[earlierRecords.length - 1] ?? null;
    } else {
      // Prioridade 3: dia posterior mais próximo
      const laterRecords = dailyMinLogs.filter(r => r.dayStr > targetStartDateStr);
      if (laterRecords.length > 0) {
        startRecord = laterRecords[0] ?? null;
      }
    }
  }

  if (!startRecord) return null;

  const startWeight = startRecord.minWeight;
  const startDate = startRecord.date;

  // 6. Diferença em dias
  const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  const diffTime = endDay.getTime() - startDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 0; // Evita divisão por zero ou resultado negativo/inválido
  }

  const dailyLoss = (startWeight - endWeight) / diffDays;
  return dailyLoss * 7;
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
