# Relatório de Auditoria — VITA (009)

**Data**: 2026-06-18 | **Escopo**: monorepo completo (`apps/api`, `apps/web`, `packages/shared`, docs, tooling)
**Modo**: conservador, somente leitura. Nenhum arquivo de produto alterado durante a auditoria.

> **Veredito geral**: o VITA é uma base de **alta qualidade** — lint/typecheck limpos, 112
> testes passando, segurança e observabilidade exemplares, código sem TODOs nem `console.log`
> em rotas. Os achados são, em sua maioria, **dívidas de baixo impacto** ou melhorias que,
> por tocarem comportamento/deps/DB, são conservadoramente classificadas `REQUIRES_REVIEW`.
> Poucos itens são `SAFE_TO_APPLY` (essencialmente documentação).

## 0. Baseline

Ver [baseline.md](./baseline.md). Resumo: lint ✅ · typecheck ✅ · testes ✅ 112/112 ·
`npm audit` 8 (2 critical dev, 4 moderate dev, 2 low prod) · bundle web 935 kB (chunk único).

---

## 1. Arquitetura

Monorepo npm workspaces bem segmentado: backend por domínio (`allowlist`, `auth`, `config`,
`db`, `docs`, `health`, `health_metrics`, `middleware`, `observability`, `profile`, `types`),
frontend por camada (`components`, `lib`, `pages`, `services`, `theme`, `utils`), e `shared`
com schemas Zod reutilizados nos dois lados. Fluxo de dependências saudável
(domínio → middleware/db → config); sem dependências circulares observadas.

- **[F-ARQ-001] (BAIXO)** Pequena duplicação conceitual entre `metrics.service.ts` (lógica de
  `getFilterDate`/timeframe e os pares create/update/delete de weight vs BP). É repetição
  controlada e legível; extrair abstração arriscaria a clareza (contra Princípio V). Apenas registro.
- Esclarecimento: `apps/web/src/lib/api.ts` (cliente `fetch`) e `apps/web/src/services/api.ts`
  (hooks React Query) **não** são duplicatas — são camadas distintas. Sem código morto aqui.

---

## 2. Backend

Configuração Express robusta (`apps/api/src/app.ts`): `trust proxy`, `x-powered-by` off,
redirect HTTPS em produção, Helmet (HSTS em prod), CORS por allowlist de origens, `rateLimiter`
antes do parse de corpo, `express.json()`, `cookie-parser`, CSRF e logger. Tratamento de erros
central sem vazar stack/segredos (`middleware/error.ts`). Validação por Zod em todas as rotas
de escrita. Drizzle parametriza as queries; isolamento por `userEmail`; sem N+1.

- **[F-BACK-001] (MÉDIO)** O script de build da API acopla **migração de banco**:
  `"build": "npm run db:migrate && tsc … && esbuild …"`. Rodar `npm run build` localmente com
  `DATABASE_URL` de produção dispara migração contra o banco real — perigoso.
  - **Local**: `apps/api/package.json:8`
- **[F-BACK-002] (BAIXO)** Sem middleware de **compressão** HTTP no Express. Em produção a
  Vercel comprime no edge, então o impacto é nulo; apenas informativo.
  - **Local**: `apps/api/src/app.ts`
- **[F-BACK-003] (BAIXO)** `httpLogger` é registrado **depois** do `csrfProtection`
  (`app.ts:63-64`); requisições rejeitadas pelo CSRF podem não ser logadas pelo pino-http.
- **[F-BACK-004] (BAIXO)** Comentários com referências de requisito **desatualizadas** a
  "FR-016/FR-017" (`middleware/error.ts:28,38`) e "FR-011" (`auth/auth.route.ts:53`),
  herdadas da spec de fundação (001). Confundem com a numeração de outras specs.
- `express.json()` sem `limit` explícito usa o padrão de 100 kB (proteção razoável). OK.

---

## 3. Frontend

React 18 + Vite 6 + Tailwind + Radix + TanStack Query. `StrictMode` ativo, `queryClient` com
defaults sensatos (`retry: 1`, `refetchOnWindowFocus: false`). PWA configurado (manifest,
service worker, `navigateFallbackDenylist` para `/api/`).

- **[F-FRONT-001] (ALTO — impacto de performance)** **Sem code splitting / lazy loading**.
  `App.tsx` importa todas as páginas avidamente (`Home`, `Login`, `AdminAllowlist`,
  `StyleGuide`, `History`, `Profile`); `recharts` (lib pesada de gráficos) entra no chunk
  inicial. Resultado: **um único bundle de 935 kB** (aviso do Vite > 500 kB).
  - **Local**: `apps/web/src/App.tsx:8-13`, `apps/web/vite.config.ts` (sem `manualChunks`)
- **[F-FRONT-002] (MÉDIO)** A rota **`/style-guide`** é exposta **sem autenticação** e vai para
  o bundle de produção. É um artefato de design/desenvolvimento.
  - **Local**: `apps/web/src/App.tsx:55`
- **[F-FRONT-003] (BAIXO)** `vite.config.ts` sem `build.rollupOptions.output.manualChunks`
  nem `chunkSizeWarningLimit` — relacionado a F-FRONT-001.

---

## 4. Qualidade de Código

Excelente higiene: **lint limpo**, **typecheck limpo**, `@typescript-eslint/no-unused-vars`
como **error** (logo, sem imports/variáveis não utilizados), **zero** `TODO`/`FIXME`/`HACK`,
nenhum `console.log` em caminho de requisição (apenas em scripts CLI `seed.ts`/`migrate.ts`,
no bootstrap de `env.ts`, e `console.warn` justificado em `TrendChart.tsx`).

- **[F-QUAL-001] (BAIXO, SAFE)** Comentário desatualizado no `eslint.config.js:1` diz
  "ESLint 9" enquanto o pacote instalado é **ESLint 10** (`eslint: ^10.5.0`).
- **[F-QUAL-002] (BAIXO)** Ver F-BACK-004 (refs de requisito obsoletas em comentários).
- Sem código morto/comentado relevante detectado.

---

## 5. Testes

**112 testes / 23 arquivos**, todos passando. Cobertura orientada a risco (Princípio VII):
auth guard, callback OAuth, allowlist (rota+serviço), métricas de saúde, perfil, validação de
env, error handler, logging, docs, health (incl. teste de DB), utilitários de data e métricas,
e componentes (DateTimeInput, TrendChart, AppShell, páginas). Mocks adequados (testes não
exigem DB real). CI roda `test:coverage` com a action de relatório de cobertura.

- **[F-TEST-001] (BAIXO)** Não há índice/limiar de cobertura versionado neste relatório (o
  `test:coverage` é executado no CI, informativo, sem `gate` bloqueante). Cobertura por risco é
  a política correta; apenas registro de que o número absoluto não é rastreado localmente.
- Sem testes frágeis evidentes (não há dependência de relógio/ordem detectada na amostra).

---

## 6. Observabilidade

**Exemplar.** Sentry node+react com `sendDefaultPii: false`, `beforeSend` removendo
cookies/`authorization`, `tracesSampleRate: 0.1`, e **no-op gracioso** sem DSN
(`observability/sentry.ts`). Logger `pino` estruturado com `redact` de campos sensíveis
(`authorization`, `cookie`, `set-cookie`, `*.password`, `*.secret`, `*.token`) e `remove: true`
(`middleware/logging.ts`) — dados de saúde não vazam para logs (Princípio II). Erros não
tratados são logados e enviados ao Sentry pelo handler central.

- **[F-OBS-001] (BAIXO)** `TrendChart.tsx:121,132` usa `console.warn` para falhas de
  fullscreen/orientação. Aceitável para APIs de navegador não críticas; poderia ser silencioso
  ou via um logger de frontend. Sem ação recomendada.

---

## 7. Segurança

Postura **forte**. Auth exclusivamente Google OAuth + allowlist (Princípio III): fluxo com
`state` (CSRF do OAuth), verificação de `emailVerified`, checagem de allowlist e negação fora
dela (`auth/auth.route.ts`). Sessão JWT HS256 (jose, 12h) em cookie **`httpOnly` + `secure`
(prod) + `sameSite=lax`** (`auth/session.ts`). CORS por allowlist, CSRF por validação de
origem/referer com fallback ao `csurf`, HTTPS redirect, Helmet/HSTS. **`.env` não rastreado**
pelo git (só `.env.example`); **gitleaks** + **CodeQL** no CI. Sem raw SQL além de
`sql\`select 1\`` no health. Sem rotas de upload. SSRF/Open Redirect: o único redirect externo
é o do OAuth, com `state` validado.

- **[F-SEG-001] (MÉDIO)** **CSP desabilitada**: `helmet({ contentSecurityPolicy: false })`
  (`app.ts:35`). Não há header `Content-Security-Policy`. Definir uma CSP reduziria a
  superfície de XSS, mas exige teste cuidadoso (Vite, Sentry, Google, inline styles do Tailwind).
- **[F-SEG-002] (BAIXO, prod / MÉDIO no agregado dev)** `npm audit`: **2 low em produção**
  (`cookie` <0.7.0 via **`csurf`**, que está **deprecado**); **2 critical** (`shell-quote` via
  `concurrently`) e **4 moderate** (`esbuild` via `drizzle-kit`) **somente em devDependencies**
  (risco de runtime baixo). CI já roda `npm audit --omit=dev --audit-level=high` e menciona
  Dependabot.
- **[F-SEG-003] (BAIXO)** Cobertura de **CSRF** depende de validação de origem/referer com
  bypass do token `csurf` para origens conhecidas (`middleware/security.ts`). É uma defesa
  válida, mas acoplada à lista de origens; documentar a decisão.

---

## 8. Performance

- **[F-PERF-001] (ALTO)** = F-FRONT-001: bundle inicial de 935 kB (chunk único), sem lazy
  loading de rotas nem split de vendor (`recharts`, `react`). Maior alavanca de performance percebida.
- **[F-PERF-002] (MÉDIO)** **Índices ausentes**: `weight_logs` e `blood_pressure_logs` não têm
  índice em `user_email` nem em `(user_email, logged_at)`, embora as queries filtrem por
  `userEmail` e ordenem por `loggedAt` (`db/schema.ts:31-46`, `health_metrics/metrics.service.ts`).
  Em escala pessoal o impacto é pequeno, mas é uma lacuna real. (Corrigir = migração ⇒ não-SAFE.)
- TanStack Query com cache e `invalidateQueries` por chave após mutações — sem requisições
  redundantes evidentes. Neon HTTP sem pool persistente (ideal serverless). Bom.

---

## 9. Documentação

- **[F-DOC-001] (MÉDIO, SAFE)** `README.md` desatualizado: "Estrutura do repositório" lista
  apenas `specs/001-foundation-setup/`; a seção `docs/` omite `ai-git-workflow.md` e
  `design-system.md`; a tabela de scripts não inclui `test:coverage`, `db:seed`, `format`; e
  não menciona que `npm run build` executa migração de banco.
- **[F-DOC-002] (BAIXO, SAFE)** `AGENTS.md` contém um bloco SPECKIT apontando para
  `specs/008-…/plan.md` (desatualizado → 009). Além disso, `AGENTS.md` **não** é gerenciado
  pelo updater de contexto (a config aponta só para `CLAUDE.md`), então fica permanentemente defasado.
- **[F-DOC-003] (BAIXO, SAFE)** = F-QUAL-001 (comentário "ESLint 9" em `eslint.config.js`).
- **Positivo**: README descreve a stack corretamente (Drizzle, não Prisma); a "divergência
  Prisma vs Drizzle" cogitada no planejamento **não se confirma** nas docs primárias — `Prisma`
  só aparece em `specs/001` (histórico) e como dependência transitiva do Sentry no lockfile.

---

## 10. DevEx

CI sólido (`.github/workflows/ci.yml`): lint, typecheck, `test:coverage`, `npm audit` (prod,
high+), e jobs separados de gitleaks e CodeQL. Prettier + ESLint flat config. Scripts npm
abrangentes.

- **[F-DEVEX-001] (BAIXO)** **Sem Husky / pre-commit hooks** (`.husky` ausente, sem
  `prepare`/`lint-staged`). Aceitável para projeto solo (CI cobre), apenas registro.
- **[F-DEVEX-002] (MÉDIO)** **CI não roda `build`** → o bundle `apps/api/api/index.js`
  (commitado manualmente) não tem verificação de frescor. Se o backend mudar sem rebuild, o CI
  não detecta o bundle defasado.
- **[F-DEVEX-003] (BAIXO)** Node **local v24.11.1** diverge de `.nvmrc`/`engines` (**22**).
- **[F-DEVEX-004] (MÉDIO)** = F-BACK-001: `npm run build` (raiz e API) roda `db:migrate`,
  tornando o build não executável com segurança sem um banco — afeta DevEx e CI.

---

## Apêndice: índice de achados

| ID | Dimensão | Severidade | SAFE? |
|----|----------|-----------|-------|
| F-ARQ-001 | Arquitetura | BAIXO | — (registro) |
| F-BACK-001 | Backend | MÉDIO | REQUIRES_REVIEW |
| F-BACK-002 | Backend | BAIXO | REQUIRES_REVIEW |
| F-BACK-003 | Backend | BAIXO | REQUIRES_REVIEW |
| F-BACK-004 | Backend | BAIXO | REQUIRES_REVIEW¹ |
| F-FRONT-001 / F-PERF-001 | Frontend/Perf | ALTO | REQUIRES_REVIEW |
| F-FRONT-002 | Frontend | MÉDIO | REQUIRES_REVIEW |
| F-FRONT-003 | Frontend | BAIXO | REQUIRES_REVIEW |
| F-QUAL-001 / F-DOC-003 | Qualidade/Doc | BAIXO | **SAFE_TO_APPLY** |
| F-TEST-001 | Testes | BAIXO | — (registro) |
| F-OBS-001 | Observabilidade | BAIXO | — (registro) |
| F-SEG-001 | Segurança | MÉDIO | REQUIRES_REVIEW |
| F-SEG-002 | Segurança | BAIXO/MÉDIO | REQUIRES_REVIEW |
| F-SEG-003 | Segurança | BAIXO | — (registro/doc) |
| F-PERF-002 | Performance | MÉDIO | REQUIRES_REVIEW |
| F-DOC-001 | Documentação | MÉDIO | **SAFE_TO_APPLY** |
| F-DOC-002 | Documentação | BAIXO | **SAFE_TO_APPLY** |
| F-DEVEX-001 | DevEx | BAIXO | — (registro) |
| F-DEVEX-002 | DevEx | MÉDIO | REQUIRES_REVIEW |
| F-DEVEX-003 | DevEx | BAIXO | REQUIRES_REVIEW |
| F-DEVEX-004 | DevEx | MÉDIO | REQUIRES_REVIEW |

¹ F-BACK-004 é trivial, mas tocar `apps/api/src/**` exigiria rebuild do bundle (que dispara
migração) — por isso é adiado (não vale o risco para um comentário). Ver plano.
