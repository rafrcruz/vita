import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { Profile } from './Profile';
import { AuthProvider } from '../lib/auth';
import { ThemeProvider } from '../theme/ThemeProvider';

function renderProfile() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <MemoryRouter>
          <AuthProvider>
            <Profile />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Profile', () => {
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
          return {
            ok: true,
            status: 200,
            json: async () => ({ email: 'a@b.com', role: 'member' }),
          };
        }
        if (String(url).includes('/profile')) {
          return { ok: true, status: 200, json: async () => null };
        }
        return { ok: true, status: 200, json: async () => ({}) };
      }) as unknown as typeof fetch
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renderiza os três campos do perfil', async () => {
    renderProfile();
    await waitFor(() => {
      expect(screen.getByLabelText('Nome completo')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Data de nascimento')).toBeInTheDocument();
    expect(screen.getByLabelText('Altura (cm)')).toBeInTheDocument();
  });

  it('bloqueia salvar com altura fora da faixa e exibe erro', async () => {
    const user = userEvent.setup();
    renderProfile();
    await waitFor(() => {
      expect(screen.getByLabelText('Altura (cm)')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Altura (cm)'), '10');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(screen.getByText('A altura mínima é 50 cm.')).toBeInTheDocument();
    });
  });

  it('aplica mascara no campo data de nascimento e valida formato incorreto', async () => {
    const user = userEvent.setup();
    renderProfile();
    await waitFor(() => {
      expect(screen.getByLabelText('Data de nascimento')).toBeInTheDocument();
    });

    const birthDateInput = screen.getByLabelText('Data de nascimento') as HTMLInputElement;
    await user.type(birthDateInput, '13021988');
    expect(birthDateInput.value).toBe('13/02/1988');

    // Limpa e digita data incorreta
    await user.clear(birthDateInput);
    await user.type(birthDateInput, '1302198');
    expect(birthDateInput.value).toBe('13/02/198');

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(
        screen.getByText('Data de nascimento inválida. Use o formato DD/MM/AAAA.')
      ).toBeInTheDocument();
    });
  });
});
