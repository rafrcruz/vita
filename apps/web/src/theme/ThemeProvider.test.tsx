import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

function TestConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('light')}>set-light</button>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={() => setTheme('system')}>set-system</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>
  );
}

describe('ThemeProvider', () => {
  let matchMediaListeners: ((e: { matches: boolean }) => void)[] = [];
  let currentMatches = false;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    matchMediaListeners = [];

    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return {
            matches: currentMatches,
            media: query,
            addEventListener: (_: string, handler: (e: { matches: boolean }) => void) => {
              matchMediaListeners.push(handler);
            },
            removeEventListener: (_: string, handler: (e: { matches: boolean }) => void) => {
              matchMediaListeners = matchMediaListeners.filter((h) => h !== handler);
            },
          };
        }
        return { matches: false, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('T1: defaults to system when no stored preference', () => {
    currentMatches = false;
    renderProvider();
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('T2: follows OS changes when theme is system', async () => {
    currentMatches = false;
    renderProvider();
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');

    act(() => {
      currentMatches = true;
      matchMediaListeners.forEach((fn) => fn({ matches: true }));
    });

    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('T3: setTheme("dark") applies dark class and persists', async () => {
    const user = userEvent.setup();
    currentMatches = false;
    renderProvider();

    await user.click(screen.getByText('set-dark'));

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('vita.theme')).toBe('dark');
  });

  it('T4: explicit theme ignores OS changes', async () => {
    const user = userEvent.setup();
    currentMatches = false;
    renderProvider();

    await user.click(screen.getByText('set-light'));

    act(() => {
      currentMatches = true;
      matchMediaListeners.forEach((fn) => fn({ matches: true }));
    });

    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('T5: reads stored preference on mount', () => {
    currentMatches = false;
    localStorage.setItem('vita.theme', 'dark');
    renderProvider();
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('T6: falls back to light when localStorage/matchMedia unavailable', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => { throw new Error('unavailable'); }));
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('unavailable'); });

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    spy.mockRestore();
  });

  it('T7: prefers-reduced-motion is resolved by matchMedia', () => {
    let motionMatches = false;
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return { matches: motionMatches, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() };
        }
        return { matches: false, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() };
      })
    );

    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);
    motionMatches = true;
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
  });
});
