# Implementation Plan: Foundation / Platform Setup

**Branch**: `main` (feature isolada em `specs/001-foundation-setup`) | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-foundation-setup/spec.md`

## Summary

Estabelecer a fundação técnica do VITA: monorepo com SPA/PWA (React + Vite) e API
(Express serverless), acesso seguro via Google OAuth restrito por allowlist administrada por UI,
persistência em Postgres (Neon) via Drizzle, observabilidade (pino + Sentry), tratamento de erros
padronizado, documentação de API (OpenAPI), testes (Vitest) e pipeline de qualidade/entrega
(GitHub Actions para gates + Vercel Git integration para deploy/previews). Sem nenhuma
funcionalidade de negócio do domínio de saúde.

## Technical Context

**Language/Version**: TypeScript 5.x em Node.js 22.x (LTS, runtime da Vercel); ES2022 modules.

**Primary Dependencies**:

- Frontend: React 18, Vite 5, Tailwind CSS 3, React Router 6, TanStack Query 5,
  react-hook-form + Zod, vite-plugin-pwa (Workbox), @sentry/react.
- Backend: Express 4, Zod, Drizzle ORM + drizzle-kit, @neondatabase/serverless,
  google-auth-library, jose (JWT), pino + pino-http, @sentry/node,
  @asteasolutions/zod-to-openapi + swagger-ui-express.
- Compartilhado: Zod schemas em `packages/shared`.

**Storage**: PostgreSQL gerenciado no **Neon** (free tier), acessado via driver serverless e Drizzle.

**Testing**: Vitest (unit + integration) com Supertest (API) e React Testing Library (componentes).

**Target Platform**: Web (SPA/PWA) servida pela Vercel; API como funções serverless na Vercel
(projeto Vercel separado). HTTPS obrigatório.

**Project Type**: Web application (monorepo com `apps/web`, `apps/api`, `packages/shared`).

**Performance Goals**: Aplicação de proprietário único, baixo volume. Sem metas de alta escala;
expectativas padrão de app web (respostas interativas, cold start serverless aceitável).

**Constraints**:

- Online-first; PWA mínimo (instalável + service worker), sem offline-sync.
- Stateless: sessão em cookie `httpOnly`/`Secure` (token assinado), sem store de sessão no servidor.
- Nenhum segredo versionado; configuração via variáveis de ambiente validadas por Zod.
- Cookie deve permanecer **first-party** apesar de web e API serem projetos Vercel distintos
  (ver Decisão de Integração #1).

**Scale/Scope**: 1 proprietário + allowlist pequena; tabelas de fundação mínimas (allowlist).

### Decisões de Integração (costuras entre decisões já confirmadas)

1. **Cookie first-party com dois projetos Vercel** (resolve conflito Q1×Q2): o projeto web define
   um **rewrite same-origin** em `vercel.json` (`/api/:path* → https://<api>.vercel.app/api/:path*`).
   O SPA chama sempre `/api/...` na própria origem; o `Set-Cookie` é atribuído à origem do web,
   permanecendo first-party (`SameSite=Lax`). O `redirect_uri` do OAuth aponta para a origem do web
   (`/api/auth/google/callback`, também via rewrite). Sem isso, `*.vercel.app` (Public Suffix List)
   tornaria o cookie third-party e o login quebraria no Safari/Chrome. CORS com credenciais não
   resolveria.
2. **Migrations forward-only** (Drizzle/drizzle-kit não tem `down` automático): modelo forward-only;
   rollback via restauração/branch do Neon nos ambientes efêmeros e SQL de reversão manual em
   emergências (FR-006 já reconciliado na spec).
3. **Gate de CI bloqueante exige branch protection**: o GitHub Actions roda lint/typecheck/test no
   PR, mas só **bloqueia o merge** se configurado como _required status check_ na branch protection.
   O deploy (Vercel Git integration) ocorre **pós-merge** no push para `main`. A configuração de
   branch protection é um passo explícito (automatizável via GitHub API/CLI).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Princípio                                            | Avaliação                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| I. Observabilidade, não aconselhamento médico        | ✅ Nenhuma funcionalidade de saúde nesta feature.                                                               |
| II. Privacidade e segurança por padrão               | ✅ HTTPS, cookie `httpOnly`/`Secure`, segredos fora do repo, sem dados sensíveis em logs, Zod env validation.   |
| III. Acesso restrito via Google                      | ✅ Google OAuth exclusivo + allowlist com bootstrap seguro e proteção contra allowlist vazia.                   |
| IV. Stack e arquitetura definidas (PWA online-first) | ✅ React/TS/Tailwind PWA + Node/Express/TS; offline fora de escopo.                                             |
| V. Simplicidade deliberada                           | ✅ npm workspaces (zero tooling extra), stateless (sem store de sessão), libs mínimas. Ver Complexity Tracking. |
| VI. Dependências e infraestrutura sustentáveis       | ✅ Libs modernas/ativas/adotadas; Vercel/Neon/Sentry/GitHub free tier.                                          |
| VII. Testes orientados a risco                       | ✅ Vitest cobrindo gate de auth/allowlist, health, validação de env; sem testes só por cobertura.               |

**Resultado**: PASS (sem violações não justificadas). Ver Complexity Tracking para itens com
justificativa. **Re-check pós-Phase 1**: PASS — o design (data-model, contracts, quickstart) não
introduziu novas violações.

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation-setup/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — decisões de stack justificadas
├── data-model.md        # Phase 1 — entidades e schema
├── quickstart.md        # Phase 1 — guia de validação
├── contracts/           # Phase 1 — OpenAPI dos endpoints da fundação
│   └── openapi.yaml
└── tasks.md             # Phase 2 — gerado por /speckit-tasks
```

### Source Code (repository root)

```text
apps/
├── web/                 # SPA/PWA (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/         # api client, query client, sentry
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── vercel.json      # rewrite /api/* → projeto da API (cookie first-party)
├── api/                 # Express serverless
│   ├── src/
│   │   ├── app.ts       # cria o app Express (middlewares, rotas, error handler)
│   │   ├── index.ts     # handler serverless (export default app)
│   │   ├── config/      # env schema (Zod) + carregamento
│   │   ├── auth/        # OAuth Google, emissão/verificação de JWT, middleware
│   │   ├── allowlist/   # rotas admin + serviço
│   │   ├── health/      # /api/health
│   │   ├── db/          # client Drizzle + schema + migrations
│   │   ├── middleware/  # error handler, request logging
│   │   ├── observability/ # init do Sentry (backend)
│   │   └── docs/        # OpenAPI + Swagger UI
│   └── drizzle.config.ts
└── ...

packages/
└── shared/              # Zod schemas e tipos compartilhados (DTOs, contratos)

.github/workflows/
└── ci.yml               # lint + typecheck + test (gate de PR)

package.json             # npm workspaces (raiz)
```

**Structure Decision**: Monorepo com **npm workspaces** (sem ferramenta extra — Princípio V).
Web e API são deployados como **dois projetos Vercel separados**, cada um com seu Root Directory
(`apps/web`, `apps/api`). `packages/shared` centraliza os schemas Zod usados por ambos.

## Complexity Tracking

| Violation                              | Why Needed                                                | Simpler Alternative Rejected Because                                                                                          |
| -------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Express rodando em serverless (Vercel) | Constitution exige Express; deploy preferido é Vercel     | Funções Vercel "puras" evitariam o adaptador, mas contrariam a stack mandatada (Express). Adaptador é mínimo (export do app). |
| Rewrite `/api/*` no web                | Manter cookie first-party com 2 projetos Vercel           | Domínio único com subdomínios `app.`/`api.` exigiria custear/gerir um domínio; rewrite é gratuito e reproduzível.             |
| `packages/shared` (3º pacote)          | Evitar divergência de schemas entre web e API (Zod único) | Duplicar schemas nos dois apps geraria drift e bugs de contrato; o pacote é leve e sem build próprio (TS via paths).          |

## Phase 0 — Research

Ver [research.md](./research.md): decisões de monorepo, ORM/migrations, auth/sessão, validação,
estado/data-fetching, logging, observabilidade, documentação de API, testes, CI/CD e gestão de
segredos — cada uma com Decision / Rationale / Alternatives, alinhadas à Constitution.

## Phase 1 — Design & Contracts

- [data-model.md](./data-model.md): entidades (Allowlist Entry, Sessão stateless, Registro de
  Migration, Configuração de Ambiente), schema Drizzle e regras de validação.
- [contracts/openapi.yaml](./contracts/openapi.yaml): contratos de `health`, `auth` (login/callback/
  logout/me) e `allowlist` admin (CRUD).
- [quickstart.md](./quickstart.md): guia de validação ponta a ponta (setup local, migrations, login,
  allowlist, health, CI/deploy).

## Phase 2 — Próximo passo

`/speckit-tasks` para gerar `tasks.md` organizado por user story (P1→P5).
