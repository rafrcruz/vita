import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { HealthStatus } from '@vita/shared';
import { apiFetch } from '../lib/api';
import { useAuth } from '../lib/auth';

export function Home() {
  const { user, logout } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<HealthStatus>('/health'),
  });

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-slate-800/60 p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">VITA</h1>
          <button onClick={() => void logout()} className="text-sm text-slate-400 hover:text-slate-200">
            Sair
          </button>
        </div>
        <p className="mt-2 text-slate-400">Plataforma pessoal de observabilidade de saúde</p>

        {user && (
          <p className="mt-4 text-sm text-slate-300">
            {user.email} · <span className="uppercase">{user.role}</span>
            {user.role === 'admin' && (
              <>
                {' '}
                ·{' '}
                <Link to="/admin" className="text-emerald-400 hover:text-emerald-300">
                  Administrar allowlist
                </Link>
              </>
            )}
          </p>
        )}

        <div className="mt-6 rounded-lg border border-slate-700 p-4">
          <h2 className="text-sm font-semibold uppercase text-slate-400">Status do backend</h2>
          {isLoading && <p className="mt-1 text-slate-300">Verificando…</p>}
          {isError && (
            <p className="mt-1 text-red-400" role="alert">
              Indisponível: {error instanceof Error ? error.message : 'erro desconhecido'}
            </p>
          )}
          {data && (
            <p className="mt-1 text-emerald-400" data-testid="health-status">
              {data.status === 'ok' ? 'Saudável' : 'Degradado'} · {data.time}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
