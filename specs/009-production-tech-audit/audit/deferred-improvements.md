# Melhorias Não Aplicadas — VITA (009)

**Data**: 2026-06-18. Itens classificados `REQUIRES_REVIEW` (não aplicados nesta rodada
conservadora), cada um com motivo, risco e recomendação futura. Nenhum altera comportamento
sem revisão; nenhum remove funcionalidade.

## Prioridades de revisão (ordenadas)

### P-FRONT-001 / P-PERF-001 — Code splitting do frontend (Severidade: ALTO)
- **Motivo de não aplicar**: muda o comportamento de carregamento (introduz `Suspense`,
  fallbacks, chunks dinâmicos); exige validação de UX e testes de roteamento.
- **Risco**: bundle de 935 kB prejudica TTI/LCP, especialmente em mobile (foco de captura).
- **Recomendação futura**: converter rotas para `React.lazy` + `Suspense`; configurar
  `build.rollupOptions.output.manualChunks` separando `recharts` e `react`. Medir antes/depois.

### P-SEG-001 — Definir Content-Security-Policy (Severidade: MÉDIO)
- **Motivo**: `helmet({ contentSecurityPolicy: false })`; habilitar CSP mal calibrada quebra
  Vite/Sentry/Google OAuth/estilos. Requer testes cuidadosos.
- **Risco**: ausência de CSP amplia a superfície de XSS.
- **Recomendação**: introduzir CSP em modo `report-only`, ajustar `directives`, depois `enforce`.

### P-BACK-001 / P-DEVEX-004 — Desacoplar `db:migrate` do `build` (Severidade: MÉDIO)
- **Motivo**: muda o script de build e a mecânica de deploy (Vercel); precisa validar pipeline.
- **Risco**: `npm run build` local com `DATABASE_URL` de produção dispara migração acidental.
- **Recomendação**: remover `db:migrate` do `build`; rodar migração em passo de deploy explícito
  (script/CI dedicado), preservando a geração do bundle.

### P-PERF-002 — Índice `(user_email, logged_at)` em weight/BP logs (Severidade: MÉDIO)
- **Motivo**: exige **migração de schema** — proibido como `SAFE_TO_APPLY` (FR-022).
- **Risco**: queries por usuário fazem seq scan (impacto baixo em escala pessoal).
- **Recomendação**: criar índice composto via migração Drizzle revisada e testada.

### P-DEVEX-002 — Verificar frescor do bundle da API no CI (Severidade: MÉDIO)
- **Motivo**: mexe no pipeline de CI; precisa rebuildar **sem** disparar `db:migrate`.
- **Risco**: bundle `apps/api/api/index.js` defasado vai a produção sem detecção.
- **Recomendação**: job de CI que rebuilda o bundle (sem migrate) e falha se houver diff com o commitado.

### P-FRONT-002 — Rota `/style-guide` em produção (Severidade: MÉDIO)
- **Motivo**: pode ser intencional; mudar roteamento requer confirmação do mantenedor.
- **Risco**: artefato de dev acessível sem auth e embutido no bundle de produção.
- **Recomendação**: proteger com auth, ou `lazy`-load, ou excluir do build de produção. **Requer
  confirmação do mantenedor** sobre a intenção.

## Demais itens (BAIXO)

| Item | Motivo de não aplicar | Risco | Recomendação |
|------|----------------------|-------|--------------|
| P-SEG-002 | Lockfile cross-platform; `csurf` deprecado sem troca trivial | Baixo (runtime) | Tratar via Dependabot; planejar substituição de `csurf` |
| P-BACK-004 | Tocar `apps/api/src` força rebuild do bundle (→ migrate); não vale para comentário | Baixo | Corrigir refs obsoletas junto a um PR de backend que já rebuilde |
| P-BACK-003 | Reordenar middleware = mudança de comportamento | Baixo | Avaliar mover `httpLogger` antes do CSRF |
| P-DEVEX-001 | Adiciona dependência + hook (mudança de fluxo) | Baixo | Husky/lint-staged opcional; CI já cobre |
| P-DEVEX-003 | Ação no ambiente local, não no repositório | Baixo | Usar Node 22 via nvm localmente |

## Itens que exigiriam confirmação explícita do mantenedor

- **P-FRONT-002** (remover/proteger `/style-guide`) — pode ser remoção de funcionalidade.
- Nenhuma remoção de funcionalidade foi executada nesta auditoria (FR-023).

## Registros sem ação (não são problemas)

P-BACK-002 (compressão — Vercel cobre no edge), P-ARQ-001 (duplicação controlada, Princípio V),
P-OBS-001 (`console.warn` justificado), P-TEST-001 (cobertura por risco é a política correta).
