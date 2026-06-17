import * as React from 'react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { useAuth } from '../lib/auth';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Plus, TrendingUp, Scale, Heart, Calendar } from 'lucide-react';
import { WeightCaptureModal } from '../components/WeightCaptureModal';
import { BPCaptureModal } from '../components/BPCaptureModal';
import { TrendChart } from '../components/TrendChart';
import { useWeightHistory, useBPHistory } from '../services/api';
import { useState } from 'react';

export function Home() {
  const { logout } = useAuth();
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isBPOpen, setIsBPOpen] = useState(false);
  const [metric, setMetric] = useState<'weight' | 'bp'>('weight');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('all');

  const { data: weightData, isLoading: isWeightLoading } = useWeightHistory(timeframe);
  const { data: bpData, isLoading: isBPLoading } = useBPHistory(timeframe);

  const isLoadingMetrics = isWeightLoading || isBPLoading;
  const activeData = metric === 'weight' ? weightData : bpData;

  const lastEntry = React.useMemo(() => {
    if (!activeData || activeData.length === 0) return null;
    return activeData[activeData.length - 1];
  }, [activeData]);

  return (
    <AppShell>

      <div className="py-6 pb-28">
        <div className="flex items-center justify-between">
          <h1>VITA</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              Sair
            </Button>
          </div>
        </div>

        {/* Metric Selector segment tabs */}
        <div className="mt-6 flex w-full rounded-lg bg-muted p-1" role="tablist" aria-label="Selecionar métrica">
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'weight'}
            onClick={() => setMetric('weight')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              metric === 'weight'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Scale className="h-4 w-4" />
            Peso
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'bp'}
            onClick={() => setMetric('bp')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              metric === 'bp'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="h-4 w-4" />
            Pressão Arterial
          </button>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Evolução Temporal
          </span>
          <div className="flex rounded-md border bg-muted/50 p-0.5">
            {(['7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                aria-pressed={timeframe === tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded-sm px-2.5 py-1 text-xs font-semibold uppercase transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  timeframe === tf
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf === '7d' ? '7D' : tf === '30d' ? '30D' : 'Tudo'}
              </button>
            ))}
          </div>
        </div>

        {/* Trend line chart and Summary Card */}
        <div className="mt-4 space-y-4">
          {isLoadingMetrics ? (
            <Skeleton className="h-[250px] w-full rounded-lg" />
          ) : (
            <TrendChart data={activeData || []} type={metric} />
          )}

          {/* Last Entry Summary Card */}
          {!isLoadingMetrics && lastEntry && (
            <Card className="border bg-card/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                    {metric === 'weight' ? <Scale className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Última medição</p>
                    <p className="text-lg font-bold tracking-tight">
                      {metric === 'weight'
                        ? `${(lastEntry as { weight: number }).weight} kg`
                        : `${(lastEntry as { systolic: number; diastolic: number }).systolic}x${(lastEntry as { systolic: number; diastolic: number }).diastolic} mmHg`}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(lastEntry.loggedAt).toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Action Buttons — posicionados acima da BottomNav no mobile para não
          serem cobertos por ela (FR-022); no desktop (sem BottomNav) ficam mais abaixo. */}
      <div className="fixed bottom-20 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4 md:bottom-6">
        <div className="flex items-center justify-around gap-2 rounded-full border bg-background/80 p-2 shadow-xl backdrop-blur-md">
          <Button onClick={() => setIsWeightOpen(true)} className="min-h-[44px] flex-1 rounded-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Adicionar Peso
          </Button>
          <Button variant="secondary" onClick={() => setIsBPOpen(true)} className="min-h-[44px] flex-1 rounded-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Adicionar Pressão
          </Button>
        </div>
      </div>

      <WeightCaptureModal isOpen={isWeightOpen} onClose={() => setIsWeightOpen(false)} />
      <BPCaptureModal isOpen={isBPOpen} onClose={() => setIsBPOpen(false)} />
    </AppShell>
  );
}
