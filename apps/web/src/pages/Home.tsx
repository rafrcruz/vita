import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { HealthStatus } from '@vita/shared';
import { apiFetch } from '../lib/api';
import { useAuth } from '../lib/auth';
import { ThemeToggle } from '../theme/ThemeToggle';
import { AppShell } from '../components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/feedback/ErrorState';
import { Activity, Plus, TrendingUp, Scale, Heart, Calendar } from 'lucide-react';
import { WeightCaptureModal } from '../components/WeightCaptureModal';
import { BPCaptureModal } from '../components/BPCaptureModal';
import { TrendChart } from '../components/TrendChart';
import { useWeightHistory, useBPHistory } from '../services/api';
import { useState } from 'react';


export function Home() {
  const { user, logout } = useAuth();
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isBPOpen, setIsBPOpen] = useState(false);
  const [metric, setMetric] = useState<'weight' | 'bp'>('weight');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('all');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<HealthStatus>('/health'),
  });

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

      <div className="py-6 pb-24">
        <div className="flex items-center justify-between">
          <h1>VITA</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/history" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Histórico
            </Link>
            <button onClick={() => void logout()} className="text-sm text-muted-foreground hover:text-foreground">
              Sair
            </button>
          </div>
        </div>
        <p className="mt-2 text-muted-foreground">Plataforma pessoal de observabilidade de saúde</p>

        {user && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user.email}</span>
            <Badge variant="secondary" className="uppercase">{user.role}</Badge>
            {user.role === 'admin' && (
              <>
                <span>·</span>
                <Link to="/admin" className="text-primary hover:text-primary/80">
                  Administrar allowlist
                </Link>
              </>
            )}
          </div>
        )}

        {/* Metric Selector segment tabs */}
        <div className="mt-6 flex bg-muted p-1 rounded-lg w-full">
          <button
            onClick={() => setMetric('weight')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-all ${
              metric === 'weight'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Scale className="h-4 w-4" />
            Peso
          </button>
          <button
            onClick={() => setMetric('bp')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-all ${
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
          <div className="flex bg-muted/50 p-0.5 rounded-md border">
            {(['7d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`py-1 px-2.5 rounded text-xs font-semibold uppercase transition-all ${
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
                    <p className="text-lg font-black tracking-tight">
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

        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status do backend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Skeleton className="h-6 w-32" />}
            {isError && (
              <ErrorState
                message={error instanceof Error ? error.message : 'erro desconhecido'}
                retry={() => void refetch()}
              />
            )}
            {data && (
              <div className="flex items-center gap-2">
                <Badge variant={data.status === 'ok' ? 'success' : 'warning'}>
                  {data.status === 'ok' ? 'Saudável' : 'Degradado'}
                </Badge>
                <span className="text-sm text-muted-foreground" data-testid="health-status">
                  {data.time}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons at the bottom of the viewport */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
        <div className="bg-background/80 backdrop-blur-md border rounded-full p-2 shadow-2xl flex items-center justify-around gap-2">
          <button
            onClick={() => setIsWeightOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            Adicionar Peso
          </button>
          <button
            onClick={() => setIsBPOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/90 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            Adicionar Pressão
          </button>
        </div>
      </div>

      <WeightCaptureModal isOpen={isWeightOpen} onClose={() => setIsWeightOpen(false)} />
      <BPCaptureModal isOpen={isBPOpen} onClose={() => setIsBPOpen(false)} />
    </AppShell>
  );
}
