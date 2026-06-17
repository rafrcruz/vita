import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Algo deu errado',
  message,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
      role="alert"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" className="mt-4">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
