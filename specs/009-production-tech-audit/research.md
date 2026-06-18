# Phase 0 — Research: Auditoria Técnica de Produção (Modo Conservador)

**Feature**: 009-production-tech-audit | **Date**: 2026-06-18

Este documento consolida as decisões de **método e ferramentas** para conduzir a auditoria
de forma somente-leitura e conservadora, e fixa a **rubrica de classificação**. Não há
itens `NEEDS CLARIFICATION` pendentes da spec — as suposições conservadoras já foram
registradas em `spec.md` (Assumptions/Clarifications).

---

## D0. Estratégia geral: somente leitura na Fase 1–2, mudanças triviais na Fase 3

- **Decision**: A coleta de achados e o plano (Fases 1 e 2 da auditoria) são 100% somente
  leitura — análise estática, execução de comandos não destrutivos (`lint`, `typecheck`,
  `test`, `audit`, `build`) e inspeção manual por checklist. A Fase 3 aplica apenas
  correções triviais, em PRs pequenos e temáticos, cada um validado contra o baseline.
- **Rationale**: Maximiza segurança em um sistema em produção; separa diagnóstico de
  intervenção; mantém rastreabilidade e reversibilidade.
- **Alternatives considered**: Auditoria + correção em um único passo (rejeitada: mistura
  diagnóstico e risco, dificulta revisão e rollback). Ferramentas de "auto-fix" agressivas
  em massa (rejeitada: `eslint --fix` global pode alterar semântica e gerar diffs enormes
  difíceis de revisar).

## D1. Baseline objetivo antes de qualquer mudança

- **Decision**: Registrar, na Fase 0/1 da auditoria, o estado de referência: saída de
  `npm run lint`, `npm run typecheck`, `npm test` (com lista de testes passando/falhando),
  `npm audit`, e métricas de `npm run build` (tamanho de bundle web e do bundle esbuild da
  API). Esse baseline é a régua de não-regressão para a Fase 3.
- **Rationale**: Sem baseline não é possível provar "zero regressão" (SC-001) nem
  distinguir falhas pré-existentes de falhas introduzidas (edge case da spec).
- **Alternatives considered**: Confiar apenas no CI (rejeitada: CI pode não cobrir todas as
  métricas — ex.: tamanho de bundle — e queremos um snapshot versionado no relatório).

## D2. Rubrica `SAFE TO APPLY` vs `REQUIRES REVIEW`

- **Decision**: Um item é `SAFE TO APPLY` somente se satisfizer **todos**:
  1. Não altera comportamento observável (runtime, saída, side effects, ordem de efeitos).
  2. Não altera assinatura/contrato de API pública, rota, evento ou formato de resposta.
  3. Não altera o esquema do banco nem migrações.
  4. Não troca, adiciona ou remove dependência de runtime (exceto update `patch` seguro — ver D9).
  5. É localizado e revertível isoladamente.
  6. É verificável pelo baseline (lint/typecheck/test/build continuam iguais ou melhores).

  Qualquer incerteza em qualquer critério ⇒ `REQUIRES REVIEW` (princípio "em caso de
  dúvida, não altere", FR-018).
- **Rationale**: Operacionaliza as regras da spec em um teste binário e auditável,
  eliminando subjetividade na Fase 3.
- **Alternatives considered**: Classificação por "sensação de risco" (rejeitada: não
  reproduzível). Permitir refactors "pequenos" (rejeitada: escopo escorrega; a spec proíbe
  refactors).

## D3. Severidade (CRÍTICO / ALTO / MÉDIO / BAIXO)

- **Decision**: Severidade reflete **impacto × probabilidade**, independente da
  aplicabilidade: CRÍTICO = risco de segurança/perda de dados/indisponibilidade; ALTO =
  bug latente, vulnerabilidade explorável condicional, regressão de performance perceptível;
  MÉDIO = dívida técnica com impacto moderado; BAIXO = cosmético/estilo/limpeza.
- **Rationale**: Severidade orienta priorização; aplicabilidade orienta execução. São eixos
  ortogonais (um item CRÍTICO pode ser `REQUIRES REVIEW`).
- **Alternatives considered**: Fundir severidade e risco de aplicação em um único rótulo
  (rejeitada: perde a distinção entre "importante" e "seguro de aplicar agora").

## D4. Arquitetura — método

- **Decision**: Mapear acoplamento e dependências via análise de imports entre módulos
  (`apps/api/src/*`, `apps/web/src/*`, `packages/shared`); detectar dependências circulares
  por inspeção de grafo de import; identificar duplicação por busca de padrões repetidos.
  Saída: descrição textual + referências de arquivo, sem reorganização.
- **Rationale**: Suficiente para um monorepo deste porte; evita ferramentas pesadas.
- **Alternatives considered**: Ferramentas de grafo dedicadas (ex.: `madge`/`dependency-cruiser`)
  — úteis, mas adicioná-las como devDependency foge ao escopo conservador; podem ser
  executadas via `npx` pontual sem versionar, se necessário, em modo somente-relatório.

## D5. Backend — método

- **Decision**: Revisar manualmente a ordem do middleware stack (`apps/api/src/middleware`),
  presença/config de Helmet, CORS, `csurf`, `express-rate-limit`, compressão, handler global
  de erros, timeouts e retry de chamadas externas (Google/Neon), e o tratamento de
  `unhandledRejection`. Para Drizzle: inspecionar schema/migrações, índices declarados e
  padrões de query em loop (N+1).
- **Rationale**: Segurança/erros/queries são as áreas de maior risco em produção; inspeção
  dirigida é mais confiável que heurística automática aqui.
- **Alternatives considered**: Teste de carga para N+1 (rejeitada: fora de escopo, requer
  ambiente; inspeção estática de loops sobre queries é suficiente para *reportar* suspeitas).

## D6. Frontend — método

- **Decision**: Medir bundle via `npm run build` (saída do Vite/rollup) e mapa de chunks;
  verificar `React.lazy`/dynamic import e configuração de code splitting; identificar imports
  pesados não tree-shakeable; revisar memoização e re-renders em componentes de alto custo
  (gráficos `recharts`, listas); inventariar componentes/hooks/rotas potencialmente mortos;
  checar otimização de imagens (`sharp` no build) e assets em `public/`.
- **Rationale**: Bundle e re-render são os maiores vetores de performance percebida em PWA.
- **Alternatives considered**: Lighthouse/perf runtime (útil como recomendação futura; não
  bloqueante para a auditoria estática).

## D7. Qualidade de código (código morto) — método

- **Decision**: Detectar imports/variáveis não usados via ESLint + `tsc`; exports não
  utilizados e arquivos órfãos via análise de referências (busca de uso por símbolo) e,
  opcionalmente, `npx knip`/`ts-prune` em **modo somente-relatório** (sem versionar a dep).
  Confirmação manual obrigatória antes de classificar como `SAFE TO APPLY` — código usado
  via string dinâmica, rota lazy, export público ou reflexão ⇒ `REQUIRES REVIEW` (edge case
  da spec).
- **Rationale**: Falsos positivos de "código morto" são a principal fonte de regressão numa
  limpeza; a confirmação manual é a salvaguarda.
- **Alternatives considered**: Remoção automática baseada só em ferramenta (rejeitada: alto
  risco de remover símbolo usado dinamicamente).

## D8. Testes — método

- **Decision**: Rodar `vitest run --coverage`; avaliar cobertura **por risco** (auth,
  allowlist, cálculos/agregações de health metrics, validações Zod) e não por % global
  (Princípio VII). Identificar testes frágeis (dependentes de tempo/ordem/implementação),
  redundantes e lacunas críticas. Mocks avaliados quanto a fidelidade.
- **Rationale**: Alinhado à constituição (testes orientados a risco).
- **Alternatives considered**: Meta de % de cobertura (rejeitada explicitamente pela
  constituição).

## D9. Observabilidade & Segurança — método

- **Decision**: Verificar configuração de Sentry (node/react) e `pino` (redação de campos
  sensíveis — o projeto usa `@pinojs/redact`), captura de exceções, erros silenciosos e
  promises sem `.catch`. Segurança: `npm audit` (classificar por severidade), busca por
  secrets versionados (referenciar por localização, nunca transcrever — salvaguarda do GATE),
  revisão de XSS/CSRF (`csurf`)/SSRF/Open Redirect/SQLi (Drizzle parametriza, mas checar raw
  SQL) e uploads (verificar se existem). Dependências vulneráveis: só `patch` seguro é
  aplicável; upgrades maiores ⇒ `REQUIRES REVIEW`.
- **Rationale**: Privacidade/segurança são Princípio II; tratá-los com a maior cautela.
- **Alternatives considered**: Scanner SAST externo (CodeQL já roda no CI — reaproveitar
  seus achados em vez de adicionar ferramenta nova).

## D10. Documentação & DevEx — método

- **Decision**: Comparar `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/*.md`, specs e OpenAPI
  contra o código real, registrando divergências (ex.: menções a Prisma quando o ORM é
  Drizzle). DevEx: revisar scripts npm, `.github/workflows/{ci,codeql}.yml`, ESLint flat
  config, Prettier, Husky/commit conventions (verificar presença) e processo de
  release/versionamento. Correções de documentação são tipicamente `SAFE TO APPLY`.
- **Rationale**: Documentação desatualizada induz erro operacional; corrigi-la é baixo risco
  e alto valor.
- **Alternatives considered**: Reescrever docs (rejeitada: escopo; apenas corrigir
  divergências factuais).

## D11. Lockfile cross-platform (risco conhecido do projeto)

- **Decision**: Não regenerar `package-lock.json` no Windows. Qualquer update de dependência
  `patch` aplicável DEVE preservar a integridade cross-platform do lock (esbuild/lightningcss
  têm binários por plataforma); preferir edição mínima e validar que `npm ci` do CI (Linux)
  não quebra. Em dúvida ⇒ `REQUIRES REVIEW`.
- **Rationale**: Risco documentado do projeto: `npm install` no Windows quebra o `npm ci` do
  CI Linux.
- **Alternatives considered**: Atualizar deps livremente (rejeitada: quebra CI; contra o
  modo conservador).

## D12. Fluxo de entrega das correções

- **Decision**: Cada categoria de correção `SAFE TO APPLY` vira um PR pequeno e temático
  (ex.: "remoção de imports não usados", "correções de documentação", "melhoria de logs"),
  via o fluxo Git/GitHub do projeto (branch → PR → merge), com a IA conduzindo o ciclo.
  Mudanças no backend exigem rebuild + commit do bundle `apps/api/api/index.js` (mecânica de
  deploy do projeto).
- **Rationale**: PRs temáticos são revisáveis e revertíveis isoladamente (FR-026); respeita a
  mecânica de deploy versionado do VITA.
- **Alternatives considered**: Um único PR gigante (rejeitada: irrevisável, risco de rollback
  em bloco).

---

## Resumo das decisões

| # | Tema | Decisão-chave |
|---|------|---------------|
| D0 | Estratégia | Somente leitura nas Fases 1–2; mudanças triviais e temáticas na Fase 3 |
| D1 | Baseline | Snapshot de lint/typecheck/test/audit/build antes de mudar |
| D2 | SAFE TO APPLY | 6 critérios cumulativos; incerteza ⇒ REQUIRES REVIEW |
| D3 | Severidade | impacto × probabilidade, ortogonal à aplicabilidade |
| D4 | Arquitetura | imports/grafo/duplicação, somente relatório |
| D5 | Backend | inspeção dirigida de middleware/erros/queries/N+1 |
| D6 | Frontend | bundle/code splitting/re-render/código morto/assets |
| D7 | Código morto | ESLint+tsc+análise de refs; confirmação manual obrigatória |
| D8 | Testes | cobertura por risco, não por % |
| D9 | Observ./Segurança | Sentry/pino/redação; npm audit; secrets por localização |
| D10 | Docs/DevEx | documentação↔código; scripts/CI/lint/release |
| D11 | Lockfile | não regenerar no Windows; preservar cross-platform |
| D12 | Entrega | PRs pequenos temáticos; rebuild do bundle da API |

**Output**: nenhuma cláusula `NEEDS CLARIFICATION` remanescente. Pronto para Fase 1.
