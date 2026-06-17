import * as React from 'react';
import { useForm } from 'react-hook-form';
import { profileInputSchema, type ProfileInput } from '@vita/shared';
import { AppShell } from '../components/layout/AppShell';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/feedback/ErrorState';
import { useProfile, useUpdateProfile } from '../services/api';
import { useAuth } from '../lib/auth';
import { toastSuccess, toastError } from '../lib/toast';
import { UserCircle } from 'lucide-react';

interface ProfileFormValues {
  fullName: string;
  birthDate: string;
  heightCm: string;
}

/** Converte os campos string do formulário em ProfileInput, omitindo vazios. */
function toProfileInput(values: ProfileFormValues): ProfileInput {
  const input: ProfileInput = {};
  if (values.fullName.trim()) input.fullName = values.fullName.trim();
  if (values.birthDate.trim()) input.birthDate = values.birthDate.trim();
  if (values.heightCm.trim()) {
    const normalized = values.heightCm.trim().replace(',', '.');
    const parsed = Number(normalized);
    input.heightCm = Number.isNaN(parsed) ? Number.NaN : parsed;
  }
  return input;
}

export function Profile() {
  const { logout } = useAuth();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: { fullName: '', birthDate: '', heightCm: '' },
  });

  // Pré-carrega os valores salvos quando o perfil chega.
  React.useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName ?? '',
        birthDate: profile.birthDate ?? '',
        heightCm: profile.heightCm != null ? String(profile.heightCm) : '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    const input = toProfileInput(values);

    // Validação client-side reusando o schema compartilhado (fonte única de verdade).
    const result = profileInputSchema.safeParse(input);
    if (!result.success) {
      for (const issue of result.error.errors) {
        const field = issue.path[0] as keyof ProfileFormValues | undefined;
        if (field) setError(field, { message: issue.message });
      }
      toastError('Verifique os campos destacados.');
      return;
    }

    updateProfile(result.data, {
      onSuccess: () => toastSuccess('Perfil salvo com sucesso.'),
      onError: (error: { message?: string }) => toastError(error.message || 'Falha ao salvar o perfil.'),
    });
  };

  return (
    <AppShell>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1>Perfil</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              Sair
            </Button>
          </div>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Dados pessoais para uso futuro (ex.: cálculo de IMC e estimativas). Todos os campos são opcionais.
        </p>

        <div className="mt-6 max-w-md">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <ErrorState message="Não foi possível carregar o perfil." retry={() => void refetch()} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Informações pessoais</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  aria-invalid={!!errors.fullName}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  aria-invalid={!!errors.birthDate}
                  {...register('birthDate')}
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heightCm">Altura (cm)</Label>
                <Input
                  id="heightCm"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.,]*"
                  placeholder="Ex.: 170"
                  aria-invalid={!!errors.heightCm}
                  {...register('heightCm')}
                />
                {errors.heightCm && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.heightCm.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}
