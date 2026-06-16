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

export function TrendChart({ data, type }: TrendChartProps) {
  const width = 500;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

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

  // Parse points
  const points: ChartPoint[] = data.map((item) => {
    return {
      date: new Date(item.loggedAt),
      val1: type === 'weight' ? item.weight : item.systolic,
      val2: type === 'bp' ? item.diastolic : undefined,
    };
  });

  // Sort by date ascending
  points.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find min/max values
  const allYValues = points.flatMap((p) => (p.val2 !== undefined ? [p.val1, p.val2] : [p.val1]));
  let minY = Math.min(...allYValues);
  let maxY = Math.max(...allYValues);

  // Add padding to Y range to avoid touching the border
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

  // Map data coordinates to SVG coordinate system
  const getCoords = (date: Date, val: number) => {
    const xRatio = xRange === 0 ? 0.5 : (date.getTime() - minX) / xRange;
    const yRatio = (val - minY) / (maxY - minY);

    const x = padding.left + xRatio * (width - padding.left - padding.right);
    const y = height - padding.bottom - yRatio * (height - padding.top - padding.bottom);
    return { x, y };
  };

  // Generate path coordinates
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

  // Y-axis grid values (4 lines)
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, i) => {
    const val = minY + (i / (gridLinesCount - 1)) * (maxY - minY);
    const y = height - padding.bottom - (i / (gridLinesCount - 1)) * (height - padding.top - padding.bottom);
    return { val: Math.round(val), y };
  });

  // Format dates for X-axis labels
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="w-full border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal grid lines */}
        {gridLines.map((line, idx) => (
          <g key={idx} className="opacity-20">
            <line
              x1={padding.left}
              y1={line.y}
              x2={width - padding.right}
              y2={line.y}
              stroke="currentColor"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={line.y + 4}
              textAnchor="end"
              className="text-[10px] font-medium fill-muted-foreground"
            >
              {line.val}
            </text>
          </g>
        ))}

        {/* X-axis labels (min, middle, max dates) */}
        {points.length > 0 && (
          <g className="opacity-60 text-[10px] fill-muted-foreground">
            {/* Min date */}
            <text x={padding.left} y={height - 8} textAnchor="start">
              {formatShortDate(points[0]!.date)}
            </text>
            {/* Max date */}
            {points.length > 1 && (
              <text x={width - padding.right} y={height - 8} textAnchor="end">
                {formatShortDate(points[points.length - 1]!.date)}
              </text>
            )}
            {/* Middle date */}
            {points.length > 2 && (
              <text
                x={padding.left + (width - padding.left - padding.right) / 2}
                y={height - 8}
                textAnchor="middle"
              >
                {formatShortDate(points[Math.floor(points.length / 2)]!.date)}
              </text>
            )}
          </g>
        )}

        {/* Lines */}
        {type === 'weight' && path1 && (
          <>
            <path
              d={path1}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((p, idx) => {
              const { x, y } = getCoords(p.date, p.val1);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="4"
                  className="fill-background stroke-primary stroke-[2.5]"
                />
              );
            })}
          </>
        )}

        {type === 'bp' && (
          <>
            {/* Systolic (SYS) - Rose/Red */}
            {path1 && (
              <>
                <path
                  d={path1}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map((p, idx) => {
                  const { x, y } = getCoords(p.date, p.val1);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-background stroke-[#ef4444] stroke-[2.5]"
                    />
                  );
                })}
              </>
            )}

            {/* Diastolic (DIA) - Blue */}
            {path2 && (
              <>
                <path
                  d={path2}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map((p, idx) => {
                  const { x, y } = getCoords(p.date, p.val2!);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-background stroke-[#3b82f6] stroke-[2.5]"
                    />
                  );
                })}
              </>
            )}
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground border-t pt-3">
        {type === 'weight' ? (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary inline-block" />
            <span>Peso corporal (kg)</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ef4444] inline-block" />
              <span>Sistólica (SYS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-3b82f6 bg-blue-500 inline-block" />
              <span>Diastólica (DIA)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
