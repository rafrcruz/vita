# Phase 0 — Research: Foundation / Platform Setup

Cada decisão segue a Constitution: tecnologias modernas, amplamente adotadas, bem documentadas,
ativamente mantidas, sustentáveis, adequadas a agentes de IA e compatíveis com operação pessoal de
baixo custo (free tier).

## 1. Organização do monorepo

- **Decision**: **npm workspaces** com `apps/web`, `apps/api`, `packages/shared`.
- **Rationale**: Zero ferramenta adicional (já vem no npm), suportado nativamente pela Vercel
  (Root Directory por projeto), simples de operar por agentes. Alinha com Princípio V (simplicidade).
- **Alternatives**: pnpm workspaces (mais rápido/estrito, mas adiciona gerenciador externo);
  Turborepo/Nx (cache e orquestração, mas overengineering para 2 apps de um único mantenedor).

## 2. Banco de dados, ORM e migrations

- **Decision**: **Neon Postgres** + **Drizzle ORM** + **drizzle-kit**; driver `@neondatabase/serverless`.
  Migrations **forward-only** versionadas; rollback via restauração/branch do Neon (ambientes
  efêmeros) e SQL manual em emergências.
- **Rationale**: Drizzle é TypeScript-first, leve, SQL-explícito (ótimo para agentes de IA e para
  serverless, sem geração pesada de cliente). Neon é Postgres gerenciado com free tier, branching
  instantâneo (ideal para testes/preview) e driver serverless (HTTP/WebSocket) que evita problemas
  de pool em funções efêmeras.
- **Trade-off reconciliado**: drizzle-kit não oferece `down` automático → a spec (FR-006) foi
  ajustada para modelo forward-only com rollback documentado, em vez de prometer reversão por comando.
- **Alternatives**: Prisma (muito popular e maduro, porém cliente gerado mais pesado e historicamente
  com atrito em cold start serverless); Kysely (query builder puro, sem migrations integradas);
  Postgres "cru" (mais boilerplate e risco de erros de tipo).

## 3. Autenticação e sessão

- **Decision**: Fluxo **OAuth 2.0 Authorization Code** com Google, verificado no backend via
  **google-auth-library** (oficial). Após verificar a identidade e checar a allowlist, o backend
  emite um **JWT assinado** (lib **jose**) e o entrega em cookie **`httpOnly`, `Secure`,
  `SameSite=Lax`, `Path=/`**. Sessão **stateless** (sem tabela de sessões).
- **Rationale**: Atende Q2 (stateless) e o modelo serverless (sem store de sessão). google-auth-library
  é oficial e mantida; jose é o padrão moderno para JWT/JWS em TS. `httpOnly` protege contra XSS.
- **Integração crítica (cookie first-party)**: como web e API são projetos Vercel distintos sob
  `*.vercel.app` (Public Suffix List), o cookie só permanece first-party graças ao **rewrite
  `/api/*`** no projeto web (`vercel.json`). O SPA chama `/api/...` na própria origem; o `Set-Cookie`
  é atribuído à origem do web. O `redirect_uri` registrado no Google é a origem do **web**
  (`https://<web>/api/auth/google/callback`). Sem o rewrite, seria third-party (bloqueado por ITP/
  phase-out de cookies de terceiros).
- **Allowlist vazia**: o middleware de autorização nega acesso por padrão; um administrador inicial é
  semeado por env (`ADMIN_EMAILS`) na primeira migration/boot, garantindo que allowlist vazia nunca
  conceda acesso irrestrito (FR-014).
- **Alternatives**: Passport (orientado a sessão server-side, atrito em serverless); Auth.js/NextAuth
  (centrado em Next.js); Lucia (em transição/descontinuação anunciada) — todos rejeitados por menor
  aderência ao cenário Express+serverless+stateless.

## 4. Validação e contratos compartilhados

- **Decision**: **Zod** como fonte única de verdade, em `packages/shared`, reutilizado por web
  (react-hook-form + zodResolver) e API (validação de request/response). OpenAPI derivado dos schemas.
- **Rationale**: Elimina drift de contrato entre front e back (ver Complexity Tracking). Zod é padrão
  de fato, ótimo DX e para agentes.
- **Alternatives**: Yup (menos integração TS), class-validator (decorators/classe, mais cerimônia),
  duplicar validação manualmente (drift).

## 5. Estado e data-fetching (frontend)

- **Decision**: **TanStack Query** para estado de servidor; estado local com hooks do React. Sem
  biblioteca de estado global inicialmente (adicionar Zustand só se surgir necessidade real).
- **Rationale**: A maior parte do estado é server-state (auth, allowlist); TanStack Query resolve
  cache/refetch/erros. Princípio V evita Redux/estado global prematuro.
- **Alternatives**: Redux Toolkit (overengineering para o escopo); SWR (válido, mas TanStack Query é
  mais completo e amplamente adotado).

## 6. PWA

- **Decision**: **vite-plugin-pwa** (Workbox) com manifesto + service worker mínimo (precache do
  app shell; sem estratégias offline de dados).
- **Rationale**: Atende requisito mínimo de PWA sem introduzir complexidade offline (Constitution
  Princípio IV/V).
- **Alternatives**: Service worker manual (mais erro-propenso); Workbox standalone (mais setup).

## 7. Logging e tratamento de erros

- **Decision**: **pino** + **pino-http** para logs estruturados (JSON) em stdout (capturados pelos
  logs da Vercel). Middleware de erro central padroniza respostas (`{ error: { code, message } }`),
  sem vazar stack/segredos. Redação de campos sensíveis configurada no pino.
- **Rationale**: pino é o logger estruturado mais rápido/adotado em Node; serverless-friendly (stdout).
- **Alternatives**: Winston (mais pesado/lento), console.log (sem estrutura/correlação).

## 8. Observabilidade / monitoramento de erros

- **Decision**: **Sentry** (`@sentry/node` na API, `@sentry/react` no web) para captura de erros não
  tratados, com `tracesSampleRate` baixo e `beforeSend` para scrubbing de dados sensíveis.
- **Rationale**: Free tier adequado, integração madura, automatizável via DSN em env.
- **Alternatives**: Self-host (GlitchTip) — mais manutenção; apenas logs — sem agregação/alertas.

## 9. Documentação da API

- **Decision**: **OpenAPI 3** gerado a partir dos schemas Zod com **@asteasolutions/zod-to-openapi**;
  servido via **swagger-ui-express** em `/api/docs` (protegido fora de produção ou atrás de auth).
  Contrato versionado em `contracts/openapi.yaml`.
- **Rationale**: Fonte única (Zod) evita docs desatualizadas (FR-019).
- **Alternatives**: Escrever OpenAPI à mão (drift), tsoa (decorators/classe — mais cerimônia).

## 10. Testes

- **Decision**: **Vitest** para unit/integration; **Supertest** para a API; **React Testing Library**
  para componentes. Foco em risco (FR-020): gate de auth/allowlist, validação de env, health, erro
  padronizado. Playwright (e2e) fica como evolução futura, fora do escopo desta fundação.
- **Rationale**: Vitest é rápido, moderno, compartilha config com Vite e cobre front e back.
- **Alternatives**: Jest (mais lento, config separada do Vite); só e2e (lento, frágil para a fundação).

## 11. Lint, formatação e type-check

- **Decision**: **ESLint** (typescript-eslint) + **Prettier**; `tsc --noEmit` para type-check.
  Scripts npm na raiz (`lint`, `typecheck`, `test`) executados local e no CI.
- **Rationale**: Padrão da indústria, automatizável, exigido por FR-021.
- **Alternatives**: Biome (rápido e promissor, mas ecossistema/regras menos maduros que ESLint hoje).

## 12. CI/CD, deploy e ambientes

- **Decision**: **GitHub Actions** (`ci.yml`) roda `lint` + `typecheck` + `test` em cada PR (FR-022).
  **Vercel Git integration** faz deploy automático dos dois projetos no push para `main` (FR-023) e
  cria **preview deployments** por PR (FR-024). O bloqueio de merge depende de configurar o job de CI
  como **required status check** na **branch protection** (passo explícito, automatizável via API).
- **Rationale**: Divisão de responsabilidades de menor manutenção: Actions para gates de qualidade,
  Vercel para deploy/preview (zero pipeline de deploy a manter). Reflete o padrão já usado pelo
  proprietário.
- **Alternatives**: Deploy via `vercel deploy` dentro do Actions (pipeline única, mas mais script a
  manter e duplica o que a Vercel já faz nativamente).

## 13. Configuração e gestão de segredos

- **Decision**: Variáveis de ambiente carregadas e **validadas por Zod** num módulo central
  (`config/env.ts`), com **fail-fast** na inicialização (FR-007). `.env` local (gitignored) +
  `.env.example` versionado documentando todas as variáveis (FR-008). Segredos de produção em
  **Vercel Project Env Vars**; segredos de CI em **GitHub Actions Secrets**. Nada de segredo no repo.
- **Variáveis previstas**: `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
  `OAUTH_REDIRECT_URI`, `JWT_SECRET`, `SESSION_COOKIE_NAME`, `ADMIN_EMAILS`, `SENTRY_DSN`,
  `WEB_ORIGIN`, `NODE_ENV`.
- **Rationale**: Falha precoce e clara evita estados inválidos; Zod dá parsing tipado e mensagens.
- **Alternatives**: Ler `process.env` ad hoc (sem validação, erros tardios), dotenv-safe (cobre
  presença, não tipos/regra de negócio).

## 14. Automação por agentes de IA

- **Decision**: Provisionamento e operação preferencialmente via CLI/API oficiais: **GitHub CLI/API**
  (repo, branch protection, secrets), **Vercel CLI/API** (projetos, env vars, domínios), **Neon CLI/
  API** (projeto, branches, connection string), **Sentry** (projeto/DSN). Passos manuais residuais
  (ex.: criar credenciais OAuth no Google Cloud Console) ficam **documentados** no quickstart.
- **Rationale**: FR-025 — minimizar atividade manual e tornar a fundação reproduzível por agentes.
- **Alternatives**: Configuração manual via dashboards (não reproduzível, propensa a erro).

## Itens NEEDS CLARIFICATION

Nenhum remanescente — as três decisões interativas (runtime serverless, sessão stateless, allowlist
com UI) e as três costuras de integração (cookie first-party, migrations forward-only, gate via
branch protection) estão resolvidas acima.
