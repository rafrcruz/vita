/**
 * Formata uma string numérica crua para o formato DD/MM/AAAA HH:MM
 * @param value - string contendo dígitos e pontuações
 * @returns string mascarada
 */
export function formatDateTimeMask(value: string): string {
  // Mantém apenas os dígitos numéricos
  const digits = value.replace(/\D/g, '');
  const len = digits.length;

  let formatted = '';
  if (len > 0) {
    // DD
    formatted += digits.substring(0, Math.min(2, len));
  }
  if (len > 2) {
    // DD/MM
    formatted += '/' + digits.substring(2, Math.min(4, len));
  }
  if (len > 4) {
    // DD/MM/AAAA
    formatted += '/' + digits.substring(4, Math.min(8, len));
  }
  if (len > 8) {
    // DD/MM/AAAA HH
    formatted += ' ' + digits.substring(8, Math.min(10, len));
  }
  if (len > 10) {
    // DD/MM/AAAA HH:MM
    formatted += ':' + digits.substring(10, Math.min(12, len));
  }

  return formatted;
}

/**
 * Valida se a string mascarada representa uma data e hora física válida e não-futura
 * @param formatted - String no formato DD/MM/AAAA HH:MM
 * @returns boolean
 */
export function validateDateTimeString(formatted: string): boolean {
  // Valida o padrão básico regex
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
  const match = formatted.match(regex);
  if (!match) return false;

  const day = parseInt(match[1]!, 10);
  const month = parseInt(match[2]!, 10);
  const year = parseInt(match[3]!, 10);
  const hour = parseInt(match[4]!, 10);
  const minute = parseInt(match[5]!, 10);

  // Validações básicas de limites numéricos
  if (month < 1 || month > 12) return false;
  if (hour < 0 || hour > 23) return false;
  if (minute < 0 || minute > 59) return false;
  if (year < 1900 || year > 2100) return false;

  // Validação física de calendário (dia bissexto, dias do mês, etc.)
  const dateObj = new Date(year, month - 1, day, hour, minute);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day ||
    dateObj.getHours() !== hour ||
    dateObj.getMinutes() !== minute
  ) {
    return false;
  }

  // Validação para impedir datas futuras
  if (dateObj.getTime() > Date.now()) {
    return false;
  }

  return true;
}

/**
 * Converte a string mascarada (DD/MM/AAAA HH:MM) em uma string ISO (UTC)
 * @param formatted - string no formato DD/MM/AAAA HH:MM
 * @returns string ISO 8601
 */
export function parseDateTimeToISO(formatted: string): string {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
  const match = formatted.match(regex);
  if (!match) {
    throw new Error('Formato de data inválido');
  }

  const day = parseInt(match[1]!, 10);
  const month = parseInt(match[2]!, 10);
  const year = parseInt(match[3]!, 10);
  const hour = parseInt(match[4]!, 10);
  const minute = parseInt(match[5]!, 10);

  // Cria o objeto Date local
  const dateObj = new Date(year, month - 1, day, hour, minute);
  return dateObj.toISOString();
}

/**
 * Converte uma data/timestamp ISO em formato amigável para a máscara (DD/MM/AAAA HH:MM)
 * @param isoString - timestamp em ISO
 * @returns string formatada
 */
export function formatISOToDateTimeMask(isoString: string): string {
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) return '';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${minute}`;
}
