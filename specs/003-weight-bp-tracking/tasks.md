# Tasks: Weight & Blood Pressure Tracking

**Input**: Design documents from `/specs/003-weight-bp-tracking/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/api.md](./contracts/api.md)

**Tests**: Test tasks are included per **Princípio VII (Testes Orientados a Risco)** of the VITA Constitution, specifically covering input validators, parsing mechanisms, and timeframe aggregations.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend API**: `apps/api/src/`
- **Frontend Web**: `apps/web/src/`
- **Shared Package**: `packages/shared/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database extensions and shared validation schemas configuration.

- [x] T001 Define database schema tables for `weight_logs` and `blood_pressure_logs` in `apps/api/src/db/schema.ts`
- [x] T002 [P] Create health validation Zod schemas and types in `packages/shared/src/health.ts`
- [x] T003 Export health validation schemas and types in `packages/shared/src/index.ts`
- [x] T004 Build shared package to update monorepo dependencies by running `npm run build --prefix packages/shared`


---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database migrations, backend routers setup, and endpoint registration.

**⚠️ CRITICAL**: No user story implementation can begin until these core routing and DB setups are completed.

- [x] T005 Generate database migration files using Drizzle Kit by running `npm run db:generate --prefix apps/api`
- [x] T006 Apply migrations to the Neon Postgres database by running `npm run db:migrate --prefix apps/api`
- [x] T007 [P] Create Express router for health metrics in `apps/api/src/health_metrics/metrics.route.ts`
- [x] T008 Mount health metrics router under `/api/metrics` using requireAuth guard in `apps/api/src/app.ts`


**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Registro Rápido de Peso Corporal (Priority: P1) 🎯 MVP

**Goal**: Enable quick, one-handed mobile capture of body weight with comma/dot decimal parsing.

**Independent Test**: Use the "Adicionar Peso" modal, input `80,4` (comma notation), and verify that it parses successfully to `80.4`, closes the modal, and renders the success toast.

### Tests for User Story 1

- [x] T009 [P] [US1] Write unit tests for decimal parser utility in `apps/api/src/health_metrics/metrics.test.ts`
- [x] T010 [P] [US1] Write integration tests for POST `/api/metrics/weight` validator and constraints (weight bounds 20-350) in `apps/api/src/health_metrics/metrics.test.ts`

### Implementation for User Story 1

- [x] T011 [US1] Implement decimal parsing utility and weight validation service in `apps/api/src/health_metrics/metrics.service.ts`
- [x] T012 [US1] Implement POST `/api/metrics/weight` endpoint using validation service in `apps/api/src/health_metrics/metrics.route.ts`
- [x] T013 [P] [US1] Define React Query mutation for weight logging in `apps/web/src/services/api.ts`
- [x] T014 [US1] Implement mobile-friendly input popup component in `apps/web/src/components/WeightCaptureModal.tsx`
- [x] T015 [US1] Integrate `WeightCaptureModal` and button trigger in the primary layout of `apps/web/src/pages/Dashboard.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently as an MVP.

---

## Phase 4: User Story 2 - Registro Rápido de Pressão Arterial (Priority: P1)

**Goal**: Enable quick logging of systolic and diastolic blood pressure values with automatic next field focus.

**Independent Test**: Use the "Adicionar Pressão" modal, input `120` (systolic), press Tab, input `80` (diastolic), save and verify success toast.

### Tests for User Story 2

- [x] T016 [P] [US2] Write unit tests for blood pressure bounds validations (systolic 40-300, diastolic 30-200) in `apps/api/src/health_metrics/metrics.test.ts`
- [x] T017 [P] [US2] Write integration tests for POST `/api/metrics/blood-pressure` in `apps/api/src/health_metrics/metrics.test.ts`

### Implementation for User Story 2

- [x] T018 [US2] Implement blood pressure save logic and validators in `apps/api/src/health_metrics/metrics.service.ts`
- [x] T019 [US2] Implement POST `/api/metrics/blood-pressure` endpoint in `apps/api/src/health_metrics/metrics.route.ts`
- [x] T020 [P] [US2] Define React Query mutation for blood pressure logging in `apps/web/src/services/api.ts`
- [x] T021 [US2] Implement input popup component with focus-shifting behaviour in `apps/web/src/components/BPCaptureModal.tsx`
- [x] T022 [US2] Integrate `BPCaptureModal` and button trigger in `apps/web/src/pages/Dashboard.tsx`

**Checkpoint**: User Stories 1 and 2 are both functional and testable.

---

## Phase 5: User Story 3 - Visualização Histórica e Tendências Visuais (Priority: P1)

**Goal**: Render responsive SVG-based trend charts with timeframe toggling (7D/30D/Tudo) and a clean empty state.

**Independent Test**: Load the dashboard with no records and confirm the "Sem dados cadastrados" message. Add some data, toggle the filters, and verify the chart updates in under 150ms.

### Tests for User Story 3

- [x] T023 [P] [US3] Write integration tests for GET `/api/metrics/weight` and GET `/api/metrics/blood-pressure` verifying timeframe filters in `apps/api/src/health_metrics/metrics.test.ts`

### Implementation for User Story 3

- [x] T024 [US3] Implement database query filters for timeframe (7d, 30d, all) in `apps/api/src/health_metrics/metrics.service.ts`
- [x] T025 [US3] Implement GET `/api/metrics/weight` and GET `/api/metrics/blood-pressure` endpoints in `apps/api/src/health_metrics/metrics.route.ts`
- [x] T026 [P] [US3] Define React Query hooks for retrieving historical data in `apps/web/src/services/api.ts`
- [x] T027 [US3] Implement custom SVG trend visualizer in `apps/web/src/components/TrendChart.tsx`
- [x] T028 [US3] Implement metric selector (Peso / Pressão) and timeframe toggle buttons (7D / 30D / Tudo) in `apps/web/src/pages/Dashboard.tsx`
- [x] T029 [US3] Integrate `TrendChart` on the dashboard screen `apps/web/src/pages/Dashboard.tsx`

**Checkpoint**: Capture and analysis of weight and BP are fully integrated on the home dashboard.

---

## Phase 6: User Story 4 - Gerenciamento de Histórico (Priority: P2)

**Goal**: Consult, edit, and delete logged weight and BP entries chronologically on a separate view.

**Independent Test**: Open the "/history" route, click edit on a record, save changes, and confirm updates in the list. Delete a record and confirm removal.

### Tests for User Story 4

- [x] T030 [P] [US4] Write integration tests for PUT and DELETE `/api/metrics/weight/:id` and `/api/metrics/blood-pressure/:id` in `apps/api/src/health_metrics/metrics.test.ts`

### Implementation for User Story 4

- [x] T031 [US4] Implement database update/delete query handlers in `apps/api/src/health_metrics/metrics.service.ts`
- [x] T032 [US4] Implement PUT/DELETE endpoints for weight and BP in `apps/api/src/health_metrics/metrics.route.ts`
- [x] T033 [P] [US4] Define React Query mutations for update/delete in `apps/web/src/services/api.ts`
- [x] T034 [US4] Implement the chronological history log list component in `apps/web/src/pages/History.tsx`
- [x] T035 [US4] Add navigation route link to History page in the main layout `apps/web/src/pages/Dashboard.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Performance checks, offline assets caching for PWA, and final manual validation.

- [x] T036 Configure PWA asset caching for the new views in `apps/web/vite.config.ts`
- [x] T037 Audit application logs to ensure no sensitive medical numbers are printed in `apps/api/src/observability/`
- [x] T038 Execute final manual end-to-end validations using `specs/003-weight-bp-tracking/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all User Stories.
- **User Stories (Phases 3-6)**: Depend on Foundational (Phase 2).
  - Can proceed sequentially (US1 -> US2 -> US3 -> US4).
- **Polish (Phase 7)**: Depends on all User Stories completion.

### User Story Dependencies

- **User Story 1 (US1)**: Independent of other stories.
- **User Story 2 (US2)**: Independent of other stories.
- **User Story 3 (US3)**: Integrates with US1 and US2 queries.
- **User Story 4 (US4)**: Depends on US1/US2 database models and schemas.

### Parallel Opportunities

- **Setup tasks** (T002) can run in parallel.
- **Router setup** (T007) can run in parallel with Drizzle Setup.
- **Tests** (T009 & T010, T016 & T017) can be run concurrently.
- Once Phase 2 is complete, US1 (Weight) and US2 (Blood Pressure) implementation can run completely in parallel since they touch different routes and components.

---

## Parallel Example: User Story 1

```bash
# Developer A writes backend validations and tests:
T009 [P] [US1] Write unit tests for decimal parser utility in apps/api/src/health_metrics/metrics.test.ts
T010 [P] [US1] Write integration tests for POST /api/metrics/weight in apps/api/src/health_metrics/metrics.test.ts

# Developer B works on front-end assets:
T013 [P] [US1] Define React Query mutation for weight logging in apps/web/src/services/api.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2 Capture)

1. Complete Setup (Phase 1) & Foundational (Phase 2).
2. Complete US1 (Weight Capture) and US2 (BP Capture).
3. Validate capture interfaces and database persistence using simulated mobile screens.

### Incremental Delivery

1. **Milestone 1 (Capture Core)**: Weight & BP logs can be submitted from the main screen.
2. **Milestone 2 (Visualization)**: Dashboard renders historical trend lines with filter toggles.
3. **Milestone 3 (Management)**: History list with edit/delete actions is published.
