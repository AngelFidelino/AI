# API Contract: Loan Calculation API

**Feature**: 001-loan-calculation-api
**Date**: 2026-04-15
**Base URL**: `http://localhost:8000`

---

## Endpoints

### POST /api/v1/loans/calculate

Calculate monthly payment and generate amortization schedule for a loan.

**Authentication**: None (open access)

#### Request

**Content-Type**: `application/json`

```json
{
  "amount": 10000,
  "term_months": 12,
  "annual_rate": 5.0
}
```

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `amount` | number | Yes | > 0 | Loan principal amount |
| `term_months` | integer | Yes | > 0, integer only | Loan term in months |
| `annual_rate` | number | Yes | >= 0, <= 100 | Annual interest rate as percentage |

#### Response: 200 OK

**Content-Type**: `application/json`

```json
{
  "monthly_payment": 854.17,
  "total_payment": 10250.00,
  "total_interest": 250.00,
  "schedule": [
    {
      "payment_number": 1,
      "payment_amount": 854.17,
      "principal_portion": 812.50,
      "interest_portion": 41.67,
      "remaining_balance": 9187.50
    },
    {
      "payment_number": 2,
      "payment_amount": 854.17,
      "principal_portion": 815.89,
      "interest_portion": 38.28,
      "remaining_balance": 8371.61
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `monthly_payment` | number | Fixed monthly payment (2 decimal places) |
| `total_payment` | number | Total amount paid over loan term (2 decimal places) |
| `total_interest` | number | Total interest paid over loan term (2 decimal places) |
| `schedule` | array | Complete amortization schedule |
| `schedule[].payment_number` | integer | Sequential payment number (1-based) |
| `schedule[].payment_amount` | number | Payment amount for this installment (2 decimal places) |
| `schedule[].principal_portion` | number | Amount applied to principal (2 decimal places) |
| `schedule[].interest_portion` | number | Amount applied to interest (2 decimal places) |
| `schedule[].remaining_balance` | number | Remaining balance after payment (2 decimal places) |

**Invariants**:
- `len(schedule) == term_months`
- `schedule[-1].remaining_balance == 0.00`
- `sum(schedule[*].principal_portion) == amount`
- `sum(schedule[*].interest_portion) == total_interest`
- All monetary values rounded to exactly 2 decimal places

#### Response: 400 Bad Request (Validation Error)

**Content-Type**: `application/json`

```json
{
  "error": "validation_error",
  "details": [
    {
      "field": "amount",
      "message": "Loan amount must be greater than 0"
    },
    {
      "field": "term_months",
      "message": "Term must be a positive integer"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Always `"validation_error"` |
| `details` | array | List of field-specific errors |
| `details[].field` | string | Name of the invalid field |
| `details[].message` | string | Human-readable error description |

**Validation Error Cases**:

| Input Condition | Field | Expected Message |
|----------------|-------|------------------|
| amount <= 0 | `amount` | Loan amount must be greater than 0 |
| amount missing | `amount` | Field is required |
| amount non-numeric | `amount` | Must be a valid number |
| term_months <= 0 | `term_months` | Term must be a positive integer |
| term_months non-integer (e.g., 12.5) | `term_months` | Term must be a positive integer |
| term_months missing | `term_months` | Field is required |
| annual_rate < 0 or > 100 | `annual_rate` | Interest rate must be between 0 and 100 |
| annual_rate missing | `annual_rate` | Field is required |
| any field non-numeric | (respective field) | Must be a valid number |

#### Response: 422 Unprocessable Entity

FastAPI's default response for malformed JSON or type coercion failures. This is Pydantic's native error format and may differ from the custom 400 format above. The implementation should catch Pydantic `ValidationError` and transform it into the 400 format.

---

### GET /health

Health check endpoint for service status verification.

**Authentication**: None

#### Response: 200 OK

**Content-Type**: `application/json`

```json
{
  "status": "UP"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Service status, always `"UP"` when healthy |

---

## CORS Configuration

| Setting | Value |
|---------|-------|
| Allowed Origins | `http://localhost:5173` |
| Allowed Methods | `POST` |
| Allowed Headers | `*` |

---

## Logging Contract

Every request/response cycle produces a structured log entry:

```json
{
  "timestamp": "2026-04-15T10:00:00Z",
  "method": "POST",
  "path": "/api/v1/loans/calculate",
  "status_code": 200,
  "response_time_ms": 12.5
}
```

Request body content is NOT logged to avoid PII exposure.

---

## Example Scenarios

### Scenario 1: Standard Calculation
```bash
curl -X POST http://localhost:8000/api/v1/loans/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 10000, "term_months": 12, "annual_rate": 5.0}'
```
Expected: 200 OK, monthly_payment = 854.17, total_interest = 250.00

### Scenario 2: Zero Interest
```bash
curl -X POST http://localhost:8000/api/v1/loans/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "term_months": 10, "annual_rate": 0}'
```
Expected: 200 OK, monthly_payment = 500.00, total_interest = 0.00

### Scenario 3: Validation Error
```bash
curl -X POST http://localhost:8000/api/v1/loans/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": -1000, "term_months": 0, "annual_rate": 150}'
```
Expected: 400 Bad Request with errors for all three fields

### Scenario 4: Health Check
```bash
curl http://localhost:8000/health
```
Expected: 200 OK, `{"status": "UP"}`
