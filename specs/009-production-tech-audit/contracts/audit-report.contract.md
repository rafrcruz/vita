# Contract: Relatório de Auditoria (`audit/audit-report.md`)

Entregável 1 (FR-027). Define a estrutura obrigatória do relatório de achados.

## Regras estruturais

- DEVE conter uma seção por **dimensão** (as 10 de `Dimension`), nesta ordem:
  Arquitetura, Backend, Frontend, Qualidade de Código, Testes, Observabilidade,
  Segurança, Performance, Documentação, DevEx (FR-001..FR-011).
- Dimensão sem achados relevantes DEVE ser marcada explicitamente como
  **"Sem achados relevantes"** — nunca omitida (spec, US1 cenário 4).
- DEVE iniciar com um bloco **Baseline** (research D1): saída resumida de lint,
  typecheck, testes (passa/falha), `npm audit` e métricas de build.
- Cada achado DEVE seguir o schema de `Achado` (data-model): `id`, `title`,
  `description`, `evidence`, `location[]`.
- Secrets DEVEM ser referenciados por **localização**, nunca transcritos.

## Template por achado

```markdown
#### [F-<DIM>-NNN] <título>

- **Severidade (prévia)**: CRITICO | ALTO | MEDIO | BAIXO
- **Local**: `caminho/arquivo.ts:linha` (e/ou símbolo)
- **Descrição**: <o que foi observado e por que é um problema>
- **Evidência**: <trecho/observação; sem expor secrets>
```

## Esqueleto do documento

```markdown
# Relatório de Auditoria — VITA (009)

## 0. Baseline
- Lint: ... | Typecheck: ... | Testes: X passando / Y falhando | npm audit: ... | Build: ...

## 1. Arquitetura
## 2. Backend
## 3. Frontend
## 4. Qualidade de Código
## 5. Testes
## 6. Observabilidade
## 7. Segurança
## 8. Performance
## 9. Documentação
## 10. DevEx

## Apêndice: índice de achados (id → dimensão → severidade prévia)
```

## Critérios de aceite

- [ ] 10 seções de dimensão presentes (com achados ou "Sem achados relevantes").
- [ ] Bloco Baseline presente e preenchido.
- [ ] Todo achado tem `id`, `location` e descrição.
- [ ] Nenhum secret transcrito.
