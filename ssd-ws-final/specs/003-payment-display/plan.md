# Implementation Plan: Payment Display

**Branch**: `003-payment-display` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-payment-display/spec.md`

## Summary

The Payment Display component is a read-only React component that presents calculated loan metrics — monthly payment (primary), total payment, principal amount, and total interest — in a card-based layout with US currency formatting. It receives data via props from the parent `App` component after a successful loan calculation, shows a placeholder message when no data is available, and adapts across three responsive breakpoints (desktop, tablet, mobile). The component uses semantic HTML with ARIA attributes for accessibility and `aria-live="polite"` to announce result updates to screen readers.

## Technical Context

**Language/Version**: TypeScript (strict mode) on React 18+
**Primary Dependencies**: React 18+, Vite (latest stable), Vitest, React Testing Library
**Storage**: N/A — no persistence; display-only component consuming props from parent state
**Testing**: Vitest + React Testing Library (TDD per constitution Principle III)
**Target Platform**: Modern browsers (Desktop, Tablet, Mobile via responsive CSS)
**Project Type**: Web application (frontend component within existing React/Vite project)
**Performance Goals**: Frontend initial load within 2 seconds (constitution quality gate); result identification within 2 seconds of rendering (SC-001)
**Constraints**: Display-only (no user interactions, FR-009); US currency formatting only; simple interest scope
**Scale/Scope**: Single component with 4 displayed metrics, 3 responsive breakpoints, 1 placeholder state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-First Development | **PASS** | This feature does not define new API endpoints. It consumes the existing `LoanResult` interface already established in 001-loan-calculation-api. The API contract (`POST /api/v1/loans/calculate`) is unchanged. |
| II. Separation of Concerns | **PASS** | Payment Display is a pure presentation component (FR-009). It receives data via props and performs no calculation logic. Currency formatting is a presentation concern correctly placed in the frontend layer. |
| III. Test-Driven Development | **PASS** | Plan mandates TDD cycle for all component behavior: rendering, currency formatting, placeholder state, responsive layout, accessibility, and data updates. |
| IV. Decimal Precision | **PASS** | All monetary values arrive as numbers from the API (already computed with Decimal precision on backend). Frontend formats display values to exactly 2 decimal places using `Intl.NumberFormat` or `toFixed(2)`. No arithmetic performed in this component. |
| V. Input Validation at Every Boundary | **N/A** | This component has no input fields (FR-009). It is display-only and receives pre-validated data from the parent. |
| VI. Simple Interest Scope Constraint | **PASS** | No calculation logic in this component. Displays results of the existing simple interest calculation. |
| VII. Responsive Three-Level Design | **PASS** | Spec requires three breakpoints (Desktop >= 1024px, Tablet 768–1023px, Mobile < 768px). Cards display in main content area beside sidebar on Desktop/Tablet; stack vertically on Mobile. |
| VIII. Living Documentation | **PASS** | README updates will be addressed if setup/usage instructions change. This feature adds a component but does not change prerequisites or setup. |

**Gate Result**: **ALL PASS** — no violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-payment-display/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── component-api.md # PaymentDisplay component contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── App.tsx                      # Updated: integrates PaymentDisplay
│   ├── App.css                      # Updated: layout accommodates PaymentDisplay
│   ├── components/
│   │   ├── LoanForm/                # Existing (002)
│   │   │   ├── LoanForm.tsx
│   │   │   ├── LoanForm.css
│   │   │   └── index.ts
│   │   └── PaymentDisplay/          # NEW (003)
│   │       ├── PaymentDisplay.tsx   # Main display component
│   │       ├── PaymentDisplay.css   # Styling (responsive, cards)
│   │       └── index.ts            # Named export barrel
│   ├── utils/
│   │   ├── validation.ts           # Existing (002)
│   │   └── formatCurrency.ts       # NEW: US currency formatting utility
│   ├── types/
│   │   └── loan.ts                 # Updated: add PaymentDisplayProps
│   └── tests/
│       ├── setup.ts                # Existing
│       ├── PaymentDisplay.test.tsx  # NEW: component tests
│       ├── formatCurrency.test.ts  # NEW: formatting utility tests
│       ├── LoanForm.test.tsx       # Existing (002)
│       ├── loanApi.test.ts         # Existing (002)
│       └── validation.test.ts      # Existing (002)
```

**Structure Decision**: Web application structure (Option 2). This feature adds a new component (`PaymentDisplay/`) and utility (`formatCurrency.ts`) to the existing `frontend/` project established in 002-loan-input-form. No backend changes required.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
