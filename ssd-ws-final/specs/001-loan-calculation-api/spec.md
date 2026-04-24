# Feature Specification: Loan Calculation API

**Feature Branch**: `001-loan-calculation-api`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "The Loan Calculation API is the backend core of the Loan Simulator application. It provides a RESTful API endpoint that accepts loan parameters (amount, term, interest rate), performs simple interest calculations, and returns the monthly payment amount along with a complete amortization schedule showing the breakdown of each installment."

## Clarifications

### Session 2026-04-15

- Q: What RESTful API convention should the endpoint follow? → A: `POST /api/v1/loans/calculate` with JSON request/response bodies, HTTP 200 for success, HTTP 400 for validation errors.
- Q: What level of observability should the API provide? → A: Structured request/response logging plus a `GET /health` endpoint.
- Q: Should the API require any authentication or is it open/unauthenticated? → A: No authentication — open access, suitable for dev/internal use.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate Loan Payment (Priority: P1)

A consumer application sends loan parameters — principal amount, loan term in months, and annual interest rate — to the calculation service. The service computes the fixed monthly payment using simple interest and returns the result along with summary totals (total payment, total interest). This is the core value proposition: accurate, on-demand loan payment calculation.

**Why this priority**: This is the foundational capability. Without accurate monthly payment calculation, no other feature (amortization schedule, validation, etc.) delivers value. A consumer can use just this to display a loan payment estimate.

**Independent Test**: Can be fully tested by sending a valid set of loan parameters and verifying the returned monthly payment, total payment, and total interest match the simple interest formula.

**Acceptance Scenarios**:

1. **Given** a loan amount of $10,000, term of 12 months, and annual rate of 5%, **When** the consumer submits these parameters, **Then** the service returns a monthly payment of $854.17, total payment of $10,250.00, and total interest of $250.00.
2. **Given** a loan amount of $5,000, term of 10 months, and annual rate of 0%, **When** the consumer submits these parameters, **Then** the service returns a monthly payment of $500.00, total payment of $5,000.00, and total interest of $0.00.
3. **Given** a loan amount of $1,000, term of 1 month, and annual rate of 12%, **When** the consumer submits these parameters, **Then** the service returns a monthly payment of $1,010.00, total payment of $1,010.00, and total interest of $10.00.

---

### User Story 2 - Generate Amortization Schedule (Priority: P2)

A consumer application requests a loan calculation and receives a complete installment-by-installment breakdown showing how each payment splits between principal and interest, with the remaining balance after each payment. This enables users to understand exactly how their loan is paid down over time.

**Why this priority**: The amortization schedule adds transparency and detail to the basic calculation. It depends on Story 1's calculation engine but extends it with per-installment granularity that users expect from a loan simulator.

**Independent Test**: Can be fully tested by submitting loan parameters and verifying the returned installment array has the correct number of entries, each with payment number, payment amount, principal portion, interest portion, and remaining balance — with the final balance at exactly $0.00.

**Acceptance Scenarios**:

1. **Given** a valid loan request for 12 months, **When** the consumer submits the request, **Then** the response includes exactly 12 installments, each with sequential payment numbers from 1 to 12.
2. **Given** a valid loan request, **When** the consumer reviews the installment breakdown, **Then** the sum of all principal portions equals the original loan amount, and the sum of all interest portions equals the total interest.
3. **Given** a valid loan request, **When** the consumer checks the final installment, **Then** the remaining balance is exactly $0.00.
4. **Given** a valid loan request, **When** the consumer reviews the schedule, **Then** all monetary values are accurate to 2 decimal places.

---

### User Story 3 - Validate Loan Parameters (Priority: P3)

A consumer application sends invalid or incomplete loan parameters. The service validates all inputs and returns clear, field-specific error messages indicating which parameters are invalid and why. This prevents incorrect calculations and helps the consumer display meaningful feedback to end users.

**Why this priority**: Input validation is essential for reliability but is a defensive capability — it prevents bad outcomes rather than delivering primary value. The calculation and schedule stories deliver the core user experience; validation ensures robustness.

**Independent Test**: Can be fully tested by sending various invalid parameter combinations (negative amount, zero term, rate out of range, missing fields, non-numeric values) and verifying each returns the appropriate error response with field-specific messages.

**Acceptance Scenarios**:

1. **Given** a request with a negative loan amount, **When** the consumer submits the request, **Then** the service returns an error indicating the loan amount must be greater than 0.
2. **Given** a request with a term of 0, **When** the consumer submits the request, **Then** the service returns an error indicating the term must be a positive integer.
3. **Given** a request with an interest rate of 150 (exceeding 100), **When** the consumer submits the request, **Then** the service returns an error indicating the rate must be between 0 and 100.
4. **Given** a request missing one or more required parameters, **When** the consumer submits the request, **Then** the service returns an error identifying each missing field.
5. **Given** a request with non-numeric values for any parameter, **When** the consumer submits the request, **Then** the service returns a type validation error.

---

### Edge Cases

- What happens when the interest rate is exactly 0%? The system should handle zero-interest loans correctly, with all interest portions equal to $0.00 and the monthly payment being simply the principal divided by the term.
- What happens when the term is exactly 1 month? The system should produce a single installment where the entire principal plus one month's interest is paid at once.
- What happens when the loan amount is extremely large (e.g., $200,000 with a 360-month term)? The system should generate all 360 installments accurately within acceptable response time and maintain 2-decimal-place precision throughout.
- How does the system handle rounding across many installments? The final installment must adjust to ensure the remaining balance is exactly $0.00, absorbing any accumulated rounding differences.
- What happens when a non-integer term is provided (e.g., 12.5 months)? The system should reject it with a clear error message requiring a positive integer.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a single endpoint `POST /api/v1/loans/calculate` that accepts a JSON request body containing three parameters: loan amount (positive number), term in months (positive integer), and annual interest rate as a percentage (0 to 100). Successful responses return HTTP 200 with a JSON body; validation errors return HTTP 400 with a structured JSON error body.
- **FR-002**: System MUST calculate the monthly payment using the simple interest method: total interest = principal x (rate / 100) x (term / 12); monthly payment = (principal + total interest) / term.
- **FR-003**: System MUST return the calculated monthly payment, total payment amount, and total interest as part of every successful response.
- **FR-004**: System MUST generate a complete amortization schedule with one entry per month, each containing: payment number, payment amount, principal portion, interest portion, and remaining balance.
- **FR-005**: System MUST ensure the amortization schedule has exactly as many entries as the loan term in months.
- **FR-006**: System MUST ensure the final installment results in a remaining balance of exactly $0.00, adjusting the last payment if necessary to absorb rounding differences.
- **FR-007**: System MUST round all monetary values to exactly 2 decimal places.
- **FR-008**: System MUST validate that the loan amount is a number greater than 0; reject otherwise with a field-specific error.
- **FR-009**: System MUST validate that the term is a positive integer; reject non-integers and values less than or equal to 0 with a field-specific error.
- **FR-010**: System MUST validate that the interest rate is a number between 0 and 100 (inclusive); reject values outside this range with a field-specific error.
- **FR-011**: System MUST validate that all three parameters are present; reject requests with missing parameters and identify which fields are missing.
- **FR-012**: System MUST reject non-numeric values for any parameter with a type validation error.
- **FR-013**: System MUST return structured error responses containing the error category and field-specific error messages for each invalid parameter.
- **FR-014**: System MUST perform all calculations in-memory with no data persistence; each request is stateless and independent.
- **FR-015**: System MUST expose a `GET /health` endpoint that returns HTTP 200 with a JSON body indicating service status (e.g., `{"status": "UP"}`), suitable for load balancer or orchestrator health checks.
- **FR-016**: System MUST produce structured logs for each incoming request (method, path, parameters) and outgoing response (status code, response time), using a consistent format (e.g., JSON-structured logs).

### Key Entities

- **Loan Request**: Represents the input parameters for a calculation — principal amount, term in months, and annual interest rate. All three fields are required for every calculation.
- **Loan Calculation Result**: The computed output containing monthly payment, total payment, total interest, and the full amortization schedule.
- **Installment**: A single row in the amortization schedule representing one monthly payment, containing the payment sequence number, payment amount, principal portion, interest portion, and remaining balance after payment.
- **Validation Error**: A structured error response identifying which input parameters failed validation and providing human-readable error messages for each.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every valid loan calculation request returns a correct monthly payment that matches the simple interest formula, verified across at least 5 distinct test scenarios (varying amounts, terms, and rates).
- **SC-002**: The sum of all principal portions in the amortization schedule equals the original loan amount for every calculation, with zero discrepancy.
- **SC-003**: The sum of all interest portions in the amortization schedule equals the reported total interest for every calculation, with zero discrepancy.
- **SC-004**: The final installment in every amortization schedule shows a remaining balance of exactly $0.00.
- **SC-005**: All invalid input combinations (negative amount, zero term, out-of-range rate, missing fields, non-numeric values) are rejected with appropriate field-specific error messages — 100% rejection accuracy.
- **SC-006**: Calculations for loan terms up to 360 months complete and return results within 1 second.
- **SC-007**: All monetary values in responses are accurate to exactly 2 decimal places across all test scenarios.
- **SC-008**: The `GET /health` endpoint returns HTTP 200 with a valid JSON status body when the service is running.
- **SC-009**: Every request/response cycle produces a structured log entry containing method, path, status code, and response time.

## Assumptions

- The calculation uses simple interest only (not compound interest or standard amortizing loan formulas). This is an explicit design decision, not a simplification.
- Monthly payments only — no support for bi-weekly, weekly, or custom payment frequencies.
- No fees are included in calculations (no origination fees, processing fees, or other charges).
- No extra payment or early payoff scenarios are supported.
- The service is stateless — no calculation history is stored or retrievable.
- The consumer application is responsible for presenting results to end users; this service focuses solely on computation and validation.
- The service operates in a single-user development environment; no rate limiting or multi-tenancy is required.
- Currency is assumed to be USD with standard 2-decimal-place precision; no multi-currency support is needed.
- The API requires no authentication or authorization; all endpoints are open access. Authentication may be added later via an API gateway if the service moves to a production or multi-tenant environment.
