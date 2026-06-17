# Tasks: Weight Total Loss Indicator

**Input**: Design documents from `/specs/007-weight-total-loss-indicator/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `apps/web/src/`
- Paths shown below refer to the monorepo structure in VITA.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and validation of workspace cleanliness.

- [X] T001 Verify workspace cleanliness and run tests to establish baseline in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core calculations and utilities that must be implemented and verified before UI changes are made.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Implement calculateWeightTotalLoss utility function in apps/web/src/utils/metrics.ts
- [X] T003 [P] Add unit tests for calculateWeightTotalLoss in apps/web/src/utils/metrics.test.ts

**Checkpoint**: Foundation ready - calculations are verified and tested. User story UI components can now be built.

---

## Phase 3: User Story 1 - View Weight Total Loss Indicator (Priority: P1) 🎯 MVP

**Goal**: Compute and display the Total Loss metric in the Home dashboard.

**Independent Test**: Add sample weight logs (e.g., 80 kg and 75 kg). Access the dashboard and verify that the "Perda Total" indicator card calculates the weight change correctly and formats it with a minus sign (`-5.0 kg`).

### Implementation for User Story 1

- [X] T004 [US1] Update Home page calculatedWeightMetrics React memo selector to compute totalLoss in apps/web/src/pages/Home.tsx
- [X] T005 [US1] Create indicator card markup and display value for Perda Total in apps/web/src/pages/Home.tsx

**Checkpoint**: At this point, the "Perda Total" metric should be fully functional, calculated, and visible.

---

## Phase 4: User Story 2 - Order of Indicators and Responsive Design (Priority: P1)

**Goal**: Display weight indicators in the specified order and implement a premium responsive layout.

**Independent Test**: Resize the window to mobile view (e.g., 320px). Ensure the cards stack gracefully in a 2-column or single-column layout without overlapping text, and verify they are displayed in the exact order: última medição, peso atual, perda total, 7D, 30D, Total.

### Implementation for User Story 2

- [X] T006 [US2] Update Weight indicator cards layout structure and order in apps/web/src/pages/Home.tsx
- [X] T007 [P] [US2] Apply Tailwind CSS responsive grid classes to the indicators container in apps/web/src/pages/Home.tsx

**Checkpoint**: All user stories should now be independently functional, responsive, and matching the requested order.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verification and final quality adjustments.

- [X] T008 [P] Run Vitest unit tests suite with npm run test to verify all mathematical formulas pass
- [X] T009 Run quickstart.md validation in specs/007-weight-total-loss-indicator/quickstart.md to verify user flows manually on desktop and mobile viewports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  - User stories can proceed sequentially in priority order (US1 → US2) or in parallel.
- **Polish (Final Phase)**: Depends on both user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) is complete.
- **User Story 2 (P2)**: Can start after US1 is functional to verify correct ordering and grid placement.

### Parallel Opportunities

- Unit tests writing (T003) can be performed in parallel with code adjustments if split.
- Layout order adjustments (T006) and applying Tailwind grid responsiveness (T007) are highly parallelizable.

---

## Parallel Example: User Story 2

```bash
# Apply layout ordering and apply responsive Tailwind grid properties in parallel:
Task: "Update Weight indicator cards layout structure and order in apps/web/src/pages/Home.tsx"
Task: "Apply Tailwind CSS responsive grid classes to the indicators container in apps/web/src/pages/Home.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1) to enable the Total Loss indicator card.
3. Validate User Story 1 works correctly.

### Incremental Delivery

1. Verify foundation is complete.
2. Implement User Story 1 (displays Total Loss card).
3. Implement User Story 2 (places cards in correct order: Last, Current, Total, 7D, 30D, Total; and makes them responsive).
4. Run validation and verify layout looks perfect on all screens.
