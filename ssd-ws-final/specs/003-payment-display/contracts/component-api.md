# Component API Contract: Payment Display

**Feature**: 003-payment-display
**Date**: 2026-04-15

---

## Component: PaymentDisplay

A read-only display component that presents calculated loan metrics in a card-based layout. The component is purely presentational — it receives data via props, formats monetary values as US currency, and renders with responsive layout. It has no user interactions, input fields, or data manipulation (FR-009).

### Props Interface

```typescript
interface PaymentDisplayProps {
  data: PaymentDisplayData | null;
}

interface PaymentDisplayData {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `PaymentDisplayData \| null` | Yes | Calculation results to display. `null` renders placeholder state. |

### Data Fields

| Field | Type | Constraints | Display |
|-------|------|-------------|---------|
| `monthlyPayment` | `number` | > 0, 2 decimals | Primary metric, large prominent text |
| `totalPayment` | `number` | > 0, 2 decimals | Featured purple card |
| `totalInterest` | `number` | >= 0, 2 decimals | Breakdown card (right column) |
| `principal` | `number` | > 0, 2 decimals | Breakdown card (left column) |

### Usage

```tsx
import { PaymentDisplay } from './components/PaymentDisplay';
import type { LoanResult, PaymentDisplayData } from './types/loan';

function App() {
  const [result, setResult] = useState<LoanResult | null>(null);
  const [loanAmount, setLoanAmount] = useState<number>(0);

  const displayData: PaymentDisplayData | null = result ? {
    monthlyPayment: result.monthly_payment,
    totalPayment: result.total_payment,
    totalInterest: result.total_interest,
    principal: loanAmount,
  } : null;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <LoanForm onCalculate={(res) => setResult(res)} />
      </aside>
      <main className="results">
        <PaymentDisplay data={displayData} />
      </main>
    </div>
  );
}
```

### Behavior Contract

| Behavior | Description |
|----------|-------------|
| **Placeholder state** | When `data` is `null`, renders a centered placeholder message: "Calculate a loan to see results" |
| **Results state** | When `data` is non-null, renders three cards with formatted monetary values |
| **Currency formatting** | All monetary values formatted as US currency (`$X,XXX.XX`) using `formatCurrency` utility |
| **Visual hierarchy** | Monthly payment is the most prominent metric (large text), followed by total payment (featured card), then breakdown |
| **Data updates** | Re-renders with new data when `data` prop changes; no intermediate loading state |
| **Previous data retention** | Parent keeps previous data during recalculation; component continues showing stale data until new data arrives |
| **No interactions** | Component has no click handlers, input fields, buttons, or internal state mutations |
| **Layout shift prevention** | Component always occupies the results area, even in placeholder state |

### DOM Structure Contract

```html
<!-- Placeholder state (data === null) -->
<div class="payment-display" aria-live="polite">
  <section class="payment-display__placeholder">
    <p>Calculate a loan to see results</p>
  </section>
</div>

<!-- Results state (data !== null) -->
<div class="payment-display" aria-live="polite">
  <div class="payment-display__cards">

    <!-- Monthly Payment Card -->
    <section class="payment-display__card payment-display__card--monthly"
             aria-label="Monthly Payment">
      <div class="payment-display__card-header">
        <h3 class="payment-display__card-label">Monthly Payment</h3>
        <span class="payment-display__card-icon" aria-hidden="true">$</span>
      </div>
      <p class="payment-display__amount payment-display__amount--primary">
        $856.07
      </p>
      <p class="payment-display__card-description">
        Amount due each month
      </p>
    </section>

    <!-- Total Payment Card (Featured) -->
    <section class="payment-display__card payment-display__card--total"
             aria-label="Total Payment">
      <div class="payment-display__card-header">
        <h3 class="payment-display__card-label">Total Payment</h3>
        <span class="payment-display__card-icon" aria-hidden="true">↑</span>
      </div>
      <p class="payment-display__amount">
        $10,272.84
      </p>
      <p class="payment-display__card-description">
        Over loan lifetime
      </p>
    </section>

    <!-- Payment Breakdown Card -->
    <section class="payment-display__card payment-display__card--breakdown"
             aria-label="Payment Breakdown">
      <h3 class="payment-display__card-label">Payment Breakdown</h3>
      <div class="payment-display__breakdown-grid">
        <div class="payment-display__breakdown-item">
          <span class="payment-display__breakdown-label">Principal Amount</span>
          <span class="payment-display__breakdown-value">$10,000.00</span>
        </div>
        <div class="payment-display__breakdown-item">
          <span class="payment-display__breakdown-label">Total Interest</span>
          <span class="payment-display__breakdown-value">$272.84</span>
        </div>
      </div>
    </section>

  </div>
</div>
```

### CSS Classes Contract

| Class | Element | Purpose |
|-------|---------|---------|
| `.payment-display` | `<div>` | Root container with `aria-live="polite"` |
| `.payment-display__placeholder` | `<section>` | Placeholder state — centered message, dashed border |
| `.payment-display__cards` | `<div>` | Grid container for the three cards |
| `.payment-display__card` | `<section>` | Base card styling (white, rounded, shadow, padding) |
| `.payment-display__card--monthly` | `<section>` | Monthly payment card (white background) |
| `.payment-display__card--total` | `<section>` | Featured total payment card (purple gradient) |
| `.payment-display__card--breakdown` | `<section>` | Breakdown card (white background, two-column) |
| `.payment-display__card-header` | `<div>` | Card header row (label + icon) |
| `.payment-display__card-label` | `<h3>` | Card title text |
| `.payment-display__card-icon` | `<span>` | Decorative icon (aria-hidden) |
| `.payment-display__amount` | `<p>` | Formatted currency amount |
| `.payment-display__amount--primary` | `<p>` | Large display amount (48px, bold) |
| `.payment-display__card-description` | `<p>` | Subtitle/description text (14px, gray) |
| `.payment-display__breakdown-grid` | `<div>` | Two-column layout for principal + interest |
| `.payment-display__breakdown-item` | `<div>` | Single breakdown metric (label + value) |
| `.payment-display__breakdown-label` | `<span>` | Breakdown metric label (e.g., "Principal Amount") |
| `.payment-display__breakdown-value` | `<span>` | Breakdown metric formatted value |

### Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Live region | `aria-live="polite"` on root `.payment-display` container |
| Card landmarks | `<section aria-label="...">` for each card |
| Decorative icons | `aria-hidden="true"` on icon spans |
| Heading hierarchy | `<h3>` for card labels (within `<main>` which may contain `<h2>`) |
| Semantic structure | `<section>`, `<p>`, `<div>` — no non-semantic wrappers |
| Color contrast | All text meets WCAG AA contrast ratios against card backgrounds |
| No focus traps | No interactive elements; no focus management needed |

### Responsive Layout Contract

| Breakpoint | Card Grid | Behavior |
|-----------|-----------|----------|
| Desktop (>= 1024px) | Monthly + Total side-by-side (2 columns); Breakdown full-width below | Cards use available horizontal space in main content area |
| Tablet (768–1023px) | Monthly + Total side-by-side (2 columns); Breakdown full-width below | Cards adapt to narrower main area |
| Mobile (< 768px) | All cards single-column stacked | Monthly → Total → Breakdown vertical flow |

---

## Utility: formatCurrency

### Function Signature

```typescript
function formatCurrency(value: number): string;
```

### Formatting Rules

| Input | Output | Rule |
|-------|--------|------|
| `10272.84` | `"$10,272.84"` | Standard formatting |
| `0` | `"$0.00"` | Zero value (FR edge case) |
| `999999.99` | `"$999,999.99"` | Large value (FR-012) |
| `850.1` | `"$850.10"` | Always 2 decimal places (edge case) |
| `0.01` | `"$0.01"` | Minimum non-zero value |
| `1234.567` | `"$1,234.57"` | Rounds to 2 decimal places |

### Implementation

```typescript
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
```

### Location

`frontend/src/utils/formatCurrency.ts`

---

## Integration Notes

### Parent Component Changes (App.tsx)

The existing `App.tsx` needs the following modifications:
1. Import `PaymentDisplay` component
2. Track `loanAmount` from form state (numeric value after conversion)
3. Map `LoanResult` + `loanAmount` to `PaymentDisplayData`
4. Replace the current inline results rendering with `<PaymentDisplay data={...} />`

### Data Flow

```
LoanForm.onCalculate(result: LoanResult)
  │
  ▼
App.tsx: setResult(result)
App.tsx: setLoanAmount(numericAmount)  ← needs new state
  │
  ▼
App.tsx: maps to PaymentDisplayData
  │  {
  │    monthlyPayment: result.monthly_payment,
  │    totalPayment: result.total_payment,
  │    totalInterest: result.total_interest,
  │    principal: loanAmount,
  │  }
  │
  ▼
PaymentDisplay: renders formatted cards
```

### LoanForm Callback Enhancement

The current `LoanForm` calls `onCalculate(result)` but does not expose the form's `amount` value to the parent. The parent needs `principal` for the PaymentDisplay. Options:
1. **Modify `onCalculate` signature**: `onCalculate: (result: LoanResult, principal: number) => void` — adds principal as a second argument
2. **Extract from result**: Not possible — the API response does not include `amount` as a field (it's implicit from the request)
3. **Separate callback**: Adds complexity

**Recommended**: Option 1 — modify `LoanFormProps.onCalculate` to include `principal` as a second parameter. This is a minor, backward-compatible change (the second parameter can be optional in the type if needed).
