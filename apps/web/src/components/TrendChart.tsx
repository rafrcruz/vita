import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Maximize2, X } from 'lucide-react';
import { Button } from './ui/button';

interface ChartPoint {
  date: Date;
  val1: number; // weight or systolic
  val2?: number; // diastolic (only for BP)
}

interface TrendChartProps {
  data: { loggedAt: string; weight?: number; systolic?: number; diastolic?: number }[];
  type: 'weight' | 'bp';
  timeframe?: '7d' | '30d' | 'all';
}

/**
 * Mantido para compatibilidade com testes unitários legados.
 */
export function computeXTickIndices(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const count = Math.min(6, n);
  const indices: number[] = [];
  for (let i = 0; i < count; i++) {
    indices.push(Math.round((i * (n - 1)) / (count - 1)));
  }
  return Array.from(new Set(indices));
}

/**
 * Mantido para compatibilidade com testes unitários legados.
 */
export function formatMetricValue(type: 'weight' | 'bp', val1: number, val2?: number): string {
  return type === 'weight' ? `${val1} kg` : `${val1}x${val2} mmHg`;
}

export function TrendChart({ data, type, timeframe = 'all' }: TrendChartProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Escuta mudanças no fullscreen nativo do navegador
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (!isCurrentlyFullscreen && isFullscreen) {
        setIsFullscreen(false);
        // Destrava orientação ao sair do fullscreen
        if (typeof screen !== 'undefined' && screen.orientation) {
          const orientation = screen.orientation as unknown as {
            unlock?: () => void;
          };
          if (typeof orientation.unlock === 'function') {
            try {
              orientation.unlock();
            } catch {
              // ignore
            }
          }
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Fallback para fechar tela cheia com a tecla Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        if (typeof screen !== 'undefined' && screen.orientation) {
          const orientation = screen.orientation as unknown as {
            unlock?: () => void;
          };
          if (typeof orientation.unlock === 'function') {
            try {
              orientation.unlock();
            } catch {
              // ignore
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleEnterFullscreen = async () => {
    setIsFullscreen(true);
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (typeof screen !== 'undefined' && screen.orientation) {
        const orientation = screen.orientation as unknown as {
          lock?: (orientation: 'landscape') => Promise<void>;
        };
        if (typeof orientation.lock === 'function') {
          await orientation.lock('landscape');
        }
      }
    } catch (err) {
      console.warn('Failed to enter fullscreen or lock orientation:', err);
    }
  };

  const handleExitFullscreen = async () => {
    setIsFullscreen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Failed to exit fullscreen:', err);
    }
    try {
      if (typeof screen !== 'undefined' && screen.orientation) {
        const orientation = screen.orientation as unknown as {
          unlock?: () => void;
        };
        if (typeof orientation.unlock === 'function') {
          orientation.unlock();
        }
      }
    } catch {
      // ignore
    }
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center border rounded-lg bg-muted/10 relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full text-muted/10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <span
          className="text-sm font-semibold text-muted-foreground z-10"
          data-testid="empty-chart-text"
        >
          Sem dados cadastrados
        </span>
      </div>
    );
  }

  const unit = type === 'weight' ? 'kg' : 'mmHg';

  // Parse points
  const rawPoints: ChartPoint[] = data.map((item) => ({
    date: new Date(item.loggedAt),
    val1: type === 'weight' ? item.weight! : item.systolic!,
    val2: type === 'bp' ? item.diastolic! : undefined,
  }));

  // Ordena por data crescente
  rawPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Agrega pontos por dia para Peso nos períodos de 30d/tudo
  const points = React.useMemo(() => {
    if (type === 'weight' && (timeframe === '30d' || timeframe === 'all')) {
      const dayMap = new Map<string, ChartPoint>();
      for (const p of rawPoints) {
        const dayStr = p.date.toDateString();
        const existing = dayMap.get(dayStr);
        if (!existing || p.val1 < existing.val1) {
          dayMap.set(dayStr, p);
        }
      }
      return Array.from(dayMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    return rawPoints;
  }, [rawPoints, type, timeframe]);

  // Formata o tick do eixo X baseado no período e tipo
  const formatXTick = (tick: number | string) => {
    const date = new Date(tick);
    if (isNaN(date.getTime())) return '';

    if (type === 'weight') {
      if (timeframe === '7d') {
        const dayMonth = date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
        const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        return `${dayMonth} ${time}`;
      }
      const xRange = points[points.length - 1]!.date.getTime() - points[0]!.date.getTime();
      const useMonthYear = xRange > 180 * 24 * 60 * 60 * 1000;
      if (useMonthYear) {
        return date.toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' });
      }
      return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
    } else {
      // BP: Sempre exibe data e hora
      const dayMonth = date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
      const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      return `${dayMonth} ${time}`;
    }
  };

  const formatTooltipDate = (dateVal: number | string) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Prepara os dados para o Recharts
  const chartData = points.map((p) => ({
    timestamp: p.date.getTime(),
    val1: p.val1,
    val2: p.val2,
  }));

  interface TooltipPayloadItem {
    name: string;
    value: number;
    stroke?: string;
    color?: string;
    payload: {
      timestamp: number;
    };
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
  }

  // Tooltip customizado do Recharts para manter a acessibilidade e estética
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const timestamp = payload[0]!.payload.timestamp;
      return (
        <div className="bg-popover border border-border text-popover-foreground p-3 rounded-lg shadow-md text-xs space-y-1">
          <p className="font-semibold text-muted-foreground">{formatTooltipDate(timestamp)}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="font-bold flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: p.stroke || p.color }}
              />
              <span>
                {p.name}: {p.value} {unit}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChartContent = () => (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'weight' ? (
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="hsl(var(--border))"
            opacity={0.4}
            vertical={false}
          />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXTick}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
            minTickGap={40}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            name="Peso"
            type="monotone"
            dataKey="val1"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            activeDot={{ r: 6, strokeWidth: 0 }}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'hsl(var(--background))',
              stroke: 'hsl(var(--primary))',
            }}
          />
        </AreaChart>
      ) : (
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="hsl(var(--border))"
            opacity={0.4}
            vertical={false}
          />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXTick}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
            minTickGap={45}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            name="Sistólica (SYS)"
            type="monotone"
            dataKey="val1"
            stroke="hsl(var(--destructive))"
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 0 }}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'hsl(var(--background))',
              stroke: 'hsl(var(--destructive))',
            }}
          />
          <Line
            name="Diastólica (DIA)"
            type="monotone"
            dataKey="val2"
            stroke="hsl(var(--info))"
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 0 }}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'hsl(var(--background))',
              stroke: 'hsl(var(--info))',
            }}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <div className="w-full border rounded-lg p-4 bg-card text-card-foreground shadow-sm relative group">
      {/* Botão de Tela Cheia */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm"
          onClick={handleEnterFullscreen}
          aria-label="Visualizar gráfico em tela cheia"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-[250px] w-full pt-4">{renderChartContent()}</div>

      {/* Legendas dos Gráficos */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground border-t pt-3">
        {type === 'weight' ? (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary inline-block" />
            <span>Peso corporal ({unit})</span>
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

      {/* Overlay de Tela Cheia */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-background flex flex-col p-6 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">
                {type === 'weight' ? 'Evolução de Peso Corporal' : 'Evolução de Pressão Arterial'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Exibição estendida de dados do usuário
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={handleExitFullscreen}
              aria-label="Fechar tela cheia"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 min-h-0 w-full bg-card/30 rounded-xl p-4 border">
            {renderChartContent()}
          </div>

          {/* Dica para dispositivos móveis se travar orientação falhar */}
          <div className="mt-4 text-center text-[10px] text-muted-foreground block md:hidden">
            Dica: Vire o celular na horizontal para uma visualização otimizada.
          </div>
        </div>
      )}
    </div>
  );
}
