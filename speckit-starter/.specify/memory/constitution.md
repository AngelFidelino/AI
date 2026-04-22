<!-- Sync Impact Report:
Version change: N/A → 1.0.0
Modified principles: N/A → All (new constitution)
Added sections: All sections are new
Removed sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md (referenced in constitution)
  ✅ .specify/templates/spec-template.md (referenced in constitution) 
  ⚠ .specify/templates/tasks-template.md (needs investigation)
  ⚠ .specify/templates/commands/*.md (needs investigation)
Follow-up TODOs: None
-->

# Loan Simulator Constitution

## Core Principles

### I. API-First Development
All features must begin with a well-defined API contract. Define request/response schemas before implementation to ensure consistency between frontend and backend. This allows parallel development once the contract is established.

### II. Test-First Development (NON-NEGOTIABLE)
Test-Driven Development is mandatory for all features. Write failing tests first, then implement minimal code to pass tests, followed by refactoring. Apply Red-Green-Refactor cycle for backend calculation logic and frontend components.

### III. Separation of Concerns
Maintain clear architectural boundaries:
- Backend: Business logic, calculations, data validation only
- Frontend: User interface, presentation, user experience only  
- API Layer: Clear contract between frontend and backend
No cross-layer dependencies that bypass the API contract.

### IV. Responsive Design Priority
All UI components must work across three defined breakpoints: Desktop (≥1024px), Tablet (≥768px), and Mobile (<768px). The LoanForm must present as a persistent side-panel on Desktop/Tablet and stack vertically on Mobile.

### V. Decimal Precision for Financial Calculations
All monetary calculations must use precise decimal types (Python Decimal) to avoid floating-point errors. Round to exactly 2 decimal places for currency display. Validation must ensure mathematical correctness of the simple interest formula.

## Technical Standards

### Technology Stack Requirements
- Backend: Python 3.12+, FastAPI, Pydantic, uv package manager (no pip/venv)
- Frontend: React 18+, Vite, pnpm package manager (no npm/yarn)
- Testing: pytest for backend, Vitest + React Testing Library for frontend
- Development: Local development only, no production deployment

### Code Quality Standards
- Type safety mandatory for all function signatures
- Code must be self-documenting with clear variable names
- All public functions/components must have documentation comments
- Follow PEP 8 for Python, adapted Airbnb guide for JavaScript/React

## Development Workflow

### Development Phases
1. API-First Development (2 days): Define contract → Write API tests (TDD) → Implement backend → Verify API
2. Frontend Development (2-3 days): Setup → Create components (TDD) → Implement API service → Integration
3. Integration & Testing (1-2 days): End-to-end testing → Cross-browser testing → Validation → Bug fixes
4. Documentation (1 day): README files → API docs → Usage guide

### Version Control Workflow
- Main branch: Stable, working code
- Feature branches: Major features/components
- Commit frequency: After each passing test (TDD cycle)
- Merge strategy: Merge to main after feature completion and testing

## Governance

This constitution supersedes all other development practices. Amendments require documentation in the version history and must propagate to all dependent template files. All implementation must comply with these principles and standards.

All specifications and plans should reference the relevant templates:
- Plan template: .specify/templates/plan-template.md
- Specification template: .specify/templates/spec-template.md

**Version**: 1.0.0 | **Ratified**: 2025-07-16 | **Last Amended**: 2025-07-16