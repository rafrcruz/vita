import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { AdminAllowlist } from './AdminAllowlist';
import { AuthProvider } from '../lib/auth';
import { ThemeProvider } from '../theme/ThemeProvider';

function renderAdmin() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <MemoryRouter>
          <AuthProvider>
            <AdminAllowlist />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('AdminAllowlist (accessibility)', () => {
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
          return { ok: true, status: 200, json: async () => ({ email: 'admin@test.com', role: 'admin' }) };
        }
        if (String(url).includes('/allowlist')) {
          return { ok: true, status: 200, json: async () => [] };
        }
        return { ok: true, status: 200, json: async () => ({}) };
      }) as unknown as typeof fetch
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderAdmin();
    // Wait for loaded empty state to render to avoid act warnings and check actual accessibility
    await screen.findByText('Nenhum usuário na allowlist');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('T036: validates form fields and shows error messages', async () => {
    const user = userEvent.setup();
    renderAdmin();

    await screen.findByText('Nenhum usuário na allowlist');

    const emailInput = screen.getByLabelText('E-mail');
    const submitButton = screen.getByRole('button', { name: /adicionar/i });

    // Submit without typing anything (validation error for email)
    await user.click(submitButton);

    // Wait for inline validation error
    const errorText = await screen.findByText('E-mail inválido');
    expect(errorText).toBeInTheDocument();

    // Type invalid email
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument();

    // Clear and type valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@email.com');

    // Mock API error for submission to test "try again" / alert error message
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (String(url).includes('/auth/me')) {
          return { ok: true, status: 200, json: async () => ({ email: 'admin@test.com', role: 'admin' }) };
        }
        if (String(url).includes('/allowlist')) {
          // POST fails
          return { ok: false, status: 400, json: async () => ({ error: { message: 'E-mail já cadastrado' } }) };
        }
        return { ok: true, status: 200, json: async () => ({}) };
      }) as unknown as typeof fetch
    );

    await user.click(submitButton);

    // Alert error message appears
    const alertError = await screen.findByText('E-mail já cadastrado');
    expect(alertError).toBeInTheDocument();
  });
});
