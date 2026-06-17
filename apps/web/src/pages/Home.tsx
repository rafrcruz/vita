import * as React from 'react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { useAuth } from '../lib/auth';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Plus, TrendingUp, Scale, Heart, Calendar, LogOut } from 'lucide-react';
import { WeightCaptureModal } from '../components/WeightCaptureModal';
import { BPCaptureModal } from '../components/BPCaptureModal';
import { TrendChart } from '../components/TrendChart';
import { useWeightHistory, useBPHistory } from '../services/api';
import { useState } from 'react';
import { calculateWeightLossWeekly, calculateBPAverage, getLocalDayString } from '../utils/metrics';

export function Home() {
  const { logout } = useAuth();
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isBPOpen, setIsBPOpen] = useState(false);
  const [metric, setMetric] = useState<'weight' | 'bp'>('weight');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('all');

  const { data: weightData, isLoading: isWeightLoading } = useWeightHistory(timeframe);
  const { data: bpData, isLoading: isBPLoading } = useBPHistory(timeframe);

  const { data: allWeightData, isLoading: isAllWeightLoading } = useWeightHistory('all');
  const { data: allBPData, isLoading: isAllBPLoading } = useBPHistory('all');

  const isLoadingMetrics = isWeightLoading || isBPLoading || isAllWeightLoading || isAllBPLoading;
  const activeData = metric === 'weight' ? weightData : bpData;

  const lastEntry = React.useMemo(() => {
    if (!activeData || activeData.length === 0) return null;
    return activeData[activeData.length - 1];
  }, [activeData]);

  const calculatedWeightMetrics = React.useMemo(() => {
    if (!allWeightData || allWeightData.length === 0) return null;
    const last = allWeightData[allWeightData.length - 1];
    
    const lastDayStr = getLocalDayString(last.loggedAt);
    const lastDayLogs = allWeightData.filter(log => getLocalDayString(log.loggedAt) === lastDayStr);
    const currentWeight = Math.min(...lastDayLogs.map(log => log.weight));

    const weeklyLossTotal = calculateWeightLossWeekly(allWeightData, null);
    const weeklyLoss30d = calculateWeightLossWeekly(allWeightData, 30);
    const weeklyLoss7d = calculateWeightLossWeekly(allWeightData, 7);

    return {
      lastEntry: last,
      currentWeight,
      weeklyLossTotal,
      weeklyLoss30d,
      weeklyLoss7d
    };
  }, [allWeightData]);

  const calculatedBPMetrics = React.useMemo(() => {
    if (!allBPData || allBPData.length === 0) return null;
    const last = allBPData[allBPData.length - 1];

    const { avgSystolic: avgSystolicTotal, avgDiastolic: avgDiastolicTotal } = calculateBPAverage(allBPData, null);
    const { avgSystolic: avgSystolic30d, avgDiastolic: avgDiastolic30d } = calculateBPAverage(allBPData, 30);
    const { avgSystolic: avgSystolic7d, avgDiastolic: avgDiastolic7d } = calculateBPAverage(allBPData, 7);

    return {
      lastEntry: last,
      avgSystolicTotal,
      avgDiastolicTotal,
      avgSystolic30d,
      avgDiastolic30d,
      avgSystolic7d,
      avgDiastolic7d
    };
  }, [allBPData]);

  const formatWeightKg = (val: number | null) => {
    if (val === null || val === undefined) return 'N/A';
    return `${val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
  };

  const formatWeightValue = (val: number | null) => {
    if (val === null || val === undefined) return 'N/A';
    const formatted = val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return `${val > 0 ? '+' : ''}${formatted} kg/sem`;
  };

  return (
    <AppShell>

      <div className="py-6 pb-28">
        <div className="flex items-center justify-between">
          <h1>VITA</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => void logout()} className="gap-2">
              <LogOut className="h-4 w-4" />
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

          {/* Health Metrics & Indicators */}
          {!isLoadingMetrics && metric === 'weight' && calculatedWeightMetrics && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Última Medição</p>
                  <p className="text-lg font-bold mt-1 tracking-tight">
                    {formatWeightKg(calculatedWeightMetrics.lastEntry.weight)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">
                    {new Date(calculatedWeightMetrics.lastEntry.loggedAt).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Peso Atual</p>
                  <p className="text-lg font-bold mt-1 tracking-tight">
                    {formatWeightKg(calculatedWeightMetrics.currentWeight)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Menor do último dia</p>
                </CardContent>
              </Card>

              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Perda Semanal (7d)</p>
                  <p className={`text-lg font-bold mt-1 tracking-tight ${calculatedWeightMetrics.weeklyLoss7d !== null && calculatedWeightMetrics.weeklyLoss7d > 0 ? 'text-success' : ''}`}>
                    {formatWeightValue(calculatedWeightMetrics.weeklyLoss7d)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Últimos 7 dias</p>
                </CardContent>
              </Card>

              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Perda Semanal (30d)</p>
                  <p className={`text-lg font-bold mt-1 tracking-tight ${calculatedWeightMetrics.weeklyLoss30d !== null && calculatedWeightMetrics.weeklyLoss30d > 0 ? 'text-success' : ''}`}>
                    {formatWeightValue(calculatedWeightMetrics.weeklyLoss30d)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Últimos 30 dias</p>
                </CardContent>
              </Card>

              <Card className="border bg-card/50 col-span-2 sm:col-span-1">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Perda Semanal (Total)</p>
                  <p className={`text-lg font-bold mt-1 tracking-tight ${calculatedWeightMetrics.weeklyLossTotal !== null && calculatedWeightMetrics.weeklyLossTotal > 0 ? 'text-success' : ''}`}>
                    {formatWeightValue(calculatedWeightMetrics.weeklyLossTotal)}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Todo o período</p>
                </CardContent>
              </Card>
            </div>
          )}

          {!isLoadingMetrics && metric === 'bp' && calculatedBPMetrics && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Última Medição</p>
                  <p className="text-lg font-bold mt-1 tracking-tight">
                    {calculatedBPMetrics.lastEntry.systolic}x{calculatedBPMetrics.lastEntry.diastolic}
                    <span className="text-[10px] font-medium text-muted-foreground ml-1">mmHg</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">
                    {new Date(calculatedBPMetrics.lastEntry.loggedAt).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Média (7d)</p>
                  <p className="text-lg font-bold mt-1 tracking-tight">
                    {calculatedBPMetrics.avgSystolic7d !== null ? `${calculatedBPMetrics.avgSystolic7d}x${calculatedBPMetrics.avgDiastolic7d}` : 'N/A'}
                    {calculatedBPMetrics.avgSystolic7d !== null && <span className="text-[10px] font-medium text-muted-foreground ml-1">mmHg</span>}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Últimos 7 dias</p>
                </CardContent>
              </Card>

              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Média (30d)</p>
                  <p className="text-lg font-bold mt-1 tracking-tight">
                    {calculatedBPMetrics.avgSystolic30d !== null ? `${calculatedBPMetrics.avgSystolic30d}x${calculatedBPMetrics.avgDiastolic30d}` : 'N/A'}
                    {calculatedBPMetrics.avgSystolic30d !== null && <span className="text-[10px] font-medium text-muted-foreground ml-1">mmHg</span>}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Últimos 30 dias</p>
                </CardContent>
              </Card>

              <Card className="border bg-card/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Média (Total)</p>
                  <p className="text-lg font-bold mt-1 tracking-tight">
                    {calculatedBPMetrics.avgSystolicTotal !== null ? `${calculatedBPMetrics.avgSystolicTotal}x${calculatedBPMetrics.avgDiastolicTotal}` : 'N/A'}
                    {calculatedBPMetrics.avgSystolicTotal !== null && <span className="text-[10px] font-medium text-muted-foreground ml-1">mmHg</span>}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">Todo o período</p>
                </CardContent>
              </Card>
            </div>
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
