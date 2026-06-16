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
import { Activity } from 'lucide-react';

export function Home() {
  const { user, logout } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<HealthStatus>('/health'),
  });

  return (
    <AppShell>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1>VITA</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
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
    </AppShell>
  );
}
