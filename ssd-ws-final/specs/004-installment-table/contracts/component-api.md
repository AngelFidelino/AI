# Component API Contract: Installment Table

**Feature**: 004-installment-table
**Date**: 2026-04-15

---

## Component: InstallmentTable

A read-only display component that renders the complete amortization schedule for a calculated loan in a semantic HTML table. The component handles five states (pre-calculation placeholder, loading, error with retry, empty schedule, and full data display), formats all monetary values as US currency, includes a summary totals row, visual progress bars, zebra striping, interest column highlighting, sticky headers, and sticky Payment # column on mobile. It is purely presentational — it receives data via props, formats values for display, and delegates retry actions to the parent.

### Props Interface

```typescript
import type { Installment } from './loan';

export interface InstallmentTableProps {
  installments: Installment[] | null;
  originalLoanAmount: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `installments` | `Installment[] \| null` | Yes | The amortization schedule data. `null` renders pre-calculation placeholder. Empty array renders "No payment schedule available." |
| `originalLoanAmount` | `number` | Yes | The original loan principal, used for progress bar percentage calculation. Passed explicitly alongside installments (per clarification). |
| `isLoading` | `boolean` | Yes | Whether a calculation is in progress. When `true`, renders loading state regardless of other props. |
| `error` | `string \| null` | Yes | Error message from a failed calculation. When non-null (and not loading), renders error state with retry button. |
| `onRetry` | `() => void` | Yes | Callback invoked when the retry button is clicked in error state. Parent handles re-triggering the calculation. |

### Installment Data Fields (consumed from existing type)

| Field | Type | Constraints | Display Column |
|-------|------|-------------|----------------|
| `payment_number` | `number` | Integer >= 1 | Payment # |
| `payment_amount` | `number` | > 0, 2 decimals | Payment Amount |
| `principal_portion` | `number` | > 0, 2 decimals | Principal |
| `interest_portion` | `number` | >= 0, 2 decimals | Interest (highlighted) |
| `remaining_balance` | `number` | >= 0, 2 decimals | Remaining Balance |

### Usage

```tsx
import { InstallmentTable } from './components/InstallmentTable';
import type { LoanResult } from './types/loan';

function App() {
  const [result, setResult] = useState<LoanResult | null>(null);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    // Re-trigger calculation with last known form values
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <LoanForm onCalculate={handleCalculate} />
      </aside>
      <main className="results">
        <PaymentDisplay data={displayData} />
        <InstallmentTable
          installments={result?.schedule ?? null}
          originalLoanAmount={loanAmount}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
}
```

### Behavior Contract

| Behavior | Description | Spec Reference |
|----------|-------------|----------------|
| **Pre-calculation placeholder** | When `installments` is `null`, `isLoading` is `false`, and `error` is `null`, renders: "Enter loan details and calculate to see payment schedule." | FR-006 |
| **Loading state** | When `isLoading` is `true`, renders a loading indicator inside the card container. Immediately replaces any previously visible content (table, placeholder, or error). | FR-007 |
| **Error state with retry** | When `error` is non-null and `isLoading` is `false`, renders the error message and a "Retry" button. Clicking Retry calls `onRetry`. The component does not re-execute the calculation itself. | FR-008 |
| **Empty schedule** | When `installments` is an empty array, renders: "No payment schedule available." | FR-009 |
| **Full table render** | When `installments` has items, renders a semantic `<table>` with one row per installment in sequential order. | FR-001, FR-002 |
| **Currency formatting** | All monetary values formatted as US currency (`$X,XXX.XX`) using the existing `formatCurrency` utility. | FR-003 |
| **Summary row** | `<tfoot>` contains a totals row with "Total" label, sum of payments, sum of principal, sum of interest, and a fully filled progress bar. | FR-004 |
| **Progress bars** | Each row displays a visual progress bar showing `((originalLoanAmount - remainingBalance) / originalLoanAmount) * 100`. No percentage text visible. Screen readers receive the numeric value via `aria-valuenow`. | FR-005, FR-011 |
| **Card header** | Card header shows "Payment Schedule" title and "{n} payments" count. | FR-015 |
| **Zebra striping** | Alternating row backgrounds in `<tbody>` for readability. | FR-016 |
| **Summary row distinction** | Summary row has bold text, prominent top border, slightly darker background. | FR-017 |
| **Interest highlighting** | Interest column cells use distinct color (amber/orange `#D97706` on light yellow `#FEF3C7`). | FR-014 |
| **Data integrity warning** | If the final installment's `remaining_balance` is not exactly `0`, an inline warning appears below the table in a warning color. Does not obstruct the schedule. | FR-013 |
| **Table caption** | Caption reads "Loan Amortization Schedule" for accessibility. | FR-010 |
| **Sticky headers** | Column headers remain visible during vertical scroll. | FR-012 |
| **Sticky Payment # (mobile)** | On viewports under 768px, the Payment # column remains fixed during horizontal scroll via `position: sticky`. | FR-012 |
| **No interactions** | Component has no sorting, filtering, export, or editing capability. Display-only with scrolling and retry. | Spec assumptions |

### DOM Structure Contract

```html
<!-- Card wrapper (all states) -->
<section class="installment-table" aria-labelledby="installment-table-title">
  <div class="installment-table__header">
    <h2 id="installment-table-title">Payment Schedule</h2>
    <span class="installment-table__count">{n} payments</span>  <!-- only in data state -->
  </div>

  <!-- STATE: Pre-calculation placeholder (installments === null, not loading, no error) -->
  <div class="installment-table__placeholder">
    <p>Enter loan details and calculate to see payment schedule.</p>
  </div>

  <!-- STATE: Loading (isLoading === true) -->
  <div class="installment-table__loading" aria-live="polite">
    <p>Loading payment schedule...</p>
  </div>

  <!-- STATE: Error (error !== null, not loading) -->
  <div class="installment-table__error" role="alert">
    <p class="installment-table__error-message">{error message}</p>
    <button class="installment-table__retry-button" type="button">
      Retry
    </button>
  </div>

  <!-- STATE: Empty array (installments.length === 0) -->
  <div class="installment-table__empty">
    <p>No payment schedule available.</p>
  </div>

  <!-- STATE: Data (installments.length > 0) -->
  <div class="installment-table__wrapper">
    <table class="installment-table__table">
      <caption class="installment-table__caption">
        Loan Amortization Schedule
      </caption>
      <thead class="installment-table__head">
        <tr>
          <th scope="col" class="installment-table__th">Payment #</th>
          <th scope="col" class="installment-table__th">Payment Amount</th>
          <th scope="col" class="installment-table__th">Principal</th>
          <th scope="col" class="installment-table__th installment-table__th--interest">Interest</th>
          <th scope="col" class="installment-table__th">Remaining Balance</th>
          <th scope="col" class="installment-table__th">Progress</th>
        </tr>
      </thead>
      <tbody class="installment-table__body">
        <!-- Repeated for each installment -->
        <tr class="installment-table__row">
          <td class="installment-table__cell installment-table__payment-number">1</td>
          <td class="installment-table__cell installment-table__amount">$875.00</td>
          <td class="installment-table__cell installment-table__principal">$833.33</td>
          <td class="installment-table__cell installment-table__interest">$41.67</td>
          <td class="installment-table__cell installment-table__balance">$9,166.67</td>
          <td class="installment-table__cell installment-table__progress-cell">
            <div
              class="installment-table__progress"
              role="progressbar"
              aria-valuenow="8"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="8% of loan repaid"
            >
              <div
                class="installment-table__progress-fill"
                style="width: 8%"
              ></div>
            </div>
          </td>
        </tr>
        <!-- ... more rows ... -->
      </tbody>
      <tfoot class="installment-table__foot">
        <tr class="installment-table__row installment-table__row--summary">
          <td class="installment-table__cell installment-table__payment-number">Total</td>
          <td class="installment-table__cell installment-table__amount">$10,500.00</td>
          <td class="installment-table__cell installment-table__principal">$10,000.00</td>
          <td class="installment-table__cell installment-table__interest">$500.00</td>
          <td class="installment-table__cell installment-table__balance"></td>
          <td class="installment-table__cell installment-table__progress-cell">
            <div
              class="installment-table__progress"
              role="progressbar"
              aria-valuenow="100"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="100% of loan repaid"
            >
              <div
                class="installment-table__progress-fill"
                style="width: 100%"
              ></div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Data integrity warning (conditional, after table) -->
  <div class="installment-table__warning" role="alert">
    ⚠ The final payment does not result in a $0.00 balance.
    Remaining balance: $0.03. This may indicate a rounding discrepancy.
  </div>
</section>
```

### CSS Classes Contract

| Class | Element | Purpose |
|-------|---------|---------|
| `.installment-table` | `<section>` | Root card container (white background, rounded corners, shadow, padding) |
| `.installment-table__header` | `<div>` | Card header row (title + payment count) |
| `.installment-table__count` | `<span>` | Payment count badge (e.g., "12 payments") |
| `.installment-table__placeholder` | `<div>` | Pre-calculation placeholder state — centered message |
| `.installment-table__loading` | `<div>` | Loading state container with `aria-live="polite"` |
| `.installment-table__error` | `<div>` | Error state container with `role="alert"` |
| `.installment-table__error-message` | `<p>` | Error message text |
| `.installment-table__retry-button` | `<button>` | Retry button (purple, matches project button style) |
| `.installment-table__empty` | `<div>` | Empty schedule state — centered message |
| `.installment-table__wrapper` | `<div>` | Table scroll container (`overflow-x: auto`) |
| `.installment-table__table` | `<table>` | The data table |
| `.installment-table__caption` | `<caption>` | Visually hidden table caption for accessibility |
| `.installment-table__head` | `<thead>` | Table header section (sticky on vertical scroll) |
| `.installment-table__th` | `<th>` | Column header cell (uppercase, 11-12px, semibold, gray) |
| `.installment-table__th--interest` | `<th>` | Interest column header (optional distinct styling) |
| `.installment-table__body` | `<tbody>` | Table body section (contains data rows) |
| `.installment-table__row` | `<tr>` | Data row (zebra striping via `nth-child(even)`) |
| `.installment-table__row--summary` | `<tr>` | Summary/totals row (bold, darker background, top border) |
| `.installment-table__foot` | `<tfoot>` | Table footer section (summary row) |
| `.installment-table__cell` | `<td>` | Base cell styling |
| `.installment-table__payment-number` | `<td>` | Payment # column (sticky on mobile) |
| `.installment-table__amount` | `<td>` | Payment Amount column |
| `.installment-table__principal` | `<td>` | Principal column |
| `.installment-table__interest` | `<td>` | Interest column (highlighted: amber text on yellow background) |
| `.installment-table__balance` | `<td>` | Remaining Balance column |
| `.installment-table__progress-cell` | `<td>` | Progress bar column cell |
| `.installment-table__progress` | `<div>` | Progress bar container (gray background, rounded) |
| `.installment-table__progress-fill` | `<div>` | Progress bar filled portion (purple `#5B4FFF`, rounded) |
| `.installment-table__warning` | `<div>` | Data integrity warning (amber border, yellow background, `role="alert"`) |

### Accessibility Contract

| Requirement | Implementation | Spec Reference |
|-------------|----------------|----------------|
| Table caption | `<caption>` with text "Loan Amortization Schedule" | FR-010 |
| Column header associations | `<th scope="col">` on all header cells | FR-010 |
| Progress bar accessibility | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` | FR-011 |
| Loading announcement | `aria-live="polite"` on loading container | FR-007 |
| Error announcement | `role="alert"` on error container | FR-008 |
| Warning announcement | `role="alert"` on data integrity warning | FR-013 |
| Section landmark | `<section aria-labelledby="installment-table-title">` | Accessibility best practice |
| Keyboard navigation | Standard tab navigation through table; retry button is focusable | User Story 5 |
| Heading hierarchy | `<h2>` for "Payment Schedule" (within `<main>`) | Document structure |
| Color contrast | All text meets WCAG AA contrast ratios; interest highlighting text (#D97706 on #FEF3C7) ~4.6:1 | User Story 5 |
| No percentage text | Progress bars convey value via ARIA only, not visible text | FR-005 |

### Responsive Layout Contract

| Breakpoint | Table Layout | Sticky Behavior | Column Visibility |
|-----------|-------------|-----------------|-------------------|
| Desktop (>= 1024px) | Full table, `width: 100%`, no horizontal scroll. All 6 columns visible in main content area beside side-panel. | Sticky `<thead>` on vertical scroll | All 6 columns visible |
| Tablet (768-1023px) | Full table, narrower columns. All 6 columns visible in narrower main content area. | Sticky `<thead>` on vertical scroll | All 6 columns visible |
| Mobile (< 768px) | Table with `min-width: 700px` inside `overflow-x: auto` wrapper. Full viewport width, horizontal scroll enabled. | Sticky `<thead>` on vertical scroll. Sticky Payment # column on horizontal scroll (`position: sticky; left: 0`). | All 6 columns visible via horizontal scroll |

**Sticky z-index Layering**:
| Element | z-index | Purpose |
|---------|---------|---------|
| Corner cell (header + first column) | 3 | Stays on top during both scroll directions |
| Header row (`<thead>` cells) | 2 | Stays above body during vertical scroll |
| Sticky first column (`<td>`) | 1 | Stays above other body cells during horizontal scroll |
| Regular body cells | auto | Normal flow |

---

## Integration Notes

### Parent Component Changes (App.tsx)

The existing `App.tsx` needs the following modifications:

1. **Import** `InstallmentTable` component
2. **Add state**: `isLoading: boolean` (default `false`), `error: string | null` (default `null`)
3. **Store last form values** for retry functionality (e.g., `lastFormValues` ref or state)
4. **Update `handleCalculate`**: Set loading/error lifecycle around API call
5. **Add `handleRetry`**: Re-triggers calculation with last known form values
6. **Render** `<InstallmentTable>` below `<PaymentDisplay>` in the results area
7. **Clear previous result on new calculation**: Set `result = null` when loading starts (FR-007)

### Updated App.tsx Data Flow

```
LoanForm.onCalculate(result: LoanResult, principal: number)
  │
  ▼
App.tsx: handleCalculate
  │  1. setIsLoading(true), setError(null), setResult(null)  ← clear previous
  │  2. API call (via loanApi)
  │  3a. Success: setResult(result), setLoanAmount(principal), setIsLoading(false)
  │  3b. Error: setError(message), setIsLoading(false)
  │
  ▼
App.tsx: maps to component props
  │  PaymentDisplay: data = result ? {...} : null
  │  InstallmentTable:
  │    installments = result?.schedule ?? null
  │    originalLoanAmount = loanAmount
  │    isLoading = isLoading
  │    error = error
  │    onRetry = handleRetry
  │
  ▼
InstallmentTable: renders appropriate state
```

### Important: Loading State Synchronization

The existing `LoanForm` manages its own internal loading state (for the submit button). The new `App.tsx` loading state is separate and specifically for the InstallmentTable. Both should be set/cleared at the same lifecycle points:

- **Calculation starts**: LoanForm sets internal `isSubmitting = true`; App sets `isLoading = true`
- **Calculation ends**: LoanForm sets internal `isSubmitting = false`; App sets `isLoading = false`

The current architecture has the API call happening inside `LoanForm` which then calls `onCalculate` on success. To support loading/error in `App.tsx`, the API call lifecycle needs to be lifted to `App.tsx`, or `LoanForm` needs additional callbacks (`onLoadingStart`, `onError`). The recommended approach is to refactor so that `App.tsx` controls the API call lifecycle:

1. `LoanForm` calls `onSubmit(formData)` instead of calling the API directly
2. `App.tsx` calls `calculateLoan(formData)`, manages loading/error/result state
3. `App.tsx` passes loading state down to both `LoanForm` (for button state) and `InstallmentTable`

This refactoring aligns with Principle II (Separation of Concerns): the form is responsible for input collection and validation, while the parent manages data fetching and distribution.

---

## Reused Utility: formatCurrency

The existing `formatCurrency` function from `frontend/src/utils/formatCurrency.ts` (created in 003-payment-display) is reused without modification. No new utility files are needed for this feature.

```typescript
// Already exists — no changes
export function formatCurrency(value: number): string;
```

Location: `frontend/src/utils/formatCurrency.ts`
