import { ThemeToggle } from '../theme/ThemeToggle';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Spinner } from '../components/ui/spinner';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '../components/feedback/Alert';
import { EmptyState } from '../components/feedback/EmptyState';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toastSuccess, toastError, toastInfo } from '../lib/toast';

const colorTokens = [
  { name: 'background', class: 'bg-background' },
  { name: 'foreground', class: 'bg-foreground' },
  { name: 'card', class: 'bg-card' },
  { name: 'primary', class: 'bg-primary' },
  { name: 'secondary', class: 'bg-secondary' },
  { name: 'muted', class: 'bg-muted' },
  { name: 'accent', class: 'bg-accent' },
  { name: 'destructive', class: 'bg-destructive' },
  { name: 'success', class: 'bg-success' },
  { name: 'warning', class: 'bg-warning' },
  { name: 'info', class: 'bg-info' },
];

export function StyleGuide() {
  return (
    <AppShell>
      <div className="py-6 space-y-12">
        <header className="flex items-center justify-between">
          <div>
            <h1>Guia Visual VITA</h1>
            <p className="text-muted-foreground">Documentação viva do design system</p>
          </div>
          <ThemeToggle />
        </header>

        <section>
          <h2>Cores (Tokens)</h2>
          <p className="mb-4 text-sm text-muted-foreground">Paleta índigo/violeta sobre neutros frios</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="space-y-2">
                <div className={`h-16 rounded-lg border border-border ${token.class}`} />
                <p className="text-xs font-mono">{token.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Tipografia</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Display (text-metric · números de destaque)</p>
              <p className="text-metric">72,5</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">H1</p>
              <h1>Título H1</h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">H2</p>
              <h2>Título H2</h2>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">H3</p>
              <h3>Título H3</h3>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body</p>
              <p>Texto de corpo padrão para leitura confortável.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Caption</p>
              <p className="text-sm text-muted-foreground">Texto secundário ou legenda.</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Espaçamentos</h2>
          <div className="flex items-end gap-2">
            {[1, 2, 3, 4, 6, 8, 12, 16].map((size) => (
              <div key={size} className="text-center">
                <div className="bg-primary rounded" style={{ width: `${size * 4}px`, height: `${size * 4}px` }} />
                <p className="text-xs mt-1">{size}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Raios</h2>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-sm" />
              <p className="text-xs mt-1">sm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-md" />
              <p className="text-xs mt-1">md</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-lg" />
              <p className="text-xs mt-1">lg</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full" />
              <p className="text-xs mt-1">full</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Elevação</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Escala de sombras (camadas): cartão → cartão elevado → popover/menu → modal/sheet.
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { level: 'sm', cls: 'shadow-sm' },
              { level: 'md', cls: 'shadow-md' },
              { level: 'lg', cls: 'shadow-lg' },
              { level: 'xl', cls: 'shadow-xl' },
            ].map(({ level, cls }) => (
              <div key={level} className="text-center">
                <div className={`h-16 w-16 rounded-lg border border-border bg-card ${cls}`} />
                <p className="mt-2 text-xs font-mono">{level}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Movimento</h2>
          <p className="text-sm text-muted-foreground">
            Microinterações discretas com duração de 120–200&nbsp;ms (tokens <span className="font-mono">duration-fast</span>,{' '}
            <span className="font-mono">duration-DEFAULT</span>, <span className="font-mono">duration-slow</span>) e easing
            único. Tudo respeita <span className="font-mono">prefers-reduced-motion</span>.
          </p>
        </section>

        <section>
          <h2>Botões</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section>
          <h2>Inputs</h2>
          <div className="max-w-sm space-y-4">
            <div>
              <Label htmlFor="demo-input">Input padrão</Label>
              <Input id="demo-input" placeholder="Digite algo..." />
            </div>
            <div>
              <Label htmlFor="demo-textarea">Textarea</Label>
              <Textarea id="demo-textarea" placeholder="Escreva aqui..." />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="demo-checkbox" />
              <Label htmlFor="demo-checkbox">Checkbox</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="demo-switch" />
              <Label htmlFor="demo-switch">Switch</Label>
            </div>
          </div>
        </section>

        <section>
          <h2>Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        <section>
          <h2>Cards</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Descrição do card com informações adicionais.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Conteúdo do card aqui.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Outro Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Mais conteúdo de exemplo.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2>Alertas</h2>
          <div className="space-y-4 max-w-2xl">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>Este é um alerta informativo padrão.</AlertDescription>
            </Alert>
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>Operação concluída com sucesso.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>Verifique as informações antes de continuar.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>Ocorreu um erro ao processar sua solicitação.</AlertDescription>
            </Alert>
          </div>
        </section>

        <section>
          <h2>Loading States</h2>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-xs mt-2">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-xs mt-2">Medium</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-xs mt-2">Large</p>
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </section>

        <section>
          <h2>Empty State</h2>
          <EmptyState
            title="Nenhum item encontrado"
            description="Comece adicionando seu primeiro item."
            action={{ label: 'Adicionar item', onClick: () => {} }}
          />
        </section>

        <section>
          <h2>Toasts</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Notificações alinhadas às cores semânticas do design system (não à paleta do sonner).
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => toastSuccess('Operação concluída com sucesso.')}>
              Toast de sucesso
            </Button>
            <Button variant="outline" onClick={() => toastError('Não foi possível concluir a operação.')}>
              Toast de erro
            </Button>
            <Button variant="outline" onClick={() => toastInfo('Mensagem informativa.')}>
              Toast informativo
            </Button>
          </div>
        </section>

        <section>
          <h2>Modais e Diálogos</h2>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Abrir Modal (Dialog)</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Ação</DialogTitle>
                  <DialogDescription>
                    Esta é uma descrição informativa do modal. Pressione Esc ou clique fora para fechar.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">Conteúdo customizável do modal.</div>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Abrir Lateral (Sheet)</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu de Configurações</SheetTitle>
                  <SheetDescription>Configurações rápidas de perfil do usuário.</SheetDescription>
                </SheetHeader>
                <div className="py-4">Conteúdo customizável do painel lateral.</div>
              </SheetContent>
            </Sheet>
          </div>
        </section>

        <section>
          <h2>Menus e Tooltips</h2>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Ações Rápidas</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Editar Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Excluir Conta</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Informações">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dica explicativa ou ajuda contextual.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        <section>
          <h2>Tabelas e Listas</h2>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Permissão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ana.silva@exemplo.com</TableCell>
                  <TableCell><Badge variant="success">Ativo</Badge></TableCell>
                  <TableCell className="text-right">admin</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">pedro.santos@exemplo.com</TableCell>
                  <TableCell><Badge variant="secondary">Pendente</Badge></TableCell>
                  <TableCell className="text-right">member</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <h2>Seleção e Rádios</h2>
          <div className="space-y-4 max-w-sm">
            <div>
              <Label htmlFor="guide-select" className="mb-2 block">Dropdown Select</Label>
              <Select defaultValue="member">
                <SelectTrigger id="guide-select">
                  <SelectValue placeholder="Selecione um papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Membro comum</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="block">Papel do Usuário (Radio)</Label>
              <RadioGroup defaultValue="member">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="member" id="r-member" />
                  <Label htmlFor="r-member" className="font-normal">Membro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="r-admin" />
                  <Label htmlFor="r-admin" className="font-normal">Administrador</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        <section>
          <h2>Ícones (Lucide)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Padrão: Lucide React. Tamanhos: 16px (sm), 20px (md), 24px (lg).
          </p>
          <div className="flex items-center gap-4">
            <Info className="h-4 w-4" />
            <Info className="h-5 w-5" />
            <Info className="h-6 w-6" />
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
