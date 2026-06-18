# Plano de Melhorias — VITA (009)

**Data**: 2026-06-18 | **Base**: [audit-report.md](./audit-report.md)
**Regra-mestre**: incerteza ⇒ `REQUIRES_REVIEW`. Severidade (impacto×probabilidade) é
ortogonal à aplicabilidade.

## Tabela de itens

| ID | Achados | Problema | Impacto | Risco (de aplicar) | Esforço | Recomendação | Severidade | Aplicabilidade |
|----|---------|----------|---------|--------------------|---------|--------------|------------|----------------|
| P-DOC-001 | F-DOC-001 | README desatualizado (estrutura/specs, docs/, scripts, build↔migrate) | Onboarding/erro operacional | Nulo (documentação) | TRIVIAL | Atualizar README | MÉDIO | **SAFE_TO_APPLY** |
| P-DOC-002 | F-DOC-002 | Bloco SPECKIT do `AGENTS.md` aponta para specs/008 | Contexto de agente defasado | Nulo (documentação) | TRIVIAL | Apontar para 009 (consistente com CLAUDE.md) | BAIXO | **SAFE_TO_APPLY** |
| P-QUAL-001 | F-QUAL-001/F-DOC-003 | Comentário "ESLint 9" em `eslint.config.js` (é v10) | Confusão menor | Nulo (comentário) | TRIVIAL | Corrigir comentário | BAIXO | **SAFE_TO_APPLY** |
| P-FRONT-001 | F-FRONT-001/F-PERF-001 | Sem code splitting → bundle 935 kB | Performance percebida (TTI/LCP) | Médio (Suspense/fallbacks, mudança de carregamento) | MÉDIO | `React.lazy` por rota + `manualChunks` (recharts/react); validar | ALTO | REQUIRES_REVIEW |
| P-FRONT-002 | F-FRONT-002 | `/style-guide` exposto sem auth em prod | Exposição de artefato de dev | Médio (muda roteamento; confirmar se é intencional) | BAIXO | Proteger/`lazy`/excluir de prod — confirmar com mantenedor | MÉDIO | REQUIRES_REVIEW |
| P-BACK-001 | F-BACK-001/F-DEVEX-004 | `build` acopla `db:migrate` (conecta ao banco) | Risco operacional (migração acidental) | Médio (muda script de build/deploy; mecânica Vercel) | MÉDIO | Desacoplar migrate do build; migrar via passo explícito | MÉDIO | REQUIRES_REVIEW |
| P-SEG-001 | F-SEG-001 | CSP desabilitada no Helmet | Superfície de XSS maior | Alto (CSP mal calibrada quebra app: Vite/Sentry/Google/Tailwind) | MÉDIO | Definir CSP report-only → enforce, com testes | MÉDIO | REQUIRES_REVIEW |
| P-SEG-002 | F-SEG-002 | Vulns de deps (`csurf`/`cookie` prod-low; `concurrently`/`drizzle-kit` dev) | Segurança (baixa em runtime) | Médio (lockfile cross-platform; `csurf` deprecado sem troca trivial) | MÉDIO | Tratar via Dependabot; avaliar substituir `csurf` (deprecado) | BAIXO/MÉDIO | REQUIRES_REVIEW |
| P-PERF-002 | F-PERF-002 | Índices ausentes em weight/BP logs | Performance de query (baixo em escala pessoal) | Alto (migração = mudança de schema; proibido como SAFE) | BAIXO | Adicionar índice `(user_email, logged_at)` via migração revisada | MÉDIO | REQUIRES_REVIEW |
| P-DEVEX-002 | F-DEVEX-002 | CI não verifica frescor do bundle da API | Bundle defasado em prod silenciosamente | Médio (mexe no CI; cuidado com migrate no build) | MÉDIO | Job de CI que rebuilda (sem migrate) e diffa o bundle | MÉDIO | REQUIRES_REVIEW |
| P-BACK-004 | F-BACK-004/F-QUAL-002 | Comentários com refs de FR obsoletas (error.ts, auth.route.ts) | Confusão de manutenção | Baixo, **mas** tocar `apps/api/src` força rebuild do bundle (→ migrate) | TRIVIAL | Corrigir comentários junto de um PR de backend que já rebuilde | BAIXO | REQUIRES_REVIEW |
| P-BACK-002 | F-BACK-002 | Sem compressão HTTP no Express | Nulo (Vercel comprime no edge) | — | — | Nenhuma ação (informativo) | BAIXO | — |
| P-BACK-003 | F-BACK-003 | `httpLogger` após CSRF | Observabilidade menor | Baixo (reordenar middleware = comportamento) | BAIXO | Avaliar mover logger antes do CSRF | BAIXO | REQUIRES_REVIEW |
| P-DEVEX-003 | F-DEVEX-003 | Node local v24 ≠ engines 22 | Inconsistência de ambiente | Baixo (ação do ambiente local, não do repo) | TRIVIAL | Usar Node 22 local (nvm) | BAIXO | REQUIRES_REVIEW |
| P-DEVEX-001 | F-DEVEX-001 | Sem Husky/pre-commit | Defesa antecipada ausente | Médio (adiciona dep + hook = mudança de fluxo) | BAIXO | Opcional; CI já cobre | BAIXO | REQUIRES_REVIEW |
| P-ARQ-001 | F-ARQ-001 | Duplicação conceitual em metrics.service | Manutenção menor | Alto vs benefício (refactor; contra Princípio V) | MÉDIO | Não mexer (registro) | BAIXO | — |
| P-OBS-001 | F-OBS-001 | `console.warn` no TrendChart | Nulo | Baixo | TRIVIAL | Opcional | BAIXO | — |
| P-TEST-001 | F-TEST-001 | Nº de cobertura não rastreado localmente | Visibilidade | — | — | Manter política por risco (Princípio VII) | BAIXO | — |
| P-SEG-003 | F-SEG-003 | CSRF acoplado a lista de origens | Clareza | Nulo (documentar) | TRIVIAL | Documentar decisão (cabe no PR de docs) | BAIXO | SAFE_TO_APPLY² |

² P-SEG-003 é apenas documentação da decisão; pode entrar no PR de docs se desejado.

## Resumo por severidade

| Severidade | Qtd |
|-----------|-----|
| CRÍTICO | 0 (nenhum achado de severidade crítica no app; os "critical" do `npm audit` são **dev-only**) |
| ALTO | 1 (P-FRONT-001) |
| MÉDIO | 6 (P-DOC-001, P-FRONT-002, P-BACK-001, P-SEG-001, P-PERF-002, P-DEVEX-002) |
| BAIXO | demais |

## Resumo por aplicabilidade

| Aplicabilidade | Qtd | Itens |
|----------------|-----|-------|
| **SAFE_TO_APPLY** | 3 (+1 opc.) | P-DOC-001, P-DOC-002, P-QUAL-001 (e P-SEG-003 opcional) |
| **REQUIRES_REVIEW** | 11 | P-FRONT-001/002, P-BACK-001/003/004, P-SEG-001/002, P-PERF-002, P-DEVEX-001/002/003 |
| Registro (sem ação) | 4 | P-BACK-002, P-ARQ-001, P-OBS-001, P-TEST-001 |

## Fila de execução proposta (PRs temáticos — só `SAFE_TO_APPLY`)

1. **PR "docs"** — P-DOC-001 (README) + P-DOC-002 (AGENTS.md) + P-QUAL-001 (comentário eslint)
   [+ P-SEG-003 opcional: documentar a decisão de CSRF]. Sem mudança de runtime, sem tocar
   `apps/api/src` (não dispara rebuild/migrate).

> Todos os itens `REQUIRES_REVIEW` ficam para `deferred-improvements.md` com motivo, risco e
> recomendação futura. Nenhum deles é aplicado nesta rodada.
