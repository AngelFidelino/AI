# Quickstart: Loan Calculation API

**Feature**: 001-loan-calculation-api
**Date**: 2026-04-15

## Prerequisites

- **uv** (latest stable) — handles Python 3.12+ installation automatically
- No need to install Python, pip, or venv separately

## Setup

```bash
# From repository root
cd backend

# Install Python 3.12 (if not already available)
uv python install 3.12

# Install dependencies
uv sync

# Run tests (TDD — always run tests first)
uv run pytest tests/ -v --cov=services --cov=routes

# Start the development server
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## Quick Test

### Calculate a Loan
```bash
curl -X POST http://localhost:8000/api/v1/loans/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 10000, "term_months": 12, "annual_rate": 5.0}'
```

### Health Check
```bash
curl http://localhost:8000/health
```

### API Documentation
Open `http://localhost:8000/docs` in your browser for the interactive Swagger UI.

## Project Structure

```
backend/
├── main.py                  # App entry point, CORS, health endpoint
├── models/
│   ├── request.py           # LoanRequest Pydantic model
│   └── response.py          # LoanResponse, Installment, ErrorResponse models
├── services/
│   └── loan_calculator.py   # Core calculation logic
├── routes/
│   └── loans.py             # POST /api/v1/loans/calculate
├── middleware/
│   └── logging.py           # Structured request/response logging
├── pyproject.toml            # Dependencies (managed by uv)
└── tests/
    ├── test_loan_calculator.py
    ├── test_loans_api.py
    └── test_validation.py
```

## Development Workflow (TDD)

1. **Write a failing test** in `tests/`
2. **Run tests**: `uv run pytest tests/ -v`
3. **Write minimal code** to make the test pass
4. **Refactor** while keeping tests green
5. **Commit** after each passing test cycle

## Key Design Decisions

- **Decimal precision**: All monetary calculations use Python `Decimal` — never `float`
- **Simple interest only**: `Total Interest = Principal x (Rate/100) x (Term/12)`
- **Final installment adjustment**: The last payment absorbs rounding differences to ensure $0.00 remaining balance
- **Stateless**: No database, no persistence — each request is independent
- **No authentication**: Open access, suitable for local development

## Running Tests

```bash
# All tests with coverage
uv run pytest tests/ -v --cov=services --cov=routes

# Specific test file
uv run pytest tests/test_loan_calculator.py -v

# Specific test
uv run pytest tests/test_loan_calculator.py::test_calculate_monthly_payment_basic -v
```
