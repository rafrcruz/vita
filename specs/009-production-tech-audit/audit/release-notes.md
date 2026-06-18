# Release Notes — v0.1.1 (auditoria 009)

**Data**: 2026-06-18
**Tipo**: PATCH — correções de documentação e comentários. **Sem mudança de comportamento.**

> **Estado**: release confirmada pelo mantenedor. Bump `0.1.0 → 0.1.1` aplicado aos manifestos
> e ao lockfile (FR-032), entregue via ciclo branch → PR → merge.

## Correções de documentação
- **README**: estrutura do repositório atualizada (incluídos `docs/ai-git-workflow.md` e
  `docs/design-system.md`; `specs/` generalizado); tabela de scripts completada (`format`,
  `test:coverage`, `db:seed`); nota de que o build da API executa `db:migrate`.
- **AGENTS.md**: referência de plano atualizada para `specs/009-production-tech-audit/plan.md`.
- **eslint.config.js**: comentário corrigido para "ESLint 10" (versão real instalada).

## Compatibilidade
- **Sem breaking changes.** Nenhuma alteração de API pública, contratos, rotas ou esquema de
  banco. Nenhuma dependência adicionada/removida/atualizada. Comportamento funcional preservado
  integralmente.
- Gate de não-regressão: `lint` ✅ · `typecheck` ✅ · `test` 112/112 ✅ (= baseline).

## Itens adiados
- Backlog classificado (`REQUIRES_REVIEW`) em [deferred-improvements.md](./deferred-improvements.md):
  code splitting (ALTO), CSP, desacoplar migrate do build, índice de DB, verificação de bundle
  no CI, e itens menores. Nenhum aplicado nesta release conservadora.

## Bump de versão (aplicado — FR-032)
`0.1.0 → 0.1.1` aplicado em: `package.json` (raiz), `apps/api/package.json`,
`apps/web/package.json`, `packages/shared/package.json` e nos campos `version` de workspace de
`package-lock.json`, via `npm version --no-git-tag-version` — **sem regenerar o lockfile**
(integridade cross-platform preservada, research D11).
