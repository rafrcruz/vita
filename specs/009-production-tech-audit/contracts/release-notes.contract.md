# Contract: Release Notes (`audit/release-notes.md`)

Entregável 5 (FR-031). Resumo das mudanças entregues pela auditoria.

## Regras estruturais

- `version` DEVE ser um incremento **PATCH** sobre a versão atual (`0.1.0` → `0.1.1`),
  pois a auditoria entrega apenas correções/melhorias internas sem mudança de comportamento.
- DEVE incluir uma **nota de compatibilidade** afirmando: sem breaking change, sem mudança
  de API pública, sem mudança de esquema de banco.
- DEVE referenciar os PRs/alterações aplicadas (rastreabilidade ao entregável 3a).
- Itens não aplicados NÃO entram nas release notes (entram em `deferred-improvements.md`).
- O bump `version` DEVE ser aplicado ao `package.json` (raiz + workspaces) e ao lockfile
  **somente se** ≥1 alteração `SAFE_TO_APPLY` for aplicada (FR-032); o `package-lock.json`
  NÃO deve ser regenerado no Windows (preservar integridade cross-platform).

## Esqueleto

```markdown
# Release Notes — vX.Y.Z (auditoria 009)

**Data**: AAAA-MM-DD
**Tipo**: PATCH — correções e melhorias internas, sem mudança de comportamento.

## Melhorias internas
- <categoria> (#PR): <resumo>

## Correções de documentação
- <resumo>

## Observabilidade / Qualidade
- <resumo>

## Compatibilidade
- Sem breaking changes. Sem alteração de API pública, contratos ou esquema de banco.
  Comportamento funcional preservado integralmente.

## Itens adiados
- Ver `deferred-improvements.md` para o backlog classificado (REQUIRES_REVIEW).
```

## Critérios de aceite

- [ ] `version` é incremento PATCH.
- [ ] Nota de compatibilidade presente e afirmativa.
- [ ] Apenas mudanças efetivamente aplicadas listadas.
- [ ] Link/menção ao backlog de itens adiados.
- [ ] Se houve ≥1 `SAFE_TO_APPLY` aplicado: `version` dos manifestos e do lockfile bumpado
      coerentemente (FR-032); caso contrário, sem release e sem bump.
