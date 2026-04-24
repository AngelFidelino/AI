# Implementation Plan: Loan Input Form

**Branch**: `002-loan-input-form` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-loan-input-form/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a React + TypeScript loan input form component that provides three validated input fields (loan amount, loan term, annual interest rate) with client-side validation on blur and submit, responsive layout (side-panel on desktop/tablet, stacked on mobile), and integration with the existing backend `POST /api/v1/loans/calculate` endpoint. The form handles loading states, error display (both client-side validation and backend errors), and a 10-second API timeout. Development follows TDD with Vitest + React Testing Library, managed via pnpm and Vite.

## Technical Context

**Language/Version**: TypeScript (strict mode) on React 18+
**Primary Dependencies**: React 18+, Vite (latest stable), Vitest, React Testing Library, Fetch API (native)
**Storage**: N/A — no persistence; form state is ephemeral in React component state
**Testing**: Vitest + React Testing Library (frontend component and integration tests)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) — local development
**Project Type**: Web application (frontend SPA component, part of larger React app)
**Performance Goals**: Initial form render < 2 seconds; form submission feedback < 100ms (client-side validation); API response display within API response time + rendering overhead
**Constraints**: No external UI framework (CSS-only styling); pnpm as package manager; Fetch API for HTTP (no axios); 10-second API timeout; client-side validation must mirror backend validation rules
**Scale/Scope**: Single form component with 3 inputs; 1 API integration; 3 responsive breakpoints (mobile < 768px, tablet 768–1023px, desktop >= 1024px)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | API-First Development | PASS | API contract already defined in spec 001 (`POST /api/v1/loans/calculate`). This feature consumes the existing contract. No new endpoints are introduced. |
| II | Separation of Concerns | PASS | Frontend-only feature. No calculation logic in the frontend — all calculations delegated to backend API. Form handles presentation, client-side validation, and API communication only. |
| III | Test-Driven Development | PASS | Plan requires TDD cycle with Vitest + React Testing Library. Component rendering, validation, form submission, error handling, and accessibility all tested. |
| IV | Decimal Precision | PASS | Form sends raw numeric values to backend; all monetary calculation and rounding happens server-side. Frontend displays results as received from API (pre-rounded to 2 decimal places). |
| V | Input Validation at Every Boundary | PASS | Client-side validation on blur + submit (FR-002). Validates amount > 0 and <= 10,000,000; term 1–600 integer; rate 0–100 with up to 2 decimal places. Backend validation remains independent. |
| VI | Simple Interest Scope Constraint | N/A | Frontend does not perform calculations. Simple interest constraint is enforced by backend. |
| VII | Responsive Three-Level Design | PASS | Three breakpoints defined: Desktop >= 1024px (side-panel 300–350px), Tablet 768–1023px (narrower side-panel 250–280px), Mobile < 768px (stacked layout). Matches constitution exactly. |
| VIII | Living Documentation | PASS | Plan generates quickstart.md with frontend setup instructions. README update deferred to implementation phase. |

**Gate Result**: PASS — No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-loan-input-form/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── index.html                    # Vite entry HTML
├── package.json                  # Dependencies and scripts (managed by pnpm)
├── pnpm-lock.yaml                # Lock file
├── tsconfig.json                 # TypeScript configuration (strict mode)
├── vite.config.ts                # Vite configuration with Vitest
├── src/
│   ├── main.tsx                  # React app entry point
│   ├── App.tsx                   # Root component with responsive layout
│   ├── components/
│   │   └── LoanForm/
│   │       ├── LoanForm.tsx      # Main form component
│   │       ├── LoanForm.css      # Form styles (responsive, validation states)
│   │       └── index.ts          # Named export barrel
│   ├── services/
│   │   └── loanApi.ts            # Fetch-based API client (POST /api/v1/loans/calculate)
│   ├── types/
│   │   └── loan.ts               # TypeScript interfaces (LoanParams, LoanResult, ValidationError)
│   ├── utils/
│   │   └── validation.ts         # Client-side validation logic
│   └── tests/
│       ├── LoanForm.test.tsx     # Component rendering, interaction, validation tests
│       ├── loanApi.test.ts       # API service tests (mocked fetch)
│       └── validation.test.ts   # Validation utility unit tests
└── vitest.config.ts              # Vitest configuration (if separate from vite.config.ts)
```

**Structure Decision**: Web application structure (Option 2 — frontend only for this feature). The `frontend/` directory is created at the repository root alongside the existing `backend/` directory. Components use co-located CSS files. Tests are in a centralized `src/tests/` directory matching the backend convention. Type definitions are centralized in `src/types/`.

## Complexity Tracking

> No constitution violations detected. This section is intentionally empty.
