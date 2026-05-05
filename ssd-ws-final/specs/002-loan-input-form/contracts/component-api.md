# Component API Contract: Loan Input Form

**Feature**: 002-loan-input-form
**Date**: 2026-04-15

---

## Component: LoanForm

The primary user-facing component. Renders a form with three validated input fields and a submit button. Communicates results to the parent component via a callback prop.

### Props Interface

```typescript
interface LoanFormProps {
  onCalculate: (result: LoanResult) => void;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onCalculate` | `(result: LoanResult) => void` | Yes | Called when backend returns a successful calculation result |

### Result Type

```typescript
interface LoanResult {
  monthly_payment: number;
  total_payment: number;
  total_interest: number;
  schedule: Installment[];
}

interface Installment {
  payment_number: number;
  payment_amount: number;
  principal_portion: number;
  interest_portion: number;
  remaining_balance: number;
}
```

### Usage

```tsx
import { LoanForm } from './components/LoanForm';
import type { LoanResult } from './types/loan';

function App() {
  const handleCalculate = (result: LoanResult) => {
    // Display results in PaymentDisplay, InstallmentTable, etc.
    console.log('Monthly payment:', result.monthly_payment);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <LoanForm onCalculate={handleCalculate} />
      </aside>
      <main className="results">
        {/* Future: PaymentDisplay and InstallmentTable components */}
      </main>
    </div>
  );
}
```

### Behavior Contract

| Behavior | Description |
|----------|-------------|
| **Renders 3 input fields** | Loan Amount ($), Loan Term (months), Annual Interest Rate (%) |
| **Validates on blur** | Each field is validated when it loses focus |
| **Validates on submit** | All fields validated before API call |
| **Shows inline errors** | Red text near the relevant field |
| **Prevents duplicate submissions** | Button disabled during API processing |
| **Shows loading state** | Button text changes to "Calculating..." during API call |
| **Calls onCalculate on success** | Passes `LoanResult` to parent |
| **Handles API errors gracefully** | Displays user-friendly error messages |
| **Preserves form values on error** | Form remains editable with entered values |
| **Keyboard navigable** | Tab order: amount → term → rate → Calculate button |
| **Accessible** | ARIA labels, error associations, focus indicators |

### DOM Structure Contract

```html
<form>
  <h2>Loan Details</h2>
  
  <!-- Loan Amount Field -->
  <div class="form-field">
    <label for="amount">Loan Amount ($)</label>
    <input id="amount" type="text" inputmode="decimal" placeholder="e.g., 10000" 
           aria-describedby="amount-error" />
    <span id="amount-error" class="error-message" role="alert">
      <!-- Error text when invalid -->
    </span>
  </div>

  <!-- Loan Term Field -->
  <div class="form-field">
    <label for="term">Loan Term (months)</label>
    <input id="term" type="text" inputmode="numeric" placeholder="e.g., 12"
           aria-describedby="term-error" />
    <span id="term-error" class="error-message" role="alert">
      <!-- Error text when invalid -->
    </span>
  </div>

  <!-- Annual Interest Rate Field -->
  <div class="form-field">
    <label for="rate">Annual Interest Rate (%)</label>
    <input id="rate" type="text" inputmode="decimal" placeholder="e.g., 5.0"
           aria-describedby="rate-error" />
    <span id="rate-error" class="error-message" role="alert">
      <!-- Error text when invalid -->
    </span>
  </div>

  <!-- API Error Message -->
  <div class="api-error" role="alert">
    <!-- Displayed on network/server errors -->
  </div>

  <!-- Submit Button -->
  <button type="submit" disabled={isLoading}>
    {isLoading ? 'Calculating...' : 'Calculate'}
  </button>
</form>
```

### CSS Classes Contract

| Class | Element | Purpose |
|-------|---------|---------|
| `.loan-form` | `<form>` | Form container with card styling |
| `.form-field` | `<div>` | Wrapper for label + input + error |
| `.form-field--error` | `<div>` | Applied when field has validation error |
| `.error-message` | `<span>` | Inline error text (red) |
| `.api-error` | `<div>` | API/network error banner |
| `.submit-button` | `<button>` | Calculate button |
| `.submit-button--loading` | `<button>` | Loading state styling |

### Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Field labels | `<label for="fieldId">` associated with each input |
| Error announcements | `role="alert"` on error message containers |
| Error association | `aria-describedby` linking input to its error span |
| Invalid state | `aria-invalid="true"` on fields with errors |
| Focus order | Natural tab order: amount → term → rate → submit |
| Focus indicators | Visible colored border on focused inputs |
| Submit via keyboard | Enter key submits form when button focused |

---

## Service: loanApi

### API Client Interface

```typescript
async function calculateLoan(params: LoanCalculateRequest): Promise<LoanResult>;
```

### Request Contract

```typescript
interface LoanCalculateRequest {
  amount: number;
  term_months: number;
  annual_rate: number;
}
```

**Endpoint**: `POST /api/v1/loans/calculate`
**Content-Type**: `application/json`
**Timeout**: 10 seconds (AbortController)

### Response Handling

| Status | Action |
|--------|--------|
| 200 OK | Parse JSON as `LoanResult`, return to caller |
| 400 Bad Request | Parse JSON as `ApiError`, throw typed error with field details |
| 500+ Server Error | Throw error with message "An error occurred while calculating. Please try again." |
| Network Error | Throw error with message "Unable to connect to server. Please try again." |
| Timeout (10s) | Throw error with message "Request timed out. Please try again." |

### Error Types

```typescript
class LoanApiError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string>
  ) {
    super(message);
  }
}
```

---

## Utility: validation

### Validation Function Interface

```typescript
function validateLoanForm(values: LoanFormState): ValidationErrors;
function validateField(field: string, value: string): string | null;
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `amount` | Required | "Please enter a loan amount" |
| `amount` | Must be numeric | "Please enter a valid number" |
| `amount` | Must be > 0 | "Loan amount must be greater than 0" |
| `amount` | Must be <= 10,000,000 | "Loan amount must not exceed 10,000,000" |
| `term` | Required | "Please enter a loan term" |
| `term` | Must be numeric | "Please enter a valid number" |
| `term` | Must be integer | "Please enter a whole number for months" |
| `term` | Must be >= 1 | "Loan term must be at least 1 month" |
| `term` | Must be <= 600 | "Loan term must not exceed 600 months" |
| `rate` | Required | "Please enter an interest rate" |
| `rate` | Must be numeric | "Please enter a valid number" |
| `rate` | Must be >= 0 | "Interest rate must be between 0 and 100" |
| `rate` | Must be <= 100 | "Interest rate must be between 0 and 100" |
| `rate` | Max 2 decimal places | "Interest rate allows up to 2 decimal places" |
