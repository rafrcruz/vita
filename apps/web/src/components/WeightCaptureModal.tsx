import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLogWeight } from '../services/api';
import { toastSuccess, toastError } from '../lib/toast';

interface WeightCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeightCaptureModal({ isOpen, onClose }: WeightCaptureModalProps) {
  const [weightValue, setWeightValue] = React.useState('');
  const [customDate, setCustomDate] = React.useState(false);
  const [dateTime, setDateTime] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { mutate: logWeight, isPending } = useLogWeight();

  // Reset state and focus on open
  React.useEffect(() => {
    if (isOpen) {
      setWeightValue('');
      setCustomDate(false);
      // Format current local time for datetime-local input: YYYY-MM-DDTHH:MM
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60 * 1000;
      const localISOTime = new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
      setDateTime(localISOTime);

      // Delay focus slightly to allow Radix transition to complete
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightValue.trim()) {
      toastError('Por favor, insira o valor do peso.');
      return;
    }

    // Parse weight separating dot and comma
    const normalized = weightValue.trim().replace(',', '.');
    const parsedWeight = parseFloat(normalized);

    if (isNaN(parsedWeight) || parsedWeight < 20 || parsedWeight > 350) {
      toastError('O peso deve ser um número válido entre 20 e 350 kg.');
      return;
    }

    logWeight(
      {
        weight: parsedWeight,
        loggedAt: customDate ? new Date(dateTime).toISOString() : undefined,
      },
      {
        onSuccess: () => {
          toastSuccess(`Peso de ${parsedWeight} kg registrado com sucesso!`);
          onClose();
        },
        onError: (error: any) => {
          toastError(error.message || 'Falha ao salvar registro de peso.');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Registrar Peso</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Visual highlight of entered value */}
          <div className="flex flex-col items-center justify-center bg-muted/30 p-6 rounded-lg border border-dashed">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Peso Atual (kg)
            </span>
            <div className="flex items-baseline gap-1">
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                pattern="[0-9.,]*"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                placeholder="00.0"
                disabled={isPending}
                className="text-5xl font-black text-center bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary/80 w-36 px-2 tracking-tight transition-colors"
                autoFocus
              />
              <span className="text-2xl font-bold text-muted-foreground">kg</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="custom-date-weight"
                checked={customDate}
                onChange={(e) => setCustomDate(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="custom-date-weight" className="text-sm font-medium cursor-pointer select-none">
                Alterar data/hora (registro retroativo)
              </Label>
            </div>

            {customDate && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                <Input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  disabled={isPending}
                  required
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
