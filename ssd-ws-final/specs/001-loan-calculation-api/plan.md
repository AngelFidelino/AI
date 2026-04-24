# Implementation Plan: Loan Calculation API

**Branch**: `001-loan-calculation-api` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-loan-calculation-api/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a RESTful API backend service that accepts loan parameters (principal amount, term in months, annual interest rate), performs simple interest calculations, and returns the monthly payment, totals, and a complete amortization schedule. The service uses Python/FastAPI with Pydantic validation, `Decimal` precision for all monetary math, and exposes `POST /api/v1/loans/calculate` plus `GET /health`. Development follows TDD with pytest, managed via `uv`.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**: FastAPI (latest stable), Pydantic (bundled with FastAPI), uvicorn
**Storage**: N/A — stateless, all computation in-memory per request
**Testing**: pytest (backend), Vitest + React Testing Library (frontend — future scope)
**Target Platform**: Local development (macOS/Windows/Linux)
**Project Type**: Web service (API backend for a frontend SPA)
**Performance Goals**: API response time < 100ms for calculations; handle up to 360-month terms within 1 second
**Constraints**: All monetary values use `Decimal` (no float); 2-decimal-place precision; simple interest only
**Scale/Scope**: Single-user local development; 1 API endpoint + 1 health endpoint; no persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | API-First Development | PASS | Spec defines `POST /api/v1/loans/calculate` contract with JSON schemas before implementation. Note: constitution uses `/api/calculate-loan` but spec uses `/api/v1/loans/calculate` — spec endpoint takes precedence as a refinement, not a contradiction. |
| II | Separation of Concerns | PASS | This feature is backend-only (calculation + validation). No presentation logic. Frontend is separate scope. |
| III | Test-Driven Development | PASS | Plan requires TDD cycle: tests first, then implementation. pytest for backend with 100% coverage on calculation logic. |
| IV | Decimal Precision | PASS | All monetary calculations use Python `Decimal` type. FR-007 requires 2 decimal places. Rounding adjustments on final installment per FR-006. |
| V | Input Validation at Every Boundary | PASS | Backend validates all inputs independently (FR-008 through FR-013). Pydantic enforces type/range constraints. HTTP 400 with field-specific errors. |
| VI | Simple Interest Scope Constraint | PASS | FR-002 explicitly defines simple interest formula. No compound interest. Spec assumptions confirm this is a design decision. |
| VII | Responsive Three-Level Design | N/A | This feature is backend-only. Frontend responsive design applies to a separate feature. |
| VIII | Living Documentation | PASS | Plan generates quickstart.md; README updates will follow implementation. |

**Gate Result**: PASS — No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-loan-calculation-api/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── main.py              # FastAPI app entry point, CORS config, health endpoint
├── models/
│   ├── request.py       # Pydantic model: LoanRequest
│   └── response.py      # Pydantic models: LoanResponse, Installment, ErrorResponse
├── services/
│   └── loan_calculator.py  # Core calculation logic (simple interest, amortization)
├── routes/
│   └── loans.py         # POST /api/v1/loans/calculate route handler
├── middleware/
│   └── logging.py       # Structured request/response logging middleware
├── pyproject.toml       # Dependencies and project metadata (managed by uv)
└── tests/
    ├── test_loan_calculator.py  # Unit tests for calculation service
    ├── test_loans_api.py        # Contract tests for API endpoint
    └── test_validation.py       # Validation edge case tests
```

**Structure Decision**: Web application structure (Option 2 — backend only for this feature). The backend follows a layered architecture: `models/` for Pydantic schemas, `services/` for business logic, `routes/` for API handlers, `middleware/` for cross-cutting concerns. Tests are co-located within the backend directory.

## Complexity Tracking

> No constitution violations detected. This section is intentionally empty.
