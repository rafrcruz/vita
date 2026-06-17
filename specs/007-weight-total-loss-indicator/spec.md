# Feature Specification: Weight Total Loss Indicator

**Feature Branch**: `007-weight-total-loss-indicator`

**Created**: 2026-06-17

**Status**: Draft

**Input**: User description: "Quero um pequeno ajustes. Na parte do PESO, nos indicadores, eu quero inserir mais um indicador. Será o indicador de Perda Total, que vai mostrar em kg qual foi a perda total considerando o peso do primeiro registro, menos o peso atual (menor peso registrado no ultimo dia em que teve registro). deve ficar na ordem ultima medição, peso atual, perda total, ai as perdas semanais de 7D, 30D e Total. sempre implementar tomando o cuidado para continuar bacana tanto na experiencia no computador como no celular."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Weight Total Loss Indicator (Priority: P1)

As a user tracking my fitness/health journey, I want to see a "Total Loss" (Perda Total) indicator alongside my other weight indicators, so that I can see the overall change from my first recorded weight to my current weight at a glance.

**Why this priority**: High value for the user, directly requested, and simple to compute while keeping the dashboard motivating.

**Independent Test**: Add a weight record of 80 kg on the first day, and 75 kg on a later day. Check that the indicators display in the correct order, and that "Perda Total" displays as "-5,0 kg" (or "-5.0 kg" depending on locale).

**Acceptance Scenarios**:

1. **Given** the weight dashboard is open, **When** metrics are calculated, **Then** the "Perda Total" indicator displays the change between the first recorded weight and the current weight (lowest weight of the last day with records).
2. **Given** the user has lost weight overall, **When** the "Perda Total" indicator is rendered, **Then** it shows the difference formatted with a minus (`-`) sign (e.g., `-5.0 kg`).
3. **Given** the user has gained weight overall, **When** the "Perda Total" indicator is rendered, **Then** it shows the difference formatted with a plus (`+`) sign (e.g., `+2.0 kg`).
4. **Given** the user's first and current weight are equal, **When** the "Perda Total" indicator is rendered, **Then** it displays `0.0 kg`.

---

### User Story 2 - Order of Indicators and Responsive Design (Priority: P1)

As a user accessing VITA from both mobile and desktop devices, I want the weight indicators to be presented in a specific logical order and layout that adapts beautifully to different screen sizes, so that I have a consistent and premium user experience.

**Why this priority**: Directly requested layout requirements and critical for device responsiveness.

**Independent Test**: Resize the window to mobile width and verify that the cards stack or grid gracefully without truncation or horizontal scrolling, and that the order is: última medição, peso atual, perda total, 7D, 30D, Total.

**Acceptance Scenarios**:

1. **Given** the weight dashboard is open, **When** indicators are displayed, **Then** the order of the weight indicators MUST be:
   1. Última medição (Last measurement)
   2. Peso atual (Current weight)
   3. Perda total (Total loss)
   4. Perda semanal 7D (7D weekly average)
   5. Perda semanal 30D (30D weekly average)
   6. Perda semanal Total (Total weekly average)
2. **Given** a desktop screen width, **When** indicators are rendered, **Then** they display in a multi-column row layout (e.g., 6 columns or 3x2 grid) that makes efficient use of desktop space.
3. **Given** a mobile screen width, **When** indicators are rendered, **Then** they wrap/stack cleanly (e.g., a 2-column grid or single column list) to avoid truncation, text overlapping, or horizontal overflow.

---

### Edge Cases

- **Zero records in the system**: When there are no weight logs, the "Perda Total" indicator should gracefully display "N/A" (or "0.0 kg" as a safe fallback) without causing application runtime errors.
- **Single record in the system**: When only one weight log exists, the first record is also the current weight. The total loss must display as `0.0 kg` and not throw division-by-zero or undefined errors.
- **Multiple records on the first day / last day**:
  - The first record's weight should be determined correctly. If multiple logs exist on the very first day, we use the first logged record chronologically.
  - The current weight is defined as the lowest weight recorded on the most recent day containing data (matching existing "Peso atual" logic).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001 (Total Loss Calculation)**: The system MUST calculate "Perda Total" as `firstWeight - currentWeight`.
  - `firstWeight` is the weight of the chronologically earliest record in the database.
  - `currentWeight` is the lowest weight of the latest day with records.
- **FR-002 (Total Loss Sign Formatting)**:
  - If `currentWeight` < `firstWeight` (weight loss), the value MUST be displayed with a minus (`-`) sign (e.g., `-5.0 kg`).
  - If `currentWeight` > `firstWeight` (weight gain), the value MUST be displayed with a plus (`+`) sign (e.g., `+2.0 kg`).
  - If `currentWeight` == `firstWeight`, the value MUST be displayed as `0.0 kg`.
- **FR-003 (Indicators Order)**: The indicators under the weight chart MUST be displayed in the following order:
  1. Última medição (Last measurement)
  2. Peso atual (Current weight)
  3. Perda total (Total loss)
  4. Perda semanal (7d)
  5. Perda semanal (30d)
  6. Perda semanal (Total)
- **FR-004 (Responsive Layout)**: The layout container for weight indicators MUST adapt dynamically between desktop and mobile viewport sizes:
  - Desktop: Grid or row layout utilizing horizontal space.
  - Mobile: Wrapping or stacking grid layout ensuring readability and touch friendliness.
- **FR-005 (Safe Fallback)**: The calculation logic MUST handle empty state (no records) by returning `null`, and formatting it as `N/A`.

### Key Entities

- **WeightRecord**: Represents a single weight measurement, containing `weight` (numeric value), `loggedAt` (date/time of recording).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of indicators are readable on viewport widths down to 320px without horizontal scrollbars or text overlapping.
- **SC-002**: Computation of the "Perda Total" indicator executes in under 5ms client-side as part of the React memoization payload.
- **SC-003**: 100% of unit tests for the total loss calculation logic pass, covering empty state, single record, multiple records, and weight loss/gain scenarios.

## Assumptions

- The styling uses Tailwind CSS classes matching the existing project design tokens.
- We assume that the user's timezone context is correctly handled by local day string operations already present in the utilities.
