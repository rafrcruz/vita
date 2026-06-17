# Implementation Plan: Weight & Blood Pressure Tracking

**Branch**: `003-weight-bp-tracking` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-weight-bp-tracking/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implements a health tracking module for body weight and blood pressure in VITA. This plan covers:

- In-place quick entry inputs on the home screen designed for fast, one-handed mobile capture.
- Timeframe-filtered charts (7D/30D/All) using light SVG components to monitor trends.
- A dedicated log management page to edit or delete past records.
- Database schema additions for Postgres using Drizzle ORM, backed by rigorous backend validation and unit testing.

## Technical Context

**Language/Version**: TypeScript / Node 22

**Primary Dependencies**: React 18, `@tanstack/react-query`, `lucide-react`, Express 4, `drizzle-orm`, Zod, `@neondatabase/serverless`

**Storage**: Neon Serverless PostgreSQL with Drizzle ORM

**Testing**: Vitest for unit/integration tests (backend/frontend)

**Target Platform**: Vercel (API & Web Host) / Mobile and Desktop Web Browsers (PWA)

**Project Type**: Monorepo Web Application

**Performance Goals**: UI chart rendering & tabs toggle under 150ms, save operation under 5s, decimal keyboard activation on focus.

**Constraints**: One-handed usage layout, PWA, Google OAuth, requireAuth middleware.

**Scale/Scope**: Single-user health observability tracker.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Principle I: Observabilidade de Saúde, Não Aconselhamento Médico**
  - _Gate Status_: **PASSED**. The UI and backend will store and visualize weight and BP data purely descriptively (e.g. historical average, raw values) without rendering clinical classifications (e.g., "Hypertension Stage 1") or diagnoses.
- **Principle II: Privacidade e Segurança de Dados de Saúde por Padrão**
  - _Gate Status_: **PASSED**. No health data will be logged in server logs. Authenticated users can only see their own records.
- **Principle III: Acesso Restrito e Autenticação via Google**
  - _Gate Status_: **PASSED**. The routes will utilize the existing `requireAuth` middleware to ensure Google authenticated access matching the allowlist.
- **Principle IV: Stack e Arquitetura Definidas (PWA Online-First)**
  - _Gate Status_: **PASSED**. Built using the existing frontend (React/Vite/Tailwind) and backend (Express/Node) architecture.
- **Principle V: Simplicidade Deliberada (Anti-Overengineering)**
  - _Gate Status_: **PASSED**. We will use standard REST endpoints and a simple database schema. For data visualization, we will implement clean React SVG-based line charts rather than introducing a heavy third-party charting library.
- **Principle VI: Dependências e Infraestrutura Sustentáveis**
  - _Gate Status_: **PASSED**. Only well-maintained, standard monorepo packages (Express, React, Drizzle) will be utilized.
- **Principle VII: Testes Orientados a Risco**
  - _Gate Status_: **PASSED**. Critical test targets are identified (decimal parsing, validation limits, chronological sorting).

## Project Structure

### Documentation (this feature)

```text
specs/003-weight-bp-tracking/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 quickstart / validation scenarios
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── contracts/
    └── api.md           # API interface contract
```

### Source Code (repository root)

```text
apps/api/
├── src/
│   ├── db/
│   │   ├── schema.ts         # Added weight_logs and blood_pressure_logs tables
│   │   └── migrations/       # Migration files
│   └── health_metrics/       # New module for weight & blood pressure routes
│       ├── metrics.route.ts  # Express Router
│       ├── metrics.service.ts# Logic for CRUD and sorting
│       └── metrics.test.ts   # Unit and integration tests

apps/web/
├── src/
│   ├── components/
│   │   ├── WeightCaptureModal.tsx # Mobile-focused input overlay
│   │   ├── BPCaptureModal.tsx     # Mobile-focused BP input overlay
│   │   └── TrendChart.tsx         # Clean, responsive SVG-based trend chart
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main dashboard updated with modal triggers and charts
│   │   └── History.tsx            # Dedicated history management page
│   └── services/
│       └── api.ts                 # React Query integrations for health metrics
```

**Structure Decision**: Option 2 (Web Application Monorepo). The backend files are in `apps/api/src/` and frontend components are in `apps/web/src/`. Shared validation schemas are located under `packages/shared/src/`.

## Complexity Tracking

> _No current violations detected. Clean architecture adhering strictly to VITA Constitution._

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| _None_    | _N/A_      | _N/A_                                |
