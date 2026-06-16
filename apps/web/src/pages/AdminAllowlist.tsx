import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { AllowlistEntryDto, Role } from '@vita/shared';
import { apiFetch } from '../lib/api';

export function AdminAllowlist() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [error, setError] = useState<string | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ['allowlist'],
    queryFn: () => apiFetch<AllowlistEntryDto[]>('/allowlist'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['allowlist'] });

  const addMutation = useMutation({
    mutationFn: () => apiFetch('/allowlist', { method: 'POST', body: JSON.stringify({ email, role }) }),
    onSuccess: () => {
      setEmail('');
      setRole('member');
      setError(null);
      void invalidate();
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : 'Erro ao adicionar'),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/allowlist/${id}`, { method: 'DELETE' }),
    onSuccess: () => void invalidate(),
    onError: (e: unknown) => setError(e instanceof Error ? e.message : 'Erro ao remover'),
  });

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Allowlist</h1>
          <Link to="/" className="text-slate-400 hover:text-slate-200">
            ← Início
          </Link>
        </div>

        <form
          className="mt-6 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addMutation.mutate();
          }}
        >
          <input
            type="email"
            required
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-lg bg-slate-800 px-3 py-2 ring-1 ring-slate-700"
          >
            <option value="member">member</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
          >
            Adicionar
          </button>
        </form>

        {error && (
          <p className="mt-3 text-red-400" role="alert">
            {error}
          </p>
        )}

        <ul className="mt-6 divide-y divide-slate-800 rounded-lg ring-1 ring-slate-800">
          {isLoading && <li className="p-4 text-slate-400">Carregando…</li>}
          {entries?.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between p-4">
              <span>
                {entry.email}{' '}
                <span className="ml-2 rounded bg-slate-700 px-2 py-0.5 text-xs uppercase">
                  {entry.role}
                </span>
              </span>
              <button
                onClick={() => removeMutation.mutate(entry.id)}
                disabled={removeMutation.isPending}
                className="text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
