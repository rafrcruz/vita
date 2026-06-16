# Phase 0 — Research: Frontend Design System Foundation

Consolida as decisões técnicas que resolvem o Technical Context do `plan.md`. As ambiguidades de
produto já foram resolvidas em `spec.md` › Clarifications; aqui ficam as decisões de implementação,
todas avaliadas contra a Constituição (Princípios IV, V, VI).

## D1. Abordagem da biblioteca de componentes

- **Decision**: Padrão **shadcn/ui** — primitivos **Radix UI** (headless, acessíveis) estilizados
  com Tailwind, com o código dos componentes **copiado para `src/components/ui`** (não é uma
  dependência de UI; é código do projeto). Utilitários: `class-variance-authority` (variantes),
  `tailwind-merge` + `clsx` (helper `cn()`).
- **Rationale**: Acessibilidade (teclado/ARIA) pronta via Radix → atende FR-022/FR-023/SC-008;
  o projeto é dono do código → sem lock-in, alinhado ao Princípio V; Tailwind-nativo → coeso com a
  stack (Princípio IV); documentação e adoção massivas → produtividade de agentes de IA (FR-025) e
  sustentabilidade (Princípio VI).
- **Alternatives considered**: MUI/Mantine/Chakra (mais peso, mais opinião visual, menos controle —
  rejeitado pelo Princípio V); construir tudo do zero (risco alto de acessibilidade e retrabalho —
  rejeitado). *(Confirmado na clarificação Q1.)*

## D2. Estratégia de tokens e temas

- **Decision**: Tokens como **CSS custom properties** em `:root` (tema claro) e `.dark` (tema
  escuro), em formato **HSL**, referenciados pelo `tailwind.config.ts` (`darkMode: 'class'`). Troca
  de tema = alternar a classe `dark` no elemento `<html>`. Cores semânticas: `background`,
  `foreground`, `card`, `primary` (índigo/violeta), `secondary`, `muted`, `accent`, `destructive`,
  `success`, `warning`, `info`, `border`, `input`, `ring`.
- **Rationale**: Troca de tema instantânea sem reflow custoso (FR-006, SC-002); um único conjunto de
  classes Tailwind funciona nos dois temas; é o padrão consolidado do shadcn/ui (consistência e
  documentação). Paleta índigo/violeta sobre neutros frios (clarificação Q3), com tons calibrados
  para contraste AA (FR-010/SC-004).
- **Alternatives considered**: dois conjuntos de classes (`dark:` em tudo) — verboso e propenso a
  erro; theming via JS runtime — desnecessário e mais lento. Rejeitados.

## D3. Modelo tri-estado de tema e prevenção de FOUC

- **Decision**: `ThemeProvider` com estado **`'light' | 'dark' | 'system'`** (padrão `system`),
  persistido em `localStorage` (`vita.theme`). Em modo `system`, escuta `matchMedia('(prefers-color-scheme: dark)')`
  e reage em tempo real (FR-008). FOUC evitado com **script inline síncrono no `<head>` do
  `index.html`** que lê a preferência e aplica a classe `dark` **antes** da renderização do React.
- **Rationale**: Atende FR-007/FR-008/FR-009 e SC-003 (zero flash). O script inline é a técnica
  padrão e mínima; fallback seguro para tema claro quando `localStorage`/`matchMedia` indisponíveis
  (edge case de modo privado).
- **Alternatives considered**: aplicar tema só no React (causa flash — rejeitado); cookie + SSR
  (não há SSR nesta SPA — N/A).

## D4. Responsividade, breakpoints e app shell

- **Decision**: Breakpoints Tailwind customizados cobrindo os formatos da spec:
  `sm` 640, `md` 768 (tablet), `lg` 1024, `xl` 1280, `2xl` 1536, **`3xl` 1920 (Full HD)** e
  **`4xl` 2560+ (ultrawide)**. App shell adaptativo: **`BottomNav`** (mobile) → **`NavRail`
  recolhível** (tablet) → **`SidebarNav` fixa** (desktop/ultrawide), selecionado por CSS/breakpoint.
  `PageContainer` limita a largura de leitura (`max-w`) e, em ultrawide, habilita layout
  multi-painel deliberado.
- **Rationale**: Cada formato recebe navegação própria (FR-013/SC-006), com ergonomia de polegar no
  mobile (FR-014). Limitar largura de leitura evita linhas longas em telas largas (FR-016).
- **Alternatives considered**: sidebar única que colapsa em tudo (mais simples, mas pior ergonomia
  mobile — rejeitado na clarificação Q4); barras fluidas sem max-width (legibilidade ruim em
  ultrawide — rejeitado).

## D5. Ícones, toasts, animação

- **Decision**: Ícones = **`lucide-react`** (par padrão do shadcn/ui, tree-shakeable). Toasts/
  notificações = **`sonner`**. Animação/microinterações = **`tailwindcss-animate`** + transições
  CSS, sempre sob `prefers-reduced-motion` (FR-024/SC-011). **Framer Motion NÃO é adotado agora**
  (YAGNI — Princípio V).
- **Rationale**: Todas modernas, mantidas e de baixo peso (Princípio VI); cobrem feedback visual
  (FR-017/FR-018) sem dependência pesada de animação.
- **Alternatives considered**: react-icons (menos coeso visualmente), Radix Toast cru (mais
  boilerplate que sonner), Framer Motion (peso/complexidade desnecessários agora).

## D6. Formulários eficientes para entrada rápida

- **Decision**: **`react-hook-form`** + **`@hookform/resolvers/zod`** (zod já no monorepo, inclusive
  schemas compartilhados em `@vita/shared`). Padrões: tipos de `input`/teclado adequados ao dado
  (`inputMode`, `type`), validação inline, foco inicial correto, ordem de tabulação, valores padrão.
- **Rationale**: Reduz cliques/toques e re-renderizações (FR-020); reaproveita validação zod já
  existente (consistência front/back); RHF é o padrão de mercado, mantido e acessível.
- **Alternatives considered**: estado controlado manual (verboso, mais re-render), Formik (menos
  ativo que RHF). Rejeitados.

## D7. Testes orientados a risco (Princípio VII)

- **Decision**: Testes para: (a) lógica do `ThemeProvider` — resolução `system`, persistência,
  reação a `matchMedia`, fallback; (b) acessibilidade automatizada com **`vitest-axe`** nas
  telas-vitrine e no guia (0 violações A/AA — SC-008); (c) comportamento do app shell por
  breakpoint (qual navegação é exibida). Sem testes apenas por cobertura.
- **Rationale**: Protege as partes com regra/risco reais (tema e acessibilidade), conforme a
  Constituição; o restante é visual e validado pelo guia/quickstart.
- **Alternatives considered**: testes de snapshot visual/E2E (Playwright) — fora de escopo agora;
  podem ser adicionados depois se o risco justificar.

## D8. Guia visual vivo

- **Decision**: Página React em rota **`/style-guide`** que renderiza tokens (cores, tipografia,
  espaçamentos, raios, sombras), todos os componentes em seus estados e exemplos de layout por
  breakpoint, refletindo o tema atual. Sem ferramenta externa (ex.: Storybook) nesta fase.
- **Rationale**: Mantém a stack simples (Princípio V), fica versionado junto ao app e usa os mesmos
  componentes reais (fonte única de verdade). Storybook adicionaria tooling/manutenção não
  justificados para um mantenedor único agora.
- **Alternatives considered**: Storybook (poderoso, porém peso de tooling — adiado); README estático
  (não é "vivo" — rejeitado por FR-027).

## Dependências a adicionar (resumo)

| Pacote | Tipo | Uso |
|--------|------|-----|
| `@radix-ui/react-*` (por componente) | prod | Primitivos acessíveis |
| `class-variance-authority` | prod | Variantes de componente |
| `tailwind-merge`, `clsx` | prod | Helper `cn()` |
| `tailwindcss-animate` | dev (plugin Tailwind) | Animações utilitárias |
| `lucide-react` | prod | Ícones |
| `sonner` | prod | Toasts |
| `react-hook-form`, `@hookform/resolvers` | prod | Formulários (zod já presente) |
| `vitest-axe` | dev | Asserções de acessibilidade |

Todas avaliadas como modernas, amplamente adotadas e ativamente mantidas (Princípio VI). Os bumps
entram pelo fluxo de PR + CI já estabelecido (validação de lockfile cross-platform conforme a nota
operacional do projeto).
