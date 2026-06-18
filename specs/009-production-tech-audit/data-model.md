# Phase 1 — Data Model: Auditoria Técnica de Produção (Modo Conservador)

**Feature**: 009-production-tech-audit | **Date**: 2026-06-18

As "entidades" desta feature são os **artefatos da auditoria** e seus relacionamentos.
Não há entidades persistidas em banco — todas vivem como documentos versionados em
`specs/009-production-tech-audit/audit/`. Este modelo define seus campos, vocabulários
controlados (enums) e o ciclo de vida que liga um achado à sua resolução.

## Enums (vocabulário controlado)

### Dimension
`ARQUITETURA` · `BACKEND` · `FRONTEND` · `QUALIDADE_CODIGO` · `TESTES` ·
`OBSERVABILIDADE` · `SEGURANCA` · `PERFORMANCE` · `DOCUMENTACAO` · `DEVEX`
> As dez dimensões obrigatórias (FR-001). Cada uma DEVE ter cobertura no relatório.

### Severity
`CRITICO` · `ALTO` · `MEDIO` · `BAIXO`
> Impacto × probabilidade (research D3). Exatamente um por item (FR-015).

### Applicability
`SAFE_TO_APPLY` · `REQUIRES_REVIEW`
> Exatamente um por item (FR-016). Definido pela rubrica de 6 critérios (research D2).

### Effort
`TRIVIAL` · `BAIXO` · `MEDIO` · `ALTO`
> Estimativa relativa de esforço de correção.

### ChangeStatus
`APPLIED` · `DEFERRED`
> Resultado da Fase 3 para cada item de plano.

---

## Entity: Achado (Finding)

Um problema ou oportunidade identificado na auditoria (Fase 1).

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | string | Identificador estável, ex.: `F-BACK-001`. Único. |
| `dimension` | Dimension | Obrigatório. |
| `title` | string | Resumo curto do problema. |
| `description` | string | O que foi observado e por que é um problema. |
| `evidence` | string | Trecho/observação que sustenta o achado (sem expor secrets). |
| `location` | Location[] | ≥1 referência rastreável `arquivo[:linha]` (FR-012). |

**Regras de validação**:
- `location` NUNCA contém o **valor** de um secret — apenas sua localização (salvaguarda do GATE).
- Todo `Achado` origina ≥1 `PlanItem` (relacionamento 1→N).

**Location** (value object): `{ file: string; line?: number; symbol?: string }`.

## Entity: Item de Plano (Improvement Plan Item)

Decisão derivada de um ou mais achados (Fase 2). É a unidade de classificação e execução.

| Campo | Tipo | Regras |
|-------|------|--------|
| `id` | string | ex.: `P-BACK-001`. Único. |
| `findingIds` | string[] | ≥1 referência a `Achado.id`. |
| `problem` | string | Coluna "Problema" da tabela do plano (FR-014). |
| `impact` | string | Coluna "Impacto". |
| `risk` | string | Coluna "Risco" (risco de **aplicar** a mudança). |
| `effort` | Effort | Coluna "Esforço". |
| `recommendation` | string | Coluna "Recomendação". |
| `severity` | Severity | Exatamente um (FR-015). |
| `applicability` | Applicability | Exatamente um (FR-016). |

**Regras de validação**:
- Se a mudança altera comportamento, API, contrato, esquema de banco, ou troca/adiciona/remove
  dependência (exceto `patch` seguro), ou implica refactor/mudança arquitetural ⇒
  `applicability = REQUIRES_REVIEW` (FR-017).
- Qualquer incerteza sobre os 6 critérios da rubrica ⇒ `REQUIRES_REVIEW` (FR-018).
- `severity` e `applicability` são **ortogonais**: um item pode ser `CRITICO` + `REQUIRES_REVIEW`.

## Entity: Alteração Aplicada (Applied Change)

Mudança efetivamente realizada na Fase 3.

| Campo | Tipo | Regras |
|-------|------|--------|
| `planItemId` | string | Referência a `PlanItem.id`. Obrigatório. |
| `files` | string[] | Arquivos tocados (entregável arquivo-por-arquivo, FR-028). |
| `summary` | string | O que mudou e por que é neutro em comportamento. |
| `pr` | string | Identificador do PR temático (FR-026). |
| `baselineVerified` | boolean | `true` ⇔ lint/typecheck/test/build = baseline (FR-025). |

**Regras de validação**:
- Só pode existir se `PlanItem.applicability = SAFE_TO_APPLY` (FR-020).
- `baselineVerified` DEVE ser `true` para o PR ser integrável.
- Toda `Alteração Aplicada` é rastreável a exatamente um `PlanItem` (FR-021).

## Entity: Melhoria Não Aplicada (Deferred Improvement)

Item de plano não implementado nesta rodada.

| Campo | Tipo | Regras |
|-------|------|--------|
| `planItemId` | string | Referência a `PlanItem.id`. Obrigatório. |
| `reason` | string | Motivo de não aplicar (FR-029). |
| `risk` | string | Risco associado. |
| `futureRecommendation` | string | Recomendação futura. |

**Regras de validação**:
- Todo `PlanItem` com `applicability = REQUIRES_REVIEW` DEVE ter um `Deferred Improvement`.
- Um `PlanItem` `SAFE_TO_APPLY` não aplicado por escolha também vira `Deferred` com motivo.

## Entity: Release Note

Resumo das mudanças entregues pela auditoria.

| Campo | Tipo | Regras |
|-------|------|--------|
| `version` | string | Incremento **PATCH** sobre a versão atual `0.1.0` → `0.1.1` (FR-031). |
| `date` | date | Data da release. |
| `appliedChanges` | string[] | Referências às `Applied Change`/PRs. |
| `compatibilityNote` | string | DEVE afirmar: sem breaking change, sem mudança de API/DB. |
| `manifestsBumped` | boolean | `true` ⇔ o `version` dos `package.json` (raiz + workspaces) e do lockfile foi incrementado (FR-032). |

**Regras de validação**:
- `version` segue semver com bump apenas de PATCH (correções/melhorias internas).
- `compatibilityNote` é obrigatório e DEVE confirmar preservação de comportamento.
- `manifestsBumped = true` **somente se** ≥1 `AppliedChange` existir (FR-032); caso contrário não há release e `manifestsBumped = false`. O bump preserva a integridade cross-platform do `package-lock.json` (sem regenerar no Windows).

---

## Relacionamentos

```text
Achado (1) ───< (N) PlanItem
PlanItem (1) ──┬─ (0..1) AppliedChange      [se SAFE_TO_APPLY e aplicado]
               └─ (0..1) DeferredImprovement [se REQUIRES_REVIEW ou adiado]
AppliedChange (N) ───> (1) ReleaseNote
```

Invariante: para todo `PlanItem`, existe **exatamente um** resultado — `AppliedChange`
(`status = APPLIED`) **ou** `DeferredImprovement` (`status = DEFERRED`) — nunca ambos,
nunca nenhum.

## Ciclo de vida (state transitions de um PlanItem)

```text
[Identificado] ──classificação──> [Classificado: severity + applicability]
       │
       ├─ applicability = SAFE_TO_APPLY ──> [Em PR] ──baseline OK──> [APPLIED]
       │                                        └──baseline falha──> [DEFERRED + motivo]
       │
       └─ applicability = REQUIRES_REVIEW ─────────────────────────> [DEFERRED + recomendação]
```

- Transição para `APPLIED` exige `baselineVerified = true`.
- Transição para `DEFERRED` sempre registra `reason`/`futureRecommendation`.
- Remoção de funcionalidade ou breaking change só transiciona para `APPLIED` com
  **confirmação explícita do mantenedor** (FR-023); caso contrário permanece `DEFERRED`.

## Cobertura de requisitos (rastreabilidade)

| Requisito | Entidade/Campo que o satisfaz |
|-----------|-------------------------------|
| FR-012 (referência rastreável) | `Achado.location` |
| FR-014 (5 colunas) | `PlanItem.{problem,impact,risk,effort,recommendation}` |
| FR-015/016 (severidade/aplicabilidade únicas) | `PlanItem.severity`, `PlanItem.applicability` |
| FR-017/018 (gating REQUIRES_REVIEW) | regras de validação de `PlanItem` |
| FR-020/021 (só SAFE aplicado e rastreável) | `AppliedChange.planItemId` + invariante |
| FR-025 (não-regressão) | `AppliedChange.baselineVerified` |
| FR-028 (arquivo por arquivo) | `AppliedChange.files` |
| FR-029 (não aplicadas) | `DeferredImprovement.{reason,risk,futureRecommendation}` |
| FR-031 (release notes PATCH) | `ReleaseNote.{version,compatibilityNote}` |
| FR-032 (bump condicional dos manifestos) | `ReleaseNote.manifestsBumped` + regra de validação |
