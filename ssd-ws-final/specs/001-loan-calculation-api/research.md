# Research: Loan Calculation API

**Feature**: 001-loan-calculation-api
**Date**: 2026-04-15
**Status**: Complete — all items resolved

## Research Tasks

### 1. Simple Interest Calculation Formula Validation

**Context**: The spec defines a specific simple interest formula (FR-002). Need to verify correctness and confirm alignment with constitution Principle VI.

**Decision**: Use the formula as specified:
- Total Interest = Principal x (Rate / 100) x (Term / 12)
- Monthly Payment = (Principal + Total Interest) / Term

**Rationale**: This is the standard simple interest formula. The division of rate by 100 converts from percentage to decimal. The division of term by 12 converts months to years for the annual rate. The constitution (Principle VI) confirms this exact formula.

**Alternatives considered**:
- Compound interest (amortizing loan formula): Explicitly excluded by constitution Principle VI and spec assumptions.
- Simple interest with different per-installment allocation: Considered but the spec defines per-installment interest as `Remaining Balance x (Annual Rate / 12)`, which creates a decreasing interest pattern even under simple interest.

### 2. Amortization Schedule Generation with Simple Interest

**Context**: FR-004 requires a per-installment breakdown. Need to determine how simple interest distributes across installments since simple interest total is pre-computed.

**Decision**: Use the pre-computed total interest distributed across installments:
- Monthly interest portion = Remaining Balance x (Annual Rate / 100 / 12)
- Monthly principal portion = Monthly Payment - Monthly Interest Portion
- Remaining Balance = Previous Balance - Principal Portion
- Final installment adjusts to zero out the balance (FR-006)

**Rationale**: This approach provides a meaningful amortization breakdown where early payments have higher interest portions and later payments have higher principal portions, matching user expectations for an amortization schedule. The total of all interest portions will equal the pre-computed total interest (with minor rounding adjustments absorbed by the final installment).

**Alternatives considered**:
- Equal interest distribution (Total Interest / Term per installment): Simpler but provides no useful breakdown — every installment would look identical, defeating the purpose of a schedule.
- Applying interest only to original principal each month: Would make all interest portions identical, which is technically correct for flat simple interest but less informative.

### 3. Decimal Precision and Rounding Strategy

**Context**: Constitution Principle IV mandates `Decimal` types. FR-007 requires 2 decimal places. Need to determine rounding strategy.

**Decision**: Use Python's `decimal.Decimal` with `ROUND_HALF_EVEN` (banker's rounding) as specified in the constitution. Apply rounding:
- Round monthly payment to 2 decimal places after computation
- Round each installment's interest and principal portions to 2 decimal places
- Adjust the final installment to absorb accumulated rounding differences, ensuring remaining balance is exactly $0.00

**Rationale**: Banker's rounding minimizes systematic bias. The final-installment adjustment is required by FR-006 and prevents balance drift.

**Alternatives considered**:
- `ROUND_HALF_UP`: Common in finance but constitution explicitly calls for banker's rounding or equivalent.
- Arbitrary precision throughout (defer rounding to display): Would complicate the API contract and shift responsibility to consumers.

### 4. FastAPI Project Structure Best Practices

**Context**: Need to determine optimal FastAPI project layout for a small, focused API service.

**Decision**: Use a modular layered structure:
- `main.py` — App factory, CORS, health endpoint
- `models/` — Pydantic request/response schemas
- `services/` — Pure business logic (no HTTP concerns)
- `routes/` — API route handlers (thin, delegate to services)
- `middleware/` — Logging middleware

**Rationale**: Separates concerns per constitution Principle II. Services contain testable pure functions. Routes are thin wrappers. Models define the API contract (Principle I).

**Alternatives considered**:
- Single-file FastAPI app: Too coupled for TDD; hard to test calculation logic independently.
- Domain-driven structure (e.g., `loans/` domain package): Over-engineered for a single-endpoint service.

### 5. Pydantic Validation for Field-Specific Errors

**Context**: FR-008 through FR-013 require field-specific validation errors. Need to determine how to leverage Pydantic for this.

**Decision**: Use Pydantic v2 field validators with `Field()` constraints:
- `amount: Decimal = Field(gt=0)` — enforces positive amount
- `term_months: int = Field(gt=0)` — enforces positive integer
- `annual_rate: Decimal = Field(ge=0, le=100)` — enforces 0-100 range
- Catch Pydantic `ValidationError` in a custom exception handler to format field-specific error messages per FR-013

**Rationale**: Pydantic provides built-in field-level validation that maps directly to the spec requirements. Custom exception handler transforms Pydantic's error format into the API's error contract.

**Alternatives considered**:
- Manual validation in the route handler: Duplicates Pydantic's capabilities, more code, less declarative.
- Custom validator classes: Unnecessary when Pydantic covers all validation rules.

### 6. Structured Logging Implementation

**Context**: FR-016 requires structured request/response logging (method, path, parameters, status code, response time).

**Decision**: Implement a custom FastAPI middleware that:
- Logs each request (method, path) on entry
- Captures response status code and computes response time
- Uses Python's `logging` module with JSON-formatted output
- Avoids logging request body content to prevent PII exposure (log parameter presence only)

**Rationale**: Middleware approach captures all requests uniformly without polluting route handlers. JSON-structured logs are parseable by log aggregation tools if the service evolves.

**Alternatives considered**:
- Third-party logging library (structlog, loguru): Adds dependencies for minimal benefit in a PoC.
- Decorator-based logging per route: Less maintainable, easy to forget on new routes.

### 7. Endpoint Path: Spec vs Constitution Discrepancy

**Context**: Constitution references `POST /api/calculate-loan`. Spec defines `POST /api/v1/loans/calculate`. Need to resolve.

**Decision**: Use the spec endpoint `POST /api/v1/loans/calculate`.

**Rationale**: The spec is the more recent and detailed document. The versioned path (`/api/v1/`) follows REST best practices and allows future API evolution. The constitution's reference was a general example; the spec's clarification (Session 2026-04-15) explicitly chose this path. This is a refinement, not a contradiction.

**Alternatives considered**:
- Use constitution path `/api/calculate-loan`: Would contradict the spec's explicit clarification and lack API versioning.
- Support both paths: Unnecessary complexity for a PoC.
