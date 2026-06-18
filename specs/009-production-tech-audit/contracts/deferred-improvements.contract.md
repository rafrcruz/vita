# Contract: Lista de Melhorias Não Aplicadas (`audit/deferred-improvements.md`)

Entregável 3b (FR-029). Itens não implementados nesta rodada, com justificativa.

## Regras estruturais

- DEVE listar todo `PlanItem` com `applicability = REQUIRES_REVIEW` e todo
  `SAFE_TO_APPLY` que não foi aplicado por escolha.
- Cada entrada DEVE conter: **motivo**, **risco** e **recomendação futura** (FR-029).
- Itens de segurança CRITICO/ALTO não aplicáveis DEVEM ser destacados como prioridade.

## Formato por entrada

```markdown
### P-<DIM>-NNN — <título curto>
- **Severidade**: CRITICO | ALTO | MEDIO | BAIXO
- **Motivo de não aplicar**: <por que ficou de fora agora>
- **Risco**: <risco associado a aplicar / a não aplicar>
- **Recomendação futura**: <passo sugerido, com pré-condições de revisão>
```

## Seções complementares

- **Prioridades de revisão**: itens CRITICO/ALTO ordenados para tratamento futuro.
- **Itens que exigem confirmação do mantenedor**: remoções de funcionalidade / breaking
  changes (FR-023) que NÃO foram executados.

## Critérios de aceite

- [ ] Todo item REQUIRES_REVIEW presente com motivo/risco/recomendação.
- [ ] Itens que exigem confirmação explícita claramente sinalizados (não aplicados).
- [ ] Nenhuma funcionalidade removida sem confirmação registrada.
