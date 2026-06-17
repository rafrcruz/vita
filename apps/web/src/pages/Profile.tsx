import * as React from 'react';
import { useForm } from 'react-hook-form';
import { profileInputSchema, type ProfileInput } from '@vita/shared';
import { toDisplayDate, toApiDate } from '../utils/metrics';
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
import { UserCircle, LogOut } from 'lucide-react';

interface ProfileFormValues {
  fullName: string;
  birthDate: string;
  heightCm: string;
}

/** Converte os campos string do formulário em ProfileInput, omitindo vazios. */
function toProfileInput(values: ProfileFormValues): ProfileInput {
  const input: ProfileInput = {};
  if (values.fullName.trim()) input.fullName = values.fullName.trim();
  if (values.birthDate.trim()) {
    input.birthDate = toApiDate(values.birthDate.trim());
  }
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
        birthDate: profile.birthDate ? toDisplayDate(profile.birthDate) : '',
        heightCm: profile.heightCm != null ? String(profile.heightCm) : '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    const input = toProfileInput(values);

    // Validação client-side reusando o schema compartilhado (fonte única de verdade).
    const result = profileInputSchema.safeParse(input);
    if (!result.success) {
      // Agrupa mensagens por campo
      const fieldIssues: { [key: string]: string[] } = {};
      for (const issue of result.error.errors) {
        const field = issue.path[0] as string;
        if (field) {
          if (!fieldIssues[field]) fieldIssues[field] = [];
          fieldIssues[field].push(issue.message);
        }
      }

      // Define o erro para cada campo
      Object.keys(fieldIssues).forEach((field) => {
        const messages = fieldIssues[field] || [];
        let message = messages[0] || '';

        if (field === 'birthDate') {
          const hasFormatError = messages.some(
            (msg) => msg.includes('AAAA-MM-DD') || msg.includes('inválida')
          );
          if (hasFormatError) {
            message = 'Data de nascimento inválida. Use o formato DD/MM/AAAA.';
          } else {
            message = messages[0] || '';
          }
        }

        setError(field as keyof ProfileFormValues, { message });
      });

      toastError('Verifique os campos destacados.');
      return;
    }

    updateProfile(result.data, {
      onSuccess: () => toastSuccess('Perfil salvo com sucesso.'),
      onError: (error: { message?: string }) =>
        toastError(error.message || 'Falha ao salvar o perfil.'),
    });
  };

  return (
    <AppShell>
      <div className="py-6">
        <div className="flex items-center justify-between">
          <h1>Perfil</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => void logout()} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Dados pessoais para uso futuro (ex.: cálculo de IMC e estimativas). Todos os campos são
          opcionais.
        </p>

        <div className="mt-6 max-w-md">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <ErrorState
              message="Não foi possível carregar o perfil."
              retry={() => void refetch()}
            />
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
                  type="text"
                  placeholder="DD/MM/AAAA"
                  aria-invalid={!!errors.birthDate}
                  {...register('birthDate', {
                    onChange: (e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 8) val = val.slice(0, 8);
                      if (val.length > 4) {
                        e.target.value = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
                      } else if (val.length > 2) {
                        e.target.value = `${val.slice(0, 2)}/${val.slice(2)}`;
                      } else {
                        e.target.value = val;
                      }
                    },
                  })}
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
