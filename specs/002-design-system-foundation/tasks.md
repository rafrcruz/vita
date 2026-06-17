---
description: 'Task list for Frontend Design System Foundation'
---

# Tasks: Frontend Design System Foundation

**Input**: Design documents from `specs/002-design-system-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluídos de forma **orientada a risco** (Constituição, Princípio VII e contratos):
lógica de tema (`ThemeProvider`) e acessibilidade automatizada (`vitest-axe`) nas telas-vitrine e
no guia. Sem testes apenas por cobertura.

**Organization**: Tarefas agrupadas por user story (P1→P4). Todo o escopo é o workspace `apps/web`;
o `apps/api` não é alterado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: user story correspondente (US1–US4)
- Caminhos relativos à raiz do monorepo

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependências e utilidades base do design system

- [x] T001 Adicionar dependências do design system ao `apps/web/package.json` (Radix por componente, `class-variance-authority`, `tailwind-merge`, `clsx`, `lucide-react`, `sonner`, `react-hook-form`, `@hookform/resolvers`; dev: `tailwindcss-animate`, `vitest-axe`) e rodar `npm install` (atenção ao lockfile cross-platform: conferir `"extraneous"` == 0 antes de commitar)
- [x] T002 [P] Criar helper `cn()` (clsx + tailwind-merge) em `apps/web/src/lib/utils.ts`
- [x] T003 [P] Registrar o matcher do `vitest-axe` no setup de testes em `apps/web/src/test/setup.ts`

**Checkpoint**: `npm install` ok; `cn()` disponível; testes podem usar asserções de acessibilidade.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Camada de tokens e configuração que TODAS as user stories consomem

**⚠️ CRITICAL**: Nenhuma user story começa antes desta fase concluir

- [x] T004 Definir os design tokens como CSS custom properties (`:root` e `.dark`, formato HSL) em `apps/web/src/index.css`, conforme `contracts/design-tokens.md` (cores de superfície, marca índigo/violeta, semânticas, controle, `--radius`, `--chart-*`)
- [x] T005 Mapear cores para `hsl(var(--token))`, adicionar breakpoints customizados (`3xl` 1920 = Full HD; `4xl` 2560, que cobre o ultrawide de 3440px de largura), raio derivado de `--radius` e plugin `tailwindcss-animate` em `apps/web/tailwind.config.ts`
- [x] T006 Adicionar script inline anti-FOUC no `<head>` de `apps/web/index.html` (lê `localStorage["vita.theme"]`, resolve via `matchMedia` quando `system`, aplica classe `dark` antes da primeira pintura; fallback `light`)
- [x] T007 [P] Definir estilos globais/tipográficos base (fonte, hierarquia de títulos, `background`/`foreground`) usando tokens em `apps/web/src/index.css`, conforme regras K4/K5 de `contracts/design-tokens.md`

**Checkpoint**: tokens aplicáveis nos dois temas; sem flash no carregamento; base tipográfica pronta.

---

## Phase 3: User Story 1 - Fundação visual com tema claro/escuro persistente (Priority: P1) 🎯 MVP

**Goal**: Tokens aplicados em toda a app + tema tri-estado (Claro/Escuro/Sistema) instantâneo,
persistente e sem flash, com contraste AA.

**Independent Test**: Percorrer as telas existentes, alternar o tema pelo controle dedicado,
recarregar/reabrir e confirmar persistência sem flash e contraste adequado nos dois temas.

### Tests for User Story 1

- [x] T008 [P] [US1] Testes unitários do `ThemeProvider` (resolução `system`, persistência em `vita.theme`, reação ao `matchMedia`, ignorar SO quando explícito, fallback) cobrindo T1–T7 de `contracts/theming-contract.md` em `apps/web/src/theme/ThemeProvider.test.tsx`

### Implementation for User Story 1

- [x] T009 [US1] Implementar `ThemeProvider` (estado `light|dark|system`, persistência `localStorage["vita.theme"]`, listener de `matchMedia`, aplica/remove a classe `dark` no `<html>`) em `apps/web/src/theme/ThemeProvider.tsx`
- [x] T010 [US1] Implementar hook `useTheme` (`theme`, `resolvedTheme`, `setTheme`) em `apps/web/src/theme/useTheme.ts`
- [x] T011 [US1] Implementar controle `ThemeToggle` tri-estado (Claro/Escuro/Sistema, ícones lucide) em `apps/web/src/theme/ThemeToggle.tsx`
- [x] T012 [US1] Envolver a aplicação com `ThemeProvider` (acima do roteador) e expor o `ThemeToggle` em `apps/web/src/App.tsx`
- [x] T013 [US1] Garantir que Login/Home/Admin adotem os tokens (remover cores fixas; coerência nos dois temas) em `apps/web/src/pages/Login.tsx`, `Home.tsx`, `AdminAllowlist.tsx`
- [x] T014 [US1] Atualizar o teste existente `apps/web/src/pages/Home.test.tsx` para envolver o render com `ThemeProvider` (evitar quebra após a mudança)

**Checkpoint**: US1 funcional e testável isoladamente — visual coeso + tema persistente sem flash.

---

## Phase 4: User Story 2 - Layout e navegação responsivos (Priority: P2)

**Goal**: App shell adaptativo — barra inferior (mobile) → rail recolhível (tablet) → sidebar fixa
(desktop/ultrawide), com largura de leitura controlada e sem rolagem horizontal.

**Independent Test**: Abrir as telas em ≈390/768/1920/3440px e confirmar a navegação por formato,
ausência de quebra/rolagem horizontal e aproveitamento de espaço.

### Tests for User Story 2

- [x] T015 [P] [US2] Teste do `AppShell` selecionando a navegação correta por breakpoint (mock de `matchMedia`), cobrindo N1–N3 de `contracts/components.md`, em `apps/web/src/components/layout/AppShell.test.tsx`

### Implementation for User Story 2

- [x] T016 [P] [US2] Implementar `PageContainer` (limite de largura de leitura + tratamento ultrawide) em `apps/web/src/components/layout/PageContainer.tsx`
- [x] T017 [P] [US2] Implementar `BottomNav` (mobile, alvos ≥44px) em `apps/web/src/components/layout/BottomNav.tsx`
- [x] T018 [P] [US2] Implementar `NavRail` (tablet, recolhível) em `apps/web/src/components/layout/NavRail.tsx`
- [x] T019 [P] [US2] Implementar `SidebarNav` (desktop/ultrawide, fixa) em `apps/web/src/components/layout/SidebarNav.tsx`
- [x] T020 [US2] Implementar `AppShell` compondo a navegação por breakpoint (depende de T016–T019) em `apps/web/src/components/layout/AppShell.tsx`
- [x] T021 [US2] Envolver Home e Admin no `AppShell` em `apps/web/src/pages/Home.tsx` e `apps/web/src/pages/AdminAllowlist.tsx`

**Checkpoint**: US1 + US2 funcionam; navegação distinta e adequada em cada formato.

---

## Phase 5: User Story 3 - Biblioteca de componentes, estados e formulários (Priority: P3)

**Goal**: Componentes acessíveis reutilizáveis (ação, entrada, exibição, sobreposição, feedback) com
estados padronizados (loading/vazio/erro/sucesso) e formulários otimizados para entrada rápida.

**Independent Test**: Montar telas usando apenas componentes da biblioteca; validar estados, foco
por teclado/leitor de tela e validação inline de formulário.

### Implementation for User Story 3

- [x] T022 [P] [US3] `Button` e `IconButton` (variantes via CVA, estado `loading` que bloqueia duplo-clique, **altura/área mínima de toque ≥44×44px** nos tamanhos primários — FR-014/SC-009) em `apps/web/src/components/ui/button.tsx`
- [x] T023 [P] [US3] `Input`, `Textarea`, `Label` em `apps/web/src/components/ui/input.tsx`, `textarea.tsx`, `label.tsx`
- [x] T024 [P] [US3] `Card` e `Badge` em `apps/web/src/components/ui/card.tsx` e `badge.tsx`
- [x] T025 [P] [US3] `Dialog` (modal) e `Sheet` (drawer mobile) sobre Radix, com focus trap/Esc/retorno de foco, em `apps/web/src/components/ui/dialog.tsx` e `sheet.tsx`
- [x] T026 [P] [US3] `DropdownMenu`, `Tooltip` (Radix) em `apps/web/src/components/ui/dropdown-menu.tsx` e `tooltip.tsx`
- [x] T027 [P] [US3] `Table`, `Skeleton`, `Spinner` em `apps/web/src/components/ui/table.tsx`, `skeleton.tsx`, `spinner.tsx`
- [x] T028 [P] [US3] `Select`, `Checkbox`, `Switch`, `RadioGroup` (Radix) em `apps/web/src/components/ui/select.tsx`, `checkbox.tsx`, `switch.tsx`, `radio-group.tsx`
- [x] T029 [P] [US3] Padrões de feedback `EmptyState`, `ErrorState`, `LoadingState`, `Alert` em `apps/web/src/components/feedback/`
- [x] T030 [US3] Integrar `Toaster` (sonner) em `apps/web/src/App.tsx` e helper de toast (sucesso/erro/info)
- [x] T031 [US3] Implementar `FormField` com `react-hook-form` + `@hookform/resolvers/zod` (label associada, validação inline acessível, `inputMode`/`type` adequados) em `apps/web/src/components/ui/form.tsx`
- [x] T032 [US3] Reconstruir `Login` com componentes/estados (fluxo Google inalterado; loading/erro) em `apps/web/src/pages/Login.tsx`
- [x] T033 [US3] Reconstruir `Home` com componentes (cartão de status de health; estados loading/erro) em `apps/web/src/pages/Home.tsx`
- [x] T034 [US3] Reconstruir `AdminAllowlist` com `Table`/`List` + formulário de adição (FormField) + estados vazio/erro/confirmação em `apps/web/src/pages/AdminAllowlist.tsx`

### Tests for User Story 3

- [x] T035 [P] [US3] Testes de acessibilidade (`vitest-axe`, 0 violações A/AA) para Login/Home/Admin em `apps/web/src/pages/Login.test.tsx`, `Home.test.tsx`, `AdminAllowlist.test.tsx`
- [x] T036 [P] [US3] Teste de validação de formulário (erro inline + "tentar novamente") do formulário de adição em `apps/web/src/pages/AdminAllowlist.test.tsx`

**Checkpoint**: US1–US3 funcionam; telas-vitrine reconstruídas sobre a biblioteca, acessíveis.

---

## Phase 6: User Story 4 - Guia visual vivo (Priority: P4)

**Goal**: Página `/style-guide` que documenta e demonstra tokens, componentes (com estados) e
layouts por formato, refletindo o tema atual.

**Independent Test**: Acessar `/style-guide`, alternar o tema e verificar tokens, componentes em
seus estados e exemplos de layout por breakpoint, com diretrizes de uso.

### Implementation for User Story 4

- [x] T037 [US4] Implementar a página `StyleGuide` (paleta/tokens, tipografia, espaçamentos, raios, sombras, **iconografia — padrão de estilo/tamanho do lucide, FR-004**, componentes em todos os estados, exemplos de layout por formato, sensível ao tema) em `apps/web/src/pages/StyleGuide.tsx`
- [x] T038 [US4] Adicionar a rota `/style-guide` em `apps/web/src/App.tsx`

### Tests for User Story 4

- [x] T039 [P] [US4] Teste de acessibilidade (`vitest-axe`, 0 violações A/AA) do guia em `apps/web/src/pages/StyleGuide.test.tsx`

**Checkpoint**: Todas as user stories independentemente funcionais; fundação documentada e viva.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação final e refinamentos transversais

- [x] T040 [P] Verificar `prefers-reduced-motion` (transições/microinterações reduzidas) e alvos de toque ≥44px nas telas-vitrine
- [x] T041 Rodar `npm run lint`, `npm run typecheck` e `npm run test` (inclui testes de tema e `vitest-axe`) — garantir tudo verde
- [x] T042 Executar a validação do `quickstart.md` (cenários V1–V5) em ≈390/768/1920/3440px e nos dois temas; registrar resultados
- [x] T043 [P] Documentar diretrizes de uso do design system em `docs/design-system.md` (referência rápida: tokens, tema, componentes, padrões de layout)
- [x] T044 Revisão de simplicidade e organização (FR-021/FR-025, Princípio V): conferir que não há componentes genéricos especulativos nem abstrações prematuras, e que a estrutura de `apps/web/src` (`theme/`, `components/ui`, `components/feedback`, `components/layout`) favorece consistência e produtividade de IA
