# Banco de dados (Neon + Drizzle)

Postgres gerenciado no **Neon**, acessado via driver serverless (`@neondatabase/serverless`) e
**Drizzle ORM**. Migrations são **forward-only** (geradas pelo `drizzle-kit`).

## Comandos (a partir da raiz do monorepo)

```bash
npm run db:generate   # gera SQL de migration a partir de src/db/schema.ts
npm run db:migrate    # aplica as migrations pendentes no banco (DATABASE_URL)
npm -w @vita/api run db:seed   # semeia o(s) admin(s) a partir de ADMIN_EMAILS
```

## Estratégia de rollback (FR-006)

O `drizzle-kit` **não** oferece um comando de "down" automático. A reversão de schema segue uma
estratégia documentada, adequada a uma aplicação pessoal de baixo volume:

1. **Ambientes de teste/efêmeros — Neon branching**: crie um branch do banco para validar uma
   migration sem risco; descarte o branch para "reverter".
   ```bash
   neonctl branches create --project-id <id> --name test-migration
   # ... validar ...
   neonctl branches delete <branch-id>
   ```
2. **Produção — Point-in-Time Restore**: o Neon mantém histórico; restaure o branch para um instante
   anterior à migration em caso de problema (console Neon ou `neonctl`).
3. **Emergência — SQL de reversão manual**: aplique manualmente o SQL inverso da migration
   problemática.

Como o modelo é forward-only, prefira sempre avançar com uma nova migration corretiva a tentar
desfazer uma já aplicada.
