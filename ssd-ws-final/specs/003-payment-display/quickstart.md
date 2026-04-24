# Quickstart: Payment Display

**Feature**: 003-payment-display
**Date**: 2026-04-15

## Prerequisites

- **Node.js**: 16.x or later
- **pnpm**: Latest stable
- **Frontend project initialized**: The React/Vite/TypeScript project must be set up (see `specs/002-loan-input-form/quickstart.md`)
- **Backend running** (for integration): The loan calculation API at `http://localhost:8000` (see `specs/001-loan-calculation-api/quickstart.md`)

## No Additional Dependencies

This feature uses only libraries already installed in the frontend project:
- React 18+ (component rendering)
- Vitest + React Testing Library (testing)
- TypeScript (type definitions)
- `Intl.NumberFormat` (native browser API for currency formatting)

No new `pnpm add` commands are required.

## New Files to Create

```text
frontend/src/
├── components/
│   └── PaymentDisplay/
│       ├── PaymentDisplay.tsx         # Main display component
│       ├── PaymentDisplay.css         # Component styles (responsive, cards)
│       └── index.ts                   # Named export barrel
├── utils/
│   └── formatCurrency.ts             # US currency formatting utility
└── tests/
    ├── PaymentDisplay.test.tsx        # Component tests
    └── formatCurrency.test.ts         # Formatting utility tests
```

## Files to Modify

| File | Change |
|------|--------|
| `src/types/loan.ts` | Add `PaymentDisplayData` and `PaymentDisplayProps` interfaces |
| `src/App.tsx` | Import `PaymentDisplay`, add `loanAmount` state, map data, replace inline results |
| `src/App.css` | Minor adjustments if needed for PaymentDisplay integration |

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

### Run only Payment Display tests

```bash
cd frontend
pnpm vitest PaymentDisplay
pnpm vitest formatCurrency
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

1. **Write a failing test** in `src/tests/`
2. **Run tests**: `pnpm vitest` (watch mode)
3. **Write minimal code** to make the test pass
4. **Refactor** while keeping tests green
5. **Commit** after each passing test cycle

### Suggested TDD Order

1. **`formatCurrency` utility** (pure function, no DOM)
   - Basic formatting
   - Zero value
   - Large values
   - Rounding / decimal places

2. **PaymentDisplay placeholder state**
   - Renders placeholder message when `data` is null
   - Placeholder text matches spec

3. **PaymentDisplay data rendering**
   - Renders monthly payment with correct formatting
   - Renders total payment in featured card
   - Renders principal and total interest in breakdown

4. **PaymentDisplay data updates**
   - Updates all values when data prop changes
   - Reverts to placeholder when data set to null

5. **PaymentDisplay accessibility**
   - `aria-live="polite"` on container
   - `aria-label` on card sections
   - `aria-hidden="true"` on decorative icons

## Verification Checklist

After implementation, verify:

- [ ] `pnpm vitest` — all tests pass
- [ ] Placeholder message shows when no calculation performed
- [ ] Monthly payment displays prominently with currency formatting
- [ ] Total payment shows in purple featured card
- [ ] Breakdown shows principal and total interest
- [ ] Values update correctly after recalculation
- [ ] Layout adapts at desktop (>= 1024px), tablet (768-1023px), mobile (< 768px)
- [ ] All amounts show `$X,XXX.XX` format with exactly 2 decimal places
