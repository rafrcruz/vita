# Baseline — Auditoria 009 (régua de não-regressão)

**Capturado em**: 2026-06-18 | **Tarefas**: T004, T005

Snapshot do estado do repositório **antes** de qualquer alteração. É a referência objetiva
para o gate de não-regressão da Fase 3 (SC-001 / FR-025).

## Ambiente

| Item | Valor |
|------|-------|
| Node local | **v24.11.1** |
| `.nvmrc` / `engines.node` | **22** / `22.x` (⚠️ mismatch local — ver achado F-DEVEX-003) |
| Gerenciador | npm workspaces (`apps/*`, `packages/*`) |
| `node_modules` | presente (não regenerar lock no Windows — research D11) |

## Resultados dos comandos

| Comando | Resultado |
|---------|-----------|
| `npm run lint` | ✅ **limpo** (0 erros/avisos) |
| `npm run typecheck` | ✅ **limpo** nos 3 workspaces (`@vita/shared`, `@vita/api`, `@vita/web`) |
| `npm test` (vitest run) | ✅ **23 arquivos, 112 testes, 0 falhas** (~14s) |
| `npm audit` (prod, `--omit=dev`) | ⚠️ **2 low** (`cookie` <0.7.0 via `csurf`) |
| `npm audit` (incl. dev) | ⚠️ **8 total**: 2 critical (`shell-quote` ← `concurrently`, **dev**), 4 moderate (`esbuild` ≤0.24.2 ← `drizzle-kit`, **dev**), 2 low (`cookie` ← `csurf`, **prod**) |
| `npm -w @vita/web run build` | ✅ build ok (7,3s) |
| `npm run build` (raiz, **API**) | ⏭️ **NÃO executado** — o script da API roda `db:migrate` (conecta/altera o banco). Inseguro em auditoria read-only. Ver F-BACK-001 / F-DEVEX-004. |

## Métricas de bundle

| Artefato | Tamanho |
|----------|---------|
| Web JS (`dist/assets/index-*.js`) | **935,39 kB** (gzip 278,09 kB) — chunk único, **> 500 kB** (aviso do Vite) |
| Web CSS | 36,06 kB (gzip 7,07 kB) |
| PWA precache | 995,90 KiB (19 entradas) |
| API bundle commitado (`apps/api/api/index.js`) | ~35 kB |

## Ferramentas read-only disponíveis (detecção, sem versionar deps)

`npx knip` · `npx ts-prune` · `npx dependency-cruiser` — usadas em modo somente-relatório.
Observação: ESLint já aplica `@typescript-eslint/no-unused-vars: error` (lint limpo ⇒ sem
imports/variáveis não utilizados detectáveis por essa regra).

## Convenções de ID

- Achados: `F-<DIM>-NNN` (DIM ∈ ARQ, BACK, FRONT, QUAL, TEST, OBS, SEG, PERF, DOC, DEVEX)
- Itens de plano: `P-<DIM>-NNN`
