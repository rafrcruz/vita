import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useLogBP } from '../services/api';
import { toastSuccess, toastError } from '../lib/toast';
import { DateTimeInput } from './DateTimeInput';
import { formatISOToDateTimeMask, parseDateTimeToISO } from '../lib/date';

interface BPCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BPCaptureModal({ isOpen, onClose }: BPCaptureModalProps) {
  const [systolic, setSystolic] = React.useState('');
  const [diastolic, setDiastolic] = React.useState('');
  const [customDate, setCustomDate] = React.useState(false);
  const [dateTime, setDateTime] = React.useState('');
  const [isDateValid, setIsDateValid] = React.useState(true);
  const sysRef = React.useRef<HTMLInputElement>(null);
  const diaRef = React.useRef<HTMLInputElement>(null);

  const { mutate: logBP, isPending } = useLogBP();

  // Reset state and focus on open
  React.useEffect(() => {
    if (isOpen) {
      setSystolic('');
      setDiastolic('');
      setCustomDate(false);

      const now = new Date();
      setDateTime(formatISOToDateTimeMask(now.toISOString()));
      setIsDateValid(true);

      setTimeout(() => {
        sysRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!systolic.trim() || !diastolic.trim()) {
      toastError('Por favor, insira ambos os valores de pressão.');
      return;
    }

    const sysNum = parseInt(systolic, 10);
    const diaNum = parseInt(diastolic, 10);

    if (isNaN(sysNum) || sysNum < 40 || sysNum > 300) {
      toastError('A pressão sistólica (SYS) deve ser um número entre 40 e 300 mmHg.');
      return;
    }

    if (isNaN(diaNum) || diaNum < 30 || diaNum > 200) {
      toastError('A pressão diastólica (DIA) deve ser um número entre 30 e 200 mmHg.');
      return;
    }

    if (customDate && !isDateValid) {
      toastError('Por favor, insira uma data e hora válidas (e não-futura).');
      return;
    }

    logBP(
      {
        systolic: sysNum,
        diastolic: diaNum,
        loggedAt: customDate ? parseDateTimeToISO(dateTime) : undefined,
      },
      {
        onSuccess: () => {
          toastSuccess(`Pressão arterial de ${sysNum}x${diaNum} mmHg registrada!`);
          onClose();
        },
        onError: (error: { message?: string }) => {
          toastError(error.message || 'Falha ao salvar registro de pressão.');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Registrar Pressão Arterial
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Dual input display with focus highlight */}
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-6 rounded-lg border border-dashed">
            <div className="flex flex-col items-center border-r">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Sistólica (SYS)
              </span>
              <div className="flex items-baseline gap-1">
                <input
                  ref={sysRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value.replace(/\D/g, ''))}
                  placeholder="120"
                  disabled={isPending}
                  className="text-metric text-center bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary/80 w-20 px-1 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      diaRef.current?.focus();
                    }
                  }}
                  autoFocus
                />
                <span className="text-xs font-bold text-muted-foreground uppercase">SYS</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Diastólica (DIA)
              </span>
              <div className="flex items-baseline gap-1">
                <input
                  ref={diaRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value.replace(/\D/g, ''))}
                  placeholder="80"
                  disabled={isPending}
                  className="text-metric text-center bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary/80 w-20 px-1 transition-colors"
                />
                <span className="text-xs font-bold text-muted-foreground uppercase">DIA</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="custom-date-bp"
                checked={customDate}
                onCheckedChange={(checked) => setCustomDate(checked === true)}
                disabled={isPending}
              />
              <Label
                htmlFor="custom-date-bp"
                className="text-sm font-medium cursor-pointer select-none"
              >
                Alterar data/hora (registro retroativo)
              </Label>
            </div>

            {customDate && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                <DateTimeInput
                  value={dateTime}
                  onChange={(val, isValid) => {
                    setDateTime(val);
                    setIsDateValid(isValid);
                  }}
                  disabled={isPending}
                  required
                  className={`w-full ${!isDateValid && dateTime.length === 16 ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
