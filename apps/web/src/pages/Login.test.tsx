import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { Login } from './Login';
import { AuthProvider } from '../lib/auth';
import { ThemeProvider } from '../theme/ThemeProvider';

function renderLogin() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <MemoryRouter>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Login (accessibility)', () => {
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
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => null,
      })) as unknown as typeof fetch
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderLogin();
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
    // Garante que o estado pós-carregamento foi atualizado
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
