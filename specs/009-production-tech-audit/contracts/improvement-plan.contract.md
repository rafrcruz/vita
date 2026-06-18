# Contract: Plano de Melhorias (`audit/improvement-plan.md`)

Entregável 2. Define a tabela classificada exigida pela Fase 2 (FR-014..FR-019).

## Regras estruturais

- DEVE conter **uma tabela** onde cada `PlanItem` é uma linha (FR-014).
- Cada linha DEVE ter as 5 colunas preenchidas: Problema, Impacto, Risco, Esforço,
  Recomendação — além de Severidade e Aplicabilidade.
- Cada item DEVE referenciar o(s) achado(s) de origem (`findingIds`).
- `severity` ∈ {CRITICO, ALTO, MEDIO, BAIXO} — exatamente um (FR-015).
- `applicability` ∈ {SAFE_TO_APPLY, REQUIRES_REVIEW} — exatamente um (FR-016).
- Itens que alterem comportamento/API/contrato/DB ou troquem biblioteca/arquitetura
  DEVEM ser `REQUIRES_REVIEW` (FR-017); incerteza ⇒ `REQUIRES_REVIEW` (FR-018).
- Esta fase NÃO aplica mudança alguma (FR-019).

## Formato da tabela

```markdown
| ID | Achados | Problema | Impacto | Risco | Esforço | Recomendação | Severidade | Aplicabilidade |
|----|---------|----------|---------|-------|---------|--------------|------------|----------------|
| P-BACK-001 | F-BACK-001 | ... | ... | ... | TRIVIAL | ... | MEDIO | SAFE_TO_APPLY |
```

## Seções complementares

- **Resumo por severidade**: contagem de itens por CRITICO/ALTO/MEDIO/BAIXO.
- **Resumo por aplicabilidade**: contagem SAFE_TO_APPLY vs REQUIRES_REVIEW.
- **Fila de execução proposta**: agrupamento dos `SAFE_TO_APPLY` em PRs temáticos (FR-026).

## Critérios de aceite

- [ ] 100% dos achados representados por ≥1 item (sem achado órfão).
- [ ] Nenhuma célula vazia nas 5 colunas + 2 rótulos.
- [ ] Toda mudança de comportamento/API/DB/biblioteca marcada REQUIRES_REVIEW.
- [ ] Nenhuma alteração de código realizada nesta fase.
