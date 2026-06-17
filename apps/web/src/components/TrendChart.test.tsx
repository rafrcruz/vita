import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { TrendChart, computeXTickIndices, formatMetricValue } from './TrendChart';

// Mock Recharts to bypass JSDOM container dimensions issues
vi.mock('recharts', async () => {
  const original = await vi.importActual<Record<string, unknown>>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div className="recharts-responsive-container-mock" style={{ width: 800, height: 600 }}>
        {children}
      </div>
    ),
  };
});

describe('computeXTickIndices', () => {
  it('retorna vazio para 0 pontos e [0] para 1 ponto', () => {
    expect(computeXTickIndices(0)).toEqual([]);
    expect(computeXTickIndices(1)).toEqual([0]);
  });

  it('usa todos os pontos quando há entre 2 e 6', () => {
    expect(computeXTickIndices(2)).toEqual([0, 1]);
    expect(computeXTickIndices(4)).toEqual([0, 1, 2, 3]);
    expect(computeXTickIndices(6)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('limita a no máximo 6 marcas para muitos pontos, incluindo extremos', () => {
    const ticks = computeXTickIndices(100);
    expect(ticks.length).toBeLessThanOrEqual(6);
    expect(ticks.length).toBeGreaterThanOrEqual(3);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBe(99);
  });
});

describe('formatMetricValue', () => {
  it('formata peso com unidade kg', () => {
    expect(formatMetricValue('weight', 72.5)).toBe('72.5 kg');
  });

  it('formata pressão com sistólica/diastólica e mmHg', () => {
    expect(formatMetricValue('bp', 120, 80)).toBe('120x80 mmHg');
  });
});

describe('TrendChart', () => {
  it('renderiza estado vazio sem erro', () => {
    render(<TrendChart data={[]} type="weight" />);
    expect(screen.getByTestId('empty-chart-text')).toBeInTheDocument();
  });

  it('renderiza com 1 ponto sem erro e expõe rótulo acessível', () => {
    render(
      <TrendChart data={[{ loggedAt: '2026-06-10T12:00:00.000Z', weight: 70 }]} type="weight" />
    );
    // Recharts renderiza o gráfico e coloca os valores ou textos dentro do SVG.
    // Vamos validar se a estrutura do gráfico renderiza e contém o botão de tela cheia.
    expect(screen.getByLabelText('Visualizar gráfico em tela cheia')).toBeInTheDocument();
  });
});
