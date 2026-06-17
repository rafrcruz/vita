# Phase 1 — Data Model: Foundation / Platform Setup

O domínio desta fundação é mínimo: apenas o necessário para o gate de acesso (allowlist) e o
controle de schema. **Nenhuma** entidade de saúde é introduzida.

## Entidades

### Allowlist Entry (`allowlist`)

E-mail autorizado a acessar a aplicação e seu papel.

| Campo        | Tipo                     | Regras                                                                                              |
| ------------ | ------------------------ | --------------------------------------------------------------------------------------------------- |
| `id`         | uuid (PK)                | gerado pelo banco                                                                                   |
| `email`      | text                     | **único** (case-insensitive), formato de e-mail válido (Zod `.email()`), normalizado para lowercase |
| `role`       | enum `admin` \| `member` | default `member`                                                                                    |
| `created_at` | timestamptz              | default `now()`                                                                                     |
| `created_by` | text (e-mail) \| null    | quem adicionou (null para os semeados)                                                              |

**Regras de negócio**:

- Unicidade por `email` normalizado (lowercase) — índice único.
- Pelo menos um `admin` deve existir após o bootstrap; o sistema **não** permite remover o último
  `admin` (proteção contra lockout) nem esvaziar a allowlist a ponto de conceder acesso irrestrito.
- Bootstrap: e-mails de `ADMIN_EMAILS` são semeados como `admin` na migration/boot inicial.
- Autorização: um login só é concedido se o e-mail autenticado pelo Google existir na allowlist.

**Transições de estado**: presença na allowlist = autorizado; ausência/remoção = bloqueado nas
autenticações subsequentes (sessões já emitidas expiram naturalmente — TTL curto recomendado).

### Sessão (stateless — não persistida)

Não há tabela. A sessão é um **JWT assinado** transportado em cookie `httpOnly`/`Secure`.

| Claim         | Conteúdo                                          |
| ------------- | ------------------------------------------------- |
| `sub`         | identificador do usuário (e-mail normalizado)     |
| `role`        | `admin` \| `member` (cópia no momento da emissão) |
| `iat` / `exp` | emissão e expiração (TTL curto, ex.: 1h–24h)      |

**Observações**: por ser stateless, mudanças de papel/remoção da allowlist só têm efeito pleno na
próxima emissão (após expiração/relogin). TTL curto mitiga a janela. Logout limpa o cookie.

### Registro de Migration (`__drizzle_migrations`)

Histórico de migrations aplicadas, gerenciado pelo drizzle-kit (forward-only). Não manipulado pela
aplicação; usado para determinar o estado do schema.

### Configuração de Ambiente (não persistida)

Conjunto de variáveis validadas por Zod no boot. Não é uma tabela; documentada em `.env.example` e
em [research.md](./research.md) §13. Variáveis: `DATABASE_URL`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `OAUTH_REDIRECT_URI`, `JWT_SECRET`, `SESSION_COOKIE_NAME`, `ADMIN_EMAILS`,
`SENTRY_DSN`, `WEB_ORIGIN`, `NODE_ENV`.

## Esboço de schema (Drizzle)

```text
allowlist
  id          uuid       PK default gen_random_uuid()
  email       text       NOT NULL
  role        text       NOT NULL default 'member'   -- 'admin' | 'member'
  created_at  timestamptz NOT NULL default now()
  created_by  text        NULL
  UNIQUE (lower(email))
```

## Relação com requisitos

- FR-005/FR-006 → `allowlist` + migrations forward-only + `__drizzle_migrations`.
- FR-010..FR-014 → `allowlist` (papéis, unicidade, bootstrap, proteção contra lockout) + Sessão JWT.
- FR-007/FR-009 → Configuração de Ambiente validada por Zod (fail-fast).
