import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/feedback/Alert';
import { AlertCircle } from 'lucide-react';

export function Login() {
  const { login, user } = useAuth();
  const [params] = useSearchParams();
  const error = params.get('error');

  if (user) {
    window.location.assign('/');
  }

  return (
    <main className="min-h-screen bg-background text-foreground grid place-items-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>VITA</CardTitle>
          <CardDescription>Acesso restrito</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Acesso não autorizado para este e-mail.</AlertDescription>
            </Alert>
          )}
          <Button onClick={login} className="w-full">
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
