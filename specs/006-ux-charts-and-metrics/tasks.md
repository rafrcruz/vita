# Tasks: UX, Charts, and Metrics Improvements

**Input**: Design documents from `/specs/006-ux-charts-and-metrics/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths are specified in descriptions.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initial project folder setup for calculations and test suites.

- [x] T001 Create analytical utility and test files under `apps/web/src/utils/metrics.ts` and `apps/web/src/utils/metrics.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core calculation functions and unit tests verifying date conversions, fallback calculations, and averages. No UI implementation can start until this phase completes.

- [x] T002 [P] Write unit tests in `apps/web/src/utils/metrics.test.ts` verifying birthdate display-to-API and API-to-display conversion helper functions
- [x] T003 [P] Implement `toDisplayDate` and `toApiDate` helper functions in `apps/web/src/utils/metrics.ts` to convert between `YYYY-MM-DD` and `DD/MM/YYYY`
- [x] T004 [P] Write unit tests in `apps/web/src/utils/metrics.test.ts` verifying weight loss fallback logic and blood pressure average statistics under all boundary conditions
- [x] T005 Implement weight loss fallback calculator and BP timeframe averaging functions in `apps/web/src/utils/metrics.ts`

**Checkpoint**: Foundation ready - calculations and tests are verified; user story UI implementation can now begin.

---

## Phase 3: User Story 1 - Birthdate Input Usability (Priority: P1) 🎯 MVP

**Goal**: Enable keyboard typing of the birthdate field with format masking, eliminating the calendar datepicker.

**Independent Test**: Navigate to the Profile screen, enter "13/02/1988" manually, and verify validation and successful profile saving.

### Implementation for User Story 1

- [x] T006 [US1] Implement text change input masking logic in `apps/web/src/pages/Profile.tsx` to auto-insert slashes (DD/MM/YYYY) and limit input length to 10 characters
- [x] T007 [US1] Update state initialization and submission in `apps/web/src/pages/Profile.tsx` to translate profile birthdate values between API format (`YYYY-MM-DD`) and display format (`DD/MM/YYYY`)
- [x] T008 [US1] Update validation and error layout in `apps/web/src/pages/Profile.tsx` to handle incorrect dates, years < 1900, or future dates
- [x] T009 [US1] Adjust Profile unit tests in `apps/web/src/pages/Profile.test.tsx` to align with the text input behavior and test masking validations

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Advanced Weight & Blood Pressure Analytics (Priority: P1)

**Goal**: Display analytics metrics (current weight, weekly weight loss rate, and blood pressure averages) beneath the charts on the dashboard.

**Independent Test**: Register weight and blood pressure readings across multiple dates and verify that correct metrics are displayed below the charts.

### Implementation for User Story 2

- [x] T010 [US2] Modify `apps/web/src/pages/Home.tsx` to fetch the complete historical dataset (`timeframe='all'`) for both weight and blood pressure logs, regardless of the active chart timeframe
- [x] T011 [US2] Integrate the metrics calculations in `apps/web/src/pages/Home.tsx` to calculate Weight and BP metrics for Total, 30d, and 7d periods
- [x] T012 [US2] Build and render the weight metrics indicators block below the weight chart in `apps/web/src/pages/Home.tsx`
- [x] T013 [US2] Build and render the blood pressure metrics indicators block below the blood pressure chart in `apps/web/src/pages/Home.tsx`

**Checkpoint**: Weight and BP analytics indicators are verified and visible on the dashboard.

---

## Phase 5: User Story 3 - Detailed Chart Time Resolution & Readability (Priority: P2)

**Goal**: Display hours/minutes on chart X-axis ticks for same-day measurements/short ranges, and restore full contrast visibility to Y-axis ticks.

**Independent Test**: Add multiple logs on the same day and verify the chart X-axis prints timestamps and the Y-axis numbers have strong contrast.

### Implementation for User Story 3

- [x] T014 [US3] Modify the X-axis `formatTick` function inside `apps/web/src/components/TrendChart.tsx` to print date and time (`DD/MM HH:MM`) when there are duplicate days in the active dataset or when `xRange` is <= 7 days
- [x] T015 [US3] Restructure the SVG elements in `apps/web/src/components/TrendChart.tsx` to extract the Y-axis `<text>` elements from the `opacity-20` line group, ensuring high text contrast in both light and dark themes

**Checkpoint**: Chart ticks display correct timestamps and have legible contrast.

---

## Phase 6: User Story 4 - Premium Modal Animations & Exit Button Visuals (Priority: P3)

**Goal**: Update modal transitions on desktop to fade/zoom centered, and add an exit icon to the logout button.

**Independent Test**: Trigger the weight modal and observe centered zoom entry. Locate the "Sair" button and verify the exit icon.

### Implementation for User Story 4

- [x] T016 [US4] Update position transition layout classes on `DialogContent` in `apps/web/src/components/ui/dialog.tsx` to prevent positional slide transitions on desktop (sm+), preserving centered fade-in and scale-zoom transitions
- [x] T017 [US4] Add a standard log-out icon (from `lucide-react`) next to the "Sair" button labels in the headers of `apps/web/src/pages/Home.tsx` and `apps/web/src/pages/Profile.tsx`

**Checkpoint**: Modal animations are polished and the logout button displays the exit icon.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification and validation check execution.

- [x] T018 Run the Vitest test suite on the frontend package via `npm run test --prefix apps/web` to confirm that all unit tests pass successfully
- [x] T019 Manually execute all verification scenarios documented in `quickstart.md` to ensure correct integration

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all UI implementation.
- **User Stories (Phases 3 to 6)**: All depend on Foundational (Phase 2).
  - User Story 1 (P1) and User Story 2 (P1) can proceed in parallel.
  - User Story 3 (P2) depends on User Story 2 metrics implementation but can proceed in parallel once foundational functions are stable.
  - User Story 4 (P3) is independent and can be worked on at any time.
- **Polish (Phase 7)**: Depends on completion of all implementation phases.

### Parallel Opportunities

- Foundational test writing (`T002`, `T004`) and file setup (`T001`) can run in parallel.
- Once Phase 2 (Foundational) completes, User Story 1 and User Story 2 can be developed concurrently.
- Polish phase verification (`T018`) runs in parallel across all packages.

---

## Parallel Example: Foundational Setup

```bash
# Set up test files and implement test scripts concurrently:
Task: "Write unit tests in apps/web/src/utils/metrics.test.ts verifying birthdate display-to-API and API-to-display conversion helper functions"
Task: "Write unit tests in apps/web/src/utils/metrics.test.ts verifying weight loss fallback logic and blood pressure average statistics under all boundary conditions"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational math formulas (Phases 1 & 2).
2. Complete Profile Date of Birth input masking and validation (Phase 3 - User Story 1).
3. **STOP and VALIDATE**: Open the Profile screen and test entering a date manually. Confirm validation and successful database write.

### Incremental Delivery

1. Deliver Birthdate input mask (P1).
2. Deliver Dashboard Health Metrics cards (P1).
3. Deliver Chart X/Y improvements (P2).
4. Deliver Modal transitions and sign-out icon (P3).
