# Contract: Profile API

Recurso singleton por usuário autenticado. Todos os endpoints estão sob `/api/profile`, montados
com o middleware `requireAuth` (mesmo padrão de `/api/metrics`). A identidade vem da sessão
(`req.user.email`); o cliente **não** envia o e-mail.

Formato de erro segue o padrão da plataforma: `{ "error": { "code": string, "message": string } }`.

## Tipos

```ts
// Entrada (PUT) — todos os campos opcionais (FR-014)
type ProfileInput = {
  fullName?: string; // trim, ≤ 120
  birthDate?: string; // "YYYY-MM-DD", não futura, ano ≥ 1900
  heightCm?: number; // 50–250
};

// Resposta
type UserProfile = {
  id: string;
  fullName: string | null;
  birthDate: string | null; // "YYYY-MM-DD"
  heightCm: number | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
```

## GET /api/profile

Retorna o perfil do usuário autenticado.

- **200 OK** → `UserProfile` quando existe.
- **200 OK** → `null` (ou objeto com todos os campos nulos) quando o perfil ainda não foi criado.
  O cliente trata como "primeiro acesso / campos vazios".
- **401 Unauthorized** → `{ error: { code: "unauthenticated", message: "Autenticação necessária." } }`.

### Exemplo (200, existente)

```json
{
  "id": "9f1c...",
  "fullName": "Maria Silva",
  "birthDate": "1990-05-12",
  "heightCm": 168,
  "createdAt": "2026-06-17T12:00:00.000Z",
  "updatedAt": "2026-06-17T12:00:00.000Z"
}
```

## PUT /api/profile

Cria ou atualiza (upsert) o perfil do usuário autenticado. Idempotente.

- **Request body**: `ProfileInput` (campos omitidos permanecem inalterados quando já existia
  valor; em criação, ausentes ficam nulos).
- **200 OK** → `UserProfile` atualizado.
- **400 Bad Request** → `{ error: { code: "validation_error", message: <mensagem em pt-BR> } }`
  para data futura/ano < 1900, altura fora de 50–250, ou tipos inválidos.
- **401 Unauthorized** → `{ error: { code: "unauthenticated", message: "Autenticação necessária." } }`.

### Exemplo de requisição

```json
{ "fullName": "Maria Silva", "birthDate": "1990-05-12", "heightCm": 168 }
```

### Casos de validação (referência para testes)

| Entrada                       | Resultado            |
| ----------------------------- | -------------------- |
| `{}` (tudo vazio)             | 200 — salva parcial  |
| `birthDate` = data futura     | 400 validation_error |
| `birthDate` = "1899-01-01"    | 400 validation_error |
| `heightCm` = 10               | 400 validation_error |
| `heightCm` = 300              | 400 validation_error |
| `fullName` com 200 caracteres | 400 validation_error |
| dados válidos                 | 200 — UserProfile    |

## Observações

- Sem `DELETE` nesta feature (não solicitado).
- Não logar valores de `fullName`/`birthDate`/`heightCm` (dados pessoais — Princípio II).
- Após alterar o backend, rebuildar e commitar o bundle `apps/api/api/index.js` (mecânica de
  deploy do projeto).
