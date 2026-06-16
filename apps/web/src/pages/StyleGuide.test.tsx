import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import { StyleGuide } from './StyleGuide';
import { ThemeProvider } from '../theme/ThemeProvider';

function renderStyleGuide() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <MemoryRouter>
          <StyleGuide />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('StyleGuide (accessibility)', () => {
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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderStyleGuide();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
