# Quickstart: Installment Table

**Feature**: 004-installment-table
**Date**: 2026-04-15

## Prerequisites

- **Node.js**: 16.x or later
- **pnpm**: Latest stable
- **Frontend project initialized**: The React/Vite/TypeScript project must be set up (see `specs/002-loan-input-form/quickstart.md`)
- **Backend running** (for integration): The loan calculation API at `http://localhost:8000` (see `specs/001-loan-calculation-api/quickstart.md`)
- **Previous features implemented**: LoanForm (002), PaymentDisplay (003) — the InstallmentTable integrates alongside these components

## No Additional Dependencies

This feature uses only libraries already installed in the frontend project:
- React 18+ (component rendering)
- Vitest + React Testing Library (testing)
- TypeScript (type definitions)
- `formatCurrency` utility (already created in 003-payment-display)

No new `pnpm add` commands are required.

## New Files to Create

```text
frontend/src/
├── components/
│   └── InstallmentTable/
│       ├── InstallmentTable.tsx         # Main table component
│       ├── InstallmentTable.css         # Component styles (responsive, sticky, zebra, progress)
│       └── index.ts                     # Named export barrel
└── tests/
    └── InstallmentTable.test.tsx        # Component tests
```

## Files to Modify

| File | Change |
|------|--------|
| `src/types/loan.ts` | Add `InstallmentTableProps` interface |
| `src/App.tsx` | Import `InstallmentTable`, add `isLoading`/`error` state, refactor API call lifecycle, add `handleRetry`, render `InstallmentTable` below `PaymentDisplay` |
| `src/App.css` | Minor adjustments for InstallmentTable spacing in results area |

## Running Tests

### Run all tests

```bash
cd frontend
pnpm run test
```

### Run tests in watch mode (TDD development)

```bash
cd frontend
pnpm vitest
```

### Run only Installment Table tests

```bash
cd frontend
pnpm vitest InstallmentTable
```

## Running the Application

### Start the backend (required for integration)

```bash
cd backend
uv run uvicorn main:app --reload
```

### Start the frontend

```bash
cd frontend
pnpm run dev
```

The application will be available at `http://localhost:5173`.

## TDD Workflow

Follow the Red-Green-Refactor cycle per the constitution (Principle III):

1. **Write a failing test** in `src/tests/InstallmentTable.test.tsx`
2. **Run tests**: `pnpm vitest` (watch mode)
3. **Write minimal code** to make the test pass
4. **Refactor** while keeping tests green
5. **Commit** after each passing test cycle

### Suggested TDD Order

1. **Pre-calculation placeholder state** (simplest render)
   - Renders placeholder message when `installments` is `null`, not loading, no error
   - Placeholder text: "Enter loan details and calculate to see payment schedule."

2. **Loading state**
   - Renders loading indicator when `isLoading` is `true`
   - Loading text: "Loading payment schedule..."

3. **Error state with retry**
   - Renders error message when `error` is non-null
   - Renders retry button
   - Clicking retry calls `onRetry` callback

4. **Empty array state**
   - Renders "No payment schedule available." when `installments` is empty array

5. **Basic data rendering** (single installment)
   - Renders table with caption "Loan Amortization Schedule"
   - Renders 6 column headers
   - Renders one data row with payment number
   - Card header shows "Payment Schedule" with "1 payments"

6. **Currency formatting**
   - All monetary values display `$X,XXX.XX` format
   - Uses existing `formatCurrency` utility

7. **Multi-row rendering** (12-month schedule)
   - Renders exactly 12 data rows in sequential order
   - Payment numbers 1 through 12

8. **Summary/totals row**
   - `<tfoot>` contains totals row with "Total" label
   - Sums of payments, principal, interest are correct
   - Summary progress bar is fully filled

9. **Progress bar rendering**
   - Each row has a progress bar with correct percentage
   - Progress bars have `role="progressbar"` with `aria-valuenow`
   - Last row shows 100% progress

10. **Interest column highlighting**
    - Interest cells have the highlighting class applied

11. **Data integrity warning**
    - Shows warning when final `remaining_balance` is not `0`
    - No warning when final `remaining_balance` is `0`
    - Warning has `role="alert"`

12. **Accessibility**
    - `<caption>` present with correct text
    - `<th scope="col">` on all header cells
    - Section has `aria-labelledby`
    - Loading container has `aria-live="polite"`

13. **App.tsx integration** (refactor API call lifecycle)
    - Lift API call from LoanForm to App
    - Add isLoading/error state management
    - Add handleRetry functionality
    - Render InstallmentTable with correct props

## Verification Checklist

After implementation, verify:

- [ ] `pnpm vitest` — all tests pass (minimum 8 scenarios per SC-007)
- [ ] Placeholder message shows when no calculation performed
- [ ] Loading indicator appears during calculation
- [ ] Error message with retry button appears on API failure
- [ ] "No payment schedule available" shows for empty installment array
- [ ] Table renders correct number of rows for calculated loan
- [ ] All amounts show `$X,XXX.XX` format with exactly 2 decimal places
- [ ] Summary row shows correct totals (total principal = original loan amount)
- [ ] Progress bars fill proportionally; last row and summary show 100%
- [ ] Interest column has distinct amber/orange highlighting
- [ ] Zebra striping on alternating rows
- [ ] Summary row visually distinct (bold, darker background, top border)
- [ ] Card header shows "Payment Schedule" with payment count
- [ ] Data integrity warning appears if final balance is not $0.00
- [ ] Layout adapts at desktop (>= 1024px), tablet (768-1023px), mobile (< 768px)
- [ ] On mobile: horizontal scroll works, Payment # column stays fixed
- [ ] On vertical scroll: column headers stay visible (sticky)
- [ ] Screen reader announces table caption, progress values, and warnings
- [ ] Table renders within 100ms for 360-row schedule (manual timing check)
