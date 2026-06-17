import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

function Loading() {
  return (
    <div className="min-h-screen bg-background text-muted-foreground grid place-items-center">
      Carregando…
    </div>
  );
}

/** Exige usuário autenticado. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Exige usuário administrador. */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center p-6">
        <p className="text-destructive">Acesso restrito a administradores.</p>
      </div>
    );
  }
  return <>{children}</>;
}
