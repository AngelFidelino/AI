# Data Model: Loan Calculation API

**Feature**: 001-loan-calculation-api
**Date**: 2026-04-15

## Entities

### 1. LoanRequest

**Description**: Input parameters for a loan calculation. Submitted by the consumer as a JSON request body.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `amount` | `Decimal` | Required, > 0 | Loan principal amount in USD |
| `term_months` | `int` | Required, > 0, integer only | Loan term in months |
| `annual_rate` | `Decimal` | Required, >= 0, <= 100 | Annual interest rate as percentage (e.g., 5.0 for 5%) |

**Validation Rules** (FR-008 through FR-012):
- `amount`: Must be a positive number. Reject zero, negative, non-numeric.
- `term_months`: Must be a positive integer. Reject zero, negative, float, non-numeric.
- `annual_rate`: Must be a number in [0, 100]. Reject negative, > 100, non-numeric.
- All three fields are required. Missing fields produce field-specific errors.

**Pydantic Implementation**:
```python
from decimal import Decimal
from pydantic import BaseModel, Field

class LoanRequest(BaseModel):
    amount: Decimal = Field(gt=0, description="Loan principal amount")
    term_months: int = Field(gt=0, description="Loan term in months")
    annual_rate: Decimal = Field(ge=0, le=100, description="Annual interest rate as percentage")
```

---

### 2. Installment

**Description**: A single row in the amortization schedule representing one monthly payment.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `payment_number` | `int` | Sequential, 1 to N | Installment sequence number |
| `payment_amount` | `Decimal` | > 0, 2 decimal places | Total payment for this month |
| `principal_portion` | `Decimal` | >= 0, 2 decimal places | Amount applied to principal |
| `interest_portion` | `Decimal` | >= 0, 2 decimal places | Amount applied to interest |
| `remaining_balance` | `Decimal` | >= 0, 2 decimal places | Balance after this payment |

**Rules**:
- `payment_amount = principal_portion + interest_portion`
- `remaining_balance` decreases monotonically
- Final installment: `remaining_balance` MUST be exactly `0.00`
- Final installment may differ from others to absorb rounding adjustments (FR-006)

**State Transitions**:
```
[Full Balance] → payment 1 → [Reduced Balance] → payment 2 → ... → payment N → [$0.00]
```

---

### 3. LoanResponse

**Description**: Complete calculation result returned to the consumer.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `monthly_payment` | `Decimal` | > 0, 2 decimal places | Fixed monthly payment amount |
| `total_payment` | `Decimal` | > 0, 2 decimal places | Total amount paid over loan term |
| `total_interest` | `Decimal` | >= 0, 2 decimal places | Total interest paid over loan term |
| `schedule` | `list[Installment]` | Length = `term_months` | Complete amortization schedule |

**Derived Values**:
- `total_interest = amount x (annual_rate / 100) x (term_months / 12)`
- `monthly_payment = (amount + total_interest) / term_months`
- `total_payment = amount + total_interest`
- `len(schedule) == term_months` (FR-005)

**Invariants**:
- `sum(i.principal_portion for i in schedule) == amount` (SC-002)
- `sum(i.interest_portion for i in schedule) == total_interest` (SC-003)
- `schedule[-1].remaining_balance == 0.00` (SC-004)

---

### 4. ValidationError (Response)

**Description**: Structured error response for invalid inputs.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `error` | `str` | Always `"validation_error"` | Error category |
| `details` | `list[FieldError]` | At least 1 entry | Per-field error details |

### 4a. FieldError

| Field | Type | Description |
|-------|------|-------------|
| `field` | `str` | Name of the invalid field |
| `message` | `str` | Human-readable error description |

---

## Relationships

```
LoanRequest ──[validates]──→ LoanResponse
                              ├── monthly_payment
                              ├── total_payment
                              ├── total_interest
                              └── schedule: List[Installment]
                                   ├── Installment 1
                                   ├── Installment 2
                                   └── ... Installment N

LoanRequest ──[fails validation]──→ ValidationError
                                     └── details: List[FieldError]
```

## Calculation Flow

```
1. Receive LoanRequest
2. Validate all fields (Pydantic)
   ├── Invalid → return ValidationError (HTTP 400)
   └── Valid → continue
3. Compute totals:
   a. total_interest = amount × (annual_rate / 100) × (term_months / 12)
   b. monthly_payment = (amount + total_interest) / term_months
   c. total_payment = amount + total_interest
4. Generate amortization schedule:
   a. remaining_balance = amount
   b. For each month 1..N:
      - interest_portion = remaining_balance × (annual_rate / 100 / 12)
      - principal_portion = monthly_payment - interest_portion
      - If last month: adjust to zero out balance
      - remaining_balance -= principal_portion
   c. Round all monetary values to 2 decimal places
5. Return LoanResponse (HTTP 200)
```
