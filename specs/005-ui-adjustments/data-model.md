# Phase 1 — Data Model: Ajustes de UI

A única entidade nova desta feature é **Perfil do Usuário**. As demais mudanças são de UI e
não introduzem dados persistidos.

## Entidade: Perfil do Usuário (`user_profiles`)

Representa os dados pessoais do usuário-proprietário, com relação 1:1 com o usuário autenticado
(identificado pelo e-mail). Destinado a fundamentar funcionalidades futuras (IMC, calorias),
sem realizar tais cálculos nesta feature.

### Campos

| Campo       | Tipo (DB)                                    | Nulo? | Regras / Validação                                                                            |
| ----------- | -------------------------------------------- | ----- | --------------------------------------------------------------------------------------------- |
| `id`        | `uuid` PK (defaultRandom)                    | não   | Identificador interno.                                                                        |
| `userEmail` | `text`                                       | não   | E-mail do dono. **Único** (índice único, case-insensitive). FK lógica ao usuário autenticado. |
| `fullName`  | `text`                                       | sim   | Trim; comprimento ≤ 120; opcional.                                                            |
| `birthDate` | `date` (requer import `date` em `schema.ts`) | sim   | Formato `YYYY-MM-DD` (Drizzle retorna string); não pode ser futura; ano ≥ 1900; opcional.     |
| `heightCm`  | `real`                                       | sim   | Faixa plausível 50–250 cm; opcional.                                                          |
| `createdAt` | `timestamptz` (defaultNow)                   | não   | Auditoria.                                                                                    |
| `updatedAt` | `timestamptz` (defaultNow)                   | não   | Atualizado em cada upsert.                                                                    |

### Índices

- `user_profiles_email_lower_unique`: índice único sobre `lower(user_email)` (espelha o padrão
  do `allowlist`), garantindo no máximo um perfil por usuário.

### Relacionamentos

- 1:1 lógico com o usuário autenticado (via `userEmail`). Não há FK física para `allowlist`
  porque o usuário é identificado pela sessão Google/allowlist, seguindo o padrão de
  `weight_logs`/`blood_pressure_logs` (que também referenciam `user_email` sem FK).

### Regras de acesso

- Toda leitura/escrita ocorre sob `requireAuth` e é filtrada por `req.user.email`. Um usuário
  só acessa o próprio perfil (Princípio II).

### Operações

- **Leitura** (`GET /api/profile`): retorna o perfil do usuário autenticado; se não existir,
  retorna objeto vazio/`null` (cliente trata como "ainda não preenchido").
- **Upsert** (`PUT /api/profile`): valida via `profileInputSchema`; cria a linha se ausente ou
  atualiza a existente (por `userEmail`), atualizando `updatedAt`. Idempotente.

### Schema compartilhado (Zod) — `@vita/shared/profile`

`profileInputSchema` (todos opcionais — FR-014):

- `fullName`: `string` opcional, `trim`, `max(120)`.
- `birthDate`: `string` opcional no formato `YYYY-MM-DD`; refinamentos: data válida, não futura,
  ano ≥ 1900.
- `heightCm`: `number` opcional, `min(50)`, `max(250)`.

Tipos exportados: `ProfileInput` (entrada) e um tipo de resposta `UserProfile` (campos acima +
`id`, timestamps), reutilizados por web e api.

## Migração

- Gerar via `drizzle-kit generate` após adicionar `userProfiles` em `apps/api/src/db/schema.ts`.
- Aplicar com `npm run db:migrate` (rodado também no `build` da API).
- Verificar compatibilidade do lockfile/CI conforme memória do projeto (não regenerar lock no
  Windows sem necessidade).

## Estado / transições

Sem máquina de estados: o perfil é um registro singleton por usuário, criado/atualizado por
upsert. Campos podem evoluir de "vazio" para "preenchido" individualmente, sem ordem obrigatória.
