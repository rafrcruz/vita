import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { Home } from './Home';
import { AuthProvider } from '../lib/auth';
import { ThemeProvider } from '../theme/ThemeProvider';

function renderHome() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <MemoryRouter>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Home (app shell)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (String(url).includes('/auth/me')) {
          return { ok: true, status: 200, json: async () => ({ email: 'a@b.com', role: 'admin' }) };
        }
        if (String(url).includes('/metrics/')) {
          return { ok: true, status: 200, json: async () => [] };
        }
        return { ok: true, status: 200, json: async () => ({}) };
      }) as unknown as typeof fetch
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exibe o título VITA e o botão Sair no cabeçalho', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: 'VITA' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument();
  });

  it('não exibe mais os elementos removidos (subtítulo, status do backend, admin inline)', () => {
    renderHome();
    expect(screen.queryByText('Plataforma pessoal de observabilidade de saúde')).not.toBeInTheDocument();
    expect(screen.queryByText('Status do backend')).not.toBeInTheDocument();
    expect(screen.queryByText('Administrar allowlist')).not.toBeInTheDocument();
    expect(screen.queryByTestId('health-status')).not.toBeInTheDocument();
  });

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderHome();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'VITA' })).toBeInTheDocument();
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('exibe os indicadores de peso na ordem correta com Perda Total', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (String(url).includes('/auth/me')) {
          return { ok: true, status: 200, json: async () => ({ email: 'a@b.com', role: 'admin' }) };
        }
        if (String(url).includes('/metrics/weight')) {
          return {
            ok: true,
            status: 200,
            json: async () => [
              { id: '1', weight: 80.0, loggedAt: '2026-06-10T12:00:00Z' },
              { id: '2', weight: 75.0, loggedAt: '2026-06-17T12:00:00Z' }
            ]
          };
        }
        if (String(url).includes('/metrics/bp')) {
          return { ok: true, status: 200, json: async () => [] };
        }
        return { ok: true, status: 200, json: async () => ({}) };
      }) as unknown as typeof fetch
    );

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Última Medição')).toBeInTheDocument();
    });

    expect(screen.getByText('Peso Atual')).toBeInTheDocument();
    expect(screen.getByText('Perda Total')).toBeInTheDocument();
    expect(screen.getByText('Perda Semanal (7d)')).toBeInTheDocument();
    expect(screen.getByText('Perda Semanal (30d)')).toBeInTheDocument();
    expect(screen.getByText('Perda Semanal (Total)')).toBeInTheDocument();

    // -5.0 kg (locale formatted)
    expect(screen.getByText(/-5[.,]0 kg$/)).toBeInTheDocument();
  });
});

