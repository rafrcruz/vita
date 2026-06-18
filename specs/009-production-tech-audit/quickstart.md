# Quickstart — Validação da Auditoria Técnica (009)

**Feature**: 009-production-tech-audit | **Date**: 2026-06-18

Este guia mostra como **estabelecer o baseline**, **conduzir a auditoria em modo somente
leitura** e **verificar a não-regressão** das correções `SAFE TO APPLY`. Não contém código
de implementação — os detalhes de cada correção vivem em `tasks.md` e nos PRs temáticos.

> Pré-requisitos: Node 22.x (ver `.nvmrc`), dependências instaladas via `npm ci` na raiz.
> No Windows, NÃO regenere o `package-lock.json` (risco cross-platform — research D11).

## 1. Estabelecer o baseline (antes de qualquer mudança)

Execute na raiz do monorepo e **registre as saídas** no bloco "Baseline" do relatório
(`contracts/audit-report.contract.md` → seção 0):

```bash
npm run lint            # ESLint flat config (eslint.config.js)
npm run typecheck       # tsc --noEmit em todos os workspaces
npm test                # vitest run (anote testes passando/falhando)
npm run test:coverage   # cobertura V8 (avaliar por risco — research D8)
npm audit               # vulnerabilidades de dependências (classificar por severidade)
npm run build           # shared + api (esbuild bundle) + web (vite); anote tamanho do bundle
```

**Resultado esperado**: um snapshot textual do estado atual. Falhas pré-existentes são
registradas como achados e como baseline — a Fase 3 não pode introduzir novas falhas, mas
não é obrigada a corrigir as pré-existentes (edge case da spec).

## 2. Conduzir a auditoria (somente leitura)

Percorrer as 10 dimensões conforme os métodos de `research.md` (D4–D10). Nenhum comando
desta etapa altera arquivos de produto. Exemplos de inspeções não destrutivas:

```bash
# Código morto / exports não usados (modo somente-relatório, sem versionar deps):
npx knip            # ou: npx ts-prune   (apenas relatar; confirmar manualmente — D7)

# Mapa de bundle / chunks do frontend:
npm run build       # inspecionar saída do Vite/rollup (tamanhos, code splitting)

# Grafo de dependências entre módulos (opcional, sem versionar):
npx dependency-cruiser apps/api/src apps/web/src   # detectar ciclos/acoplamento (D4)
```

Produzir os entregáveis conforme os contratos:
`audit-report.md` (Entregável 1) e `improvement-plan.md` (Entregável 2).

## 3. Aplicar apenas itens `SAFE TO APPLY` (Fase 3)

Para cada PR temático (research D12):

```bash
# 1) criar branch temático (a IA conduz o ciclo branch→PR→merge)
# 2) aplicar a correção localizada
# 3) revalidar contra o baseline:
npm run lint && npm run typecheck && npm test && npm run build
```

**Backend**: ao alterar `apps/api/src/**`, rebuildar e commitar o bundle serverless
`apps/api/api/index.js` (mecânica de deploy do VITA), senão a mudança não chega à produção.

## 4. Critérios de aceite (validação end-to-end)

A auditoria está validada quando:

- [ ] **SC-001** — `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` produzem
      resultado **igual ou melhor** que o baseline (sem novas falhas); nenhuma mudança em API
      pública, contratos ou esquema de banco (verificável por diff: sem alterações em rotas,
      schemas Zod expostos, migrações `apps/api/drizzle/**`).
- [ ] **SC-002** — `audit-report.md` cobre as 10 dimensões (com achados ou "Sem achados
      relevantes").
- [ ] **SC-003** — `improvement-plan.md`: 100% dos achados viram itens classificados, sem
      célula/rótulo vazio.
- [ ] **SC-004** — toda alteração em `applied-changes.md` rastreia a um item SAFE_TO_APPLY;
      todo item não aplicado consta em `deferred-improvements.md` com motivo/risco/recomendação.
- [ ] **SC-005** — diff total contém 0 mudanças arquiteturais, 0 trocas de biblioteca,
      0 breaking changes; remoções de funcionalidade só com confirmação registrada.
- [ ] **SC-006** — os 5 entregáveis existem em `specs/009-production-tech-audit/audit/`.
- [ ] **SC-007** — documentação tocada está consistente com o comportamento real.

## 5. Verificação rápida de "zero mudança de contrato"

```bash
# Garantir que nenhuma migração/esquema foi alterado:
git diff --name-only origin/main... -- apps/api/drizzle apps/api/src/db

# Garantir que o OpenAPI/rotas não mudaram de forma incompatível:
git diff -- apps/api/src/docs apps/api/src/**/routes*.ts
```

Saída esperada: vazio (ou apenas adições de comentário/documentação não funcionais).

```bash
# Se houve release (≥1 SAFE_TO_APPLY aplicado), o bump PATCH deve estar coerente
# em todos os manifestos e no lockfile (FR-032); senão, version permanece 0.1.0:
git diff -- package.json apps/api/package.json apps/web/package.json packages/shared/package.json package-lock.json
```

Esperado: bump uniforme `0.1.0 → 0.1.1` nos `version` (se houve release) **sem** alteração
da árvore de dependências do `package-lock.json` (integridade cross-platform — research D11).

## Referências

- Entidades e enums: [data-model.md](./data-model.md)
- Método por dimensão e rubrica: [research.md](./research.md)
- Formato dos entregáveis: [contracts/](./contracts/)
- Requisitos e critérios de sucesso: [spec.md](./spec.md)
