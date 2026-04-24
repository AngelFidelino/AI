<!--
=== SYNC IMPACT REPORT ===
Version change: 0.0.0 (template) → 1.0.0
Modified principles:
  - [PRINCIPLE_1_NAME] → I. API-First Development (NEW)
  - [PRINCIPLE_2_NAME] → II. Separation of Concerns (NEW)
  - [PRINCIPLE_3_NAME] → III. Test-Driven Development (NON-NEGOTIABLE) (NEW)
  - [PRINCIPLE_4_NAME] → IV. Decimal Precision (NEW)
  - [PRINCIPLE_5_NAME] → V. Input Validation at Every Boundary (NEW)
  - (expanded) → VI. Simple Interest Scope Constraint (NEW)
  - (expanded) → VII. Responsive Three-Level Design (NEW)
  - (expanded) → VIII. Living Documentation (NEW)
Added sections:
  - Core Principles (8 principles, expanded from 5 template slots)
  - Project Constraints & Scope
  - Development Workflow & Quality Gates
  - Governance
Removed sections:
  - All template placeholder sections replaced with concrete content
Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ reviewed (Constitution Check
    section references generic gates; compatible with new principles)
  - .specify/templates/spec-template.md — ✅ reviewed (no constitution-specific
    references requiring update)
  - .specify/templates/tasks-template.md — ✅ reviewed (task phases and
    structure compatible; TDD task ordering aligns with Principle III)
Deferred items: None
=== END SYNC IMPACT REPORT ===
-->

# Loan Simulator Constitution

## Core Principles

### I. API-First Development

All feature development MUST begin with API contract definition before
any implementation work starts. The API specification serves as the
binding contract between frontend and backend.

- The REST endpoint contract (`POST /api/calculate-loan`) MUST be
  documented with request/response JSON schemas before code is written
- Backend and frontend development MAY proceed in parallel only after
  the API contract is ratified
- Any contract change MUST be reviewed against both frontend and backend
  consumers before merging

**Rationale**: Prevents integration drift and enables parallel
development by a single developer switching between frontend and
backend contexts.

### II. Separation of Concerns

The system MUST maintain strict boundaries between three layers:

- **Backend**: Business logic, loan calculations, server-side data
  validation
- **Frontend**: User interface, presentation formatting, client-side
  validation, responsive layout
- **API Layer**: JSON-over-HTTP contract bridging frontend and backend

No layer MAY assume implementation details of another. The frontend
MUST NOT contain calculation logic. The backend MUST NOT contain
presentation logic.

**Rationale**: Enables independent testing, replacement, and reasoning
about each layer in an educational PoC context.

### III. Test-Driven Development (NON-NEGOTIABLE)

All production code MUST be written using the TDD cycle:

1. **Red**: Write a failing test that defines the desired behavior
2. **Green**: Write the minimal code to make the test pass
3. **Refactor**: Improve code structure while keeping all tests green

Coverage requirements:
- Backend calculation logic MUST have 100% test coverage
- Frontend components MUST have basic rendering and interaction tests
- API endpoints MUST have contract tests for valid and invalid inputs

Commits MUST follow the TDD cadence: commit after each passing test
cycle.

**Rationale**: TDD is the project's primary quality gate. Skipping
tests is a constitution violation, not a shortcut.

### IV. Decimal Precision

All monetary calculations MUST use precise decimal types. Floating-point
arithmetic MUST NOT be used for any currency or interest computation.

- All monetary values MUST be accurate to 2 decimal places
- Rounding MUST use banker's rounding (round half to even) or
  equivalent proper currency rounding
- The final installment MUST result in exactly $0.00 remaining balance;
  rounding adjustments MUST be applied to the last payment if needed

**Rationale**: Floating-point errors in financial calculations produce
incorrect amortization schedules and undermine the educational purpose
of the tool.

### V. Input Validation at Every Boundary

Input MUST be validated at both the frontend and backend boundaries
independently:

- **Loan amount**: MUST be a positive number > 0
- **Term**: MUST be a positive integer > 0 (months)
- **Rate**: MUST be a number in range 0-100 (annual percentage)

The backend MUST NOT trust frontend validation. The frontend MUST
provide immediate user feedback before sending requests. Error
responses MUST use appropriate HTTP status codes (400 for validation
errors) with clear, user-friendly messages.

**Rationale**: Defense in depth — even in an educational PoC, correct
validation discipline demonstrates production-grade practices.

### VI. Simple Interest Scope Constraint

The system MUST implement simple interest calculations only. Compound
interest, APR, variable rates, fees, and penalties are explicitly
excluded.

- Total Interest = Principal x Rate x Time (in years)
- Monthly Payment = (Principal + Total Interest) / Number of Months
- Per-installment interest = Remaining Balance x (Annual Rate / 12)

This constraint is a design decision, not a limitation to fix later.
Any request to add compound interest MUST be treated as a scope change
requiring a constitution amendment.

**Rationale**: Constraining to simple interest keeps the educational
focus clear and the implementation verifiable against manual
calculations.

### VII. Responsive Three-Level Design

The frontend MUST support exactly three responsive breakpoints:

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Desktop | >= 1024px | Side-panel (300-350px) + main content |
| Tablet | >= 768px and < 1024px | Narrower side-panel (250-280px) + main content |
| Mobile | < 768px | Single-column stacked layout |

- On Desktop and Tablet, the LoanForm MUST render as a persistent left
  side-panel alongside results
- On Mobile, all components MUST stack vertically: LoanForm, then
  PaymentDisplay, then InstallmentTable
- The InstallmentTable MUST support horizontal scrolling on Mobile

**Rationale**: Three-level responsive design demonstrates real-world
layout patterns while keeping CSS complexity manageable for a PoC.

### VIII. Living Documentation

The project README.md MUST be treated as a living document with the
same priority as passing tests:

- MUST include technology shield badges (via shields.io) reflecting
  the actual stack
- MUST include: project description, prerequisites, backend/frontend
  setup instructions, test run instructions, and API usage overview
- MUST be updated whenever dependencies change, the tech stack changes,
  or setup/usage instructions change

**Rationale**: Documentation rot is the most common failure mode in
educational projects. Treating README updates as mandatory prevents
the documentation from becoming misleading.

## Project Constraints & Scope

### Scope Boundaries

**In scope**:
- Simple interest loan calculation engine
- Monthly payment calculation and amortization schedule generation
- REST API (`POST /api/calculate-loan`)
- Web-based UI with LoanForm, PaymentDisplay, and InstallmentTable
- Client-side and server-side input validation
- Unit and component testing (backend and frontend)

**Out of scope (constitution-level exclusions)**:
- User authentication or account management
- Data persistence or database storage
- Production deployment or infrastructure
- Compound interest or variable-rate calculations
- Advanced features: payment comparisons, charts/graphs, PDF/Excel
  export, calculation history

### Technical Constraints

- Single-user, local development environment only
- No database — all computation is stateless per request
- Monthly payment frequency only (no bi-weekly, weekly, etc.)
- Fixed interest rate throughout the loan term
- No origination fees, processing fees, or prepayment penalties

### Team & Timeline

- **Team**: 1 Full-Stack Developer
- **Project type**: Educational PoC/MVP
- **Methodology**: Spec-Driven Development (SDD) with TDD
- **Tech stack reference**: See `preparation/technical.md` for
  language-specific tooling, frameworks, and configuration

## Development Workflow & Quality Gates

### Development Phases

1. **API-First Development**: Define contract, write API tests (TDD),
   implement calculation logic and endpoints
2. **Frontend Development**: Initialize project, create components
   via TDD (LoanForm, PaymentDisplay, InstallmentTable), implement
   API service layer, integrate
3. **Integration & Testing**: End-to-end flow testing, cross-browser
   verification, edge case validation
4. **Documentation**: README files, API documentation, usage guide

### Quality Gates

- All unit tests MUST pass before merging any feature branch
- API contract MUST be validated between frontend and backend
- All monetary values MUST display with currency formatting
  (e.g., $1,234.56)
- API response time MUST be under 100ms for calculations
- Frontend initial load MUST complete within 2 seconds

### Version Control

- **Main branch**: Stable, working code only
- **Feature branches**: One per major feature or component
- **Commit convention**: Conventional commits (`feat:`, `fix:`,
  `test:`, `docs:`, `refactor:`)
- **Commit cadence**: After each passing TDD cycle

## Governance

This constitution is the authoritative reference for all development
decisions on the Loan Simulator project. All implementation MUST align
with the principles and standards defined herein.

### Amendment Procedure

1. Propose the change with rationale and impact assessment
2. Verify the change does not violate existing principles without
   explicitly superseding them
3. Update this document with the amendment
4. Increment the version according to semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible
     governance change
   - **MINOR**: New principle added or existing guidance materially
     expanded
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
5. Update the Sync Impact Report (HTML comment at top of this file)
6. Propagate changes to dependent templates (plan, spec, tasks)

### Compliance Review

- Every specification MUST be checked against this constitution before
  implementation planning begins (see Constitution Check in plan
  template)
- Technology-specific standards are maintained in
  `preparation/technical.md` and MUST NOT contradict this constitution
- Any architectural decision not covered by this constitution MUST be
  proposed as an amendment before implementation

**Version**: 1.0.0 | **Ratified**: 2026-04-15 | **Last Amended**: 2026-04-15
