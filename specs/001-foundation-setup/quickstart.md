# Quickstart — Foundation / Platform Setup (guia de validação)

Guia para provar, ponta a ponta, que a fundação funciona. Detalhes de contrato/entidades estão em
[contracts/openapi.yaml](./contracts/openapi.yaml) e [data-model.md](./data-model.md); o passo a
passo de implementação fica em `tasks.md`.

## Pré-requisitos

- Node.js 20.x e npm.
- Conta/projetos (preferencialmente provisionados por CLI/API): **GitHub**, **Vercel** (2 projetos:
  web e api), **Neon** (Postgres), **Sentry**.
- Credenciais OAuth do Google (Google Cloud Console) — **passo manual documentado**: criar
  "OAuth Client ID" (Web), com `Authorized redirect URI` = origem do web + `/api/auth/google/callback`
  (ex.: `https://<web>.vercel.app/api/auth/google/callback` e `http://localhost:5173/api/auth/google/callback`).
- `.env` local criado a partir de `.env.example` (nunca versionar `.env`).

## Setup local

```bash
git clone <repo> && cd vita
npm install                       # instala todos os workspaces
cp .env.example .env              # preencher DATABASE_URL, GOOGLE_*, JWT_SECRET, ADMIN_EMAILS, ...
npm run db:migrate                # aplica migrations no banco (Neon)
npm run dev                       # sobe web (Vite) e api (Express) em paralelo
```

## Cenários de validação

### US1 — Esqueleto executável

- Acessar o SPA local (ex.: `http://localhost:5173`) → app shell do PWA carrega.
- `GET /api/health` → `200` com `{ status: "ok", db: "up" }`.
- **Esperado**: ambos os serviços sobem sem erro; frontend fala com o backend via `/api`.

### US2 — Persistência, migrations e ambiente

- Rodar `npm run db:migrate` contra banco vazio → tabela `allowlist` e `__drizzle_migrations` criadas.
- Remover uma variável obrigatória do `.env` e iniciar a API → **falha imediata** com mensagem clara
  (fail-fast do Zod).
- `git grep` por segredos → nenhum; `.env.example` documenta todas as variáveis.
- Rollback: validar procedimento documentado (branch/restauração do Neon) — forward-only por design.

### US3 — Acesso seguro (Google + allowlist)

- Sem sessão: `GET /api/auth/me` → `401`; rota protegida do SPA redireciona ao login.
- Login com conta Google **fora** da allowlist → `403` (acesso negado).
- Login com conta **na** allowlist (semeada via `ADMIN_EMAILS`) → cookie de sessão setado;
  `GET /api/auth/me` → `200` com `role`.
- Como admin, abrir a **tela de administração** e adicionar/remover e-mails → mudanças refletem nas
  autenticações subsequentes.
- Como `member`, tentar acessar a tela/endpoints de admin → `403`.
- Tentar remover o último `admin` → `409` (proteção contra lockout).
- Logout (`POST /api/auth/logout`) → `204`; cookie limpo; acesso protegido revogado.

### US4 — Observabilidade, erros e docs

- Provocar erro tratado e não tratado → resposta no formato `{ error: { code, message } }` (sem stack),
  log estruturado (pino) e evento no **Sentry**.
- Inspecionar logs → sem dados sensíveis/segredos.
- Abrir `/api/docs` (Swagger UI) → reflete os endpoints de `openapi.yaml`.

### US5 — Qualidade e entrega

- Abrir PR que quebra lint/typecheck/test → **GitHub Actions** falha; com branch protection
  (required status check), o merge é bloqueado.
- Merge em `main` → **Vercel** faz deploy automático dos dois projetos (web e api).
- Abrir PR → **preview deployment** disponível.

## Comandos esperados (raiz do monorepo)

| Script                | Função                                    |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | sobe web + api localmente                 |
| `npm run build`       | build de web e api                        |
| `npm run lint`        | ESLint em todos os workspaces             |
| `npm run typecheck`   | `tsc --noEmit` em todos os workspaces     |
| `npm run test`        | Vitest (unit + integration)               |
| `npm run db:generate` | gera migration a partir do schema Drizzle |
| `npm run db:migrate`  | aplica migrations                         |

## Notas de operação por agentes de IA

- Provisionar GitHub/Vercel/Neon/Sentry via CLI/API; armazenar segredos em Vercel Env Vars e GitHub
  Actions Secrets. O único passo tipicamente manual é a criação do OAuth Client no Google Cloud
  Console — documentado acima.
