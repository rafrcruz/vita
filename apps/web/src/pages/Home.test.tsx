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
        return {
          ok: true,
          status: 200,
          json: async () => ({ status: 'ok', db: 'up', time: '2026-06-16T00:00:00.000Z' }),
        };
      }) as unknown as typeof fetch
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exibe o título e o status saudável vindo da API', async () => {
    renderHome();
    expect(screen.getByRole('heading', { name: 'VITA' })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('health-status')).toBeInTheDocument();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = renderHome();
    await waitFor(() => {
      expect(screen.getByTestId('health-status')).toBeInTheDocument();
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
