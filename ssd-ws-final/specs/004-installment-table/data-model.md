# Data Model: Installment Table

**Feature**: 004-installment-table
**Date**: 2026-04-15

## Entities

### 1. Installment (existing — consumed, not modified)

**Description**: Represents a single monthly payment in the amortization schedule. This interface already exists in `frontend/src/types/loan.ts` (defined in 001-loan-calculation-api). The InstallmentTable consumes this type as-is.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `payment_number` | `number` | Integer, >= 1 | Sequential payment number starting from 1 |
| `payment_amount` | `number` | > 0, 2 decimal places | Fixed monthly payment amount |
| `principal_portion` | `number` | > 0, 2 decimal places | Portion of payment applied to loan principal |
| `interest_portion` | `number` | >= 0, 2 decimal places | Portion of payment representing borrowing cost |
| `remaining_balance` | `number` | >= 0, 2 decimal places | Outstanding principal after this payment |

**Existing TypeScript Interface** (unchanged):
```typescript
export interface Installment {
  payment_number: number;
  payment_amount: number;
  principal_portion: number;
  interest_portion: number;
  remaining_balance: number;
}
```

**Per-Row Invariants**:
- `principal_portion + interest_portion === payment_amount` (within $0.01 rounding tolerance)
- `remaining_balance` decreases monotonically from first to last payment
- Final payment's `remaining_balance` should be `0` (FR-013 warns if not)

---

### 2. InstallmentTableProps (new)

**Description**: Component props interface defining the contract between InstallmentTable and its parent (`App`). Encodes five possible component states through a combination of props.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `installments` | `Installment[] \| null` | Yes | The amortization schedule data, or `null` before any calculation |
| `originalLoanAmount` | `number` | Yes | The original loan principal, used for progress bar calculation |
| `isLoading` | `boolean` | Yes | Whether a calculation is currently in progress |
| `error` | `string \| null` | Yes | Error message from a failed calculation, or `null` |
| `onRetry` | `() => void` | Yes | Callback invoked when the user clicks the retry button in error state |

**TypeScript Interface**:
```typescript
export interface InstallmentTableProps {
  installments: Installment[] | null;
  originalLoanAmount: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}
```

**State Resolution** (priority order):
1. `isLoading === true` → Loading state (FR-007)
2. `error !== null` → Error state with retry (FR-008)
3. `installments === null` → Pre-calculation placeholder (FR-006)
4. `installments.length === 0` → Empty schedule message (FR-009)
5. `installments.length > 0` → Full table render (FR-001, FR-002)

---

### 3. ScheduleSummary (derived, not stored)

**Description**: Computed totals for the summary/totals row in `<tfoot>`. Not a stored entity — calculated at render time by reducing the `installments` array.

| Field | Type | Derivation | Description |
|-------|------|------------|-------------|
| `totalPayments` | `number` | `sum(installment.payment_amount)` | Total of all payment amounts |
| `totalPrincipal` | `number` | `sum(installment.principal_portion)` | Total principal paid (should equal `originalLoanAmount`) |
| `totalInterest` | `number` | `sum(installment.interest_portion)` | Total interest paid over loan lifetime |

**Invariants** (SC-003):
- `totalPrincipal` equals `originalLoanAmount` (within $0.01 rounding tolerance)
- `totalPayments === totalPrincipal + totalInterest` (within $0.01 rounding tolerance)

**TypeScript — computed inline** (not a separate type):
```typescript
const summary = installments.reduce(
  (acc, inst) => ({
    totalPayments: acc.totalPayments + inst.payment_amount,
    totalPrincipal: acc.totalPrincipal + inst.principal_portion,
    totalInterest: acc.totalInterest + inst.interest_portion,
  }),
  { totalPayments: 0, totalPrincipal: 0, totalInterest: 0 }
);
```

---

### 4. ProgressPercentage (derived, not stored)

**Description**: A computed value per installment representing the percentage of the original loan that has been repaid. Derived from `originalLoanAmount` (prop) and the installment's `remaining_balance`.

| Input | Formula | Output | Example |
|-------|---------|--------|---------|
| `originalLoanAmount`, `remaining_balance` | `((originalLoanAmount - remaining_balance) / originalLoanAmount) * 100` | `number` (0-100) | `originalLoanAmount=10000, remaining_balance=7500` → `25` |

**Edge Cases**:
- First payment: progress is small (e.g., 2-8% for typical loans)
- Last payment: progress should be 100% (`remaining_balance === 0`)
- Summary row: always 100% (fully filled progress bar, per spec)
- `originalLoanAmount === 0`: default to 0% to avoid division by zero

**TypeScript — computed inline per row**:
```typescript
const calculateProgress = (originalLoanAmount: number, remainingBalance: number): number => {
  if (originalLoanAmount <= 0) return 0;
  return Math.round(((originalLoanAmount - remainingBalance) / originalLoanAmount) * 100);
};
```

---

### 5. FormattedCurrency (existing — reused from 003)

**Description**: A formatted string representation of a monetary value. Produced by the existing `formatCurrency` utility function at render time. Already implemented in `frontend/src/utils/formatCurrency.ts`.

| Input | Output | Example |
|-------|--------|---------|
| `number` | `string` | `10272.84` → `"$10,272.84"` |

**Formatting Rules** (FR-003):
- Dollar sign prefix (`$`)
- Comma thousands separator (`,`)
- Exactly 2 decimal places
- Uses `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`

No changes needed to this utility. Reused directly.

---

## Relationships

```
App (parent component)
  ├── state: result: LoanResult | null          (from API response)
  ├── state: loanAmount: number                 (from form input)
  ├── state: isLoading: boolean                 (API call lifecycle)
  ├── state: error: string | null               (API call error)
  │
  ├──[map to PaymentDisplayData]──→ PaymentDisplay (existing, 003)
  │
  ├──[map to InstallmentTableProps]──→ InstallmentTable (NEW, 004)
  │   │
  │   │  installments: result?.schedule ?? null
  │   │  originalLoanAmount: loanAmount
  │   │  isLoading: isLoading
  │   │  error: error
  │   │  onRetry: handleRetry
  │   │
  │   └── InstallmentTable (this component)
  │       ├── isLoading === true → Loading indicator
  │       │
  │       ├── error !== null → Error message + Retry button
  │       │   └── Retry button → calls onRetry → parent re-triggers API call
  │       │
  │       ├── installments === null → Placeholder
  │       │   └── "Enter loan details and calculate to see payment schedule."
  │       │
  │       ├── installments.length === 0 → Empty state
  │       │   └── "No payment schedule available."
  │       │
  │       └── installments.length > 0 → Full table render
  │           ├── Card header: "Payment Schedule" + "{n} payments"
  │           ├── <table>
  │           │   ├── <caption> "Loan Amortization Schedule"
  │           │   ├── <thead> 6 column headers
  │           │   ├── <tbody> installments.map(row)
  │           │   │   └── Per row: Payment #, formatCurrency(amount),
  │           │   │       formatCurrency(principal), formatCurrency(interest),
  │           │   │       formatCurrency(balance), ProgressBar
  │           │   └── <tfoot> Summary row (computed totals)
  │           └── Optional: Data integrity warning (if final balance ≠ $0.00)
  │
  └── LoanForm (sibling component, existing 002)
      └── onCalculate → sets result + loanAmount in App
```

## Component State Transitions

```
[Pre-Calculation]
  │  installments === null, isLoading === false, error === null
  │  → Render placeholder: "Enter loan details and calculate to see payment schedule."
  │
  │  User submits loan form
  │  → Parent sets isLoading = true, error = null, result = null
  │
  ▼
[Loading]
  │  isLoading === true
  │  → Render loading indicator (replaces any previous content immediately)
  │
  │  API responds successfully
  │  → Parent sets result = LoanResult, loanAmount = principal, isLoading = false
  │
  ▼
[Showing Schedule]
  │  installments.length > 0, isLoading === false, error === null
  │  → Render full table with all rows, summary, progress bars
  │  → If final balance ≠ $0.00, show data integrity warning below table
  │
  │  User submits new calculation
  │  → Parent sets isLoading = true, error = null, result = null
  │  → Component transitions to [Loading] (FR-007: loading replaces existing table)
  │
  ▼
[Loading] (again — replaces previous schedule)
  │
  │  API fails with error
  │  → Parent sets error = "message", isLoading = false
  │
  ▼
[Error]
  │  error !== null, isLoading === false
  │  → Render error message + Retry button
  │
  │  User clicks Retry
  │  → onRetry callback → Parent re-triggers API call
  │  → Parent sets isLoading = true, error = null
  │  → Component transitions to [Loading]
  │
  ▼
[Loading] (retry in progress)

---

[Empty Schedule] (edge case)
  │  installments.length === 0, isLoading === false, error === null
  │  → Render "No payment schedule available."
```

## Integration with Existing Types

The `InstallmentTableProps` interface will be added to the existing `frontend/src/types/loan.ts` file alongside the current interfaces. No existing interfaces are modified.

```typescript
// Existing (unchanged)
export interface LoanFormState { ... }
export interface LoanCalculateRequest { ... }
export interface LoanResult { ... }
export interface Installment { ... }
export type ValidationErrors = ...;
export interface ApiError { ... }
export interface FieldError { ... }
export interface LoanFormProps { ... }
export interface PaymentDisplayData { ... }
export interface PaymentDisplayProps { ... }

// New (added for 004-installment-table)
export interface InstallmentTableProps {
  installments: Installment[] | null;
  originalLoanAmount: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}
```

## Data Flow from API Response to Table

```
API Response (LoanResult)
  │
  │  {
  │    monthly_payment: 875.00,
  │    total_payment: 10500.00,
  │    total_interest: 500.00,
  │    schedule: [
  │      { payment_number: 1, payment_amount: 875.00, principal_portion: 833.33,
  │        interest_portion: 41.67, remaining_balance: 9166.67 },
  │      { payment_number: 2, ... },
  │      ...
  │      { payment_number: 12, payment_amount: 875.00, principal_portion: 871.38,
  │        interest_portion: 3.62, remaining_balance: 0.00 }
  │    ]
  │  }
  │
  ▼
App.tsx (parent)
  │  result.schedule → installments prop
  │  loanAmount → originalLoanAmount prop
  │
  ▼
InstallmentTable
  │
  ├── Row 1:  #1 | $875.00 | $833.33 | $41.67 | $9,166.67 | ████░░░░░░ 8%
  ├── Row 2:  #2 | $875.00 | $836.80 | $38.20 | $8,329.87 | █████░░░░░ 17%
  ├── ...
  ├── Row 12: #12 | $875.00 | $871.38 | $3.62  | $0.00     | ██████████ 100%
  └── Total:  Total | $10,500.00 | $10,000.00 | $500.00 | — | ██████████ 100%
```
