# Lista de Alterações Aplicadas — VITA (009)

**Data**: 2026-06-18 | **Modo**: conservador. Apenas itens `SAFE_TO_APPLY`, sem mudança de
comportamento, API, contratos, esquema de banco ou dependências.

> **Estado**: alterações confirmadas pelo mantenedor e entregues via ciclo branch → PR → merge
> (incluindo o bump de versão `0.1.1`).

## PR temático único: "docs" (documentação e comentários)

Categoria: correções de documentação e comentários. **Não toca `apps/api/src/**`** → não
dispara rebuild do bundle serverless nem migração de banco. Risco: nulo (sem efeito de runtime).

### P-DOC-001 — README desatualizado
- **Arquivos**:
  - `README.md` — seção "Estrutura do repositório": adicionados `docs/ai-git-workflow.md` e
    `docs/design-system.md`; entrada `specs/` generalizada ("001 … em diante").
  - `README.md` — tabela "Scripts Disponíveis": adicionados `format`, `test:coverage`,
    `db:seed`; nota de que `npm run build` da API executa `db:migrate` (requer `DATABASE_URL`).
- **Neutralidade**: documentação pura; nenhum código de runtime afetado.

### P-DOC-002 — Bloco SPECKIT do AGENTS.md desatualizado
- **Arquivos**:
  - `AGENTS.md` — referência de plano atualizada de `specs/008-…/plan.md` para
    `specs/009-production-tech-audit/plan.md` (consistente com `CLAUDE.md`).
- **Neutralidade**: documentação/contexto de agente; sem efeito de runtime.

### P-QUAL-001 — Comentário obsoleto no eslint.config.js
- **Arquivos**:
  - `eslint.config.js` — comentário do cabeçalho corrigido de "ESLint 9" para "ESLint 10"
    (alinhado a `eslint@^10.5.0`).
- **Neutralidade**: comentário; `eslint.config.js` é ignorado pelo próprio lint
    (`**/*.config.js`). Sem efeito de runtime nem de build.

### P-VERSION — Bump de versão PATCH (FR-032)
- **Arquivos**: `package.json` (raiz), `apps/api/package.json`, `apps/web/package.json`,
  `packages/shared/package.json` (campo `version` `0.1.0 → 0.1.1`) e os 5 campos `version` de
  workspace em `package-lock.json`.
- **Método**: `npm version 0.1.1 --no-git-tag-version --include-workspace-root --workspaces`.
- **Neutralidade**: apenas strings de versão; **sem** re-resolução de dependências (diff do
  lockfile = 5 linhas; `node_modules/yocto-queue@0.1.0` e a árvore de deps intactos). Integridade
  cross-platform preservada (research D11).

## Verificação de baseline (gate de não-regressão)

| Verificação | Baseline | Pós-mudança | OK? |
|-------------|----------|-------------|-----|
| `npm run lint` | limpo | limpo | ✅ |
| `npm run typecheck` | limpo | limpo | ✅ |
| `npm test` | 112/112 | 112/112 | ✅ |
| Arquivos de produto (rotas, schema, deps) | — | inalterados | ✅ |

`baselineVerified = true` para todas as entradas acima.

## Itens NÃO aplicados

Todos os demais itens do plano são `REQUIRES_REVIEW` ou registro — ver
[deferred-improvements.md](./deferred-improvements.md). Nenhuma funcionalidade removida.
