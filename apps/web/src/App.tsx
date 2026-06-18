import { lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './lib/auth';
import { ThemeProvider } from './theme/ThemeProvider';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';
import { LoadingState } from './components/feedback/LoadingState';

// Code splitting por rota: cada página vira um chunk carregado sob demanda.
// Mantém páginas pesadas (gráficos via recharts) fora do bundle inicial.
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const History = lazy(() => import('./pages/History').then((m) => ({ default: m.History })));
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })));
const AdminAllowlist = lazy(() =>
  import('./pages/AdminAllowlist').then((m) => ({ default: m.AdminAllowlist }))
);
const StyleGuide = lazy(() => import('./pages/StyleGuide').then((m) => ({ default: m.StyleGuide })));

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingState />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminAllowlist />
                    </AdminRoute>
                  }
                />
                <Route path="/style-guide" element={<StyleGuide />} />
              </Routes>
            </Suspense>
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  toast:
                    '!rounded-lg !border !shadow-lg !bg-popover !text-popover-foreground !border-border',
                  description: '!text-muted-foreground',
                  success: '!bg-success !text-success-foreground !border-success',
                  error: '!bg-destructive !text-destructive-foreground !border-destructive',
                  warning: '!bg-warning !text-warning-foreground !border-warning',
                  info: '!bg-info !text-info-foreground !border-info',
                },
              }}
            />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
