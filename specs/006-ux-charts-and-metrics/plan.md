# Implementation Plan: UX, Charts, and Metrics Improvements

**Branch**: `006-ux-charts-and-metrics` | **Date**: 2026-06-17 | **Spec**: [spec.md](file:///c:/projects/vita/specs/006-ux-charts-and-metrics/spec.md)

**Input**: Feature specification from `/specs/006-ux-charts-and-metrics/spec.md`

## Summary
Improve overall visual styling, input usability, and analytical capabilities of VITA. Specifically:
1. Polish dialog overlay entry/exit visual transition on desktop to fade in centered.
2. Upgrade birthdate field in user profile to a keyboard-based text input with an automatic date format mask (`DD/MM/YYYY`) that translates from/to the API `YYYY-MM-DD` format.
3. Polish custom SVG X-axis ticks to print hours/minutes in case of multiple measurements on a single calendar day or short durations.
4. Improve Y-axis label contrast by moving the text labels outside of the low-opacity group.
5. Create weight and blood pressure metric blocks underneath the charts displaying averages and weight loss rates (applying fallback date searches).
6. Add an exit icon next to the logout button text.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20.x

**Primary Dependencies**: React 18, Tailwind CSS, Lucide React (exit icon), Radix UI Dialog

**Storage**: PostgreSQL (via Drizzle ORM) - existing schemas for `user_profiles`, `weight_logs`, and `blood_pressure_logs`.

**Testing**: Vitest (for unit testing formulas and transformations)

**Target Platform**: Progressive Web App (PWA)

**Project Type**: Monorepo Web Application (frontend React, backend Node/Express)

**Performance Goals**: Loading and computing analytics metrics under 150ms on dashboard mount.

**Constraints**: Calculations are performed client-side on the retrieved `'all'` history dataset. Formula logic must handle boundary conditions (zero records, single record, future dates, time collisions) gracefully.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| **I. Observabilidade de Saúde** | Pass | Calculations are displayed strictly as data summaries. No diagnostic or clinical recommendations are presented. |
| **II. Privacidade e Segurança** | Pass | Health logs are processed in-memory and are not logged. Transmission is secure. |
| **III. Acesso Restrito** | Pass | No authentication mechanism changes. Access continues to validate via Google OAuth. |
| **IV. Stack e Arquitetura** | Pass | Frontend React SPA and backend Node API architecture are strictly maintained. |
| **V. Simplicidade Deliberada** | Pass | Formulas are implemented as pure TypeScript utility functions on the frontend, avoiding heavy backend aggregations or external query engines. |
| **VI. Dependências Sustentáveis**| Pass | No new external libraries are added; date masking and math are built with pure JS/TS. |
| **VII. Testes Orientados a Risco** | Pass | Unit tests cover the calculation formula edge cases (exact matches, earlier dates search, later dates search) to ensure complete data correctness. |

---

## Project Structure

### Documentation (this feature)

```text
specs/006-ux-charts-and-metrics/
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
        ├── components/
        │   ├── ui/
        │   │   └── dialog.tsx          # Change desktop position transition behavior
        │   ├── TrendChart.tsx          # Adjust X-axis granularity & Y-axis contrast
        │   ├── WeightCaptureModal.tsx
        │   └── BPCaptureModal.tsx
        ├── pages/
        │   ├── Home.tsx                # Load 'all' history, compute & show indicators under charts
        │   └── Profile.tsx             # Date format conversion, numeric masking
        ├── utils/
        │   ├── metrics.ts              # Analytical calculations (weight loss fallback, average BP)
        │   └── metrics.test.ts         # Unit tests validating math formulas under edge cases
        └── services/
            └── api.ts                  # Query services
```

**Structure Decision**: Monorepo Web Application layout. Calculations are centralized in `apps/web/src/utils/metrics.ts` to facilitate isolated unit testing with Vitest.

---

## Complexity Tracking

*No violations detected. Standard implementation patterns are followed.*
