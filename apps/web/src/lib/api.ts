import type { ApiError } from '@vita/shared';

/**
 * Cliente HTTP mínimo para a API (mesma origem, prefixo /api).
 * Lança Error com a mensagem padronizada da API em caso de falha.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = (await res.json()) as ApiError;
      message = body.error?.message ?? message;
    } catch {
      // resposta sem corpo JSON — mantém a mensagem padrão
    }
    throw new Error(message);
  }

  // Sem corpo (ex.: 204 do logout).
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
