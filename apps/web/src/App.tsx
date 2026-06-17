import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './lib/auth';
import { ThemeProvider } from './theme/ThemeProvider';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AdminAllowlist } from './pages/AdminAllowlist';
import { StyleGuide } from './pages/StyleGuide';
import { History } from './pages/History';
import { Profile } from './pages/Profile';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
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
