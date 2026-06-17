# Design System VITA

Guia de referência rápida para o design system do VITA.

## Tokens

### Cores

Todas as cores são definidas como CSS custom properties em formato HSL e mapeadas via Tailwind.

| Token                                          | Uso                           |
| ---------------------------------------------- | ----------------------------- |
| `background` / `foreground`                    | Fundo e texto principal       |
| `card` / `card-foreground`                     | Cards e containers            |
| `primary` / `primary-foreground`               | Cor de marca (índigo/violeta) |
| `secondary` / `secondary-foreground`           | Elementos secundários         |
| `muted` / `muted-foreground`                   | Elementos sutis               |
| `accent` / `accent-foreground`                 | Destaques (violeta)           |
| `destructive` / `success` / `warning` / `info` | Estados semânticos            |
| `border` / `input` / `ring`                    | Controles e foco              |

### Tema

O tema é controlado pela classe `dark` no `<html>`. Use `ThemeToggle` para alternar entre Claro/Escuro/Sistema.

```tsx
import { ThemeToggle } from '@/theme/ThemeToggle';
import { useTheme } from '@/theme/useTheme';

const { theme, resolvedTheme, setTheme } = useTheme();
```

### Tipografia

Hierarquia: Display (4xl bold) → H1 (3xl bold) → H2 (2xl semibold) → H3 (xl semibold) → Body → Caption (sm muted).

### Espaçamento

Escala base 4px do Tailwind: `p-1` (4px), `p-2` (8px), `p-4` (16px), etc.

### Raios

Derivados de `--radius` (0.5rem): `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`.

## Componentes

### Ação

```tsx
import { Button, IconButton } from '@/components/ui/button';

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button loading>Carregando...</Button>
```

### Entrada

```tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
```

### Exibição

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
```

### Sobreposição

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
```

### Feedback

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/feedback/Alert';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
```

### Formulários

```tsx
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/components/ui/form';

const schema = z.object({ email: z.string().email() });
const methods = useForm({ resolver: zodResolver(schema) });

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <FormField name="email" label="E-mail" type="email" />
  </form>
</FormProvider>;
```

## Layout

### AppShell

```tsx
import { AppShell } from '@/components/layout/AppShell';

<AppShell>{/* conteúdo da página */}</AppShell>;
```

O AppShell seleciona automaticamente a navegação por breakpoint:

- **Mobile** (< 768px): BottomNav
- **Tablet** (768px–1023px): NavRail recolhível
- **Desktop** (≥ 1024px): SidebarNav fixa

### PageContainer

```tsx
import { PageContainer } from '@/components/layout/PageContainer';

<PageContainer className="py-6">{/* conteúdo com max-width de leitura */}</PageContainer>;
```

## Breakpoints

| Token | Largura | Formato            |
| ----- | ------- | ------------------ |
| base  | 0–639px | Smartphone pequeno |
| `sm`  | 640px+  | Smartphone         |
| `md`  | 768px+  | Tablet             |
| `lg`  | 1024px+ | Desktop            |
| `xl`  | 1280px+ | Desktop grande     |
| `2xl` | 1536px+ | Desktop extra      |
| `3xl` | 1920px+ | Full HD            |
| `4xl` | 2560px+ | Ultrawide          |

## Ícones

Usamos **Lucide React** como padrão:

```tsx
import { Home, Settings, User, AlertCircle } from 'lucide-react';

<Home className="h-5 w-5" />;
```

Tamanhos: `h-4 w-4` (16px), `h-5 w-5` (20px), `h-6 w-6` (24px).

## Toasts

```tsx
import { toastSuccess, toastError, toastInfo } from '@/lib/toast';

toastSuccess('Operação concluída!');
toastError('Algo deu errado.');
toastInfo('Informação importante.');
```

## Acessibilidade

- Todos os componentes seguem WCAG 2.1 AA
- Alvos de toque ≥ 44×44px em controles primários
- Foco visível via `--ring`
- Respeita `prefers-reduced-motion`
- Testes automatizados com `vitest-axe`

## Guia Visual

Acesse `/style-guide` para ver todos os tokens e componentes em ação, sensíveis ao tema atual.
