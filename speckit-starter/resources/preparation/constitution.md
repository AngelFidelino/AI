# Loan Simulator - Project Constitution

**Document Version**: 1.3  
**Last Updated**: April 2026  
**Project Type**: Educational PoC/MVP  
**Development Methodology**: Spec-Driven Development (SDD) with Test-Driven Development (TDD)  
**Technical Stack Reference**: [technical.md](./technical.md)

---

## 1. Project Overview

### 1.1 Project Identity
- **Name**: Loan Simulator
- **Type**: Educational Proof-of-Concept (PoC) / Minimum Viable Product (MVP)
- **Purpose**: Educational tool to demonstrate how loan payments are calculated and distributed between principal and interest over the loan term using simple interest calculations

### 1.2 Target Audience
- **Primary Users**: Consumers seeking to understand loan payment structures
- **Use Case**: Educational purposes - helping users visualize how loan payments break down over time

### 1.3 Team Composition
- **Team Size**: 1 Full-Stack Developer
- **Roles**: Backend development, Frontend development, Integration, Testing, Documentation

### 1.4 Project Scope
**In Scope**:
- Simple interest loan calculation engine
- Monthly payment calculation and amortization schedule generation
- REST API for loan calculations
- Web-based user interface with input form and results display
- Basic validation and error handling
- Unit testing for backend and frontend

**Out of Scope**:
- User authentication or account management
- Data persistence or database
- Production deployment
- Compound interest calculations
- Advanced features (payment comparisons, graphs, export functionality)

---

## 2. Architecture Principles

### 2.1 Architectural Pattern
**API-First Development**:
- Define API contract FIRST before implementation
- API specification serves as contract between frontend and backend
- Ensures consistency and prevents integration issues
- Backend and frontend development can proceed in parallel after contract is defined

**Separation of Concerns**:
- **Backend**: Business logic, calculations, data validation
- **Frontend**: User interface, presentation, user experience
- **API Layer**: Clear contract between frontend and backend

### 2.2 Component Architecture

#### Backend Structure
```
backend/
├── main                         # Application entry point, app initialization
├── routes/
│   └── loan_routes              # API endpoints
├── services/
│   └── loan_calculator          # Core calculation logic (simple interest)
├── models/
│   └── loan_models              # Request/response models
├── tests/
│   ├── test_loan_calculator     # Unit tests for calculation logic
│   └── test_loan_routes         # API endpoint tests
└── README.md                    # Backend setup and run instructions
```

#### Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── LoanForm             # Input form component (side-panel on Desktop/Tablet)
│   │   ├── PaymentDisplay       # Monthly payment display
│   │   └── InstallmentTable     # Amortization table component
│   ├── services/
│   │   └── api                  # API communication layer
│   ├── tests/
│   │   ├── LoanForm.test        # Component tests
│   │   ├── PaymentDisplay.test
│   │   └── InstallmentTable.test
│   ├── App                      # Main application component (manages responsive layout)
│   └── main                     # Application entry point
└── README.md                    # Frontend setup and run instructions
```

> **Note**: File extensions and build tool configurations are defined in [technical.md](./technical.md).

### 2.3 Responsive Layout

The application supports three responsive breakpoints:

| Breakpoint | Name | Width | Description |
|-----------|------|-------|-------------|
| Desktop | `≥1024px` | Large screens | Full side-panel layout |
| Tablet | `≥768px and <1024px` | Medium screens | Compact side-panel layout |
| Mobile | `<768px` | Small screens | Single-column stacked layout |

#### Desktop Layout (`≥1024px`)
```
┌──────────────────────────────────────────────────┐
│ Header / Title                                    │
├──────────────┬───────────────────────────────────┤
│              │                                    │
│  LoanForm    │   PaymentDisplay                   │
│  (left       │                                    │
│   side-panel)│   InstallmentTable                 │
│              │                                    │
│              │                                    │
└──────────────┴───────────────────────────────────┘
```
- **Left Panel**: Fixed-width side-panel (~300-350px) containing the LoanForm
- **Main Content**: Remaining width displays PaymentDisplay and InstallmentTable
- Side-panel remains visible and accessible while scrolling results

#### Tablet Layout (`≥768px and <1024px`)
```
┌────────────────────────────────────────┐
│ Header / Title                          │
├────────────┬───────────────────────────┤
│            │                            │
│ LoanForm   │  PaymentDisplay            │
│ (left      │                            │
│  side-panel│  InstallmentTable          │
│  narrower) │                            │
│            │                            │
└────────────┴───────────────────────────┘
```
- **Left Panel**: Narrower side-panel (~250-280px) containing the LoanForm
- **Main Content**: Remaining width displays PaymentDisplay and InstallmentTable
- Same side-panel concept as Desktop but with reduced widths

#### Mobile Layout (`<768px`)
```
┌──────────────────────┐
│ Header / Title        │
├──────────────────────┤
│                       │
│ LoanForm              │
│ (full-width, stacked) │
│                       │
├──────────────────────┤
│                       │
│ PaymentDisplay        │
│                       │
├──────────────────────┤
│                       │
│ InstallmentTable      │
│ (horizontal scroll)   │
│                       │
└──────────────────────┘
```
- **No side-panel**: All components stack vertically in a single column
- LoanForm occupies full width at the top
- Results (PaymentDisplay, InstallmentTable) appear below the form

### 2.4 Data Flow
1. User inputs loan parameters in frontend form
2. Frontend validates input (client-side)
3. Frontend sends POST request to backend API
4. Backend validates request using data models
5. Backend calculates monthly payment and generates amortization schedule
6. Backend returns JSON response
7. Frontend receives response and displays results

### 2.5 API Contract

#### Endpoint: Calculate Loan
- **Method**: POST
- **Path**: `/api/calculate-loan`
- **Content-Type**: `application/json`

**Request Schema**:
```json
{
  "amount": number,      // Loan principal (positive, > 0)
  "term": integer,       // Loan term in MONTHS (positive, > 0)
  "rate": number         // Annual interest rate as percentage (0-100)
}
```

**Response Schema**:
```json
{
  "monthlyPayment": number,      // Fixed monthly payment amount
  "totalPayment": number,        // Total amount paid over loan term
  "totalInterest": number,       // Total interest paid
  "installments": [
    {
      "paymentNumber": integer,  // Sequential payment number (1, 2, 3, ...)
      "paymentAmount": number,   // Monthly payment (constant)
      "principal": number,       // Principal portion of payment
      "interest": number,        // Interest portion of payment
      "remainingBalance": number // Outstanding balance after payment
    }
  ]
}
```

**Error Response Schema**:
```json
{
  "detail": string  // Error message
}
```

---

## 3. Coding Standards and Conventions

> **Note**: Language-specific coding standards, style guides, and code examples are defined in [technical.md](./technical.md).

### 3.1 General Principles
- **Readability**: Code should be self-documenting with clear variable names
- **Type Safety**: Use type annotations/hints for all function signatures
- **Decimal Precision**: Use precise decimal types for all monetary calculations; avoid floating-point arithmetic
- **Consistency**: Follow established coding standards throughout the project

### 3.2 Git Commit Conventions
- Use conventional commit messages:
  - `feat:` - New feature
  - `fix:` - Bug fix
  - `test:` - Adding or updating tests
  - `docs:` - Documentation changes
  - `refactor:` - Code refactoring

Example: `feat: implement simple interest calculation service`

---

## 4. Testing Approach

### 4.1 Testing Methodology
**Test-Driven Development (TDD)**:
1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests green

### 4.2 Testing Coverage Requirements

#### Backend Testing
- **Coverage Target**: Core calculation logic must be 100% tested
- **What to Test**:
  - Calculation accuracy (simple interest formula)
  - Edge cases (minimum values, maximum values, rounding)
  - Input validation
  - API endpoint responses
  - Error handling

#### Frontend Testing
- **Coverage Target**: All components should have basic rendering and interaction tests
- **What to Test**:
  - Component rendering
  - User interactions (form submission, input changes)
  - API call integration (mocked)
  - Display of calculated results
  - Error message display

> **Note**: Test framework configuration, structure examples, and run commands are defined in [technical.md](./technical.md).

### 4.3 API Testing
- Use the backend framework's automatic API documentation for manual testing
- Manual testing of API endpoints during development
- Integration testing through frontend-backend interaction

### 4.4 Test Data
**Standard Test Cases**:
1. **Basic Case**: $10,000 loan, 12 months, 5% rate
2. **Edge Case**: Small amount ($100), short term (3 months), low rate (1%)
3. **Edge Case**: Large amount ($100,000), long term (60 months), high rate (15%)
4. **Validation**: Zero values, negative values, invalid inputs

---

## 5. Security Requirements

### 5.1 Input Validation
- **Backend**: Data models validate all incoming requests
- **Frontend**: Client-side validation before API calls
- **Validation Rules**:
  - Loan amount: Must be positive number > 0
  - Term: Must be positive integer > 0
  - Rate: Must be positive number, typically 0-100

### 5.2 CORS Configuration
- Enable CORS on the backend for local development
- Allow frontend origin to communicate with the backend API

> **Note**: CORS implementation details and code examples are defined in [technical.md](./technical.md).

### 5.3 Error Handling
- Never expose internal error details to users
- Return appropriate HTTP status codes:
  - `200`: Success
  - `400`: Bad Request (validation errors)
  - `500`: Internal Server Error
- Provide clear, user-friendly error messages

### 5.4 Data Security
- **No sensitive data**: Application does not handle personal or financial data beyond calculation inputs
- **No persistence**: No data storage means no data breach risk
- **Local only**: Development environment only, no external exposure

---

## 6. Performance Expectations

### 6.1 Calculation Performance
- **Response Time**: API should respond within 100ms for calculations
- **Efficiency**: Simple interest calculations are lightweight; no optimization needed for PoC
- **Precision**: All monetary calculations accurate to 2 decimal places

### 6.2 Frontend Performance
- **Initial Load**: Application should load within 2 seconds
- **Interaction**: Form submission and results display should be instantaneous
- **Rendering**: Installment table should render smoothly (up to 60 rows for 5-year loan)

### 6.3 Scalability Considerations
- **Not Applicable**: PoC is single-user, local development only
- No concurrent user handling required
- No load testing or performance optimization needed

---

## 7. Development Workflow

### 7.1 Development Phases

#### Phase 1: API-First Development (2 days)
1. **Define API Contract**: Document request/response schemas
2. **Write API Tests**: Create failing tests for API endpoints (TDD)
3. **Implement Calculation Logic**: Build simple interest calculator with tests
4. **Implement API Endpoints**: Create backend API routes
5. **Verify API**: Test with automatic API docs and manual requests

#### Phase 2: Frontend Development (2-3 days)
1. **Setup Frontend Project**: Initialize project with chosen framework and build tool
2. **Create Components (TDD)**:
   - Write component tests first
   - Implement LoanForm component
   - Implement PaymentDisplay component
   - Implement InstallmentTable component
3. **Implement API Service**: Create HTTP client wrapper
4. **Integration**: Connect components with API service

#### Phase 3: Integration & Testing (1-2 days)
1. **End-to-End Testing**: Test complete user flow
2. **Cross-Browser Testing**: Verify on Chrome, Firefox, Safari, Edge
3. **Validation Testing**: Test edge cases and error scenarios
4. **Bug Fixes**: Address any issues found

#### Phase 4: Documentation (1 day)
1. **README Files**: Setup instructions for both backend and frontend
2. **API Documentation**: Ensure automatic API documentation is complete
3. **Usage Guide**: Basic user guide for testing the application

> **Note**: Development environment setup commands are defined in [technical.md](./technical.md).

### 7.2 Version Control Workflow
1. **Main Branch**: Stable, working code
2. **Feature Branches**: For each major feature or component
3. **Commit Frequency**: Commit after each passing test (TDD cycle)
4. **Merge Strategy**: Merge to main after feature completion and testing

---

## 8. Quality Standards

### 8.1 Code Quality
- **Readability**: Code should be self-documenting with clear variable names
- **Comments**: Document complex logic, especially calculation formulas
- **Documentation**: All public functions/components should have documentation comments
- **Consistency**: Follow established coding standards throughout

### 8.2 Calculation Accuracy
- **Mathematical Correctness**: Simple interest formula must be implemented correctly
- **Rounding**: Use proper rounding for currency (2 decimal places)
- **Final Balance**: Last installment must result in exactly $0.00 remaining balance
- **Validation**: Test calculations against manual/calculator verification

### 8.3 User Experience
- **Clarity**: Clear labels and instructions for all inputs
- **Feedback**: Immediate visual feedback for errors and successful calculations
- **Formatting**: All monetary values displayed as currency (e.g., $1,234.56)
- **Responsiveness**: Three-level responsive design (Desktop ≥1024px, Tablet ≥768px, Mobile <768px)
- **Layout**: On Desktop and Tablet, the loan input form is presented in a persistent left side-panel alongside results; on Mobile, components stack vertically in a single column

### 8.4 Project Documentation (README)
- **Living Document**: The main `README.md` file at the project root must always be kept up to date with current details on how to set up, run, and use the project
- **Technology Badges**: The `README.md` must include shield badges (using `https://img.shields.io/badge`) as a header at the top of the file, reflecting the languages, tools, frameworks, and key dependencies used in the project (e.g., Python, FastAPI, React, TypeScript, Vite, etc.)
- **Content Requirements**: The README must include at minimum:
  - Technology badge header
  - Project description and purpose
  - Prerequisites and environment setup
  - Backend setup and run instructions
  - Frontend setup and run instructions
  - How to run tests
  - API usage overview
- **Update Cadence**: The `README.md` must be updated whenever new dependencies are added, the tech stack changes, or setup/usage instructions change. Keeping the README accurate is as important as keeping tests green

---

## 9. Constraints and Limitations

### 9.1 Technical Constraints
- **Simple Interest Only**: Does not support compound interest calculations
- **Monthly Payments Only**: Fixed monthly payment frequency
- **No Database**: No data persistence or storage
- **Development Mode Only**: Not production-ready
- **Single User**: No multi-user support or session management

### 9.2 Functional Limitations
- **No Authentication**: No user accounts
- **No History**: Cannot save or retrieve previous calculations
- **No Comparison**: Cannot compare multiple loan scenarios
- **No Visualizations**: No charts or graphs
- **No Export**: Cannot export results to PDF/Excel

### 9.3 Calculation Assumptions
- **Simple Interest Formula**: Uses simple interest, not APR or compound interest
- **Fixed Rate**: Interest rate remains constant throughout loan term
- **No Fees**: No origination fees, processing fees, or penalties
- **Regular Payments**: Assumes on-time monthly payments

---

## 10. Success Criteria

### 10.1 Functional Success
- ✅ User can input loan amount, term (months), and interest rate
- ✅ System calculates and displays monthly payment correctly
- ✅ System generates complete amortization schedule
- ✅ Final payment results in $0.00 remaining balance
- ✅ All calculations are mathematically accurate using simple interest formula

### 10.2 Technical Success
- ✅ Backend API responds successfully to valid requests
- ✅ Frontend communicates properly with backend
- ✅ All unit tests pass (backend and frontend)
- ✅ Application runs without errors in development mode
- ✅ API contract is consistent between frontend and backend (API-First validation)

### 10.3 Quality Success
- ✅ Code follows established coding standards
- ✅ All components have corresponding tests (TDD)
- ✅ Documentation is complete (README files)
- ✅ Input validation works on both frontend and backend
- ✅ Error messages are clear and user-friendly

---

## 11. Calculation Reference

### 11.1 Simple Interest Formula

**Total Interest Calculation**:
```
Total Interest = Principal × Rate × Time
where:
  Principal = Loan amount
  Rate = Annual interest rate (as decimal, e.g., 0.05 for 5%)
  Time = Loan term in years
```

**Monthly Payment Calculation**:
```
Total Amount = Principal + Total Interest
Monthly Payment = Total Amount / Number of Months
```

**Per-Installment Breakdown**:
```
For each payment period:
  Interest Portion = Remaining Balance × (Annual Rate / 12)
  Principal Portion = Monthly Payment - Interest Portion
  New Balance = Remaining Balance - Principal Portion
```

### 11.2 Example Calculation
**Inputs**:
- Loan Amount: $10,000
- Term: 12 months (1 year)
- Rate: 5% annual

**Calculations**:
```
Total Interest = $10,000 × 0.05 × 1 = $500
Total Amount = $10,000 + $500 = $10,500
Monthly Payment = $10,500 / 12 = $875.00

First Payment Breakdown:
  Interest = $10,000 × (0.05 / 12) = $41.67
  Principal = $875.00 - $41.67 = $833.33
  Balance = $10,000 - $833.33 = $9,166.67
```

---

## Document Control

**Version History**:
- v1.0 (January 2026): Initial constitution for Loan Simulator PoC
- v1.1 (January 2026): Extracted technology-specific content to [technical.md](./technical.md)
- v1.2 (April 2026): Added 3-level responsive design (Desktop/Tablet/Mobile) with side-panel layout for LoanForm
- v1.3 (April 2026): Added Section 8.4 - README documentation principle with technology badge requirements

**Review and Updates**:
- This constitution should be reviewed if project scope changes
- Any architectural decisions should update this document
- Technology stack changes should update [technical.md](./technical.md)

**Authority**:
- This document serves as the authoritative reference for all development decisions
- All implementation must align with principles and standards defined herein

---

**End of Constitution**
