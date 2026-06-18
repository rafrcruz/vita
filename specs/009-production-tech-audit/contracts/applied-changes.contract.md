# Contract: Lista de Alterações Aplicadas (`audit/applied-changes.md`)

Entregável 3a (FR-028). Registro arquivo-por-arquivo do que foi efetivamente mudado.

## Regras estruturais

- Lista apenas itens com `applicability = SAFE_TO_APPLY` que foram aplicados (FR-020).
- Cada entrada DEVE rastrear ao `PlanItem` de origem (FR-021) e listar os arquivos tocados.
- DEVE indicar o PR temático correspondente (FR-026) e a verificação de baseline (FR-025).
- DEVE afirmar a neutralidade de comportamento de cada mudança.

## Formato por entrada

```markdown
### P-<DIM>-NNN — <título curto>
- **PR**: #<n> (<categoria temática>)
- **Arquivos**:
  - `caminho/arquivo.ts` — <o que mudou>
- **Neutralidade**: <por que não altera comportamento/API/DB>
- **Baseline**: lint ✓ · typecheck ✓ · testes ✓ (= baseline) · build ✓
```

## Agrupamento por PR temático (exemplos de categorias)

- Remoção de imports/variáveis não utilizados
- Remoção de código morto confirmado
- Correções de documentação (README/OpenAPI/CLAUDE.md/AGENTS.md)
- Ajustes de lint sem efeito semântico
- Melhorias de mensagens de log / tratamento de erros / observabilidade
- Pequenas otimizações de performance comprovadamente neutras

## Critérios de aceite

- [ ] Toda alteração rastreável a um `PlanItem` SAFE_TO_APPLY.
- [ ] Cada entrada lista arquivos e PR.
- [ ] `Baseline` = baseline registrado (sem novas falhas).
- [ ] Nenhuma mudança de comportamento/API/DB/biblioteca presente.
