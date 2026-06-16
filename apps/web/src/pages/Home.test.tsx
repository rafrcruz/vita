import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { AuthProvider } from '../lib/auth';

function renderHome() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Home (app shell)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        // /auth/me → autenticado como admin; /health → saudável
        if (String(url).includes('/auth/me')) {
          return { ok: true, status: 200, json: async () => ({ email: 'a@b.com', role: 'admin' }) };
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
    expect(screen.getByText('VITA')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('health-status')).toHaveTextContent('Saudável');
    });
  });
});
