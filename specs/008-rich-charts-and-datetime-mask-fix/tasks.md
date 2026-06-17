# Tasks: Rich Charts & Datetime Input Mask Fix

**Input**: Design documents from `/specs/008-rich-charts-and-datetime-mask-fix/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are requested explicitly in the specification (FR-011) to validate layout, axis overlapping prevention, mask formatting, and date verification.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are relative to the repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Instalação e configuração inicial de dependências de gráficos.

- [x] T001 Instalar a biblioteca `recharts` como dependência no arquivo [apps/web/package.json](file:///c:/projects/vita/apps/web/package.json)
- [x] T002 [P] Configurar tipos e compilerOptions do TypeScript em [apps/web/tsconfig.json](file:///c:/projects/vita/apps/web/tsconfig.json) para garantir compatibilidade com `recharts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criação de utilitários centrais de data/hora que bloqueiam a implementação das entradas retroativas.

- [x] T003 Implementar o utilitário de formatação de máscara `formatDateTimeMask(raw: string): string` no arquivo [apps/web/src/lib/date.ts](file:///c:/projects/vita/apps/web/src/lib/date.ts)
- [x] T004 Implementar o utilitário de validação lógica de datas `validateDateTimeString(formatted: string): boolean` no arquivo [apps/web/src/lib/date.ts](file:///c:/projects/vita/apps/web/src/lib/date.ts)
- [x] T005 [P] Escrever testes de unidade robustos cobrindo anos bissextos, limites numéricos e apagamento em [apps/web/src/lib/date.test.ts](file:///c:/projects/vita/apps/web/src/lib/date.test.ts)

**Checkpoint**: Foundation ready - a máscara de dados pode ser integrada e os gráficos podem ser refatorados.

---

## Phase 3: User Story 1 - Evolução de Gráficos sem Sobreposição (Priority: P1) 🎯 MVP

**Goal**: Substituir o gráfico SVG manual por Recharts com cálculo dinâmico e inteligente de ticks e responsividade.

**Independent Test**: Popular dados históricos na Home e redimensionar a viewport de 320px até resoluções desktop, checando se os textos não se encavalam.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Escrever testes de integração e renderização de layout do gráfico em [apps/web/src/components/TrendChart.test.tsx](file:///c:/projects/vita/apps/web/src/components/TrendChart.test.tsx)

### Implementation for User Story 1

- [x] T007 [US1] Refatorar o componente de visualização utilizando a biblioteca Recharts (`ResponsiveContainer`, `AreaChart`, etc.) consumindo as cores base Tailwind em [apps/web/src/components/TrendChart.tsx](file:///c:/projects/vita/apps/web/src/components/TrendChart.tsx)
- [x] T008 [US1] Ajustar a montagem de dados ativos de peso/pressão e controle de período em [apps/web/src/pages/Home.tsx](file:///c:/projects/vita/apps/web/src/pages/Home.tsx)

**Checkpoint**: User Story 1 está totalmente funcional e testável de forma isolada na Home do VITA.

---

## Phase 4: User Story 3 - Digitação Fluida na Entrada Retroativa de Data/Hora (Priority: P1)

**Goal**: Substituição do input nativo do navegador por máscara fluida que aceita digitação contínua sem quebrar no ano.

**Independent Test**: Marcar "registro retroativo" no modal e digitar continuamente `120620260130`. Verificar se formata como `12/06/2026 01:30` sem pular caracteres.

### Tests for User Story 3

- [X] T009 [P] [US3] Escrever testes de integração simulando digitação de 12 dígitos no input com máscara em [apps/web/src/components/ui/input.test.tsx](file:///c:/projects/vita/apps/web/src/components/ui/input.test.tsx) ou equivalente

### Implementation for User Story 3

- [X] T010 [P] [US3] Criar o componente utilitário de entrada mascarada `<DateTimeInput>` (ou reutilizável no wrapper do input padrão) em [apps/web/src/components/ui/input.tsx](file:///c:/projects/vita/apps/web/src/components/ui/input.tsx)
- [X] T011 [US3] Integrar o campo de texto mascarado e a validação client-side no modal de Peso [apps/web/src/components/WeightCaptureModal.tsx](file:///c:/projects/vita/apps/web/src/components/WeightCaptureModal.tsx)
- [X] T012 [US3] Integrar o campo de texto mascarado e a validação client-side no modal de Pressão [apps/web/src/components/BPCaptureModal.tsx](file:///c:/projects/vita/apps/web/src/components/BPCaptureModal.tsx)
- [X] T013 [US3] Atualizar a edição de registros de histórico para utilizar o input mascarado em [apps/web/src/pages/History.tsx](file:///c:/projects/vita/apps/web/src/pages/History.tsx)

**Checkpoint**: A entrada fluida está funcional para todos os cadastros históricos de métricas.

---

## Phase 5: User Story 2 - Gráfico em Tela Cheia e Rotação Automática (Priority: P2)

**Goal**: Permitir abrir o gráfico em overlay de tela cheia (CSS base) e rotacionar aparelhos celulares móveis para horizontal.

**Independent Test**: Clicar no botão expandir, constatar que o gráfico escala para 100vw/100vh e a orientação do dispositivo solicita landscape.

### Tests for User Story 2

- [X] T014 [P] [US2] Escrever testes de transição de estado de tela cheia e eventos de escape em [apps/web/src/components/TrendChart.test.tsx](file:///c:/projects/vita/apps/web/src/components/TrendChart.test.tsx)

### Implementation for User Story 2

- [X] T015 [P] [US2] Adicionar o botão de gatilho/fechamento com ícone Lucide correspondente em [apps/web/src/components/TrendChart.tsx](file:///c:/projects/vita/apps/web/src/components/TrendChart.tsx)
- [X] T016 [US2] Criar e aplicar classes de overlay fixo responsivo para tela cheia gerenciado via React state em [apps/web/src/components/TrendChart.tsx](file:///c:/projects/vita/apps/web/src/components/TrendChart.tsx)
- [X] T017 [US2] Codificar chamada e validação de permissões da API `screen.orientation.lock('landscape')` com escape gracioso em [apps/web/src/components/TrendChart.tsx](file:///c:/projects/vita/apps/web/src/components/TrendChart.tsx)

**Checkpoint**: Gráficos podem ser colocados em tela cheia de forma funcional e responsiva.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificações finais de responsividade, testes completos e validações de ambiente.

- [X] T018 [P] Rodar validações manuais descritas no guia [specs/008-rich-charts-and-datetime-mask-fix/quickstart.md](file:///c:/projects/vita/specs/008-rich-charts-and-datetime-mask-fix/quickstart.md)
- [X] T019 Executar testes completos do workspace frontend com `npm -w @vita/web run test` garantindo regressão zero
- [X] T020 [P] Executar linting global e formatação em todo o código alterado usando os scripts do repositório

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências, inicia imediatamente.
- **Foundational (Phase 2)**: Depende do Setup. Bloqueia a implementação das Stories.
- **User Story 1 e 3 (Phases 3 e 4)**: Podem começar em paralelo assim que as funções de data de Foundational estiverem prontas.
- **User Story 2 (Phase 5)**: Depende da refatoração inicial do Recharts (US1) estar madura.
- **Polish (Phase 6)**: Rodado ao final de todas as implementações das User Stories.

### Parallel Opportunities

- As tarefas `T001` e `T002` de Setup rodam em paralelo.
- As tarefas de testes e utilitários da máscara (`T005`, `T006`, `T009`, `T014`) podem ser escritas concorrentemente se houver mais de um dev.

---

## Parallel Example: User Story 3

```bash
# Executa em paralelo a codificação do componente de Input genérico
Task: "T010: Criar o componente utilitário de entrada mascarada <DateTimeInput>"

# E a escrita de testes de integração dos modais
Task: "T009: Escrever testes de integração simulando digitação de 12 dígitos"
```

---

## Implementation Strategy

### MVP First (User Story 1 - Gráficos sem Sobreposição)

1. Rodar Phase 1 (Setup) e preparar dependências.
2. Codificar refatoração do Recharts na Home (Phase 3).
3. Testar a responsividade e a correção dos ticks do eixo X.
4. **Validar MVP** em produção antes de seguir para telas cheias e inputs de dados retroativos.
