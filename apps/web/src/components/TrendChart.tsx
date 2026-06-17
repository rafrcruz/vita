import * as React from 'react';

interface ChartPoint {
  date: Date;
  val1: number; // weight or systolic
  val2?: number; // diastolic (only for BP)
}

interface TrendChartProps {
  data: { loggedAt: string; weight?: number; systolic?: number; diastolic?: number }[];
  type: 'weight' | 'bp';
}

/**
 * Índices das marcas do eixo X: entre 3 e 6 marcas distribuídas uniformemente,
 * independentemente da quantidade de pontos (FR-016). Para poucos pontos usa todos.
 */
export function computeXTickIndices(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const count = Math.min(6, n); // no máximo 6; quando há ≥3 pontos fica no intervalo 3–6
  const indices: number[] = [];
  for (let i = 0; i < count; i++) {
    indices.push(Math.round((i * (n - 1)) / (count - 1)));
  }
  return Array.from(new Set(indices));
}

/** Formata o valor de um ponto conforme a métrica (com unidade). */
export function formatMetricValue(type: 'weight' | 'bp', val1: number, val2?: number): string {
  return type === 'weight' ? `${val1} kg` : `${val1}x${val2} mmHg`;
}

export function TrendChart({ data, type }: TrendChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const width = 500;
  const height = 250;
  const padding = { top: 20, right: 24, bottom: 34, left: 48 };

  // Empty state handling
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center border rounded-lg bg-muted/10 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full text-muted/10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <span className="text-sm font-semibold text-muted-foreground z-10" data-testid="empty-chart-text">
          Sem dados cadastrados
        </span>
      </div>
    );
  }

  const unit = type === 'weight' ? 'kg' : 'mmHg';

  // Parse points
  const points: ChartPoint[] = data.map((item) => ({
    date: new Date(item.loggedAt),
    val1: type === 'weight' ? item.weight! : item.systolic!,
    val2: type === 'bp' ? item.diastolic! : undefined,
  }));

  // Sort by date ascending
  points.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find min/max values
  const allYValues = points.flatMap((p) => (p.val2 !== undefined ? [p.val1, p.val2] : [p.val1]));
  let minY = Math.min(...allYValues);
  let maxY = Math.max(...allYValues);

  const yRange = maxY - minY;
  if (yRange === 0) {
    minY = minY - 5;
    maxY = maxY + 5;
  } else {
    minY = Math.max(0, minY - yRange * 0.15);
    maxY = maxY + yRange * 0.15;
  }

  const minX = points[0]!.date.getTime();
  const maxX = points[points.length - 1]!.date.getTime();
  const xRange = maxX - minX;

  const getCoords = (date: Date, val: number) => {
    const xRatio = xRange === 0 ? 0.5 : (date.getTime() - minX) / xRange;
    const yRatio = (val - minY) / (maxY - minY);
    const x = padding.left + xRatio * (width - padding.left - padding.right);
    const y = height - padding.bottom - yRatio * (height - padding.top - padding.bottom);
    return { x, y };
  };

  const generatePath = (valKey: 'val1' | 'val2') => {
    if (points.length === 0) return '';
    return points
      .map((p, index) => {
        const val = valKey === 'val1' ? p.val1 : p.val2;
        if (val === undefined) return '';
        const { x, y } = getCoords(p.date, val);
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const path1 = generatePath('val1');
  const path2 = type === 'bp' ? generatePath('val2') : '';

  // Y-axis grid values (4 lines) com unidade.
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, i) => {
    const val = minY + (i / (gridLinesCount - 1)) * (maxY - minY);
    const y = height - padding.bottom - (i / (gridLinesCount - 1)) * (height - padding.top - padding.bottom);
    return { val: Math.round(val), y };
  });

  // X-axis: 3–6 marcas adaptativas; formato de data conforme o período.
  const useMonthYear = xRange > 180 * 24 * 60 * 60 * 1000; // intervalos longos ("Tudo")
  
  const hasMultipleMeasurementsSameDay = React.useMemo(() => {
    const days = new Set<string>();
    for (const p of points) {
      const dayStr = p.date.toDateString();
      if (days.has(dayStr)) {
        return true;
      }
      days.add(dayStr);
    }
    return false;
  }, [points]);

  const formatTick = (date: Date) => {
    if (useMonthYear) {
      return date.toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' });
    }
    if (hasMultipleMeasurementsSameDay || xRange <= 7 * 24 * 60 * 60 * 1000) {
      const dayMonth = date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
      const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      return `${dayMonth} ${time}`;
    }
    return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
  };

  const formatFull = (date: Date) =>
    date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });

  const xTickIndices = computeXTickIndices(points.length);

  // Tooltip do ponto ativo (hover/toque/teclado).
  const active = activeIndex != null ? points[activeIndex] : null;
  const activeCoords = active ? getCoords(active.date, active.val1) : null;
  const tooltipW = 124;
  const tooltipH = type === 'bp' ? 52 : 38;
  const rawTx = activeCoords ? activeCoords.x - tooltipW / 2 : 0;
  const tooltipX = Math.min(Math.max(rawTx, padding.left), width - padding.right - tooltipW);
  const tooltipAbove = activeCoords ? activeCoords.y - tooltipH - 12 > 0 : true;
  const tooltipY = activeCoords ? (tooltipAbove ? activeCoords.y - tooltipH - 12 : activeCoords.y + 12) : 0;

  const renderCircles = (valKey: 'val1' | 'val2', strokeClass: string) =>
    points.map((p, idx) => {
      const val = valKey === 'val1' ? p.val1 : p.val2;
      if (val === undefined) return null;
      const { x, y } = getCoords(p.date, val);
      return (
        <circle
          key={`${valKey}-${idx}`}
          cx={x}
          cy={y}
          r={activeIndex === idx ? 6 : 4}
          className={`fill-background ${strokeClass} stroke-[2.5] cursor-pointer focus:outline-none`}
          tabIndex={0}
          role="img"
          aria-label={`${formatFull(p.date)}: ${formatMetricValue(type, p.val1, p.val2)}`}
          onMouseEnter={() => setActiveIndex(idx)}
          onMouseLeave={() => setActiveIndex((cur) => (cur === idx ? null : cur))}
          onFocus={() => setActiveIndex(idx)}
          onBlur={() => setActiveIndex((cur) => (cur === idx ? null : cur))}
          onClick={() => setActiveIndex((cur) => (cur === idx ? null : idx))}
        />
      );
    });

  return (
    <div className="w-full border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Gráfico de evolução de ${type === 'weight' ? 'peso' : 'pressão arterial'} (${unit}). Última medição: ${formatMetricValue(
          type,
          points[points.length - 1]!.val1,
          points[points.length - 1]!.val2
        )} em ${formatFull(points[points.length - 1]!.date)}.`}
      >
        {/* Horizontal grid lines + Y labels com unidade */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={width - padding.right}
              y2={line.y}
              stroke="currentColor"
              strokeDasharray="4 4"
              strokeWidth="1"
              className="opacity-20"
            />
            <text
              x={padding.left - 8}
              y={line.y + 4}
              textAnchor="end"
              className="text-[10px] font-medium fill-muted-foreground opacity-90"
            >
              {line.val}
            </text>
          </g>
        ))}
        {/* Rótulo da unidade no topo do eixo Y */}
        <text
          x={padding.left - 8}
          y={padding.top - 6}
          textAnchor="end"
          className="text-[9px] font-semibold uppercase tracking-wide fill-muted-foreground"
        >
          {unit}
        </text>

        {/* X-axis labels (3–6 marcas adaptativas) */}
        <g className="text-[10px] fill-muted-foreground">
          {xTickIndices.map((i) => {
            const { x } = getCoords(points[i]!.date, points[i]!.val1);
            const anchor = i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle';
            return (
              <text key={i} x={x} y={height - 10} textAnchor={anchor} className="opacity-70">
                {formatTick(points[i]!.date)}
              </text>
            );
          })}
        </g>

        {/* Lines */}
        {type === 'weight' && path1 && (
          <>
            <path d={path1} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {renderCircles('val1', 'stroke-primary')}
          </>
        )}

        {type === 'bp' && (
          <>
            {path1 && (
              <>
                <path d={path1} fill="none" stroke="hsl(var(--destructive))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {renderCircles('val1', 'stroke-destructive')}
              </>
            )}
            {path2 && (
              <>
                <path d={path2} fill="none" stroke="hsl(var(--info))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {renderCircles('val2', 'stroke-info')}
              </>
            )}
          </>
        )}

        {/* Tooltip do ponto ativo */}
        {active && activeCoords && (
          <g aria-hidden="true">
            <line
              x1={activeCoords.x}
              y1={padding.top}
              x2={activeCoords.x}
              y2={height - padding.bottom}
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-20"
            />
            <rect
              x={tooltipX}
              y={tooltipY}
              width={tooltipW}
              height={tooltipH}
              rx="6"
              className="fill-popover stroke-border"
              strokeWidth="1"
            />
            <text x={tooltipX + 10} y={tooltipY + 16} className="text-[10px] font-medium fill-muted-foreground">
              {formatFull(active.date)}
            </text>
            <text x={tooltipX + 10} y={tooltipY + 31} className="text-[12px] font-bold fill-popover-foreground">
              {formatMetricValue(type, active.val1, active.val2)}
            </text>
          </g>
        )}
      </svg>

      {/* Legend (distinção não depende apenas de cor — há rótulo textual) */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground border-t pt-3">
        {type === 'weight' ? (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary inline-block" />
            <span>Peso corporal (kg)</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-destructive inline-block" />
              <span>Sistólica (SYS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-info inline-block" />
              <span>Diastólica (DIA)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
