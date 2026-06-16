import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AllowlistEntryDto } from '@vita/shared';
import { apiFetch } from '../lib/api';
import { ThemeToggle } from '../theme/ThemeToggle';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { FormField } from '../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/feedback/Alert';
import { EmptyState } from '../components/feedback/EmptyState';
import { LoadingState } from '../components/feedback/LoadingState';
import { AlertCircle, Trash2, UserPlus, Users } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role: z.enum(['member', 'admin']),
});

type FormData = z.infer<typeof formSchema>;

export function AdminAllowlist() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const { data: entries, isLoading } = useQuery({
    queryKey: ['allowlist'],
    queryFn: () => apiFetch<AllowlistEntryDto[]>('/allowlist'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['allowlist'] });

  const addMutation = useMutation({
    mutationFn: (data: FormData) => apiFetch('/allowlist', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      methods.reset();
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

  const onSubmit = (data: FormData) => {
    addMutation.mutate(data);
  };

  return (
    <AppShell>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1>Allowlist</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              ← Início
            </Link>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-6 flex flex-wrap items-end gap-4">
            <FormField<FormData>
              name="email"
              label="E-mail"
              type="email"
              inputMode="email"
              placeholder="email@exemplo.com"
              className="flex-1 min-w-[200px]"
            />
            <div className="w-32">
              <Label htmlFor="role">Role</Label>
              <Select
                value={methods.watch('role')}
                onValueChange={(value) => methods.setValue('role', value as 'member' | 'admin')}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">member</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" loading={addMutation.isPending}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </form>
        </FormProvider>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6">
          {isLoading && <LoadingState />}
          {!isLoading && entries?.length === 0 && (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="Nenhum usuário na allowlist"
              description="Adicione o primeiro usuário usando o formulário acima."
            />
          )}
          {!isLoading && entries && entries.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>
                      <Badge variant={entry.role === 'admin' ? 'default' : 'secondary'}>{entry.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMutation.mutate(entry.id)}
                        disabled={removeMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AppShell>
  );
}
