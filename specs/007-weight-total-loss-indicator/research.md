# Research: Weight Total Loss Indicator

This document outlines the design decisions and calculations for the Weight Total Loss Indicator.

## Key Design Decisions

### 1. Calculation Centralization in pure TypeScript
* **Decision**: Implement the calculation logic in `apps/web/src/utils/metrics.ts` as `calculateWeightTotalLoss(logs: WeightLog[])`.
* **Rationale**: Aligning with **Princípio V (Simplicidade Deliberada)** and **Princípio VII (Testes Orientados a Risco)**, this logic should be a pure function that is easily testable using Vitest, independent of React rendering.
* **Alternatives Considered**: Performing the calculation inline in `Home.tsx`. Rejected because it would mix rendering logic with mathematical calculations and make unit testing difficult.

### 2. Sign and Numeric Formatting of Total Loss
* **Decision**: Format the result to match the weekly loss metrics formatting:
  - If current weight is lower than the first weight (weight loss): Format with a minus sign `-` (e.g., `-5.0 kg`).
  - If current weight is higher than the first weight (weight gain): Format with a plus sign `+` (e.g., `+2.0 kg`).
  - If they are equal: Display as `0.0 kg`.
  - If there are no logs: Display as `N/A`.
* **Rationale**: While a positive result of `first - current` indicates weight loss, fitness users associate a negative sign with weight reduction (losing weight) and a plus sign with weight gain. Maintaining consistent signage with weekly averages provides a cohesive UX.

### 3. Responsive Metric Card Layout
* **Decision**: Display the 6 weight indicators in `Home.tsx` using a responsive grid:
  - Mobile/Small screens: `grid grid-cols-2 gap-3` (displays as three rows of two columns each).
  - Tablet/Medium screens: `md:grid-cols-3` (displays as two rows of three columns each).
  - Desktop/Large screens: `lg:grid-cols-6` (displays as a single row of six columns).
* **Rationale**: This guarantees a premium, highly readable layout that adapts perfectly from mobile devices (avoiding text overlap or horizontal scroll) to large desktop screens.
