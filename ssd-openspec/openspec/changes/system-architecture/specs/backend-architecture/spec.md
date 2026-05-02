## ADDED Requirements

### Requirement: Backend implementation framework
The backend MUST be implemented in Python 3.8+ using FastAPI framework.

#### Scenario: FastAPI application setup
- **WHEN** backend application starts
- **THEN** system SHALL use FastAPI framework with automatic API documentation
- **THEN** system SHALL run on port 8000 using uvicorn with auto-reload enabled

### Requirement: Loan calculation engine
The Python backend SHALL calculate loan payments and generate amortization schedules.

#### Scenario: Calculate monthly payment
- **WHEN** backend receives loan calculation request with valid parameters
- **THEN** system SHALL calculate monthly payment using standard loan formula: M = P * [r(1+r)^n] / [(1+r)^n-1]
- **THEN** system SHALL return payment amount with at least 2 decimal places precision

#### Scenario: Generate amortization schedule
- **WHEN** backend receives loan calculation request
- **THEN** system SHALL generate complete amortization schedule for all payment periods
- **THEN** system SHALL calculate for each period: payment amount, principal portion, interest portion, and remaining balance

#### Scenario: Minimum loan amount validation
- **WHEN** loan amount is below minimum threshold
- **THEN** system SHALL reject the request with validation error

### Requirement: API endpoint management
The Python backend SHALL provide REST API endpoints for loan calculations.

#### Scenario: POST /api/calculate-loan endpoint
- **WHEN** frontend sends POST request to /api/calculate-loan endpoint
- **THEN** system SHALL accept JSON payload with amount, rate, and term fields
- **THEN** system SHALL validate all input parameters including data types
- **THEN** system SHALL return JSON response with monthlyPayment and installments array
- **THEN** system SHALL enable CORS to accept requests from frontend server

#### Scenario: Data type validation
- **WHEN** frontend sends incorrect data types
- **THEN** system SHALL return HTTP 400 Bad Request
- **THEN** system SHALL include specific field validation errors

#### Scenario: Input validation errors
- **WHEN** API request contains invalid parameters
- **THEN** system SHALL return HTTP 400 status code
- **THEN** system SHALL return JSON response with descriptive error message
- **THEN** system SHALL include field-specific validation errors when applicable

### Requirement: Response formatting
The Python backend SHALL format API responses consistently.

#### Scenario: Successful calculation response
- **WHEN** calculation completes successfully
- **THEN** system SHALL return JSON with monthlyPayment as number with 2 decimal places
- **THEN** system SHALL return installments as array of objects with period, principal, interest, and balance fields
- **THEN** system SHALL return HTTP 200 status code

#### Scenario: Server error response
- **WHEN** unexpected server error occurs
- **THEN** system SHALL return HTTP 500 status code
- **THEN** system SHALL return JSON with generic error message
- **THEN** system SHALL log detailed error information for debugging