import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/feedback/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  useWeightHistory,
  useBPHistory,
  useUpdateWeight,
  useDeleteWeight,
  useUpdateBP,
  useDeleteBP,
  type WeightLog,
  type BPLog,
} from '../services/api';
import { toastSuccess, toastError } from '../lib/toast';
import { Scale, Heart, Calendar, Edit2, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { DateTimeInput } from '../components/DateTimeInput';
import { formatISOToDateTimeMask, parseDateTimeToISO } from '../lib/date';

export function History() {
  const [activeTab, setActiveTab] = React.useState<'weight' | 'bp'>('weight');

  // Queries (fetch all data for history management)
  const { data: weightData, isLoading: isWeightLoading } = useWeightHistory('all');
  const { data: bpData, isLoading: isBPLoading } = useBPHistory('all');

  // Mutations
  const { mutate: deleteWeight } = useDeleteWeight();
  const { mutate: deleteBP } = useDeleteBP();
  const { mutate: updateWeight, isPending: isUpdatingWeight } = useUpdateWeight();
  const { mutate: updateBP, isPending: isUpdatingBP } = useUpdateBP();

  // Edit modals state
  const [editingWeight, setEditingWeight] = React.useState<WeightLog | null>(null);
  const [editingBP, setEditingBP] = React.useState<BPLog | null>(null);

  // Edit form states
  const [editWeightValue, setEditWeightValue] = React.useState('');
  const [editWeightDate, setEditWeightDate] = React.useState('');
  const [isWeightDateValid, setIsWeightDateValid] = React.useState(true);

  const [editBPSystolic, setEditBPSystolic] = React.useState('');
  const [editBPDiastolic, setEditBPDiastolic] = React.useState('');
  const [editBPDate, setEditBPDate] = React.useState('');
  const [isBPDateValid, setIsBPDateValid] = React.useState(true);

  // Setup form when opening edit weight modal
  React.useEffect(() => {
    if (editingWeight) {
      setEditWeightValue(editingWeight.weight.toString());
      setEditWeightDate(formatISOToDateTimeMask(editingWeight.loggedAt));
      setIsWeightDateValid(true);
    }
  }, [editingWeight]);

  // Setup form when opening edit BP modal
  React.useEffect(() => {
    if (editingBP) {
      setEditBPSystolic(editingBP.systolic.toString());
      setEditBPDiastolic(editingBP.diastolic.toString());
      setEditBPDate(formatISOToDateTimeMask(editingBP.loggedAt));
      setIsBPDateValid(true);
    }
  }, [editingBP]);

  // Delete weight handler
  const handleDeleteWeight = (id: string, weight: number) => {
    if (confirm(`Tem certeza de que deseja excluir a medição de peso de ${weight} kg?`)) {
      deleteWeight(id, {
        onSuccess: () => toastSuccess('Registro de peso excluído com sucesso.'),
        onError: (err: { message?: string }) => toastError(err.message || 'Erro ao excluir peso.'),
      });
    }
  };

  // Delete BP handler
  const handleDeleteBP = (id: string, systolic: number, diastolic: number) => {
    if (confirm(`Excluir a medição de pressão de ${systolic}x${diastolic} mmHg?`)) {
      deleteBP(id, {
        onSuccess: () => toastSuccess('Registro de pressão excluído.'),
        onError: (err: { message?: string }) =>
          toastError(err.message || 'Erro ao excluir pressão.'),
      });
    }
  };

  // Save edited weight
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWeight) return;

    const normalized = editWeightValue.trim().replace(',', '.');
    const parsedWeight = parseFloat(normalized);

    if (isNaN(parsedWeight) || parsedWeight < 20 || parsedWeight > 350) {
      toastError('O peso deve ser um número entre 20 e 350 kg.');
      return;
    }

    if (!isWeightDateValid) {
      toastError('Por favor, insira uma data e hora válidas (e não-futura).');
      return;
    }

    updateWeight(
      {
        id: editingWeight.id,
        data: {
          weight: parsedWeight,
          loggedAt: parseDateTimeToISO(editWeightDate),
        },
      },
      {
        onSuccess: () => {
          toastSuccess('Registro de peso atualizado!');
          setEditingWeight(null);
        },
        onError: (err: { message?: string }) =>
          toastError(err.message || 'Erro ao atualizar peso.'),
      }
    );
  };

  // Save edited BP
  const handleSaveBP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBP) return;

    const sysNum = parseInt(editBPSystolic, 10);
    const diaNum = parseInt(editBPDiastolic, 10);

    if (isNaN(sysNum) || sysNum < 40 || sysNum > 300) {
      toastError('A pressão sistólica deve ser entre 40 e 300 mmHg.');
      return;
    }

    if (isNaN(diaNum) || diaNum < 30 || diaNum > 200) {
      toastError('A pressão diastólica deve ser entre 30 e 200 mmHg.');
      return;
    }

    if (!isBPDateValid) {
      toastError('Por favor, insira uma data e hora válidas (e não-futura).');
      return;
    }

    updateBP(
      {
        id: editingBP.id,
        data: {
          systolic: sysNum,
          diastolic: diaNum,
          loggedAt: parseDateTimeToISO(editBPDate),
        },
      },
      {
        onSuccess: () => {
          toastSuccess('Registro de pressão atualizado!');
          setEditingBP(null);
        },
        onError: (err: { message?: string }) =>
          toastError(err.message || 'Erro ao atualizar pressão.'),
      }
    );
  };

  // Sort logs descending (newest first) for history listing
  const sortedWeights = React.useMemo(() => {
    if (!weightData) return [];
    return [...weightData].sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
  }, [weightData]);

  const sortedBPs = React.useMemo(() => {
    if (!bpData) return [];
    return [...bpData].sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
  }, [bpData]);

  const isLoading = activeTab === 'weight' ? isWeightLoading : isBPLoading;

  return (
    <AppShell>
      <div className="py-6">
        {/* Header navigation */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            aria-label="Voltar"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Histórico de Medições</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus registros de saúde</p>
          </div>
        </div>

        {/* Tab selector */}
        <div
          className="mb-6 flex w-full rounded-lg bg-muted p-1"
          role="tablist"
          aria-label="Selecionar métrica"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'weight'}
            onClick={() => setActiveTab('weight')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeTab === 'weight'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Scale className="h-4 w-4" />
            Peso
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'bp'}
            onClick={() => setActiveTab('bp')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeTab === 'bp'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="h-4 w-4" />
            Pressão Arterial
          </button>
        </div>

        {/* Main List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))
          ) : activeTab === 'weight' ? (
            sortedWeights.length === 0 ? (
              <EmptyState
                icon={<Scale className="h-12 w-12" />}
                title="Nenhum registro de peso encontrado."
              />
            ) : (
              sortedWeights.map((log) => (
                <Card key={log.id} className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Scale className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold tracking-tight">{log.weight} kg</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(log.loggedAt).toLocaleString(undefined, {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingWeight(log)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWeight(log.id, log.weight)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          ) : sortedBPs.length === 0 ? (
            <EmptyState
              icon={<Heart className="h-12 w-12" />}
              title="Nenhum registro de pressão encontrado."
            />
          ) : (
            sortedBPs.map((log) => (
              <Card key={log.id} className="transition-colors hover:bg-muted/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold tracking-tight">
                        {log.systolic}x{log.diastolic}{' '}
                        <span className="text-xs font-semibold text-muted-foreground">mmHg</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(log.loggedAt).toLocaleString(undefined, {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingBP(log)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBP(log.id, log.systolic, log.diastolic)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit Weight Modal */}
      <Dialog open={!!editingWeight} onOpenChange={(open) => !open && setEditingWeight(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Peso</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveWeight} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="weight-edit">Peso (kg)</Label>
              <Input
                id="weight-edit"
                type="text"
                inputMode="decimal"
                pattern="[0-9.,]*"
                value={editWeightValue}
                onChange={(e) => setEditWeightValue(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-date-edit">Data e Hora</Label>
              <DateTimeInput
                id="weight-date-edit"
                value={editWeightDate}
                onChange={(val, isValid) => {
                  setEditWeightDate(val);
                  setIsWeightDateValid(isValid);
                }}
                required
                className={
                  !isWeightDateValid && editWeightDate.length === 16
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                }
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingWeight(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdatingWeight} className="flex-1">
                {isUpdatingWeight ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 inline" />
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit BP Modal */}
      <Dialog open={!!editingBP} onOpenChange={(open) => !open && setEditingBP(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Pressão Arterial</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveBP} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp-sys-edit">Sistólica (SYS)</Label>
                <Input
                  id="bp-sys-edit"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={editBPSystolic}
                  onChange={(e) => setEditBPSystolic(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-dia-edit">Diastólica (DIA)</Label>
                <Input
                  id="bp-dia-edit"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={editBPDiastolic}
                  onChange={(e) => setEditBPDiastolic(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp-date-edit">Data e Hora</Label>
              <DateTimeInput
                id="bp-date-edit"
                value={editBPDate}
                onChange={(val, isValid) => {
                  setEditBPDate(val);
                  setIsBPDateValid(isValid);
                }}
                required
                className={
                  !isBPDateValid && editBPDate.length === 16
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                }
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingBP(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdatingBP} className="flex-1">
                {isUpdatingBP ? <Loader2 className="h-4 w-4 animate-spin mr-1 inline" /> : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
