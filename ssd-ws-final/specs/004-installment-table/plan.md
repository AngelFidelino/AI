# Implementation Plan: Installment Table

**Branch**: `004-installment-table` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-installment-table/spec.md`

## Summary

The Installment Table is a React display component that renders the complete amortization schedule for a calculated loan in a semantic HTML `<table>` with six columns: Payment #, Payment Amount, Principal, Interest, Remaining Balance, and Progress. It receives an array of installment objects and the original loan amount as props from the parent `App` component. The component supports multiple states (empty/no data, loading, error with retry, data integrity warning, and full schedule display), uses US currency formatting, includes a summary/totals footer row, visual progress bars per row, zebra striping, interest column highlighting, sticky headers, sticky Payment # column on mobile, and meets WCAG AA accessibility requirements. No calculation logic resides in this component — it is purely presentational.

## Technical Context

**Language/Version**: TypeScript (strict mode) on React 18+
**Primary Dependencies**: React 18+, Vite (latest stable), Vitest, React Testing Library
**Storage**: N/A — no persistence; display-only component consuming props from parent state
**Testing**: Vitest + React Testing Library (TDD per constitution Principle III)
**Target Platform**: Modern browsers (Desktop, Tablet, Mobile via responsive CSS)
**Project Type**: Web application (frontend component within existing React/Vite project)
**Performance Goals**: Table renders within 100ms for 360-payment loan (SC-008); frontend initial load within 2 seconds (constitution quality gate)
**Constraints**: Display-only (no sorting, filtering, export, editing); US currency formatting only; simple interest scope; reuses existing `formatCurrency` utility from 003
**Scale/Scope**: Single component handling up to 360 rows (30-year loan), 6 columns, 5 component states (no data, loading, error, empty array, data with optional warning), 3 responsive breakpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-First Development | **PASS** | This feature does not define new API endpoints. It consumes the existing `Installment[]` and `LoanResult` interfaces established in 001-loan-calculation-api. The API contract (`POST /api/v1/loans/calculate`) is unchanged. |
| II. Separation of Concerns | **PASS** | InstallmentTable is a pure presentation component. It receives data via props and performs no calculation logic. Currency formatting uses the existing frontend `formatCurrency` utility. Progress calculation (`(originalLoanAmount - remainingBalance) / originalLoanAmount`) is a presentation concern (visual representation of data). |
| III. Test-Driven Development | **PASS** | Plan mandates TDD cycle for all component behavior: rendering, currency formatting, progress bars, loading state, error state, empty state, warning state, summary row, accessibility, responsive layout, and performance. Minimum 8 test scenarios per SC-007. |
| IV. Decimal Precision | **PASS** | All monetary values arrive as numbers from the API (already computed with Decimal precision on backend). Frontend formats display values using the existing `formatCurrency` utility (`Intl.NumberFormat`). No arithmetic beyond progress percentage calculation, which uses division of already-precise values and is visual-only. |
| V. Input Validation at Every Boundary | **N/A** | This component has no input fields. It is display-only and receives pre-validated data from the parent. Defensive null/empty checks are rendering concerns, not input validation. |
| VI. Simple Interest Scope Constraint | **PASS** | No calculation logic in this component. Displays results of the existing simple interest calculation. |
| VII. Responsive Three-Level Design | **PASS** | Spec requires three breakpoints (Desktop >= 1024px, Tablet 768-1023px, Mobile < 768px). Table displays in main content area beside sidebar on Desktop/Tablet; full-width on Mobile with horizontal scroll and sticky Payment # column (FR-012). Sticky column headers for vertical scroll (FR-012). |
| VIII. Living Documentation | **PASS** | README updates will be addressed if setup/usage instructions change. This feature adds a component but does not change prerequisites or setup. |

**Gate Result**: **ALL PASS** — no violations. Proceeding to Phase 0.

### Post-Design Re-Check (after Phase 1)

All principles re-evaluated against completed design artifacts (data-model.md, contracts/component-api.md, research.md). No new violations introduced. Key design decisions validated:
- **Principle II**: Recommended App.tsx refactoring (lifting API call lifecycle from LoanForm to App) improves separation of concerns.
- **Principle III**: 12 TDD steps defined; minimum 8 test scenarios satisfied.
- **Principle VII**: Three-breakpoint responsive design with sticky headers and sticky Payment # column fully specified in CSS contract.

**Post-Design Gate Result**: **ALL PASS** — design approved for task generation.

## Project Structure

### Documentation (this feature)

```text
specs/004-installment-table/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── component-api.md # InstallmentTable component contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── App.tsx                          # Updated: integrates InstallmentTable
│   ├── App.css                          # Updated: layout accommodates InstallmentTable
│   ├── components/
│   │   ├── LoanForm/                    # Existing (002)
│   │   │   ├── LoanForm.tsx
│   │   │   ├── LoanForm.css
│   │   │   └── index.ts
│   │   ├── PaymentDisplay/              # Existing (003)
│   │   │   ├── PaymentDisplay.tsx
│   │   │   ├── PaymentDisplay.css
│   │   │   └── index.ts
│   │   └── InstallmentTable/            # NEW (004)
│   │       ├── InstallmentTable.tsx     # Main table component
│   │       ├── InstallmentTable.css     # Styling (responsive, sticky, zebra, progress bars)
│   │       └── index.ts                # Named export barrel
│   ├── utils/
│   │   ├── validation.ts               # Existing (002)
│   │   └── formatCurrency.ts           # Existing (003) — reused by InstallmentTable
│   ├── types/
│   │   └── loan.ts                     # Updated: add InstallmentTableProps, InstallmentTableState types
│   └── tests/
│       ├── setup.ts                    # Existing
│       ├── InstallmentTable.test.tsx   # NEW: component tests
│       ├── PaymentDisplay.test.tsx     # Existing (003)
│       ├── formatCurrency.test.ts      # Existing (003)
│       ├── LoanForm.test.tsx           # Existing (002)
│       ├── loanApi.test.ts             # Existing (002)
│       └── validation.test.ts          # Existing (002)
```

**Structure Decision**: Web application structure (Option 2). This feature adds a new component (`InstallmentTable/`) to the existing `frontend/` project. No backend changes required. The existing `formatCurrency` utility from 003-payment-display is reused directly — no new utility files needed.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
