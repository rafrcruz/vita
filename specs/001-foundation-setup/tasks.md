---
description: "Task list for Foundation / Platform Setup"
---

# Tasks: Foundation / Platform Setup

**Input**: Design documents from `specs/001-foundation-setup/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Incluídos de forma **orientada a risco** (FR-020 / Constitution Princípio VII): gate de
auth/allowlist, validação de ambiente, health e formato de erro. Não há testes apenas por cobertura.

**Organization**: Tarefas agrupadas por user story (P1→P5) para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: user story correspondente (US1–US5)
- Caminhos relativos à raiz do monorepo

## Path Conventions

Monorepo npm workspaces: `apps/web/`, `apps/api/`, `packages/shared/`, `.github/workflows/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do monorepo e tooling compartilhado

- [x] T001 Criar `package.json` raiz com npm workspaces (`apps/*`, `packages/*`), `engines.node` 22.x e `.nvmrc` (alinhado ao runtime Vercel 22.x)
- [x] T002 [P] Criar `tsconfig.base.json` na raiz e `tsconfig.json` por workspace (`apps/web`, `apps/api`, `packages/shared`) com paths para `@vita/shared`
- [x] T003 [P] Configurar ESLint (typescript-eslint) + Prettier na raiz (`.eslintrc.cjs`, `.prettierrc`, `.eslintignore`)
- [x] T004 [P] Configurar Vitest na raiz (`vitest.config.ts`) e workspaces de teste para web e api
- [x] T005 [P] Scaffold de `packages/shared` (`package.json`, `src/index.ts`) para schemas Zod compartilhados
- [x] T006 [P] Criar `.env.example` com todas as variáveis (DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OAUTH_REDIRECT_URI, JWT_SECRET, SESSION_COOKIE_NAME, ADMIN_EMAILS, SENTRY_DSN, WEB_ORIGIN, NODE_ENV)
- [x] T007 Adicionar scripts npm raiz (`dev`, `build`, `lint`, `typecheck`, `test`, `db:generate`, `db:migrate`) usando `concurrently` para `dev`

**Checkpoint**: `npm install` instala todos os workspaces; `npm run lint`/`typecheck`/`test` executam sem erro em projeto vazio.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura central exigida por TODAS as user stories

**⚠️ CRITICAL**: Nenhuma user story começa antes desta fase concluir

- [x] T008 Implementar módulo de configuração com validação Zod e fail-fast em `apps/api/src/config/env.ts`
- [x] T009 [P] Configurar logger estruturado pino + pino-http em `apps/api/src/middleware/logging.ts`
- [x] T010 [P] Implementar error handler central com formato `{ error: { code, message } }` (sem vazar stack/segredos) em `apps/api/src/middleware/error.ts`
- [x] T011 Criar app factory Express (monta logging, JSON, cookies, rotas `/api`, error handler) em `apps/api/src/app.ts`
- [x] T012 Criar handler serverless (export default do app) em `apps/api/src/index.ts`
- [x] T013 Scaffold do web com Vite + React + TypeScript + Tailwind e roteamento (React Router) em `apps/web/` (`index.html`, `src/main.tsx`, `src/App.tsx`, `tailwind.config.ts`)
- [x] T014 [P] Configurar PWA mínimo (manifest + service worker) com vite-plugin-pwa em `apps/web/vite.config.ts`
- [x] T015 [P] Criar API client (fetch para `/api`) e provider do TanStack Query em `apps/web/src/lib/api.ts` e `apps/web/src/lib/queryClient.ts`
- [ ] T016 Criar `apps/web/vercel.json` com rewrite `/api/:path*` → projeto da API (cookie first-party) e `apps/api/vercel.json` (build serverless). **Dep.: o destino do rewrite depende da URL do projeto Vercel da API (criado em T051); usar a URL definitiva e fechar/validar em US5.** (resolve F1)

**Checkpoint**: Fundação pronta — app Express sobe, web shell carrega, web↔api configurados.

---

## Phase 3: User Story 1 - Esqueleto executável da aplicação (Priority: P1) 🎯 MVP

**Goal**: Frontend e backend rodam localmente; health responde; web fala com api.

**Independent Test**: Em clone limpo, `npm install` + `npm run dev` sobem ambos; `GET /api/health` retorna `200`; o shell do PWA exibe o status do health.

### Tests for User Story 1

- [x] T017 [P] [US1] Teste de integração do health (`200`, `{ status: "ok" }`) em `apps/api/src/health/health.test.ts`
- [x] T018 [P] [US1] Teste do app shell renderizando o status do health em `apps/web/src/pages/Home.test.tsx`

### Implementation for User Story 1

- [x] T019 [US1] Implementar endpoint `GET /api/health` (status + timestamp) em `apps/api/src/health/health.route.ts` e montar no app
- [x] T020 [US1] Criar página inicial/app shell que consome `/api/health` e exibe status em `apps/web/src/pages/Home.tsx`
- [x] T021 [US1] Validar script `npm run dev` (concurrently web+api) e documentar no `quickstart.md` qualquer ajuste

**Checkpoint**: US1 funcional e testável de forma independente (sem banco/auth).

---

## Phase 4: User Story 2 - Persistência, migrations e ambiente (Priority: P2)

**Goal**: Banco Neon conectado, schema `allowlist` via migration forward-only, health reflete o banco.

**Independent Test**: `npm run db:migrate` cria o schema em banco vazio; remover variável obrigatória falha o boot; health reporta `db: up/down`.

### Tests for User Story 2

- [x] T022 [P] [US2] Teste de fail-fast da config Zod quando variável obrigatória ausente em `apps/api/src/config/env.test.ts`
- [x] T023 [P] [US2] Teste do health refletindo estado do banco (`db: up`) em `apps/api/src/health/health.db.test.ts`

### Implementation for User Story 2

- [x] T024 [US2] Configurar client Drizzle + driver `@neondatabase/serverless` em `apps/api/src/db/client.ts`
- [x] T025 [US2] Definir schema `allowlist` (id, email único lower, role, created_at, created_by) em `apps/api/src/db/schema.ts`
- [x] T026 [US2] Criar `apps/api/drizzle.config.ts` e gerar a migration inicial em `apps/api/src/db/migrations/`
- [x] T027 [US2] Implementar seed do admin inicial a partir de `ADMIN_EMAILS` (idempotente) em `apps/api/src/db/seed.ts`
- [x] T028 [US2] Estender `GET /api/health` para checar conectividade do banco (`db: up/down`, `503` se down) em `apps/api/src/health/health.route.ts`
- [x] T029 [US2] Documentar procedimento de rollback (branch/restore Neon) em `apps/api/src/db/README.md`

**Checkpoint**: US1 + US2 funcionam; persistência e migrations validadas.

---

## Phase 5: User Story 3 - Acesso seguro via Google + allowlist (Priority: P3)

**Goal**: Login Google restrito por allowlist; sessão stateless em cookie httpOnly; tela de admin para gerir allowlist.

**Independent Test**: Sem sessão → `401`; fora da allowlist → `403`; na allowlist → acesso e cookie; não-admin na área de admin → `403`; remover último admin → `409`.

### Tests for User Story 3

- [x] T030 [P] [US3] Teste: acesso a rota protegida **sem sessão e com sessão expirada** retorna `401` em `apps/api/src/auth/auth.guard.test.ts` (cobre expiração de token — resolve C2)
- [x] T031 [P] [US3] Teste: usuário fora da allowlist é bloqueado (`403`) no callback em `apps/api/src/auth/callback.test.ts`
- [x] T032 [P] [US3] Teste: não-admin recebe `403` nas rotas de allowlist em `apps/api/src/allowlist/allowlist.route.test.ts`
- [x] T033 [P] [US3] Teste: remover o último admin retorna `409` (proteção de lockout) em `apps/api/src/allowlist/allowlist.service.test.ts`

### Implementation for User Story 3

- [x] T034 [P] [US3] Definir schemas Zod compartilhados (CurrentUser, AllowlistEntry, AllowlistCreate) em `packages/shared/src/auth.ts`
- [x] T035 [US3] Implementar emissão/verificação de JWT (jose) e set/clear de cookie `httpOnly`/`Secure`/`SameSite=Lax` em `apps/api/src/auth/session.ts`
- [x] T036 [US3] Implementar fluxo OAuth Google (start + callback com google-auth-library, verificação de identidade + checagem na allowlist) em `apps/api/src/auth/google.ts`
- [x] T037 [US3] Implementar middlewares `requireAuth` e `requireAdmin` em `apps/api/src/auth/middleware.ts`
- [x] T038 [US3] Implementar rotas de auth (`/api/auth/google`, `/callback`, `/me`, `/logout`) em `apps/api/src/auth/auth.route.ts`
- [x] T039 [US3] Implementar serviço da allowlist (listar, criar com unicidade, remover com proteção do último admin) em `apps/api/src/allowlist/allowlist.service.ts`
- [x] T040 [US3] Implementar rotas admin da allowlist (`GET/POST/DELETE /api/allowlist`) protegidas por `requireAdmin` em `apps/api/src/allowlist/allowlist.route.ts`
- [x] T041 [P] [US3] Implementar contexto de auth + rotas protegidas + página de login no web em `apps/web/src/lib/auth.tsx` e `apps/web/src/pages/Login.tsx`
- [x] T042 [US3] Implementar tela de administração da allowlist (listar/adicionar/remover, admin-only) em `apps/web/src/pages/AdminAllowlist.tsx`

**Checkpoint**: US1–US3 funcionam; gate de acesso e administração completos.

---

## Phase 6: User Story 4 - Observabilidade, erros e documentação da API (Priority: P4)

**Goal**: Logs estruturados sem dados sensíveis, captura de erros no Sentry, respostas de erro padronizadas e docs de API atualizadas.

**Independent Test**: Erro tratado e não tratado geram formato padrão + log + evento Sentry; `/api/docs` reflete os endpoints; logs sem segredos.

### Tests for User Story 4

- [ ] T043 [P] [US4] Teste: erro tratado e não tratado retornam formato `{ error: { code, message } }` sem stack em `apps/api/src/middleware/error.test.ts`
- [ ] T044 [P] [US4] Teste: redação de campos sensíveis no logger (sem segredos/PII) em `apps/api/src/middleware/logging.test.ts`

### Implementation for User Story 4

- [ ] T045 [P] [US4] Inicializar Sentry no backend (DSN via env, `beforeSend` com scrubbing) em `apps/api/src/observability/sentry.ts` e integrar no app factory
- [ ] T046 [P] [US4] Inicializar Sentry no frontend em `apps/web/src/lib/sentry.ts`
- [ ] T047 [US4] Configurar redação de campos sensíveis no pino e garantir captura de erros não tratados em `apps/api/src/middleware/logging.ts`
- [ ] T048 [US4] Gerar OpenAPI a partir dos schemas Zod (zod-to-openapi) em `apps/api/src/docs/openapi.ts`
- [ ] T049 [US4] Servir Swagger UI em `GET /api/docs` (swagger-ui-express) em `apps/api/src/docs/docs.route.ts`

**Checkpoint**: US1–US4 funcionam; sistema observável e documentado.

---

## Phase 7: User Story 5 - Qualidade automatizada e entrega contínua (Priority: P5)

**Goal**: CI roda lint/typecheck/test por PR e bloqueia merge; deploy automático na `main`; previews por PR.

**Independent Test**: PR que quebra checks falha o CI; merge na `main` dispara deploy; PR gera preview.

### Implementation for User Story 5

- [ ] T050 [US5] Criar workflow de CI (lint, typecheck, test + **secret-scan com gitleaks**) em `.github/workflows/ci.yml` (resolve C1/SC-003)
- [ ] T051 [P] [US5] Documentar/automatizar configuração dos 2 projetos Vercel (Root Directory `apps/web` e `apps/api`, env vars) em `docs/deploy.md`
- [ ] T052 [P] [US5] Documentar/automatizar branch protection com o job de CI como required status check (via `gh` API) em `docs/deploy.md`
- [ ] T053 [P] [US5] Documentar automação de provisionamento (gh/vercel/neon/sentry CLI e secrets) em `docs/provisioning.md`

**Checkpoint**: Todas as user stories independentemente funcionais; pipeline de qualidade/entrega ativo.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Endurecimento e validação final

- [ ] T054 [P] Endurecer segurança da API (helmet, CORS restrito à origem do web, revisão de flags de cookie `httpOnly`/`Secure`/`SameSite`, **garantir HTTPS-only/redirect e HSTS** — FR-026) em `apps/api/src/app.ts` (resolve C1/FR-026)
- [ ] T055 [P] Atualizar `README.md` e `quickstart.md` com comandos finais e fluxo de setup
- [ ] T056 Executar a validação ponta a ponta do `quickstart.md` e registrar resultados
- [ ] T057 Re-checar conformidade com a Constitution (segurança/privacidade, simplicidade, testes orientados a risco)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências.
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as user stories.
- **US1 (Phase 3)**: depende da Foundational. MVP.
- **US2 (Phase 4)**: depende da Foundational; independente de US1 (pode ser paralela em equipe).
- **US3 (Phase 5)**: depende da Foundational + US2 (precisa da tabela `allowlist` e do client de banco).
- **US4 (Phase 6)**: depende da Foundational; reforça o error handler/logging já criados.
- **US5 (Phase 7)**: depende de haver scripts `lint`/`typecheck`/`test` (Setup) e de ao menos US1.
- **Polish (Phase 8)**: depende das user stories desejadas concluídas.

### User Story Dependencies

- US1 (P1): independente após Foundational.
- US2 (P2): independente após Foundational.
- US3 (P3): requer US2 (allowlist/banco).
- US4 (P4): independente após Foundational (melhora infra transversal).
- US5 (P5): requer scripts de qualidade (Setup) e app deployável (US1+).

### Parallel Opportunities

- Setup: T002, T003, T004, T005, T006 em paralelo.
- Foundational: T009, T010 em paralelo; T014, T015 em paralelo.
- US1: T017, T018 (testes) em paralelo.
- US2: T022, T023 (testes) em paralelo.
- US3: T030–T033 (testes) em paralelo; T034 e T041 paralelos a parte do backend.
- US4: T043, T044 (testes) e T045, T046 (Sentry) em paralelo.
- US5: T051, T052, T053 em paralelo.

---

## Implementation Strategy

### MVP First (US1)

1. Phase 1 (Setup) → 2. Phase 2 (Foundational) → 3. Phase 3 (US1).
4. **PARAR e VALIDAR**: testar US1 isoladamente (dev local + health). 5. Deploy/demo se desejado.

### Incremental Delivery

Setup + Foundational → US1 (MVP) → US2 (persistência) → US3 (acesso seguro + admin) → US4
(observabilidade/docs) → US5 (CI/CD). Cada incremento agrega valor sem quebrar o anterior.

## Notes

- [P] = arquivos diferentes, sem dependências pendentes.
- Cada user story é completável e testável de forma independente (US3 assume US2 pronto).
- Verificar que os testes falham antes de implementar (fluxos críticos).
- Commitar após cada task ou grupo lógico.
