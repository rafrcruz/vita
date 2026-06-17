---
description: 'Task list for feature 005 — Ajustes de UI'
---

# Tasks: Ajustes de UI — Navegação, Perfil, Gráfico e Ícone PWA

**Input**: Design documents from `/specs/005-ui-adjustments/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/profile.api.md

**Tests**: Incluídos apenas para áreas de risco conforme Princípio VII da constituição
(validação/serviço de Perfil e lógica de eixos/tooltip do gráfico). Não há TDD completo de UI.

**Organization**: Tasks agrupadas por user story (US1–US6) para implementação e teste
independentes, em ordem de prioridade (P1 → P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependências pendentes)
- **[Story]**: User story à qual a task pertence (US1–US6)
- Caminhos de arquivo exatos incluídos nas descrições

## Path Conventions

Monorepo web: `apps/web/` (SPA React), `apps/api/` (Express), `packages/shared/` (Zod/tipos).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação mínima compartilhada.

- [x] T001 Confirmar que `vite-plugin-pwa`, Radix (`dialog`/`dropdown-menu`/`sheet`/`tooltip`),
      React Hook Form, Zod e `@vita/shared` estão instalados (sem reinstalar/regenerar lockfile no
      Windows) — verificar `apps/web/package.json` e `apps/api/package.json`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura compartilhada de navegação consumida por US2 e US5 (evita divergência
entre as barras desktop/tablet/mobile).

**⚠️ CRITICAL**: Concluir antes de US2 e US5.

- [x] T002 Criar definição compartilhada de itens de navegação em
      `apps/web/src/components/layout/navItems.ts` (lista tipada: Início, Histórico, Admin
      [`adminOnly: true`], Perfil — com `to`, `icon`, `label` e flag `adminOnly`), preparada para
      acomodar novas telas futuras. A flag `adminOnly` MUST ser respeitada por **todas** as barras
      (desktop, tablet e mobile): itens `adminOnly` só aparecem para usuários com papel `admin`
      (FR-023).

**Checkpoint**: Base de navegação pronta — user stories podem começar.

---

## Phase 3: User Story 1 - Ícone da aplicação (Priority: P1) 🎯 MVP

**Goal**: Ícone próprio de saúde ao instalar na tela inicial (sem quadrado cinza "V").

**Independent Test**: Build de produção + "Adicionar à tela inicial" no celular (ou DevTools →
Application → Manifest) exibe o ícone personalizado nos tamanhos requeridos.

### Implementation for User Story 1

- [x] T003 [P] [US1] Criar assets de ícone em `apps/web/public/`: `favicon.ico`, `icon-192.png`,
      `icon-512.png`, `icon-512-maskable.png` e `apple-touch-icon.png` (180×180). Fixar no momento da
      criação o símbolo (ex.: coração/pulso ou balança estilizada) e a cor (primária do design system
      sobre `background_color` do manifesto), para um critério de aprovação objetivo da arte.
- [x] T004 [US1] Declarar `manifest.icons` (192/512 + 512 maskable, com `purpose`) no `VitePWA`
      em `apps/web/vite.config.ts`.
- [x] T005 [US1] Adicionar `<link rel="icon">` e `<link rel="apple-touch-icon">` (e revisar
      `theme-color`) em `apps/web/index.html`.

**Checkpoint**: Ícone PWA funcional e instalável.

---

## Phase 4: User Story 2 - Cabeçalho enxuto + Histórico no menu (Priority: P1)

**Goal**: Topo só com tema + Sair; remover subtítulo, linha e-mail/ADMIN/allowlist e card de
status do backend; Histórico acessível pelo menu.

**Independent Test**: Home em desktop e mobile sem os elementos removidos; Histórico acessível
pela navegação (não como botão no topo).

### Implementation for User Story 2

- [x] T006 [US2] Em `apps/web/src/pages/Home.tsx`: remover o subtítulo "Plataforma pessoal…",
      a linha de e-mail/badge de papel/link "Administrar allowlist", o card "Status do backend"
      (e a query `useQuery(['health'])` agora sem uso) e o botão "Histórico" do topo; manter no
      cabeçalho apenas `ThemeToggle` + botão "Sair".
- [x] T007 [P] [US2] Refatorar `apps/web/src/components/layout/SidebarNav.tsx` e
      `apps/web/src/components/layout/NavRail.tsx` para consumir `navItems`, incluindo "Histórico" e
      aplicando o gating `adminOnly` (o item "Admin" só é renderizado para usuários `admin`, lendo o
      papel via `useAuth`) — alinhando o desktop/tablet ao comportamento do menu mobile (FR-023).
- [x] T008 [US2] Atualizar `apps/web/src/pages/Home.test.tsx` para assertar ausência dos
      elementos removidos e o conteúdo do cabeçalho (tema + Sair), e presença de Histórico no menu.

**Checkpoint**: Cabeçalho limpo e Histórico no menu, em ambos os breakpoints.

---

## Phase 5: User Story 3 - Tela de Perfil funcional (Priority: P1)

**Goal**: Tela `/profile` real onde o usuário salva nome completo, data de nascimento e altura,
com persistência no backend.

**Independent Test**: Acessar Perfil pelo menu, salvar os três campos, recarregar e ver os
valores preenchidos; validações (data futura/inválida, altura fora de faixa) bloqueiam o salvar.

### Tests for User Story 3 ⚠️ (área de risco — Princípio VII)

> Escrever antes da implementação correspondente e garantir que falhem primeiro.

- [x] T009 [P] [US3] Testes de validação/serviço de Perfil em
      `apps/api/src/profile/profile.test.ts` cobrindo os casos do contrato (vazio→200, data futura→400,
      ano<1900→400, altura 10/300→400, fullName>120→400, válido→200, isolamento por `userEmail`).

### Implementation for User Story 3

- [x] T010 [P] [US3] Criar `profileInputSchema` (Zod) e tipos `ProfileInput`/`UserProfile` em
      `packages/shared/src/profile.ts` e exportar em `packages/shared/src/index.ts`.
- [x] T011 [P] [US3] Adicionar tabela `userProfiles` (id, userEmail único case-insensitive,
      fullName, birthDate, heightCm, createdAt, updatedAt) em `apps/api/src/db/schema.ts`.
      Acrescentar o import `date` de `drizzle-orm/pg-core` (hoje o arquivo importa apenas
      `text/timestamp/uuid/real/integer`); `birthDate` usa o tipo `date` (retorna string `YYYY-MM-DD`).
- [x] T012 [US3] Gerar a migração Drizzle (`npm run db:generate`) em
      `apps/api/src/db/migrations/` (depende de T011).
- [x] T013 [US3] Implementar `getProfile`/`upsertProfile` (filtro por `userEmail`, validação via
      `profileInputSchema`) em `apps/api/src/profile/profile.service.ts` (depende de T010, T011).
- [x] T014 [US3] Implementar rotas `GET /api/profile` e `PUT /api/profile` em
      `apps/api/src/profile/profile.route.ts` (depende de T013).
- [x] T015 [US3] Montar `profileRouter` sob `requireAuth` em `apps/api/src/app.ts`
      (`app.use('/api/profile', requireAuth, profileRouter)`).
- [x] T016 [P] [US3] Adicionar hooks `useProfile` (GET) e `useUpdateProfile` (PUT, invalidando o
      cache) em `apps/web/src/services/api.ts`.
- [x] T017 [US3] Criar a página `apps/web/src/pages/Profile.tsx` (React Hook Form + Zod, dentro
      do `AppShell`) com campos nome completo, data de nascimento e altura (cm), estados de
      loading/erro/sucesso, pré-carregando valores salvos e permitindo salvar parcial (depende de
      T016, T010).
- [x] T018 [US3] Adicionar a rota `/profile` (ProtectedRoute) em `apps/web/src/App.tsx`
      (depende de T017).
- [x] T019 [P] [US3] Teste de UI do formulário de Perfil em `apps/web/src/pages/Profile.test.tsx`
      (validações client-side, pré-carregamento, salvar parcial).
- [x] T020 [US3] Rebuildar e commitar o bundle serverless `apps/api/api/index.js`
      (`cd apps/api && npm run build`) após as mudanças de backend (depende de T012–T015).

**Checkpoint**: Perfil persistente e funcional ponta a ponta; item "Perfil" não é mais link quebrado.

---

## Phase 6: User Story 4 - Gráfico mais informativo (Priority: P2)

**Goal**: Tooltip de valor por ponto (hover desktop / toque mobile) e eixos X (3–6 marcas
adaptativas) e Y (unidade) mais legíveis, desktop e mobile.

**Independent Test**: No desktop, hover mostra valor+data; eixo X com 3–6 marcas sem
sobreposição nos três períodos; eixo Y com unidade; no mobile, toque exibe valor visível.

### Tests for User Story 4 ⚠️ (área de risco — Princípio VII)

- [x] T021 [P] [US4] Teste unitário da lógica de geração de marcas do eixo X (3–6, distribuídas,
      formato por período) e do mapeamento de ponto→valor do tooltip em
      `apps/web/src/components/TrendChart.test.tsx` (incluir 0/1/muitos pontos).

### Implementation for User Story 4

- [x] T022 [US4] Em `apps/web/src/components/TrendChart.tsx`: substituir os rótulos fixos do
      eixo X por 3–6 marcas adaptativas distribuídas uniformemente, com formato de data por período
      (dia/mês em 7D/30D; mês/ano em "Tudo" longo) e `textAnchor` ajustado nas bordas; acrescentar a
      unidade (kg/mmHg) ao eixo Y.
- [x] T023 [US4] Em `apps/web/src/components/TrendChart.tsx`: adicionar estado de "ponto ativo" e
      tooltip com valor + data, acionado por `mouseenter/leave` (desktop) e `click/touch` (mobile),
      com clamp para permanecer dentro da área visível.

**Checkpoint**: Gráfico legível e interativo em desktop e mobile.

---

## Phase 7: User Story 5 - Navegação mobile sem colisão (Priority: P2)

**Goal**: `BottomNav` com "Início" + botão de menu (três tracinhos) que abre as opções
secundárias; FABs de Adicionar totalmente clicáveis (sem sobreposição).

**Independent Test**: No mobile, barra com Início + menu (Admin role-gated, Histórico, Perfil);
botões Adicionar Peso/Pressão totalmente visíveis e clicáveis.

### Implementation for User Story 5

- [x] T024 [US5] Refatorar `apps/web/src/components/layout/BottomNav.tsx` para exibir "Início" +
      botão "Menu" (ícone `Menu`) que abre um `Sheet` (Radix) ancorado na base, listando os itens
      secundários a partir de `navItems` (Admin condicional ao papel; Histórico; Perfil); selecionar
      navega e fecha o sheet (depende de T002).
- [x] T025 [US5] Corrigir a sobreposição entre a `BottomNav` e os FABs de Adicionar em
      `apps/web/src/pages/Home.tsx` (e padding inferior do conteúdo em
      `apps/web/src/components/layout/AppShell.tsx`/`PageContainer.tsx`): ajustar `z-index` e
      espaçamento para os FABs ficarem acima da barra e totalmente clicáveis.
- [x] T026 [P] [US5] Atualizar `apps/web/src/components/layout/AppShell.test.tsx` se a estrutura
      de navegação testada mudar (presença do botão de menu mobile).

**Checkpoint**: Navegação mobile ergonômica e extensível, sem colisão de toque.

---

## Phase 8: User Story 6 - Modal de captura com teclado (Priority: P3)

**Goal**: No mobile, modal ancorado ao topo com o teclado aberto, mantendo "Alterar data",
"Cancelar" e "Salvar" visíveis; centralizado no desktop.

**Independent Test**: No mobile, abrir Adicionar Peso/Pressão com teclado aberto e ver todos os
controles sem fechar o teclado; no desktop, modal permanece centralizado.

### Implementation for User Story 6

- [x] T027 [US6] Ajustar `apps/web/src/components/ui/dialog.tsx` (DialogContent) para ancorar ao
      topo no mobile via classes responsivas (ex.: `top-4`/alinhamento ao topo) e centralizar a
      partir de `sm:`; garantir scroll interno sem cortar os botões de ação.
- [x] T028 [P] [US6] Confirmar/aplicar o posicionamento ao topo em
      `apps/web/src/components/WeightCaptureModal.tsx` e `apps/web/src/components/BPCaptureModal.tsx`
      (className quando necessário), preservando a abertura automática do teclado numérico.

**Checkpoint**: Modais legíveis com o teclado aberto no mobile.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Acessibilidade básica (FR-027–031, SC-008) e validação final, transversais às stories.

- [x] T029 [P] Adicionar nomes acessíveis (`aria-label`) ao botão de menu mobile (três tracinhos)
      em `apps/web/src/components/layout/BottomNav.tsx` e aos controles de interação do gráfico em
      `apps/web/src/components/TrendChart.tsx` (FR-027).
- [x] T030 [P] Garantir alvo de toque ≥44×44px na `BottomNav` e nos FABs de Adicionar
      (`apps/web/src/pages/Home.tsx`, `apps/web/src/components/layout/BottomNav.tsx`) (FR-029).
- [x] T031 Verificar operação por teclado e gestão de foco (foco inicial, `Esc`, retorno) no menu
      mobile (`Sheet`), modais de captura e tela de Perfil — ajustar onde os primitivos Radix não
      cobrirem (FR-028).
- [x] T032 [P] Garantir que o gráfico não dependa só de cor (legenda/rótulo sistólica×diastólica)
      nem só de hover para comunicar o valor, em `apps/web/src/components/TrendChart.tsx` (FR-030).
- [x] T033 Rodar lint, typecheck e a suíte de testes (`apps/web` e `apps/api`):
      `npm run lint`/`typecheck` e `npm test` em cada app.
- [x] T034 Executar a validação manual do `specs/005-ui-adjustments/quickstart.md` (cenários 1–7,
      incluindo a11y) em desktop e mobile.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências.
- **Foundational (Phase 2)**: depende do Setup; **bloqueia US2 e US5** (consumidores de `navItems`).
- **User Stories (Phases 3–8)**: dependem do Foundational (US2/US5) ou apenas do Setup (US1/US3/US4/US6).
- **Polish (Phase 9)**: depende das stories cujos elementos ela ajusta (US3, US4, US5, US6).

### User Story Dependencies

- **US1 (P1, Ícone)**: independente — só Setup.
- **US2 (P1, Cabeçalho/menu)**: depende de T002 (navItems). Edita `Home.tsx` (compartilha arquivo com US5/T025).
- **US3 (P1, Perfil)**: independente das demais; cadeia interna shared→schema→migration→service→route→app→bundle e web service→page→route.
- **US4 (P2, Gráfico)**: independente — toca apenas `TrendChart.tsx`.
- **US5 (P2, Nav mobile)**: depende de T002 (navItems). Edita `Home.tsx`/`AppShell` (coordenar com US2/T006).
- **US6 (P3, Modal)**: independente — toca `dialog.tsx` e os modais.

### Within Each User Story

- Tests de risco (US3/US4) antes da implementação correspondente.
- Backend: shared schema → schema DB → migração → service → route → mount → bundle.
- Frontend: service/hooks → página/componente → rota.

### Parallel Opportunities

- US1, US3, US4 e US6 podem ser desenvolvidas em paralelo (arquivos distintos) após o Foundational.
- US2 e US5 compartilham `Home.tsx` (T006 × T025) e a base `navItems` — sequenciar essas edições.
- Tasks marcadas `[P]` dentro da mesma fase tocam arquivos diferentes e podem rodar juntas.

---

## Parallel Example: User Story 3

```bash
# Após o Foundational, em paralelo (arquivos distintos):
Task T009: "Testes de profile.service em apps/api/src/profile/profile.test.ts"
Task T010: "profileInputSchema em packages/shared/src/profile.ts"
Task T011: "Tabela userProfiles em apps/api/src/db/schema.ts"
Task T016: "Hooks useProfile/useUpdateProfile em apps/web/src/services/api.ts"
```

---

## Implementation Strategy

### MVP First (User Stories P1)

1. Phase 1 (Setup) + Phase 2 (Foundational).
2. US1 (Ícone) → US2 (Cabeçalho/menu) → US3 (Perfil) — as três stories P1 formam o MVP.
3. **VALIDAR** cada uma independentemente (quickstart cenários 1–3).
4. Deploy/demo do MVP.

### Incremental Delivery

1. Setup + Foundational → base pronta.
2. US1 → testar → demo (ícone instalável).
3. US2 → testar → demo (cabeçalho limpo).
4. US3 → testar → demo (Perfil) — **lembrar do rebuild do bundle `api/index.js` (T020)**.
5. US4 → US5 → US6 (P2/P3) incrementais.
6. Polish (a11y + validação final).

### Notas operacionais

- Backend alterado (US3) exige **rebuild + commit** de `apps/api/api/index.js` (T020) e a
  migração aplicada via `npm run db:migrate` (mecânica de deploy do VITA).
- Não regenerar o lockfile no Windows sem necessidade (compatibilidade com `npm ci` do CI Linux).
- Não logar valores de perfil (dados pessoais — Princípio II).

---

## Notes

- [P] = arquivos diferentes, sem dependências pendentes.
- [Story] mapeia a task à user story para rastreabilidade.
- Cada user story é completável e testável de forma independente.
- Commit após cada task ou grupo lógico.
