import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        // Largura de leitura confortável no desktop; aproveita espaço de forma contida em
        // monitores largos/ultrawide (contenção centralizada deliberada).
        'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 2xl:max-w-6xl 3xl:max-w-7xl 4xl:px-12',
        className
      )}
    >
      {children}
    </div>
  );
}
