import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { CurrentUser } from '@vita/shared';
import { apiFetch } from './api';

async function fetchMe(): Promise<CurrentUser | null> {
  try {
    return await apiFetch<CurrentUser>('/auth/me');
  } catch {
    return null; // sem sessão válida
  }
}

type AuthValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['me'], queryFn: fetchMe });

  const value: AuthValue = {
    user: data ?? null,
    isLoading,
    login: () => {
      window.location.assign('/api/auth/google');
    },
    logout: async () => {
      await apiFetch('/auth/logout', { method: 'POST' });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
