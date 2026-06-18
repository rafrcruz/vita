---
description: "Task list — Auditoria Técnica de Produção (Modo Conservador)"
---

# Tasks: Auditoria Técnica de Produção (Modo Conservador)

**Input**: Design documents from `/specs/009-production-tech-audit/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Esta feature é uma auditoria. Ela **não escreve novos testes de produto** como
entregável — ela *avalia* a suíte existente (Princípio VII, orientado a risco) e a utiliza
como **baseline** e **gate de não-regressão**. Por isso não há seção TDD; a execução de
testes aparece como baseline (Fase 2) e verificação de regressão (US3 e Polish). Testes de
caracterização só seriam adicionados se classificados `SAFE_TO_APPLY` (research D2).

**Organization**: Tarefas agrupadas pelas 3 user stories da spec (= 3 fases da auditoria).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: US1 (Relatório), US2 (Plano), US3 (Aplicação)
- Caminhos de arquivo são absolutos a partir da raiz do repo `c:\projects\vita`.

## Convenções desta auditoria

- **Diretório de entregáveis**: `specs/009-production-tech-audit/audit/`
- **IDs de achado**: `F-<DIM>-NNN`; **IDs de item de plano**: `P-<DIM>-NNN` (ver data-model.md)
- **Regra-mestre**: incerteza ⇒ `REQUIRES_REVIEW`; "em caso de dúvida, não altere".
- **Mecânica de deploy**: ao alterar `apps/api/src/**`, rebuildar e commitar o bundle
  `apps/api/api/index.js` no mesmo PR (senão a mudança não chega à produção).

---

## Phase 1: Setup (Infraestrutura compartilhada da auditoria)

**Purpose**: Preparar área de trabalho e esqueletos dos entregáveis. Nenhuma alteração de código de produto.

- [x] T001 Criar diretórios de saída `specs/009-production-tech-audit/audit/` e `specs/009-production-tech-audit/audit/findings/`
- [x] T002 [P] Criar os 5 esqueletos de entregável conforme `specs/009-production-tech-audit/contracts/` em `specs/009-production-tech-audit/audit/`: `audit-report.md`, `improvement-plan.md`, `applied-changes.md`, `deferred-improvements.md`, `release-notes.md` (somente cabeçalhos/seções vazias do contrato)
- [x] T003 [P] Verificar toolchain: Node 22.x conforme `.nvmrc` e `npm ci` limpo a partir da raiz `c:\projects\vita` — **NÃO regenerar `package-lock.json` no Windows** (risco cross-platform, research D11)

---

## Phase 2: Foundational (Pré-requisitos bloqueantes)

**Purpose**: Estabelecer o baseline objetivo — a régua de não-regressão de toda a Fase 3 e a §0 do relatório.

**⚠️ CRITICAL**: Nenhum trabalho de US1/US3 que dependa de baseline deve começar antes disto.

- [x] T004 Capturar baseline completo e gravar saídas brutas em `specs/009-production-tech-audit/audit/baseline.md`: executar a partir da raiz `npm run lint`, `npm run typecheck`, `npm test` (anotar testes passando/falhando), `npm run test:coverage` (cobertura V8), `npm audit` (severidades) e `npm run build` (anotar tamanho do bundle web do Vite e do bundle esbuild `apps/api/api/index.js`)
- [x] T005 Registrar em `specs/009-production-tech-audit/audit/baseline.md` as ferramentas read-only disponíveis para detecção de código morto/grafo (`npx knip`, `npx ts-prune`, `npx dependency-cruiser` — modo somente-relatório, sem versionar dependências) e as convenções de ID de achado/item

**Checkpoint**: Baseline registrado — auditoria por dimensão e gate de regressão habilitados.

---

## Phase 3: User Story 1 — Relatório de Auditoria Técnica Completo (Priority: P1) 🎯 MVP

**Goal**: Produzir `audit/audit-report.md` cobrindo as 10 dimensões obrigatórias, somente leitura, sem alterar nenhum arquivo de produto.

**Independent Test**: O relatório existe, possui as 10 seções de dimensão (com achados ou "Sem achados relevantes"), todo achado tem `id` + `location` rastreável, e `git status` mostra zero alterações em código de produto durante esta fase.

> Cada dimensão escreve seu próprio arquivo em `audit/findings/` ⇒ tarefas T006–T015 são `[P]`.
> Nenhuma destas tarefas modifica código de produto.

### Implementation for User Story 1

- [x] T006 [P] [US1] **Arquitetura** → `specs/009-production-tech-audit/audit/findings/01-arquitetura.md`: avaliar estrutura de pastas, organização de módulos e acoplamento em `apps/api/src/`, `apps/web/src/`, `packages/shared/src/`; detectar dependências circulares e duplicação; checar aderência ao Princípio V (simplicidade)
- [x] T007 [P] [US1] **Backend** → `specs/009-production-tech-audit/audit/findings/02-backend.md`: ordem do middleware stack em `apps/api/src/middleware/`, config de Helmet/CORS/`csurf`/`express-rate-limit`/compressão, handler global de erros, `pino`/`pino-http`, timeouts/retry de Google/Neon; Drizzle em `apps/api/src/db/` — queries em loop (N+1), índices, raw SQL
- [x] T008 [P] [US1] **Frontend** → `specs/009-production-tech-audit/audit/findings/03-frontend.md`: bundle/code splitting/tree shaking (saída de `npm run build`), `React.lazy`/dynamic imports, re-renders e memoização (gráficos `recharts`, listas) em `apps/web/src/`, componentes/hooks/rotas potencialmente mortos, assets em `apps/web/public/`
- [x] T009 [P] [US1] **Qualidade de Código** → `specs/009-production-tech-audit/audit/findings/04-qualidade.md`: imports/variáveis não usados (ESLint+`tsc`), exports/arquivos órfãos (`npx knip`/`ts-prune`, somente relatório), código comentado antigo e TODOs esquecidos em `apps/**/src/` e `packages/shared/src/` — marcar uso dinâmico/lazy/reflexão como suspeita a confirmar (D7)
- [x] T010 [P] [US1] **Testes** → `specs/009-production-tech-audit/audit/findings/05-testes.md`: avaliar cobertura **por risco** (auth, allowlist, cálculos/agregações de health metrics, validações Zod) e não por % (Princípio VII); identificar testes frágeis/redundantes, lacunas críticas e qualidade dos mocks em `apps/**/src/**/*.test.ts` e `apps/web/src/test/`
- [x] T011 [P] [US1] **Observabilidade** → `specs/009-production-tech-audit/audit/findings/06-observabilidade.md`: config de `@sentry/node` e `@sentry/react`, redação de campos sensíveis no `pino` em `apps/api/src/observability/`, exceções não capturadas, erros silenciosos e promises sem `.catch`; checar que dados de saúde não vão a logs (Princípio II)
- [x] T012 [P] [US1] **Segurança** → `specs/009-production-tech-audit/audit/findings/07-seguranca.md`: triagem de `npm audit`; busca por secrets versionados (referenciar **por localização**, nunca transcrever); XSS/CSRF(`csurf`)/SSRF/Open Redirect/SQLi (Drizzle parametriza — checar raw SQL); uploads; auth Google + allowlist em `apps/api/src/auth/` e `apps/api/src/allowlist/` (Princípios II e III); reaproveitar achados do CodeQL (`.github/workflows/codeql.yml`)
- [x] T013 [P] [US1] **Performance** → `specs/009-production-tech-audit/audit/findings/08-performance.md`: consultas lentas/N+1 (cross-ref T007), tamanho de bundle (cross-ref T008), requisições redundantes e cache do TanStack Query em `apps/web/src/services/`, memoização e renderizações desnecessárias, assets pesados/imagens não otimizadas (`sharp`)
- [x] T014 [P] [US1] **Documentação** → `specs/009-production-tech-audit/audit/findings/09-documentacao.md`: consistência entre `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/*.md`, `specs/00x/*` e OpenAPI (gerado por zod-to-openapi) versus o código real — registrar a divergência conhecida "Prisma vs Drizzle" (research D10) e quaisquer scripts/comandos desatualizados
- [x] T015 [P] [US1] **DevEx** → `specs/009-production-tech-audit/audit/findings/10-devex.md`: scripts npm (raiz e workspaces), `.github/workflows/ci.yml` e `codeql.yml`, ESLint flat config (`eslint.config.js`), Prettier (`.prettierrc`), presença de Husky/commit conventions, processo de release e versionamento (semver, versão atual `0.1.0`)
- [x] T016 [US1] Consolidar T006–T015 em `specs/009-production-tech-audit/audit/audit-report.md` conforme `contracts/audit-report.contract.md`: embutir/referenciar `baseline.md` na §0, 10 seções de dimensão (marcar explicitamente "Sem achados relevantes" onde aplicável) e apêndice "índice de achados" (id → dimensão → severidade prévia); **ao final, verificar `git status --porcelain` e confirmar que não há alterações fora de `specs/009-production-tech-audit/audit/`** (assere FR-013 — Fase 1 somente leitura)

**Checkpoint**: Relatório de auditoria completo e independente (Entregável 1). MVP entregável. **Verificação**: `git status` mostra zero alterações em código de produto (somente arquivos sob `specs/009-production-tech-audit/audit/`).

---

## Phase 4: User Story 2 — Plano de Melhorias Classificado e Priorizado (Priority: P2)

**Goal**: Produzir `audit/improvement-plan.md` transformando cada achado em item de plano classificado por severidade e aplicabilidade. Nenhuma alteração de código.

**Independent Test**: Existe uma tabela onde cada achado aparece ≥1 vez com as 5 colunas preenchidas + 1 severidade + 1 aplicabilidade; nenhum item sem classificação; `git status` mostra zero alterações em código de produto.

> Todas as tarefas escrevem o mesmo arquivo `improvement-plan.md` ⇒ sequenciais (sem `[P]`). Dependem de T016.

### Implementation for User Story 2

- [x] T017 [US2] Transformar cada achado de `audit-report.md` em ≥1 item de plano e montar a tabela (`ID | Achados | Problema | Impacto | Risco | Esforço | Recomendação | Severidade | Aplicabilidade`) em `specs/009-production-tech-audit/audit/improvement-plan.md` conforme `contracts/improvement-plan.contract.md` (FR-014)
- [x] T018 [US2] Atribuir **severidade** (CRITICO/ALTO/MEDIO/BAIXO) a cada item por impacto × probabilidade (research D3), em `specs/009-production-tech-audit/audit/improvement-plan.md` (FR-015)
- [x] T019 [US2] Atribuir **aplicabilidade** aplicando a rubrica de 6 critérios (research D2) em `specs/009-production-tech-audit/audit/improvement-plan.md`: marcar `REQUIRES_REVIEW` todo item que altere comportamento/API/contrato/esquema de banco, troque/adicione/remova dependência (exceto `patch` seguro), ou implique refactor/arquitetura; incerteza ⇒ `REQUIRES_REVIEW` (FR-016, FR-017, FR-018)
- [x] T020 [US2] Adicionar seções de resumo (contagem por severidade e por aplicabilidade) e a **fila de execução proposta** agrupando `SAFE_TO_APPLY` em PRs temáticos em `specs/009-production-tech-audit/audit/improvement-plan.md`; validar 100% dos achados representados e zero célula/rótulo vazio; **ao final, verificar `git status --porcelain` e confirmar que não há alterações fora de `specs/009-production-tech-audit/audit/`** (assere FR-019 — Fase 2 não aplica mudanças)

**Checkpoint**: Plano classificado e priorizado completo (Entregável 2). Nenhuma mudança aplicada. **Verificação**: `git status` mostra zero alterações em código de produto.

---

## Phase 5: User Story 3 — Aplicação Apenas das Melhorias Seguras (Priority: P3)

**Goal**: Aplicar **apenas** itens `SAFE_TO_APPLY` em PRs pequenos e temáticos, registrar tudo arquivo-por-arquivo, listar o que ficou de fora e gerar release notes — preservando 100% do comportamento.

**Independent Test**: Cada alteração em `applied-changes.md` rastreia a um item `SAFE_TO_APPLY`; `npm run lint && npm run typecheck && npm test && npm run build` ≥ baseline (sem novas falhas); zero mudança em API/contratos/esquema de banco; `deferred-improvements.md` lista os não aplicados com motivo/risco/recomendação.

> Cada PR temático é aplicado, revalidado contra `baseline.md` e registrado em `applied-changes.md`. Sequenciais (mesmos arquivos potencialmente sobrepostos; revertíveis isoladamente). Cada tarefa é **condicional**: só executa se o plano contiver itens `SAFE_TO_APPLY` daquela categoria. Dependem de T020.

### Implementation for User Story 3

- [x] T021 [US3] _(sem itens SAFE_TO_APPLY — lint limpo, nada a remover)_ PR temático **imports/variáveis não utilizados**: remover os confirmados em `apps/api/src/`, `apps/web/src/`, `packages/shared/src/`; revalidar contra `baseline.md`; registrar em `specs/009-production-tech-audit/audit/applied-changes.md` (rastreio ao `P-*`, arquivos, neutralidade, baseline) (FR-020, FR-021, FR-028)
- [x] T022 [US3] _(sem código morto confirmado seguro)_ PR temático **código morto confirmado**: remover funções/componentes/rotas/exports comprovadamente não usados (confirmação manual obrigatória — nada com uso dinâmico/lazy/reflexão; senão permanece `REQUIRES_REVIEW`); revalidar; registrar em `applied-changes.md` (FR-023 — não remover funcionalidade sem confirmação)
- [x] T023 [US3] _(coberto pelo PR docs: comentário "ESLint 10")_ PR temático **ajustes de lint sem efeito semântico**: aplicar correções de ESLint/Prettier que não alterem comportamento (sem reordenar efeitos colaterais nem mudar coerção); revalidar; registrar em `applied-changes.md`
- [x] T024 [US3] _(sem itens SAFE — exigiria tocar apps/api/src e rebuild do bundle)_ PR temático **logs / tratamento de erros / observabilidade**: melhorar mensagens de log e captura de erros sem alterar fluxo em `apps/api/src/observability/` e demais módulos; **se tocar `apps/api/src/**`, rebuildar e commitar `apps/api/api/index.js` no mesmo PR**; revalidar; registrar em `applied-changes.md`
- [x] T025 [US3] **APLICADO** (README, AGENTS.md, eslint comment) — PR temático **correções de documentação**: corrigir divergências factuais em `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/*.md` e anotações OpenAPI (ex.: Prisma → Drizzle) sem alterar comportamento; registrar em `applied-changes.md` (FR-030)
- [x] T026 [US3] _(sem itens SAFE — perf = code splitting/índice, ambos REQUIRES_REVIEW)_ PR temático **pequenas otimizações de performance comprovadamente neutras** (ex.: memoização localizada, remoção de requisição redundante) — apenas se houver item `SAFE_TO_APPLY`; **se tocar backend, rebuildar `apps/api/api/index.js`**; revalidar contra `baseline.md`; registrar em `applied-changes.md`
- [x] T027 [US3] Escrever `specs/009-production-tech-audit/audit/deferred-improvements.md` conforme `contracts/deferred-improvements.contract.md`: todo item `REQUIRES_REVIEW` (e qualquer `SAFE_TO_APPLY` não aplicado) com motivo/risco/recomendação futura; destacar itens de segurança CRÍTICO/ALTO e os que exigem confirmação explícita do mantenedor (FR-029, FR-023)
- [x] T028 [US3] Escrever `specs/009-production-tech-audit/audit/release-notes.md` conforme `contracts/release-notes.contract.md`: bump **PATCH** `0.1.0 → 0.1.1`, listar PRs/alterações aplicadas e a nota de compatibilidade (sem breaking change, sem mudança de API/contratos/esquema de banco) (FR-031)
- [x] T029 [US3] ✅ **APLICADO** (confirmado pelo mantenedor) — bump `0.1.0 → 0.1.1` via `npm version --no-git-tag-version --include-workspace-root --workspaces`; diff cirúrgico (5 campos `version`; lockfile sem re-resolução). **Condicional** — executar **somente se** ≥1 alteração `SAFE_TO_APPLY` foi efetivamente aplicada (T021–T026): aplicar o bump PATCH `0.1.0 → 0.1.1` ao campo `version` de `package.json` (raiz), `apps/api/package.json`, `apps/web/package.json`, `packages/shared/package.json` e aos campos `version` correspondentes em `package-lock.json`, **sem regenerar o lockfile** (preservar integridade cross-platform — research D11); revalidar contra `baseline.md`; registrar em `applied-changes.md` (FR-032). Se nenhum `SAFE_TO_APPLY` foi aplicado, NÃO bumpar (sem release).

**Checkpoint**: Melhorias seguras aplicadas e todos os entregáveis (1, 2, 3a, 3b, 5) presentes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação end-to-end dos critérios de sucesso e consistência final.

- [x] T030 [P] Passada final de consistência de documentação: garantir que `CLAUDE.md`/`AGENTS.md`/`docs/*` tocados refletem o comportamento real e que o índice de specs está coerente (SC-007)
- [x] T031 Executar a validação do `specs/009-production-tech-audit/quickstart.md`: conferir SC-001..SC-007, incluindo os diffs de "zero mudança de contrato" (`git diff` em `apps/api/drizzle`, `apps/api/src/db`, `apps/api/src/docs`, rotas) — saída esperada vazia ou apenas comentário/documentação
- [x] T032 Gate final de regressão: `npm run lint && npm run typecheck && npm test && npm run build` a partir da raiz, resultado **igual ou melhor** que `baseline.md`; confirmar `baselineVerified = true` em todas as entradas de `applied-changes.md` (SC-001, FR-025)
- [x] T033 Verificação de aderência ao escopo conservador (SC-005): confirmar no diff agregado dos PRs — 0 mudanças arquiteturais, 0 trocas de biblioteca, 0 breaking changes; confirmar `package-lock.json` íntegro cross-platform (research D11)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: sem dependências — pode iniciar imediatamente.
- **Foundational (Fase 2)**: depende do Setup — estabelece o baseline que **bloqueia** o gate de regressão da US3.
- **US1 (Fase 3)**: depende do Setup; T006–T015 podem usar o baseline (T004) para métricas; T016 depende de T006–T015 + T004.
- **US2 (Fase 4)**: depende de T016 (relatório consolidado).
- **US3 (Fase 5)**: depende de T020 (plano classificado) e de T004 (baseline para revalidar).
- **Polish (Fase 6)**: depende de toda a US3 desejada estar concluída.

### User Story Dependencies (pipeline — específico desta auditoria)

Diferente de features típicas, as stories formam um **pipeline**: US2 consome os achados de
US1 e US3 consome a classificação de US2. Cada uma permanece **testável isoladamente**
(relatório, plano e mudanças podem ser verificados de forma independente), mas a ordem de
produção é P1 → P2 → P3 e não é paralelizável entre stories.

### Within Each User Story

- **US1**: as 10 auditorias de dimensão (T006–T015) são independentes e paralelizáveis; a consolidação (T016) é o ponto de junção.
- **US2**: tabela (T017) → severidade (T018) → aplicabilidade/gating (T019) → resumos/fila (T020), sequenciais (mesmo arquivo).
- **US3**: PRs temáticos sequenciais e revertíveis; cada PR revalida o baseline antes de integrar.

### Parallel Opportunities

- Fase 1: T002 e T003 em paralelo.
- Fase 3 (US1): **T006–T015 todas em paralelo** (cada uma escreve seu arquivo em `audit/findings/`).
- Fase 6: T030 pode iniciar em paralelo às demais verificações.
- US2 e US3 **não** são paralelizáveis entre si nem internamente (mesmos arquivos / pipeline).

---

## Parallel Example: User Story 1 (auditoria por dimensão)

```bash
# As 10 dimensões são independentes — investigar/escrever em paralelo:
Task: "Arquitetura → audit/findings/01-arquitetura.md"
Task: "Backend → audit/findings/02-backend.md"
Task: "Frontend → audit/findings/03-frontend.md"
Task: "Qualidade de Código → audit/findings/04-qualidade.md"
Task: "Testes → audit/findings/05-testes.md"
Task: "Observabilidade → audit/findings/06-observabilidade.md"
Task: "Segurança → audit/findings/07-seguranca.md"
Task: "Performance → audit/findings/08-performance.md"
Task: "Documentação → audit/findings/09-documentacao.md"
Task: "DevEx → audit/findings/10-devex.md"
# Depois, consolidar tudo em audit/audit-report.md (T016).
```

---

## Implementation Strategy

### MVP First (User Story 1 — o Relatório)

1. Fase 1: Setup.
2. Fase 2: Foundational (baseline — crítico).
3. Fase 3: US1 — auditoria das 10 dimensões + consolidação.
4. **PARAR e VALIDAR**: o relatório cobre as 10 dimensões com achados rastreáveis; zero
   alteração de código. Já entrega valor por si só (diagnóstico).

### Incremental Delivery

1. Setup + Foundational → baseline pronto.
2. US1 → Relatório de Auditoria → validar → entregar (MVP, somente leitura).
3. US2 → Plano classificado → validar → entregar (decisão acionável, sem mudança).
4. US3 → aplicar `SAFE_TO_APPLY` em PRs temáticos → validar regressão a cada PR → entregar.
5. Polish → validação end-to-end dos critérios de sucesso.

### Estratégia conservadora (inegociável)

- Diagnóstico (US1/US2) é 100% somente leitura.
- Na US3, **um PR temático por vez**, revalidado contra o baseline e revertível isoladamente.
- Qualquer dúvida sobre segurança da mudança ⇒ `REQUIRES_REVIEW` (não aplicar).
- Remoção de funcionalidade / breaking change ⇒ só com confirmação explícita do mantenedor.

---

## Notes

- `[P]` = arquivos diferentes, sem dependências.
- `[Story]` mapeia a tarefa à user story para rastreabilidade.
- Cada PR temático da US3 deve commitar, quando tocar `apps/api/src/**`, o bundle rebuildado
  `apps/api/api/index.js` (mecânica de deploy do VITA).
- Não regenerar `package-lock.json` no Windows (CI Linux usa `npm ci`).
- Parar em qualquer checkpoint para validar a story isoladamente.
