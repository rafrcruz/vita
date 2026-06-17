# Tasks: UX, Charts, and Metrics Improvements (Revisions)

**Input**: Design documents from `/specs/006-ux-charts-and-metrics/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US2, US3)
- Exact file paths are specified in descriptions.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initial verification that the workspace and dev environment are ready for calculations.

- [x] T001 Verify project environment is ready for mathematical utility updates

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core calculation functions and unit tests verifying linear interpolation and formatting signs. No UI implementation can start until this phase completes.

- [x] T002 [P] Write unit tests in `apps/web/src/utils/metrics.test.ts` verifying daily weight linear interpolation, sub-period intersections, and formatting signs
- [x] T003 [P] Implement the linear interpolation weight utility and weekly average rate calculation functions in `apps/web/src/utils/metrics.ts`

**Checkpoint**: Foundation ready - calculations and tests are verified; user story UI implementation can now begin.

---

## Phase 3: User Story 2 - Advanced Weight & Blood Pressure Analytics (Priority: P1)

**Goal**: Display revised linear interpolation metrics and proper +/- visual change indicators on the dashboard.

**Independent Test**: Register weights on different days and verify that weekly loss averages display with a minus sign (-) and gains display with a plus sign (+).

### Implementation for User Story 2

- [x] T004 [US2] Update `apps/web/src/pages/Home.tsx` to integrate the new linear interpolation weight change calculator
- [x] T005 [US2] Update weight details metrics formatting in `apps/web/src/pages/Home.tsx` to print negative signs for weight loss (`-X.X kg/sem`) and positive signs for weight gain (`+X.X kg/sem`)

**Checkpoint**: Weight and BP analytics indicators are verified and formatted correctly on the dashboard.

---

## Phase 4: User Story 3 - Timeframe Chart Displays (Priority: P2)

**Goal**: Apply timeframe-specific date representation and same-day lowest aggregation on the charts.

**Independent Test**: Switch between 7D, 30D, and ALL views on both charts and verify that Weight aggregates same-day entries on 30D/ALL but shows times on 7D, whereas BP always displays all measurements with times.

### Implementation for User Story 3

- [x] T006 [US3] Update data preparation and `formatTick` in `apps/web/src/components/TrendChart.tsx` to aggregate Weight chart same-day entries to their daily lowest value when in `Tudo` or `30D` views, displaying daily dates on the X-axis
- [x] T007 [US3] Update data preparation and `formatTick` in `apps/web/src/components/TrendChart.tsx` to display date and time (`DD/MM HH:MM`) for all Weight points in the `7D` view
- [x] T008 [US3] Update data preparation and `formatTick` in `apps/web/src/components/TrendChart.tsx` to always display all logs with date and time (`DD/MM HH:MM`) for the Blood Pressure chart in all timeframes (`7D`, `30D`, and `Tudo`)
- [x] T009 [US3] Adjust TrendChart unit tests in `apps/web/src/components/TrendChart.test.tsx` to align with the new daily lowest aggregation and BP time resolution

**Checkpoint**: Charts display logs matching the timeframe aggregation rules.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verification and validation check execution.

- [x] T010 Run the Vitest test suite on the frontend package via `npm run test --prefix apps/web` to confirm that all unit tests pass successfully
- [x] T011 Manually execute all verification scenarios documented in `quickstart.md` to ensure correct integration

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all UI implementation.
- **User Stories (Phases 3 and 4)**: Depend on Foundational (Phase 2).
  - User Story 2 (P1) and User Story 3 (P2) can proceed in parallel once foundational functions are stable.
- **Polish (Phase 5)**: Depends on completion of all implementation phases.

### Parallel Opportunities

- Foundational test writing (`T002`) and utility implementation (`T003`) can run in parallel.
- Once Phase 2 (Foundational) completes, User Story 2 and User Story 3 can be developed concurrently.

---

## Parallel Example: Foundational Setup

```bash
# Set up test files and implement test scripts concurrently:
Task: "Write unit tests in apps/web/src/utils/metrics.test.ts verifying daily weight linear interpolation, sub-period intersections, and formatting signs"
Task: "Implement the linear interpolation weight utility and weekly average rate calculation functions in apps/web/src/utils/metrics.ts"
```

---

## Implementation Strategy

### MVP First (User Story 2 Only)

1. Complete Setup and Foundational math formulas (Phases 1 & 2).
2. Complete indicators updates on Home dashboard (Phase 3 - User Story 2).
3. **STOP and VALIDATE**: Confirm calculations display correctly with proper +/- formatting.

### Incremental Delivery

1. Deliver Health Averages using daily linear interpolation (P1).
2. Deliver Chart timeframe-specific aggregation (P2).
