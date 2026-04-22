# Speckit Documentation - Loan Simulator

> **Spec-Driven Development (SDD) Documentation Package**  
> A simple loan payment calculator with amortization schedule - PoC/MVP Project

---

## 📋 Project Overview

**Project Name**: Loan Simulator  
**Type**: Proof of Concept (PoC) / Minimum Viable Product (MVP)  
**Purpose**: Calculate monthly loan payments and generate detailed amortization schedules using simple interest calculations  
**Target Audience**: Consumers seeking to understand monthly payment obligations before committing to a loan  
**Development Team**: Single developer with AI agent assistance (Kilo-code)

---

## 📁 Document Structure

This Speckit documentation follows the **Spec-Driven Development (SDD)** methodology:

### 🏛️ Constitution Document
**File**: [`constitution.md`](./constitution.md)  
**Purpose**: Project-level principles, standards, and architectural decisions  
**Scope**: Applies to the entire project across all features

### 📝 Specification Documents (Specify)
Sequential, feature-focused requirements:

1. **[`1.loan-calculation-api.md`](./1.loan-calculation-api.md)** - Backend Loan Calculation API
2. **[`2.loan-input-form.md`](./2.loan-input-form.md)** - Frontend Loan Input Form
3. **[`3.payment-display.md`](./3.payment-display.md)** - Monthly Payment Display Component
4. **[`4.installment-table.md`](./4.installment-table.md)** - Amortization Schedule Table

### 🤖 Supporting Documents
- **[`development-guide.md`](./development-guide.md)** - Kilo-code agent development workflow guide

---

## 🚀 Quick Start

### For Human Developers

1. **Start Here**: Read [`constitution.md`](./constitution.md) to understand project standards
2. **Environment Setup**: Follow Phase 1 in [`development-guide.md`](./development-guide.md)
3. **Backend Development**: Implement Feature #1 using TDD approach
4. **Frontend Development**: Implement Features #2-4 sequentially
5. **Integration**: Follow Phase 4 testing guidelines

### For AI Agents (Kilo-code)

1. **Load Context**: Read [`constitution.md`](./constitution.md) and relevant specify documents
2. **Follow Workflow**: Use [`development-guide.md`](./development-guide.md) for phase-by-phase implementation
3. **Use Prompt Templates**: Reference provided prompts for each feature
4. **Apply TDD**: Write tests first, then implement functionality
5. **Verify**: Use verification checkpoints after each phase

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Server**: Uvicorn
- **Validation**: Pydantic
- **Testing**: pytest
- **Package Manager**: uv (mandatory — do NOT use pip, venv, or python directly)

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **HTTP Client**: Fetch API (native)
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm

### Development Environment
- **CORS**: Configured for `http://localhost:5173` (Vite default)
- **API Port**: 8000 (FastAPI default)
- **Frontend Port**: 5173 (Vite default)

---

## 📖 Development Approach

### Core Methodologies

#### 1. **API-First Development**
- Design and implement API contract before frontend
- Ensure backend/frontend contract consistency
- Document request/response schemas explicitly
- See: Constitution Section 3.1

#### 2. **Test-Driven Development (TDD)**
- Write tests before implementation
- Red → Green → Refactor cycle
- Unit tests for backend calculation logic
- Component tests for frontend UI
- See: Constitution Section 5

#### 3. **Separation of Concerns**
- Backend: Pure calculation logic + REST API
- Frontend: User interface + API integration
- No business logic in frontend
- See: Constitution Section 3.2

---

## 🎯 Feature Implementation Order

Follow this sequence for development:

### Phase 1: Environment Setup
- Initialize backend project (FastAPI + pytest)
- Initialize frontend project (React + Vite + Vitest)
- Configure CORS and development servers

### Phase 2: Backend Development (API-First + TDD)
**Feature #1**: [`1.loan-calculation-api.md`](./1.loan-calculation-api.md)
- Write API tests first
- Implement loan calculation logic (simple interest)
- Create `/api/calculate-loan` endpoint
- Verify all test scenarios pass

### Phase 3: Frontend Development (Component-Based + TDD)
**Feature #2**: [`2.loan-input-form.md`](./2.loan-input-form.md)
- Write component tests
- Implement input form with validation
- Integrate with backend API using Fetch

**Feature #3**: [`3.payment-display.md`](./3.payment-display.md)
- Write component tests
- Implement payment result display
- Format currency and summary metrics

**Feature #4**: [`4.installment-table.md`](./4.installment-table.md)
- Write component tests
- Implement amortization table
- Ensure responsive design and accessibility

### Phase 4: Integration & Testing
- End-to-end testing
- Cross-browser testing
- Accessibility verification (WCAG AA)
- Documentation review

---

## 📚 Quick Reference

### Key Project Decisions

| Decision | Choice | Reference |
|----------|--------|-----------|
| **Build Tool** | Vite | Constitution 2.2 |
| **HTTP Client** | Fetch API | Constitution 2.2 |
| **Package Manager** | pnpm | Constitution 2.3 |
| **Loan Term Input** | Months only | Specify #2 |
| **Interest Calculation** | Simple interest only | Constitution 10.2 |
| **Data Persistence** | None (development mode) | Constitution 10.1 |
| **Testing Strategy** | TDD (unit tests) | Constitution 5 |
| **Responsive Breakpoints** | Desktop ≥1024px, Tablet ≥768px, Mobile <768px | Constitution 2.3 |
| **Form Layout** | Left side-panel (Desktop/Tablet), full-width stacked (Mobile) | Constitution 2.3, Specify #2 |

### Core Calculation Formulas

**Simple Interest**:
```
Total Interest = Principal × (Annual Rate / 100) × (Term in Months / 12)
```

**Monthly Payment**:
```
Monthly Payment = (Principal + Total Interest) / Term in Months
```

See Constitution Section 12 for complete calculation reference.

### Input Validation Rules

| Field | Min | Max | Type |
|-------|-----|-----|------|
| **Loan Amount** | $1,000 | $1,000,000 | Decimal |
| **Term (Months)** | 1 month | 360 months | Integer |
| **Interest Rate** | 0.01% | 100% | Decimal |

---

## 🎯 Success Criteria

### Functional Requirements
- ✅ Accurate loan payment calculations (simple interest)
- ✅ Valid amortization schedule generation
- ✅ Input validation with clear error messages
- ✅ 3-level responsive UI (Desktop ≥1024px, Tablet ≥768px, Mobile <768px)
- ✅ Side-panel layout: LoanForm in left side-panel on Desktop/Tablet, full-width stacked on Mobile

### Technical Requirements
- ✅ API response time < 500ms
- ✅ Frontend rendering < 100ms
- ✅ All tests passing (backend + frontend)
- ✅ API contract consistency verified

### Quality Requirements
- ✅ Decimal precision for monetary values
- ✅ Accessibility compliance (WCAG AA)
- ✅ Clean, maintainable code
- ✅ Comprehensive test coverage

See Constitution Section 11 for detailed success metrics.

---

## 🚧 Project Constraints

### Technical Limitations
- Development environment only (no production deployment)
- No database or data persistence
- No authentication/authorization
- Single-user application
- Desktop, tablet, and mobile browsers only (no native apps)

### Functional Limitations
- Simple interest calculation only (no compound interest)
- Fixed monthly payments (no variable rates)
- No extra payment scenarios
- No loan comparison features
- USD currency only

See Constitution Section 10 for complete constraints list.

---

## 📞 For AI Agents: How to Use This Documentation

### Context Loading
1. **Always start** by reading [`constitution.md`](./constitution.md)
2. **Load the specific feature** specification before implementation
3. **Reference the development guide** for workflow and prompts

### Implementation Workflow
1. **Extract requirements** from the specify document
2. **Follow TDD approach**: Write tests first
3. **Reference the constitution** for coding standards
4. **Verify against acceptance criteria** in the spec
5. **Check success metrics** before marking complete

### Prompt Structure Template
```
I'm implementing [Feature Name] from [specify-document.md].

Context:
- Constitution: /speckit-loan-simulator/constitution.md
- Specification: /speckit-loan-simulator/[number].[feature-name].md

Approach: [TDD/API-First/Component-Based]

Task: [Specific implementation step]

Please [specific action requested].
```

See [`development-guide.md`](./development-guide.md) for detailed Kilo-code integration.

---

## 📄 Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| README.md | 1.1 | April 2026 |
| constitution.md | 1.2 | April 2026 |
| 1.loan-calculation-api.md | 1.0 | 2024 |
| 2.loan-input-form.md | 1.1 | April 2026 |
| 3.payment-display.md | 1.1 | April 2026 |
| 4.installment-table.md | 1.1 | April 2026 |
| development-guide.md | 1.0 | 2024 |

---

## 🤝 Contributing

This is a PoC/MVP project for a single developer with AI agent assistance.

For updates to specifications:
1. Modify the relevant document (constitution or specify)
2. Update version number and last updated date
3. Ensure changes align with Speckit/SDD methodology
4. Verify impact on other documents (cross-references)

---

## 📖 About Speckit & SDD

**Speckit** is a documentation framework following the **Spec-Driven Development (SDD)** methodology.

### Core Principles:
- **Separation**: One constitution (project-wide) + multiple specify documents (feature-specific)
- **Clarity**: Clear, unambiguous requirements before coding
- **Traceability**: Every feature maps to a specification
- **AI-Friendly**: Structured for both human and AI agent consumption
- **Test-Driven**: Specifications include testable acceptance criteria

### Document Types:
- **Constitution**: Project constitution, principles, standards, architecture
- **Specify**: Feature specifications, requirements, acceptance criteria

---

## 📞 Support

For questions or clarifications about this documentation:
1. Review the constitution for project-wide standards
2. Check the specific feature specification for detailed requirements
3. Consult the development guide for implementation workflow
4. Reference test scenarios in specify documents for expected behavior

---

**Ready to begin development!** 🚀

Start with the [Development Guide](./development-guide.md) for step-by-step implementation workflow.
