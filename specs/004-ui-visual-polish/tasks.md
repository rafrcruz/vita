---
description: "Task list — Polimento Visual da Aplicação (UI/UX)"
---

# Tasks: Polimento Visual da Aplicação (UI/UX)

**Input**: Design documents from `specs/004-ui-visual-polish/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Esta é uma iniciativa de UI/UX. Não há novas funcionalidades a testar via TDD. O risco
central é **regressão**, então as tarefas de verificação usam a suíte Vitest existente (sem alterar
lógica de teste) + `vitest-axe` + inspeção visual (Princípio VII / FR-004 / SC-001).

**Organization**: Tarefas agrupadas por user story (P1→P4). Vários arquivos de tela são tocados em
mais de uma fase (concerns diferentes). Regra: tarefas em arquivos diferentes podem ser `[P]`;
tarefas no **mesmo arquivo em fases diferentes** são sequenciais (não marcar `[P]` entre fases).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos distintos, sem dependência pendente)
- **[Story]**: a qual user story a tarefa pertence (US1–US4)

## Path Conventions

- Frontend único: `apps/web/` (backend `apps/api/` **não é tocado**)

---

## Phase 1: Setup (Baseline e Guardrails de Não-Regressão)

**Purpose**: fixar a linha de base funcional/visual antes de qualquer mudança.

- [X] T001 Rodar baseline funcional: `npm run -w @vita/web typecheck` e `npm run -w @vita/web test` e registrar que estão verdes (estado de partida para SC-001)
- [X] T002 [P] Registrar baseline de auditoria de tokens com ripgrep (`text-red-|bg-red-|border-gray-|#[0-9a-fA-F]{3,6}|rgb\(|font-black|text-5xl|shadow-2xl|shadow-none`) sobre `apps/web/src`, anotando as ocorrências atuais
- [ ] T003 [P] Capturar screenshots de referência (antes) de Login, Home, History, AdminAllowlist, StyleGuide e modais de captura, em tema claro e escuro, nas larguras ~390/768/1920/3440 (base para comparação de SC-010) — **manual (sem navegador neste ambiente); pendente**

---

## Phase 2: Foundational (Escalas de Tokens — BLOQUEIA todas as stories)

**Purpose**: definir o vocabulário visual refinado do qual todas as stories dependem.

**⚠️ CRITICAL**: nenhuma story pode começar antes desta fase.

- [X] T004 Adicionar escala de elevação nomeada (níveis 0–4: superfície→cartão→cartão elevado→popover/menu→modal) em `theme.extend.boxShadow` de `apps/web/tailwind.config.ts` (ver data-model.md §3)
- [X] T005 Formalizar tokens de raio (`sm/md/lg/full`) e tokens tipográficos auxiliares (line-height/letter-spacing) em `apps/web/tailwind.config.ts` (mesmo arquivo de T004 → sequencial)
- [X] T006 Adicionar tokens de movimento — `transitionDuration` (rápida ~120 ms, padrão ~160 ms, máx ~200 ms) e `transitionTimingFunction` (easing padrão único) — em `apps/web/tailwind.config.ts`, para padronizar microinterações (resolve FR-017/SC-008; ver data-model.md §7.1) (mesmo arquivo de T004/T005 → sequencial)
- [X] T007 Definir papéis tipográficos explícitos, estilo global de foco (`ring`) e de seleção, e aplicar ajustes finos de HSL para qualquer lacuna de contraste WCAG AA nos dois temas em `apps/web/src/index.css` (ver data-model.md §1, §4; contracts/design-tokens.md)

**Checkpoint**: tokens prontos (cor, raio, elevação, tipografia, movimento) — stories podem iniciar.

---

## Phase 3: User Story 1 - Consistência visual global e tokens uniformizados (Priority: P1) 🎯 MVP

**Goal**: toda a interface usa exclusivamente tokens (cor, raio, borda, sombra); componentes do
mesmo tipo ficam idênticos entre telas.

**Independent Test**: percorrer telas + StyleGuide nos dois temas; confirmar que não há valores
cravados divergentes e que cartões/badges/inputs/tabelas/modais/alerts/toasts são idênticos entre
telas (SC-002, SC-003).

- [X] T008 [P] [US1] Substituir cor cravada `text-red-500` por `text-destructive` e harmonizar realces de ícone via tokens em `apps/web/src/pages/History.tsx`
- [X] T009 [P] [US1] Trocar `<input type="checkbox">` nativo (com `border-gray-300`) pelo componente `Checkbox` em `apps/web/src/components/WeightCaptureModal.tsx`
- [X] T010 [P] [US1] Aplicar o mesmo ajuste de checkbox/tokens em `apps/web/src/components/BPCaptureModal.tsx`
- [X] T011 [P] [US1] Aplicar escala de elevação (nível 1), raio `lg` e padding consistente em `apps/web/src/components/ui/card.tsx`
- [X] T012 [P] [US1] Aplicar elevação nível 3 + raio/borda por token em `apps/web/src/components/ui/dropdown-menu.tsx`
- [X] T013 [P] [US1] Aplicar elevação nível 3 + raio/borda por token em `apps/web/src/components/ui/select.tsx`
- [X] T014 [P] [US1] Aplicar elevação nível 3 + raio/borda por token em `apps/web/src/components/ui/tooltip.tsx`
- [X] T015 [P] [US1] Aplicar elevação nível 4 + raio por token em `apps/web/src/components/ui/dialog.tsx`
- [X] T016 [P] [US1] Aplicar elevação nível 4 + raio por token em `apps/web/src/components/ui/sheet.tsx`
- [X] T017 [P] [US1] Usar tokens `chart-*`/semânticos (remover quaisquer cores literais) em `apps/web/src/components/TrendChart.tsx`
- [X] T018 [P] [US1] Polir `apps/web/src/components/feedback/Alert.tsx` para usar cores semânticas via token, ícone e tipografia consistentes (corrige G2; usado em Login/Admin/StyleGuide)
- [X] T019 [P] [US1] Alinhar os toasts às cores semânticas dos tokens: reavaliar `richColors` do `<Toaster>` em `apps/web/src/App.tsx` (e helpers em `apps/web/src/lib/toast.ts`) para que sucesso/erro/info usem a paleta do design system, não a do `sonner` (corrige G1; FR-008/US2 AS6)
- [X] T020 [US1] Varredura de tokens nos demais componentes de UI (`badge`, `skeleton`, `spinner`, `label`, `form`, `table`, `input`, `textarea`, `switch`, `radio-group`) garantindo cor/raio/borda apenas via token em `apps/web/src/components/ui/`
- [X] T021 [US1] Remover sombras/cores ad hoc (`shadow-2xl`, realces avulsos) em favor de tokens/elevação em `apps/web/src/pages/Home.tsx` (estados e espaçamento ficam para US2/US3)
- [X] T022 [US1] Re-rodar a auditoria ripgrep (T002) e confirmar 0 valores cravados divergentes (SC-002) sobre `apps/web/src`

**Checkpoint**: coesão de tokens entregue — aplicação já parece consistente.

---

## Phase 4: User Story 2 - Estados visuais e microinterações consistentes (Priority: P2)

**Goal**: hover, focus, active/press, selected, disabled e loading padronizados em todos os
interativos, com transições discretas (usando os tokens de movimento) e `prefers-reduced-motion`
respeitado.

**Independent Test**: percorrer o StyleGuide e as telas exercitando cada estado por mouse e teclado;
confirmar foco visível consistente e feedback discreto igual entre equivalentes, com transições
dentro do intervalo de duração tokenizado (SC-004, SC-005, SC-008; contracts/visual-states.md).

- [ ] T023 [P] [US2] Padronizar hover/focus-visible/active/disabled (sem `scale` exagerado, usando tokens de duração/easing) em `apps/web/src/components/ui/button.tsx`
- [ ] T024 [P] [US2] Padronizar foco/disabled e contraste de placeholder em `apps/web/src/components/ui/input.tsx`
- [ ] T025 [P] [US2] Padronizar foco/disabled em `apps/web/src/components/ui/textarea.tsx`
- [ ] T026 [P] [US2] Padronizar checked/focus/disabled em `apps/web/src/components/ui/checkbox.tsx`
- [ ] T027 [P] [US2] Padronizar checked/focus/disabled em `apps/web/src/components/ui/radio-group.tsx`
- [ ] T028 [P] [US2] Padronizar checked/focus/disabled em `apps/web/src/components/ui/switch.tsx`
- [ ] T029 [P] [US2] Padronizar hover/selected de linhas em `apps/web/src/components/ui/table.tsx`
- [ ] T030 [P] [US2] Padronizar estados selected/hover/focus em `apps/web/src/components/layout/SidebarNav.tsx`
- [ ] T031 [P] [US2] Padronizar estados selected/hover/focus em `apps/web/src/components/layout/NavRail.tsx`
- [ ] T032 [P] [US2] Padronizar estados selected/hover/focus em `apps/web/src/components/layout/BottomNav.tsx`
- [ ] T033 [US2] Substituir o FAB manual e os `<button>` crus por `Button`/`IconButton`; padronizar estados do seletor de métrica e do filtro de tempo (selected/hover/focus) usando os tokens de movimento em `apps/web/src/pages/Home.tsx`
- [ ] T034 [US2] Padronizar estados do seletor de abas, dos icon-buttons de ação e do hover de item de lista em `apps/web/src/pages/History.tsx`
- [ ] T035 [US2] Verificar foco por teclado em todos os interativos (incl. nav, FAB, seletores, checkbox), transições dentro do intervalo tokenizado (~120–200 ms) e redução de movimento sob `prefers-reduced-motion` (SC-005, SC-008) em `apps/web`

**Checkpoint**: estados e microinterações consistentes em toda a aplicação.

---

## Phase 5: User Story 3 - Layout, espaçamento e responsividade refinados (Priority: P3)

**Goal**: ritmo de espaçamento consistente, alinhamentos precisos e aproveitamento de espaço
adequado a cada formato (mobile→ultrawide), sem quebras nem rolagem horizontal indevida.

**Independent Test**: inspecionar cada tela em ~390/768/1920/3440 (e 320px, zoom 200%), incluindo
conteúdo extremo; confirmar ausência de quebras/rolagem horizontal, navegação por formato preservada
e bom uso do espaço em ultrawide (SC-007; data-model.md §5–§6).

- [ ] T036 [US3] Ajustar largura/aproveitamento por formato (incl. `3xl`/`4xl` para ultrawide) preservando largura de leitura confortável em `apps/web/src/components/layout/PageContainer.tsx`
- [ ] T037 [US3] Ajustar ritmo de espaçamento e reconciliar o `pb` com o FAB revisado em `apps/web/src/components/layout/AppShell.tsx`
- [ ] T038 [US3] Substituir espaçamentos ad hoc (`mt-2/4/6`, `pb-24`) por ritmo consistente e layout responsivo para telas largas em `apps/web/src/pages/Home.tsx`
- [ ] T039 [P] [US3] Padronizar espaçamento/ritmo e layout responsivo da lista em `apps/web/src/pages/History.tsx`
- [ ] T040 [P] [US3] Padronizar espaçamento e responsividade de tabela/formulário em `apps/web/src/pages/AdminAllowlist.tsx`
- [ ] T041 [P] [US3] Polir espaçamento/centralização do cartão de login em `apps/web/src/pages/Login.tsx`
- [ ] T042 [US3] Verificar 4 larguras de referência + 320px + zoom 200% **e conteúdo extremo** (textos/rótulos longos, números grandes, listas vazias e muito grandes): 0 quebras, 0 vazamentos e 0 rolagem horizontal indevida (SC-007, FR-022, Edge Cases) em `apps/web`

**Checkpoint**: layout e responsividade refinados em todos os formatos, inclusive sob conteúdo extremo.

---

## Phase 6: User Story 4 - Acabamento de conteúdo: tipografia, formulários, textos, placeholders e ícones (Priority: P4)

**Goal**: hierarquia tipográfica clara, formulários visualmente consistentes, placeholders legíveis,
ícones uniformes e estados de conteúdo (vazio/carregando/erro) acabados — sem alterar validações.

**Independent Test**: revisar telas e formulários confirmando papéis tipográficos consistentes,
tratamento visual uniforme de label/placeholder/ajuda/erro (sem mudar validações), ícones uniformes
e StyleGuide refletindo tudo, incluindo alerts, toasts e tokens de movimento (SC-009, SC-010;
contracts/component-polish.md).

- [ ] T043 [US4] Aplicar o papel tipográfico "display" ao número de destaque (remover `font-black`) em `apps/web/src/pages/Home.tsx`
- [ ] T044 [P] [US4] Aplicar o papel "display" e tipografia consistente nos itens de lista em `apps/web/src/pages/History.tsx`
- [ ] T045 [P] [US4] Tornar o `CardTitle` flexível ao contexto (não fixo em `text-2xl`) em `apps/web/src/components/ui/card.tsx`
- [ ] T046 [P] [US4] Padronizar tratamento visual de label/placeholder/ajuda/erro (sem mudar validações/parse/foco) em `apps/web/src/components/WeightCaptureModal.tsx`
- [ ] T047 [P] [US4] Idem em `apps/web/src/components/BPCaptureModal.tsx`
- [ ] T048 [P] [US4] Confirmar contraste/consistência de placeholder (`placeholder:text-muted-foreground` em AA) em `apps/web/src/components/ui/input.tsx`
- [ ] T049 [US4] Substituir o estado vazio em `<div>` solto pelo componente `EmptyState` e harmonizar `ErrorState`/`LoadingState` em `apps/web/src/pages/History.tsx`
- [ ] T050 [P] [US4] Passada de consistência de ícones (tamanho/peso/alinhamento lucide) nas telas e no shell em `apps/web/src/pages/` e `apps/web/src/components/layout/`
- [ ] T051 [US4] Atualizar o guia visual para refletir tokens/escalas/estados refinados nos dois temas — incluindo elevação, movimento, `Alert` e toasts — em `apps/web/src/pages/StyleGuide.tsx` (SC-009, SC-010)

**Checkpoint**: acabamento de conteúdo concluído; StyleGuide atualizado.

---

## Phase 7: Polish & Validação Cruzada (Não-Regressão)

**Purpose**: confirmar zero regressão funcional/visual e fechar os critérios de sucesso.

- [ ] T052 Rodar `npm run -w @vita/web typecheck` e `npm run -w @vita/web test` — suíte verde sem alterar lógica de teste por motivo funcional (SC-001)
- [ ] T053 Rodar `vitest-axe`: 0 novas violações A/AA e contraste AA preservado nos dois temas (SC-005, SC-006)
- [ ] T054 [P] Re-rodar a auditoria ripgrep de tokens: 0 valores cravados divergentes em `apps/web/src` (SC-002)
- [ ] T055 [P] Comparação visual antes/depois (T003) preenchendo um checklist objetivo por área (cores, tipografia, bordas, raios, sombras, espaçamento, responsividade, componentes, estados, microinterações, formulários, placeholders, textos, ícones) — cada área marcada "igual ou superior", sem regressão (SC-010; torna SC-010 verificável via checklist)
- [ ] T056 Executar o roteiro completo de `specs/004-ui-visual-polish/quickstart.md` ponta a ponta

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências.
- **Foundational (Phase 2)**: depende do Setup — **BLOQUEIA** todas as stories (todas usam os tokens refinados de cor, raio, elevação, tipografia e movimento).
- **US1 (Phase 3)**: depende da Foundational. É o MVP de coesão.
- **US2 (Phase 4)**: depende da Foundational; recomendado após US1 (estados usam tokens/elevação/movimento aplicados). Independentemente testável.
- **US3 (Phase 5)**: depende da Foundational; toca espaçamento/responsividade. Independentemente testável.
- **US4 (Phase 6)**: depende da Foundational; acabamento fino, naturalmente por último.
- **Polish (Phase 7)**: depende das stories desejadas concluídas.

### Same-file ordering (importante)

`Home.tsx` é tocado em T021(US1)→T033(US2)→T038(US3)→T043(US4); `History.tsx` em
T008→T034→T039→T044→T049; `card.tsx` em T011(US1)→T045(US4); `input.tsx` em T024(US2)→T048(US4).
Essas sequências são **ordenadas por fase** (não paralelizáveis entre si), embora cada fase trate de
um concern distinto.

### Within Each User Story

- Tarefas em arquivos distintos marcadas `[P]` podem rodar juntas.
- A tarefa de verificação de cada story (T022, T035, T042, T051) vem por último na fase.

### Parallel Opportunities

- Phase 1: T002, T003 em paralelo.
- Phase 3 (US1): T008–T019 são todas `[P]` (arquivos distintos, incl. Alert e Toaster); T020 e T021 depois; T022 fecha.
- Phase 4 (US2): T023–T032 são `[P]` (componentes distintos); T033/T034 (telas) depois; T035 fecha.
- Phase 5 (US3): T039–T041 `[P]`; T036–T038 tocam layout/Home; T042 fecha.
- Phase 6 (US4): T044–T048, T050 `[P]`; T043/T049/T051 conforme arquivo.
- Phase 7: T054, T055 `[P]`.

---

## Parallel Example: User Story 1

```bash
# Componentes/telas em arquivos distintos — rodam em paralelo:
Task T008: text-red-500 → destructive em pages/History.tsx
Task T009: checkbox nativo → Checkbox em components/WeightCaptureModal.tsx
Task T011: elevação/raio em components/ui/card.tsx
Task T018: cores semânticas em components/feedback/Alert.tsx
Task T019: toasts → tokens semânticos em App.tsx / lib/toast.ts
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 (Setup/baseline) → 2. Phase 2 (Foundational/tokens) → 3. Phase 3 (US1).
4. **PARAR e VALIDAR**: coesão de tokens nas telas/StyleGuide nos dois temas (SC-002/SC-003) e suíte verde.
5. Esse incremento já entrega o maior salto de qualidade percebida.

### Incremental Delivery

1. Setup + Foundational → base pronta.
2. US1 → validar → (coesão visual) MVP.
3. US2 → validar → (estados/microinterações).
4. US3 → validar → (layout/responsividade).
5. US4 → validar → (acabamento de conteúdo + StyleGuide).
6. Phase 7 → não-regressão final.

Cada incremento preserva 100% do comportamento; a suíte existente é o guardrail entre fases.

---

## Notes

- `[P]` = arquivos distintos, sem dependência pendente.
- Invariante em TODAS as tarefas: nenhuma mudança de API, dados, validações, rotas, permissões,
  integrações, arquitetura ou comportamento (FR-001–FR-005). `window.confirm()` de exclusão e
  controles `datetime-local` nativos permanecem como estão (research.md D7).
- Não criar componentes inexistentes (accordion, date picker, calendário, autocomplete, search field).
- Se um teste existente quebrar por seletor de texto/role, ajustar o polimento — **não** relaxar o teste.
- Commit ao fim de cada tarefa ou grupo lógico; parar em qualquer checkpoint para validar.
