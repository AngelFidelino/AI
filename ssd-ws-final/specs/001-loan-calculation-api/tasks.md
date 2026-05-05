# Tasks: Loan Calculation API

**Input**: Design documents from `/specs/001-loan-calculation-api/`
**Prerequisites**: plan.md (loaded), spec.md (loaded), research.md (loaded), data-model.md (loaded), contracts/api.md (loaded), quickstart.md (loaded)

**Tests**: Included — TDD is explicitly required by the project constitution (Principle III) and plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (backend only)**: `backend/` at repository root
- Structure per plan.md: `backend/models/`, `backend/services/`, `backend/routes/`, `backend/middleware/`, `backend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency management, and basic project structure

- [X] T001 Create project directory structure: `backend/`, `backend/models/`, `backend/services/`, `backend/routes/`, `backend/middleware/`, `backend/tests/`
- [X] T002 Initialize Python project with `pyproject.toml` in `backend/pyproject.toml` — configure `uv`, add dependencies: `fastapi`, `uvicorn`, `pydantic`, `pytest`, `httpx` (for TestClient), `pytest-cov`
- [X] T003 Create `backend/main.py` with FastAPI app instance, CORS configuration (allow origin `http://localhost:5173`, methods `POST`, headers `*`), and `GET /health` endpoint returning `{"status": "UP"}`
- [X] T004 [P] Create empty `__init__.py` files in `backend/models/`, `backend/services/`, `backend/routes/`, `backend/middleware/`, `backend/tests/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement structured logging middleware in `backend/middleware/logging.py` — log each request (method, path) and response (status_code, response_time_ms) as JSON-structured entries using Python `logging` module; do NOT log request body content (FR-016)
- [X] T006 Register logging middleware in `backend/main.py` — import and add middleware to the FastAPI app
- [X] T007 Create LoanRequest Pydantic model in `backend/models/request.py` — fields: `amount: Decimal` (gt=0), `term_months: int` (gt=0), `annual_rate: Decimal` (ge=0, le=100) per data-model.md
- [X] T008 [P] Create response Pydantic models in `backend/models/response.py` — `Installment` (payment_number, payment_amount, principal_portion, interest_portion, remaining_balance), `LoanResponse` (monthly_payment, total_payment, total_interest, schedule: list[Installment]), `ErrorResponse` (error: str, details: list[FieldError]), `FieldError` (field: str, message: str) per data-model.md
- [X] T009 Create custom Pydantic ValidationError exception handler in `backend/main.py` — catch `RequestValidationError`, transform into `ErrorResponse` format with HTTP 400 (not 422), field-specific error messages per contracts/api.md validation error table

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Calculate Loan Payment (Priority: P1) MVP

**Goal**: Accept loan parameters (amount, term, rate) and return monthly payment, total payment, and total interest using simple interest formula

**Independent Test**: Send valid loan parameters via `POST /api/v1/loans/calculate` and verify monthly_payment, total_payment, total_interest match the simple interest formula: `total_interest = principal x (rate/100) x (term/12)`, `monthly_payment = (principal + total_interest) / term`

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (TDD)**

- [X] T010 [P] [US1] Write unit tests for core calculation in `backend/tests/test_loan_calculator.py` — test cases: (1) $10,000 / 12mo / 5% = monthly $854.17, total $10,250.00, interest $250.00; (2) $5,000 / 10mo / 0% = monthly $500.00, total $5,000.00, interest $0.00; (3) $1,000 / 1mo / 12% = monthly $1,010.00, total $1,010.00, interest $10.00; all using Decimal precision
- [X] T011 [P] [US1] Write API contract test for calculate endpoint in `backend/tests/test_loans_api.py` — test `POST /api/v1/loans/calculate` returns HTTP 200 with correct monthly_payment, total_payment, total_interest for standard loan parameters; verify JSON response structure matches contracts/api.md

### Implementation for User Story 1

- [X] T012 [US1] Implement core calculation logic in `backend/services/loan_calculator.py` — function `calculate_loan(amount: Decimal, term_months: int, annual_rate: Decimal)` returning monthly_payment, total_payment, total_interest using simple interest formula; all math with `Decimal`, rounding to 2 decimal places with `ROUND_HALF_EVEN` per research.md decision #3
- [X] T013 [US1] Create loan calculation route in `backend/routes/loans.py` — `POST /api/v1/loans/calculate` accepting `LoanRequest`, calling `calculate_loan()` service, returning `LoanResponse` (schedule as empty list for now — US2 adds schedule)
- [X] T014 [US1] Register loans router in `backend/main.py` — import and include the loans router with prefix `/api/v1`

**Checkpoint**: US1 complete — `POST /api/v1/loans/calculate` returns correct monthly payment, total payment, total interest. Run: `uv run pytest backend/tests/test_loan_calculator.py backend/tests/test_loans_api.py -v`

---

## Phase 4: User Story 2 — Generate Amortization Schedule (Priority: P2)

**Goal**: Extend the calculation response to include a complete installment-by-installment breakdown showing principal portion, interest portion, and remaining balance per payment

**Independent Test**: Submit loan parameters and verify the response contains exactly `term_months` installments, each with correct payment_number, payment_amount, principal_portion, interest_portion, remaining_balance; final balance is exactly $0.00; sum of principal portions equals amount; sum of interest portions equals total_interest

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (TDD)**

- [X] T015 [P] [US2] Write unit tests for amortization schedule generation in `backend/tests/test_loan_calculator.py` — test cases: (1) 12-month loan produces exactly 12 installments with sequential payment_numbers 1-12; (2) sum of all principal_portions equals original amount; (3) sum of all interest_portions equals total_interest; (4) final installment remaining_balance is exactly $0.00; (5) all monetary values have 2 decimal places; (6) 0% interest produces equal installments with $0.00 interest portions
- [X] T016 [P] [US2] Write API contract test for schedule in response in `backend/tests/test_loans_api.py` — test `POST /api/v1/loans/calculate` response includes `schedule` array with correct structure per contracts/api.md; verify installment count matches term_months

### Implementation for User Story 2

- [X] T017 [US2] Implement amortization schedule generation in `backend/services/loan_calculator.py` — function `generate_schedule(amount: Decimal, term_months: int, annual_rate: Decimal, monthly_payment: Decimal)` returning `list[Installment]`; per-installment: `interest_portion = remaining_balance x (annual_rate / 100 / 12)`, `principal_portion = monthly_payment - interest_portion`; final installment adjusts to zero balance (FR-006); all values rounded to 2 decimal places with `ROUND_HALF_EVEN`
- [X] T018 [US2] Update route handler in `backend/routes/loans.py` to call `generate_schedule()` and populate the `schedule` field in `LoanResponse` with the full amortization schedule

**Checkpoint**: US2 complete — response now includes full amortization schedule. Run: `uv run pytest backend/tests/ -v`

---

## Phase 5: User Story 3 — Validate Loan Parameters (Priority: P3)

**Goal**: Return clear, field-specific error messages for invalid or incomplete loan parameters, ensuring all invalid inputs are rejected with HTTP 400 and structured error details

**Independent Test**: Send various invalid parameter combinations (negative amount, zero term, rate > 100, missing fields, non-numeric values) and verify each returns HTTP 400 with `{"error": "validation_error", "details": [{"field": "...", "message": "..."}]}` per contracts/api.md

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (TDD)**

- [X] T019 [US3] Write validation tests in `backend/tests/test_validation.py` — test cases: (1) negative amount returns error "Loan amount must be greater than 0"; (2) zero term returns error "Term must be a positive integer"; (3) rate > 100 returns error "Interest rate must be between 0 and 100"; (4) missing fields return "Field is required" for each missing field; (5) non-numeric values return "Must be a valid number"; (6) non-integer term (e.g., 12.5) returns "Term must be a positive integer"; (7) multiple invalid fields return multiple error details; all expect HTTP 400 with `error: "validation_error"` structure

### Implementation for User Story 3

- [X] T020 [US3] Enhance custom validation error handler in `backend/main.py` — ensure Pydantic `RequestValidationError` is caught and transformed into the exact error message format per contracts/api.md validation error table: map Pydantic error types to human-readable messages ("Loan amount must be greater than 0", "Term must be a positive integer", "Interest rate must be between 0 and 100", "Field is required", "Must be a valid number")
- [X] T021 [US3] Verify edge case handling in `backend/models/request.py` — ensure LoanRequest model correctly rejects: zero amount, negative amount, zero term, negative term, float term (12.5), rate < 0, rate > 100, missing fields, non-numeric values; add custom validators if Pydantic Field constraints are insufficient

**Checkpoint**: US3 complete — all invalid inputs produce correct field-specific error responses. Run: `uv run pytest backend/tests/test_validation.py -v`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, edge case coverage, and documentation

- [X] T022 [P] Add edge case tests in `backend/tests/test_loan_calculator.py` — test: (1) extremely large loan ($200,000 / 360 months) completes within 1 second and maintains precision; (2) 1-month term produces single installment; (3) verify all monetary values in 360-installment schedule have exactly 2 decimal places
- [X] T023 [P] Add health endpoint test in `backend/tests/test_loans_api.py` — test `GET /health` returns HTTP 200 with `{"status": "UP"}`
- [X] T024 [P] Add logging middleware test — verify request/response logging produces structured log entries with method, path, status_code, response_time_ms fields
- [X] T025 Run full test suite with coverage: `uv run pytest backend/tests/ -v --cov=backend/services --cov=backend/routes --cov=backend/middleware` — verify all tests pass and coverage meets expectations
- [X] T026 Run quickstart.md validation — follow the quickstart steps manually: install deps, run tests, start server, execute curl commands from quickstart.md, verify expected responses

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on US1 completion (extends calculation service with schedule generation)
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion (can run in parallel with US1/US2 since it focuses on error handling, but shares the validation handler in main.py)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 — extends the calculation service and route handler created in US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — focuses on validation error handling; partially set up in T009 (Foundational), refined in T020-T021

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Models before services
- Services before endpoints/routes
- Core implementation before integration

### Parallel Opportunities

- **Phase 1**: T004 runs in parallel with T001-T003
- **Phase 2**: T007 and T008 can run in parallel (different files: request.py vs response.py)
- **Phase 3**: T010 and T011 can run in parallel (different test files for US1)
- **Phase 4**: T015 and T016 can run in parallel (different test scopes for US2)
- **Phase 5**: US3 tests (T019) can begin once Foundational is complete, even while US1/US2 are in progress
- **Phase 6**: T022, T023, T024 can all run in parallel (different test files/concerns)

---

## Parallel Example: User Story 1

```bash
# Launch US1 tests in parallel (TDD - write failing tests first):
Task: "Write unit tests for core calculation in backend/tests/test_loan_calculator.py"
Task: "Write API contract test for calculate endpoint in backend/tests/test_loans_api.py"

# Then implement sequentially:
Task: "Implement core calculation logic in backend/services/loan_calculator.py"
Task: "Create loan calculation route in backend/routes/loans.py"
Task: "Register loans router in backend/main.py"
```

---

## Parallel Example: User Story 2

```bash
# Launch US2 tests in parallel (TDD - write failing tests first):
Task: "Write unit tests for amortization schedule generation in backend/tests/test_loan_calculator.py"
Task: "Write API contract test for schedule in response in backend/tests/test_loans_api.py"

# Then implement sequentially:
Task: "Implement amortization schedule generation in backend/services/loan_calculator.py"
Task: "Update route handler in backend/routes/loans.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 — Calculate Loan Payment
4. **STOP and VALIDATE**: Test US1 independently — `uv run pytest backend/tests/test_loan_calculator.py backend/tests/test_loans_api.py -v`
5. Deploy/demo if ready — API returns correct monthly payment, total payment, total interest

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (adds amortization schedule)
4. Add User Story 3 → Test independently → Deploy/Demo (adds input validation with friendly errors)
5. Polish → Full test suite, edge cases, documentation validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 → then User Story 2 (US2 depends on US1)
   - Developer B: User Story 3 (independent of US1/US2)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All monetary calculations MUST use Python `Decimal` — never `float` (Constitution Principle IV)
- Rounding: `ROUND_HALF_EVEN` (banker's rounding) per research.md decision #3
- Simple interest ONLY — no compound interest (Constitution Principle VI)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The API endpoint is `POST /api/v1/loans/calculate` (not `/api/calculate-loan` from constitution — spec takes precedence per research.md decision #7)
