# Feature Specification: Auditoria Técnica de Produção (Modo Conservador)

**Feature Branch**: `009-production-tech-audit`

**Created**: 2026-06-18

**Status**: Draft

**Input**: User description: "Auditoria Técnica de Produção (Modo Conservador) — realizar uma auditoria técnica completa de um sistema em produção, identificar oportunidades de melhoria de baixo risco e aumentar a qualidade geral do projeto SEM alterar comportamento funcional existente. Estabilidade > elegância. Mudanças incrementais e justificadas. Sem refactors arquiteturais, sem troca de bibliotecas, sem breaking changes. Processo em 3 fases: (1) Auditoria, (2) Plano de Melhorias classificado, (3) Implementação apenas dos itens SAFE TO APPLY."

## Clarifications

### Session 2026-06-18

- Q: Como os itens "SAFE TO APPLY" devem ser entregues na Fase 3? → A: Em PRs pequenos e temáticos (um por categoria de baixo risco), cada um revisável e revertível isoladamente.
- Q: Qual o critério de versionamento para as Release Notes geradas? → A: Incremento de versão PATCH (semver), por se tratar exclusivamente de correções e melhorias internas sem mudança de comportamento.
- Q: O incremento PATCH é aplicado ao `version` dos manifestos (`package.json`) ou é só documental nas release notes? → A: É aplicado aos manifestos (`package.json` raiz + workspaces) **somente se** ao menos uma alteração `SAFE TO APPLY` for efetivamente aplicada; caso contrário, não há release e o bump não ocorre.

> **Nota de terminologia**: os rótulos em prosa **"SAFE TO APPLY"** / **"REQUIRES REVIEW"** usados nesta spec são idênticos aos valores de enum `SAFE_TO_APPLY` / `REQUIRES_REVIEW` empregados nos artefatos técnicos (`data-model.md`, `contracts/`, `tasks.md`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Relatório de Auditoria Técnica Completo (Priority: P1)

Como mantenedor de um sistema em produção, quero um relatório de auditoria técnica que cubra todas as dimensões do projeto (arquitetura, backend, frontend, qualidade de código, testes, observabilidade, segurança, performance, documentação e DevEx), para entender o estado real de qualidade do sistema e onde existem oportunidades de melhoria — sem que nada seja alterado durante o levantamento.

**Why this priority**: É a fundação de todo o trabalho. Sem um diagnóstico completo e confiável, qualquer plano ou alteração posterior carece de base. Entrega valor imediato mesmo se o trabalho parar aqui: o mantenedor obtém uma visão objetiva do estado do sistema.

**Independent Test**: Pode ser totalmente testado verificando que o relatório existe, cobre cada uma das dez dimensões obrigatórias, lista achados concretos com referências a arquivos/linhas, e que nenhum arquivo de código de produção foi modificado durante a fase de auditoria.

**Acceptance Scenarios**:

1. **Given** o sistema em produção funcional, **When** a auditoria é executada, **Then** é gerado um relatório que contém uma seção dedicada a cada uma das dez dimensões obrigatórias (Arquitetura, Backend, Frontend, Qualidade de Código, Testes, Observabilidade, Segurança, Performance, Documentação, DevEx).
2. **Given** um achado identificado, **When** ele é registrado no relatório, **Then** ele inclui uma referência rastreável (arquivo e, quando aplicável, linha) e uma descrição do problema observado.
3. **Given** a fase de auditoria em andamento, **When** ela é concluída, **Then** nenhum arquivo de código de produção, configuração de runtime ou esquema de banco de dados foi alterado.
4. **Given** uma dimensão sem problemas relevantes, **When** o relatório é gerado, **Then** essa dimensão é explicitamente marcada como "sem achados relevantes" em vez de ser omitida.

---

### User Story 2 - Plano de Melhorias Classificado e Priorizado (Priority: P2)

Como mantenedor, quero que cada achado da auditoria seja transformado em um item de plano com classificação de impacto, risco, esforço e recomendação, e rotulado como CRÍTICO/ALTO/MÉDIO/BAIXO e como SAFE TO APPLY ou REQUIRES REVIEW, para decidir com segurança o que pode ser aplicado de imediato e o que precisa de revisão humana antes de qualquer mudança.

**Why this priority**: Transforma o diagnóstico em decisões acionáveis e seguras. É o filtro de segurança que impede que mudanças arriscadas sejam aplicadas sem revisão. Depende do relatório (P1), mas entrega valor independente: o mantenedor pode usar o plano como backlog priorizado mesmo sem nenhuma implementação.

**Independent Test**: Pode ser testado verificando que existe uma tabela na qual cada achado da auditoria aparece exatamente uma vez com as cinco colunas (Problema, Impacto, Risco, Esforço, Recomendação) preenchidas, uma classificação de severidade (CRÍTICO/ALTO/MÉDIO/BAIXO) e um rótulo de aplicabilidade (SAFE TO APPLY/REQUIRES REVIEW), sem nenhum item sem classificação.

**Acceptance Scenarios**:

1. **Given** o relatório de auditoria concluído, **When** o plano de melhorias é gerado, **Then** cada achado é representado por uma linha de tabela com Problema, Impacto, Risco, Esforço e Recomendação preenchidos.
2. **Given** um item do plano, **When** ele é classificado, **Then** recebe exatamente uma severidade (CRÍTICO, ALTO, MÉDIO ou BAIXO) e exatamente um rótulo de aplicabilidade (SAFE TO APPLY ou REQUIRES REVIEW).
3. **Given** um item que altere comportamento, API, contrato externo, esquema de banco ou troque biblioteca, **When** ele é classificado, **Then** ele é obrigatoriamente rotulado como REQUIRES REVIEW.
4. **Given** o plano de melhorias, **When** ele é finalizado, **Then** nenhuma alteração de código foi aplicada (a fase é apenas de planejamento).

---

### User Story 3 - Aplicação Apenas das Melhorias Seguras (Priority: P3)

Como mantenedor, quero que somente os itens classificados como SAFE TO APPLY, de baixo risco e sem alteração funcional sejam efetivamente implementados, com um registro arquivo por arquivo do que mudou e uma lista justificada do que ficou de fora, para aumentar a qualidade do projeto preservando 100% do comportamento atual e mantendo total rastreabilidade.

**Why this priority**: É a entrega de valor tangível em qualidade, mas é a fase de maior risco. Por isso vem por último e é fortemente restrita. Depende do plano classificado (P2). Entrega melhorias reais (imports/código morto removidos, lint, logs, docs, observabilidade) sem tocar em comportamento.

**Independent Test**: Pode ser testado verificando que cada alteração aplicada está vinculada a um item SAFE TO APPLY do plano, que toda a suíte de testes existente continua passando, que não houve mudança em APIs públicas/contratos/esquema de banco, e que existe uma lista das melhorias não aplicadas com motivo, risco e recomendação futura.

**Acceptance Scenarios**:

1. **Given** o plano classificado, **When** a fase de implementação ocorre, **Then** apenas itens rotulados SAFE TO APPLY são aplicados, e cada alteração é rastreável até um item específico do plano.
2. **Given** as alterações aplicadas, **When** a suíte de testes existente é executada, **Then** todos os testes que passavam antes continuam passando, sem novas falhas.
3. **Given** itens REQUIRES REVIEW ou de risco não trivial, **When** a fase de implementação ocorre, **Then** eles NÃO são aplicados e são listados em "Melhorias Não Aplicadas" com motivo, risco e recomendação futura.
4. **Given** a remoção de uma funcionalidade ou qualquer breaking change, **When** considerada durante a implementação, **Then** ela não é executada sem confirmação explícita do mantenedor.
5. **Given** a fase concluída, **When** os entregáveis são produzidos, **Then** existem: relatório de auditoria, lista de alterações aplicadas (arquivo por arquivo), lista de melhorias não aplicadas, atualizações de documentação pertinentes e release notes.

---

### Edge Cases

- **Achado ambíguo (código aparentemente morto)**: quando não há certeza de que um trecho é realmente não utilizado (ex.: usado via reflexão, string dinâmica, export público consumido externamente, rota acessada por deep-link), o item é rebaixado para REQUIRES REVIEW e NÃO é removido — prevalece a regra "em caso de dúvida, não altere".
- **Falha de teste pré-existente**: se a suíte já tinha testes falhando antes da auditoria, isso é registrado como achado e o baseline é documentado; a fase de implementação não pode introduzir novas falhas, mas não é responsável por corrigir falhas pré-existentes sem que isso seja um item SAFE TO APPLY.
- **Achado crítico de segurança**: um achado CRÍTICO (ex.: secret exposto) é destacado no relatório; sua correção só é aplicada automaticamente se for comprovadamente SAFE TO APPLY (ex.: remover secret de arquivo versionado e mover para variável de ambiente sem alterar fluxo) — caso contrário, é REQUIRES REVIEW com recomendação urgente.
- **Mudança de lint que altera comportamento**: ajustes de lint/formatação que possam mudar semântica (ex.: reordenar efeitos colaterais, alterar coerção) são tratados como REQUIRES REVIEW, não como SAFE TO APPLY.
- **Inconsistência de documentação que reflete bug real**: quando a documentação diverge do comportamento porque o código está incorreto, corrige-se a documentação para refletir o comportamento atual e registra-se o bug como achado — não se altera o comportamento.
- **Conflito entre dimensões**: quando uma melhoria de performance reduziria observabilidade (ou vice-versa), o item é classificado como REQUIRES REVIEW com o trade-off explicitado.

## Requirements *(mandatory)*

### Functional Requirements

#### Fase 1 — Auditoria

- **FR-001**: A auditoria MUST produzir um relatório cobrindo todas as dez dimensões obrigatórias: Arquitetura, Backend, Frontend, Qualidade de Código, Testes, Observabilidade, Segurança, Performance, Documentação e DevEx.
- **FR-002**: A dimensão Arquitetura MUST avaliar estrutura de pastas, organização de módulos, acoplamento excessivo, violações de responsabilidade única, dependências circulares e duplicação de código.
- **FR-003**: A dimensão Backend MUST avaliar configuração do servidor HTTP, stack de middleware, compressão HTTP, segurança (headers, CORS, rate limiting, hardening), tratamento global de erros, logs, interceptors, validações, timeouts, políticas de retry, configuração de APIs externas, configuração do ORM, queries ineficientes, possíveis N+1 e uso de índices.
- **FR-004**: A dimensão Frontend MUST avaliar tamanho de bundle, lazy loading, code splitting, tree shaking, imports desnecessários, re-renders evitáveis, estado global, excesso de contexts, hooks duplicados, componentes mortos, assets pesados, imagens não otimizadas e performance geral.
- **FR-005**: A dimensão Qualidade de Código MUST identificar imports, variáveis, funções, métodos e componentes não utilizados; rotas, APIs, DTOs e entidades não utilizados; código comentado antigo e TODOs esquecidos.
- **FR-006**: A dimensão Testes MUST avaliar cobertura, testes frágeis, testes redundantes, lacunas críticas, qualidade dos mocks e testes E2E.
- **FR-007**: A dimensão Observabilidade MUST avaliar Sentry (ou equivalente), logging, alertas, tratamento de exceções, erros silenciosos e promises sem tratamento.
- **FR-008**: A dimensão Segurança MUST avaliar secrets expostos, uso de variáveis de ambiente, dependências vulneráveis, sanitização, XSS, CSRF, SQL Injection, SSRF, Open Redirect, rate limiting e uploads.
- **FR-009**: A dimensão Performance MUST avaliar consultas lentas, bundle excessivo, requisições redundantes, cache, memoização, renderizações desnecessárias e assets pesados.
- **FR-010**: A dimensão Documentação MUST avaliar consistência entre README, OpenAPI, specs, CLAUDE.md, AGENTS.md, ADRs, diagramas, scripts e demais arquivos `.md`.
- **FR-011**: A dimensão DevEx MUST avaliar scripts npm, CI/CD, lint, formatter, Husky, convenções de commit, processo de release e versionamento.
- **FR-012**: Cada achado registrado MUST incluir uma referência rastreável ao local (arquivo e, quando aplicável, linha) e uma descrição do problema observado.
- **FR-013**: Durante a Fase 1, o sistema MUST NOT alterar qualquer arquivo de código de produção, configuração de runtime ou esquema de banco de dados.

#### Fase 2 — Plano de Melhorias

- **FR-014**: O plano MUST conter uma tabela na qual cada achado é representado por uma linha com as colunas Problema, Impacto, Risco, Esforço e Recomendação preenchidas.
- **FR-015**: Cada item do plano MUST receber exatamente uma classificação de severidade dentre CRÍTICO, ALTO, MÉDIO e BAIXO.
- **FR-016**: Cada item do plano MUST receber exatamente um rótulo de aplicabilidade dentre SAFE TO APPLY e REQUIRES REVIEW.
- **FR-017**: Qualquer item que altere comportamento funcional, API existente, contrato externo, esquema de banco, ou que implique troca de biblioteca, refactor massivo ou mudança arquitetural MUST ser rotulado como REQUIRES REVIEW.
- **FR-018**: Itens com qualquer grau de incerteza sobre serem seguros MUST ser rotulados como REQUIRES REVIEW (princípio "em caso de dúvida, não altere").
- **FR-019**: Durante a Fase 2, o sistema MUST NOT aplicar nenhuma alteração de código (fase exclusivamente de planejamento).

#### Fase 3 — Implementação

- **FR-020**: A implementação MUST aplicar exclusivamente itens rotulados SAFE TO APPLY, de baixo risco e sem alteração funcional.
- **FR-021**: Cada alteração aplicada MUST ser rastreável até um item específico SAFE TO APPLY do plano.
- **FR-022**: O sistema MUST preservar integralmente o comportamento funcional atual, as APIs existentes, o esquema de banco de dados atual e a compatibilidade — sem breaking changes. (Contraparte negativa: ver FR-024 para as ações proibidas na Fase 3.)
- **FR-023**: O sistema MUST NOT remover funcionalidades nem realizar breaking changes sem confirmação explícita do mantenedor.
- **FR-024**: O sistema MUST NOT executar mudanças arquiteturais, troca de bibliotecas, refactors massivos, mudanças de comportamento ou mudanças de API durante a Fase 3. (Contraparte positiva: ver FR-022 para o que MUST ser preservado.)
- **FR-025**: Após a implementação, toda a suíte de testes existente MUST continuar passando, sem introdução de novas falhas em relação ao baseline registrado na Fase 1.
- **FR-026**: As alterações SAFE TO APPLY MUST ser entregues em PRs pequenos e temáticos (agrupados por categoria de baixo risco), cada um revisável e revertível isoladamente.

#### Entregáveis

- **FR-027**: O sistema MUST produzir um Relatório de Auditoria com todos os problemas encontrados.
- **FR-028**: O sistema MUST produzir uma Lista de Alterações Aplicadas, organizada arquivo por arquivo.
- **FR-029**: O sistema MUST produzir uma Lista de Melhorias Não Aplicadas, cada uma com motivo, risco e recomendação futura.
- **FR-030**: O sistema MUST atualizar a documentação pertinente (README, OpenAPI, CLAUDE.md, AGENTS.md, specs, changelog) quando os achados aplicados a tornarem desatualizada.
- **FR-031**: O sistema MUST gerar Release Notes para a versão resultante, com incremento de versão PATCH (semver), refletindo apenas correções e melhorias internas sem mudança de comportamento.
- **FR-032**: Quando ao menos uma alteração `SAFE TO APPLY` for efetivamente aplicada, o incremento PATCH (`0.1.0 → 0.1.1`) MUST ser aplicado de forma consistente ao campo `version` dos manifestos do projeto (raiz e cada workspace: `@vita/api`, `@vita/web`, `@vita/shared`) e aos campos `version` correspondentes do lockfile. Por não afetar comportamento, APIs nem resolução de dependências, este bump é classificado `SAFE TO APPLY`; a integridade cross-platform do `package-lock.json` MUST ser preservada (o lockfile NÃO deve ser regenerado no Windows). Se nenhuma alteração `SAFE TO APPLY` for aplicada, NÃO há release e o bump NÃO ocorre.

### Key Entities *(include if feature involves data)*

- **Achado (Finding)**: Um problema ou oportunidade identificado na auditoria. Atributos: dimensão, descrição, referência rastreável (arquivo/linha), evidência. Origina um ou mais Itens de Plano.
- **Item de Plano (Improvement Plan Item)**: Decisão derivada de um achado. Atributos: problema, impacto, risco, esforço, recomendação, severidade (CRÍTICO/ALTO/MÉDIO/BAIXO), aplicabilidade (SAFE TO APPLY/REQUIRES REVIEW). Relaciona-se a um Achado.
- **Alteração Aplicada (Applied Change)**: Mudança efetivamente realizada na Fase 3. Atributos: arquivo, descrição da mudança, item de plano de origem. Vincula-se obrigatoriamente a um Item de Plano SAFE TO APPLY.
- **Melhoria Não Aplicada (Deferred Improvement)**: Item não implementado nesta rodada. Atributos: motivo, risco, recomendação futura. Vincula-se a um Item de Plano.
- **Release Note**: Resumo das mudanças entregues. Atributos: versão resultante (incremento PATCH), lista de melhorias aplicadas, notas de compatibilidade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero regressões de comportamento — 100% dos testes que passavam antes da auditoria continuam passando após a implementação, e não há nenhuma alteração em APIs públicas, contratos externos ou esquema de banco de dados.
- **SC-002**: Cobertura total do diagnóstico — 100% das dez dimensões obrigatórias possuem uma seção no relatório (com achados ou marcação explícita de "sem achados relevantes").
- **SC-003**: Classificação completa — 100% dos achados que viram itens de plano possuem as cinco colunas preenchidas, uma severidade e um rótulo de aplicabilidade, sem itens não classificados.
- **SC-004**: Rastreabilidade total — 100% das alterações aplicadas são vinculáveis a um item de plano SAFE TO APPLY, e 100% dos itens não aplicados possuem motivo, risco e recomendação futura.
- **SC-005**: Aderência ao escopo conservador — 0 mudanças arquiteturais, 0 trocas de biblioteca, 0 breaking changes e 0 mudanças de comportamento foram aplicadas sem confirmação explícita.
- **SC-006**: Entregáveis completos — os cinco entregáveis obrigatórios (relatório de auditoria, lista de alterações aplicadas, lista de melhorias não aplicadas, atualizações de documentação pertinentes e release notes) estão presentes e completos.
- **SC-007**: Documentação consistente — após a entrega, não há divergências conhecidas e não documentadas entre a documentação atualizada e o comportamento real do sistema nas áreas tocadas.

## Assumptions

- O sistema está atualmente funcional em produção, com usuários reais; estabilidade prevalece sobre elegância técnica.
- A auditoria abrange todo o repositório (backend, frontend, infraestrutura como código versionada, documentação e tooling), e não um subconjunto.
- "SAFE TO APPLY" é definido como: alteração de baixo risco, sem efeito em comportamento observável, APIs, contratos, esquema de banco ou dependências — por exemplo: remoção de imports/variáveis/funções/componentes/rotas comprovadamente não utilizados, remoção de código comentado morto, ajustes de lint/formatação sem efeito semântico, melhorias de mensagens de log, melhorias de tratamento de erros e observabilidade que não mudem fluxo, pequenas otimizações de performance comprovadamente neutras e atualizações de documentação.
- Itens "REQUIRES REVIEW" não são aplicados nesta rodada; ficam documentados como recomendação futura.
- A confirmação para remover funcionalidades ou introduzir breaking changes, quando necessária, é obtida explicitamente do mantenedor antes de qualquer ação.
- O versionamento segue semver e o resultado desta auditoria conservadora corresponde a um incremento PATCH, aplicado ao `version` dos manifestos (raiz + workspaces) apenas se ao menos uma alteração `SAFE TO APPLY` for efetivamente aplicada (ver FR-032).
- As alterações são entregues via o fluxo Git/GitHub do projeto (branch → PR → merge), em PRs pequenos e temáticos, conforme o processo de contribuição vigente.
- O baseline de qualidade (testes que já passavam/falhavam, vulnerabilidades conhecidas) é registrado na Fase 1 para servir de referência objetiva à Fase 3.

## Out of Scope

- Reescrita, modernização ou refatoração livre do sistema.
- Mudanças arquiteturais profundas (reorganização de camadas, mudança de paradigma).
- Substituição de bibliotecas por preferência pessoal.
- Refactors puramente estéticos.
- Alteração de fluxos de negócio.
- Implementação de itens REQUIRES REVIEW nesta rodada.
- Correção de bugs funcionais pré-existentes que exijam mudança de comportamento (são registrados como achados/recomendações, não aplicados).
