# Implementation Plan: Weight Total Loss Indicator

**Branch**: `007-weight-total-loss-indicator` | **Date**: 2026-06-17 | **Spec**: [spec.md](file:///c:/projects/vita/specs/007-weight-total-loss-indicator/spec.md)

**Input**: Feature specification from `/specs/007-weight-total-loss-indicator/spec.md`

## Summary

Add a "Perda Total" (Total Weight Loss) indicator to the Weight metrics section of the home page dashboard. The value represents the total difference between the chronologically earliest recorded weight and the current weight (defined as the lowest weight of the last day with records). The formatting uses a minus sign (`-`) for loss, a plus sign (`+`) for gain, and `0.0 kg` for no change. The layout will adapt dynamically using a responsive grid to ensure a premium experience on both desktop and mobile devices.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 22.x

**Primary Dependencies**: React 18, Tailwind CSS, Lucide React

**Storage**: PostgreSQL (via Drizzle ORM) - existing schema for `weight_logs`

**Testing**: Vitest (for unit testing calculation and formatting utility functions)

**Target Platform**: Progressive Web App (PWA)

**Project Type**: Monorepo Web Application

**Performance Goals**: Computation of the "Perda Total" metric executes in under 5ms, maintaining dashboard load/render times under 150ms.

**Constraints**: Computations are performed client-side on the loaded history payload to align with Simplicidade Deliberada (Principle V).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                          | Status | Justification                                                                                                                    |
| ---------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **I. Observabilidade de Saúde**    | Pass   | Displays in-memory calculations of weight changes. Does not provide clinical advice or diagnostics.                              |
| **II. Privacidade e Segurança**    | Pass   | Health log details are processed in-memory client-side and not logged. Auth is unchanged.                                        |
| **III. Acesso Restrito**           | Pass   | Access is secured using Google OAuth and allowlist check. No modifications to auth.                                              |
| **IV. Stack e Arquitetura**        | Pass   | Built within the React TypeScript PWA frontend and Node backend stack.                                                           |
| **V. Simplicidade Deliberada**     | Pass   | Centralized mathematical calculations in client-side TypeScript utility helper, avoiding database aggregations.                  |
| **VI. Dependências Sustentáveis**  | Pass   | No new external libraries or packages are added.                                                                                 |
| **VII. Testes Orientados a Risco** | Pass   | Risk-oriented unit testing covers all mathematical computations and formatting permutations (loss, gain, zero logs, single log). |

## Project Structure

### Documentation (this feature)

```text
specs/007-weight-total-loss-indicator/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── api.md           # Phase 1 output (/speckit-plan command)
└── checklists/
    └── requirements.md  # Spec checklist
```

### Source Code Layout

```text
apps/
└── web/
    └── src/
        ├── pages/
        │   └── Home.tsx          # Display the indicators in the specified order and layout
        └── utils/
            ├── metrics.ts        # Pure utility functions for total weight loss
            └── metrics.test.ts   # Vitest unit tests for calculations
```

**Structure Decision**: Monorepo Web Application. The logic is kept in frontend utilities (`apps/web/src/utils/metrics.ts`) to enable rapid and isolated testing of formatting and calculations.

## Complexity Tracking

_No principles were violated. YAGNI and Simplicidade Deliberada principles are fully followed._
