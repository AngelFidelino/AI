# Data Model: Payment Display

**Feature**: 003-payment-display
**Date**: 2026-04-15

## Entities

### 1. PaymentDisplayData

**Description**: Represents the calculated loan metrics displayed by the PaymentDisplay component. Composed from the API response (`LoanResult`) and the parent's form state (`principal`). This entity is read-only from the component's perspective.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `monthlyPayment` | `number` | > 0, 2 decimal places | Fixed monthly payment amount |
| `totalPayment` | `number` | > 0, 2 decimal places | Total amount paid over loan lifetime |
| `totalInterest` | `number` | >= 0, 2 decimal places | Total interest paid over loan lifetime |
| `principal` | `number` | > 0, 2 decimal places | Original loan amount (from form input state) |

**Invariant**: `principal + totalInterest === totalPayment` (mathematical consistency, SC-007)

**TypeScript Interface**:
```typescript
interface PaymentDisplayData {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
}
```

**Source Mapping** (parent responsibility):

| PaymentDisplayData Field | Source | Origin |
|--------------------------|--------|--------|
| `monthlyPayment` | `LoanResult.monthly_payment` | API response |
| `totalPayment` | `LoanResult.total_payment` | API response |
| `totalInterest` | `LoanResult.total_interest` | API response |
| `principal` | Form input state (`amount`) | Parent component |

---

### 2. PaymentDisplayProps

**Description**: Component props interface defining the contract between PaymentDisplay and its parent (`App`).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `PaymentDisplayData \| null` | Yes | Calculation data to display, or `null` for placeholder state |

**TypeScript Interface**:
```typescript
interface PaymentDisplayProps {
  data: PaymentDisplayData | null;
}
```

**States**:
- `data === null` → Render placeholder message ("Calculate a loan to see results")
- `data !== null` → Render three-card layout with formatted metrics

---

### 3. FormattedCurrency (derived, not stored)

**Description**: A formatted string representation of a monetary value. Not a stored entity — produced by the `formatCurrency` utility function at render time.

| Input | Output | Example |
|-------|--------|---------|
| `number` | `string` | `10272.84` → `"$10,272.84"` |

**Formatting Rules** (FR-004, FR-012):
- Dollar sign prefix (`$`)
- Comma thousands separator (`,`)
- Exactly 2 decimal places
- Handles values from `$0.00` to `$999,999.99`
- Uses `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`

**TypeScript Signature**:
```typescript
function formatCurrency(value: number): string;
```

---

## Relationships

```
App (parent component)
  ├── state: result: LoanResult | null     (from API response)
  ├── state: loanAmount: number            (from form input)
  │
  ├──[map to PaymentDisplayData]──→ PaymentDisplay
  │   │
  │   │  data: {
  │   │    monthlyPayment: result.monthly_payment,
  │   │    totalPayment: result.total_payment,
  │   │    totalInterest: result.total_interest,
  │   │    principal: loanAmount
  │   │  }
  │   │
  │   └── PaymentDisplay (this component)
  │       ├── data === null → Placeholder
  │       │   └── "Calculate a loan to see results"
  │       │
  │       └── data !== null → Three-card layout
  │           ├── Monthly Payment card    → formatCurrency(data.monthlyPayment)
  │           ├── Total Payment card      → formatCurrency(data.totalPayment)
  │           └── Payment Breakdown card
  │               ├── Principal Amount    → formatCurrency(data.principal)
  │               └── Total Interest      → formatCurrency(data.totalInterest)
  │
  └── LoanForm (sibling component, existing)
      └── onCalculate → sets result state in App
```

## Component State Transitions

```
[No Data]
  │  data === null
  │  → Render placeholder message
  │  → aria-live region contains placeholder text
  │
  │  User submits loan form → API returns LoanResult
  │  → Parent maps to PaymentDisplayData
  │  → data prop changes from null to PaymentDisplayData
  │
  ▼
[Showing Results]
  │  data !== null
  │  → Render three-card layout with formatted values
  │  → aria-live region announces updated content
  │
  │  User submits new calculation → API in progress
  │  → Previous data prop unchanged (parent keeps old state)
  │  → PaymentDisplay continues showing previous results
  │
  │  API returns new LoanResult
  │  → Parent maps new data → data prop updates
  │  → PaymentDisplay re-renders with new values
  │  → aria-live announces new content
  │
  │  (Optional) Parent sets data to null
  │  → Revert to placeholder
  │
  ▼
[No Data] (if data set to null)
```

## Integration with Existing Types

The `PaymentDisplayData` and `PaymentDisplayProps` interfaces will be added to the existing `frontend/src/types/loan.ts` file alongside the current interfaces. No existing interfaces are modified.

```typescript
// Existing (unchanged)
export interface LoanResult { ... }
export interface Installment { ... }
export interface LoanFormProps { ... }
// etc.

// New (added for 003-payment-display)
export interface PaymentDisplayData {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
}

export interface PaymentDisplayProps {
  data: PaymentDisplayData | null;
}
```
