import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AppShell } from './AppShell';
import { AuthProvider } from '../../lib/auth';

function renderShell(width: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));

  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <AuthProvider>
          <AppShell>
            <div data-testid="content">Content</div>
          </AppShell>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AppShell', () => {
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
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ email: 'a@b.com', role: 'admin' }) })) as unknown as typeof fetch
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('N1: renders BottomNav on mobile (390px)', () => {
    renderShell(390);
    expect(screen.getByTestId('content')).toBeInTheDocument();
    const navs = screen.getAllByRole('navigation');
    const bottomNav = navs.find((nav) => nav.className.includes('md:hidden'));
    expect(bottomNav).toBeDefined();
  });

  it('N2: renders NavRail on tablet (768px)', () => {
    renderShell(768);
    expect(screen.getByTestId('content')).toBeInTheDocument();
    const navs = screen.getAllByRole('navigation');
    const navRail = navs.find((nav) => nav.className.includes('md:flex') && nav.className.includes('lg:hidden'));
    expect(navRail).toBeDefined();
  });

  it('N3: renders SidebarNav on desktop (1920px)', () => {
    renderShell(1920);
    expect(screen.getByTestId('content')).toBeInTheDocument();
    const navs = screen.getAllByRole('navigation');
    const sidebar = navs.find((nav) => nav.className.includes('lg:flex'));
    expect(sidebar).toBeDefined();
  });
});
