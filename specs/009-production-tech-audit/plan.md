# Implementation Plan: Auditoria Técnica de Produção (Modo Conservador)

**Branch**: `009-production-tech-audit` | **Date**: 2026-06-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-production-tech-audit/spec.md`

## Summary

Conduzir uma auditoria técnica completa do VITA — sistema em produção, com usuários
reais — cobrindo dez dimensões (Arquitetura, Backend, Frontend, Qualidade de Código,
Testes, Observabilidade, Segurança, Performance, Documentação, DevEx) e entregar, em três
fases, (1) um relatório de achados, (2) um plano de melhorias classificado por
severidade e aplicabilidade, e (3) a aplicação **apenas** dos itens `SAFE TO APPLY` —
de baixo risco e sem qualquer alteração de comportamento, API, esquema de banco ou
compatibilidade.

**Abordagem técnica**: a auditoria é majoritariamente **estática e somente leitura**.
Aproveita-se o tooling já presente no repositório (ESLint flat config, `tsc --noEmit`,
Vitest + cobertura V8, `npm audit`, build do Vite/esbuild, Drizzle) e análises manuais
guiadas por checklist por dimensão. Nenhuma fase de diagnóstico altera código. A fase de
implementação aplica correções triviais e comprovadamente neutras, entregues em PRs
pequenos e temáticos, cada um verificado contra o baseline de testes/typecheck/build
registrado na Fase 0/1.

## Technical Context

> Os campos abaixo descrevem **o sistema sob auditoria** (o que inspecionar) e o **tooling
> de auditoria** (como inspecionar). A "implementação" desta feature produz artefatos
> de documentação e correções triviais — não um novo produto.

**Language/Version**: TypeScript 5.7 em todo o monorepo; Node.js 22.x (`engines.node: 22.x`, `.nvmrc`).

**Primary Dependencies**:
- *Backend* (`apps/api`, `@vita/api`): Express 4.21, Drizzle ORM 0.45 + `@neondatabase/serverless` (Postgres/Neon), Zod 3 + `@asteasolutions/zod-to-openapi`, Helmet 8, CORS, `csurf`, `express-rate-limit` 8, `google-auth-library` 10 + `jose` 6 (auth), `pino`/`pino-http` (logs), `@sentry/node` 10, `swagger-ui-express`.
- *Frontend* (`apps/web`, `@vita/web`): React 18, Vite 6, Tailwind 3, Radix UI, TanStack Query 5, `react-router-dom` 6, `react-hook-form` + `@hookform/resolvers`, `recharts` 3, `sonner`, `@sentry/react` 10, `vite-plugin-pwa`, `sharp` (otimização de imagens).
- *Shared* (`packages/shared`, `@vita/shared`): schemas Zod compartilhados.

**Storage**: PostgreSQL (Neon serverless) acessado via Drizzle ORM; migrações via `drizzle-kit` + `src/db/migrate.ts`. **Nota de correção documental**: o sistema NÃO usa Prisma; `@prisma/instrumentation` aparece apenas como dependência transitiva do `@sentry/node`.

**Testing**: Vitest 4 (root `vitest.config.ts`, `@vitest/coverage-v8`). API: `supertest`. Web: `@testing-library/react` + `jsdom` + `vitest-axe`.

**Target Platform**: PWA (web app) servida pela Vercel; backend como função serverless Vercel (bundle `apps/api/api/index.js` gerado por esbuild). Operação online-first.

**Project Type**: Web application — monorepo npm workspaces (`apps/api` + `apps/web` + `packages/shared`).

**Audit Tooling (read-only)**: `eslint .` (root flat config), `tsc -p … --noEmit` por workspace, `vitest run --coverage`, `npm audit`, `npm run build` (medição de bundle Vite + bundle esbuild da API), inspeção de schema Drizzle/migrações e índices, `git log`/grep para código morto, comparação documentação↔código. Ferramentas adicionais de detecção de código morto (ex.: análise de exports não usados) são executadas em modo somente-relatório.

**Performance Goals**: a auditoria não define metas de runtime do produto; mede o estado atual (tamanho de bundle, queries potencialmente N+1, requisições redundantes) e o reporta. Qualquer otimização aplicada DEVE ser comprovadamente neutra em comportamento.

**Constraints** (inegociáveis, da spec):
- Zero mudança de comportamento funcional, de API pública, de contrato externo, de esquema de banco ou de compatibilidade.
- Sem mudanças arquiteturais, troca de bibliotecas, refactors massivos ou breaking changes.
- "Em caso de dúvida, não altere" — incerteza ⇒ `REQUIRES REVIEW`.
- Toda a suíte de testes que passava no baseline DEVE continuar passando.

**Scale/Scope**: monorepo de 3 workspaces; backend com ~10 módulos de domínio (`allowlist`, `auth`, `config`, `db`, `docs`, `health`, `health_metrics`, `middleware`, `observability`, `profile`, `types`); frontend com `components`, `lib`, `pages`, `services`, `theme`, `utils`. Documentação em `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/*.md`, `specs/00x/*`, OpenAPI gerado via zod-to-openapi. CI em `.github/workflows/{ci,codeql}.yml`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

A constituição do VITA (v1.0.0) é avaliada abaixo. Esta feature é, por natureza, **reforçadora** da constituição (audita conformidade) e opera sob restrições mais estritas que ela.

| Princípio | Avaliação | Conformidade |
|-----------|-----------|--------------|
| I. Observabilidade de saúde, não aconselhamento | A auditoria não altera comportamento de produto nem introduz interpretações clínicas. | ✅ PASS |
| II. Privacidade e segurança por padrão | A auditoria *verifica* secrets, logs de dados sensíveis, TLS, minimização. O relatório NÃO pode expor segredos reais (apenas referências/localizações). | ✅ PASS (com salvaguarda) |
| III. Acesso restrito Google + allowlist | A auditoria não enfraquece auth; achados de auth viram recomendação, não alteração de fluxo. | ✅ PASS |
| IV. Stack definida (PWA online-first) | Proibição de troca de biblioteca/mudança arquitetural é explícita na spec — alinhado por construção. | ✅ PASS |
| V. Simplicidade deliberada | A auditoria favorece remoção de código morto e zero novas abstrações. | ✅ PASS (reforça) |
| VI. Dependências sustentáveis | Deps vulneráveis/abandonadas são reportadas; só updates `patch` comprovadamente seguros são aplicáveis. Upgrades maiores ⇒ `REQUIRES REVIEW`. | ✅ PASS |
| VII. Testes orientados a risco | Cobertura é avaliada por risco/impacto, não por %. Não introduzir testes só para métrica. Testes existentes não podem quebrar. | ✅ PASS |

**Resultado do GATE (pré-Fase 0)**: PASS, sem violações. A seção Complexity Tracking permanece vazia.

**Re-check pós-design (Fase 1)**: PASS. Os artefatos de design (`data-model.md`, `contracts/`,
`quickstart.md`) são exclusivamente documentação — não introduzem dependências, abstrações no
código de produto, nem alteram a stack/segurança. Nenhuma nova violação; Complexity Tracking
segue vazio.

**Salvaguardas derivadas**:
- O relatório referencia secrets por **localização** (arquivo/linha), nunca transcrevendo o valor.
- Atualizações de dependências limitadas a `patch` e somente quando `SAFE TO APPLY`; cross-platform lockfile tratado com cuidado (ver research, risco conhecido do projeto).
- Adição de testes de caracterização (que apenas documentam comportamento existente) é permitida como `SAFE TO APPLY` desde que não altere gates de CI de forma bloqueante; caso contrário, `REQUIRES REVIEW`.

## Project Structure

### Documentation (this feature)

```text
specs/009-production-tech-audit/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 — método/tooling por dimensão + rubrica SAFE TO APPLY
├── data-model.md        # Fase 1 — entidades dos entregáveis (Achado, Item de Plano, etc.)
├── quickstart.md        # Fase 1 — como validar a auditoria (baseline e verificação)
├── contracts/           # Fase 1 — formato/contrato dos entregáveis
│   ├── audit-report.contract.md
│   ├── improvement-plan.contract.md
│   ├── applied-changes.contract.md
│   ├── deferred-improvements.contract.md
│   └── release-notes.contract.md
├── checklists/
│   └── requirements.md  # criado pelo /speckit-specify
└── tasks.md             # Fase 2 (/speckit-tasks — não criado aqui)
```

Os **entregáveis da auditoria** (relatório, plano, listas, release notes) são produzidos
durante a execução (`/speckit-implement`) e versionados sob esta pasta:

```text
specs/009-production-tech-audit/audit/
├── audit-report.md            # Entregável 1 (Fase 1 da auditoria)
├── improvement-plan.md        # Entregável 2 (Fase 2 da auditoria)
├── applied-changes.md         # Entregável 3a (Fase 3)
├── deferred-improvements.md   # Entregável 3b (Fase 3)
└── release-notes.md           # Entregável 5
```

### Source Code (repository root) — alvo da auditoria

```text
apps/
├── api/                       # @vita/api — backend Express serverless
│   ├── api/index.ts|index.js  # entrypoint serverless (bundle esbuild versionado)
│   ├── src/
│   │   ├── allowlist/         # allowlist de e-mails autorizados
│   │   ├── auth/              # Google OAuth + jose
│   │   ├── config/            # configuração por ambiente
│   │   ├── db/                # Drizzle schema, migrate.ts, seed.ts
│   │   ├── docs/              # OpenAPI / swagger-ui
│   │   ├── health/            # health metrics (peso/PA)
│   │   ├── health_metrics/
│   │   ├── middleware/        # stack de middlewares (helmet, cors, csurf, rate limit, erros)
│   │   ├── observability/     # Sentry, pino
│   │   ├── profile/
│   │   └── types/
│   └── drizzle/               # migrações
├── web/                       # @vita/web — frontend React/Vite PWA
│   └── src/
│       ├── components/        ├── lib/      ├── pages/
│       ├── services/          ├── theme/    └── utils/
└── ...
packages/shared/src/           # @vita/shared — schemas Zod compartilhados
docs/                          # ai-git-workflow, deploy, design-system, provisioning
.github/workflows/             # ci.yml, codeql.yml
```

**Structure Decision**: Web application (monorepo npm workspaces). A auditoria percorre
os três workspaces e a documentação/tooling de raiz. Os artefatos de diagnóstico e os
entregáveis ficam isolados em `specs/009-production-tech-audit/` para não poluir o
código-fonte; as correções `SAFE TO APPLY` são aplicadas in-place nos diretórios acima,
em PRs temáticos.

## Complexity Tracking

> Sem violações da Constituição. Nenhuma entrada necessária.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (nenhuma) | — | — |
