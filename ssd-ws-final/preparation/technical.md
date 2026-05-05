# Loan Simulator - Technical Stack Reference

**Document Version**: 1.2  
**Last Updated**: April 2026  
**Parent Document**: [Project Constitution](./constitution.md)

> This document contains the specific technology choices, language standards, tool configurations, and environment setup for the Loan Simulator project. For principles, methodology, and architectural guidelines, see the [Project Constitution](./constitution.md).

---

## 1. Technology Stack

### 1.1 Backend Stack
| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Runtime** | Python | 3.12+ | Excellent for mathematical calculations, clean syntax, modern type hint features |
| **Framework** | FastAPI | Latest Stable | Modern async support, automatic API documentation, type hints, API-first development |
| **Validation** | Pydantic | (included with FastAPI) | Type validation and data modeling |
| **Testing** | pytest | Latest | Industry standard for Python testing, TDD support |
| **Package Manager** | uv | Latest Stable | Fast Python package and project manager; sole tool for dependency management, virtual environments, and script execution — do NOT use pip or python directly |
| **CORS** | fastapi.middleware.cors | (included with FastAPI) | Enable frontend-backend communication |

### 1.2 Frontend Stack
| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Framework** | React | 18+ | Component-based architecture, modern UI development |
| **Build Tool** | Vite | Latest Stable | Fast development server, modern build tooling |
| **HTTP Client** | Fetch API | Native | Browser-native, no external dependencies, lightweight |
| **Testing** | Vitest | Latest | Fast unit testing, Vite-native, compatible with React Testing Library |
| **Testing Utils** | React Testing Library | Latest | Component testing best practices |

### 1.3 Development Tools
- **Version Control**: Git
- **Code Editor**: VS Code, PyCharm, or similar
- **API Testing**: FastAPI automatic docs (Swagger UI), Browser DevTools
- **Package Management (Backend)**: uv (mandatory — do NOT use pip, venv, or python directly; all commands go through `uv`)
- **Package Management (Frontend)**: pnpm (mandatory — do NOT use npm or yarn)

### 1.4 Deployment Environment
- **Environment**: Local development only
- **Operating System**: Windows, macOS, or Linux
- **Prerequisites**: uv (latest stable — handles Python 3.12+ installation automatically), Node.js 16.x+, pnpm (latest stable)

---

## 2. Coding Standards and Conventions

### 2.1 Python (Backend) Standards

#### Code Style
- **Style Guide**: PEP 8
- **Line Length**: Maximum 100 characters
- **Indentation**: 4 spaces
- **Naming Conventions**:
  - Functions/variables: `snake_case`
  - Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`

#### Type Hints
- Use Python type hints for all function signatures
- Leverage Pydantic models for request/response validation

#### Example:
```python
from decimal import Decimal

def calculate_monthly_payment(
    principal: Decimal,
    annual_rate: Decimal,
    term_months: int
) -> Decimal:
    """
    Calculate monthly payment using simple interest.
    
    Args:
        principal: Loan amount
        annual_rate: Annual interest rate (as decimal, e.g., 0.05 for 5%)
        term_months: Loan term in months
    
    Returns:
        Monthly payment amount
    """
    # Implementation
    pass
```

#### Decimal Precision
- **Critical**: Use `Decimal` type for all monetary calculations
- Avoid `float` to prevent rounding errors
- Round final values to 2 decimal places for currency display

### 2.2 JavaScript/React (Frontend) Standards

#### Code Style
- **Style Guide**: Airbnb JavaScript Style Guide (adapted)
- **Indentation**: 2 spaces
- **Semicolons**: Consistent usage
- **Naming Conventions**:
  - Components: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`

#### Component Structure
- Use functional components with hooks
- Prefer named exports for components
- One component per file

#### Example:
```jsx
import { useState } from 'react';

export function LoanForm({ onCalculate }) {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [rate, setRate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation and submission logic
  };

  return (
    // JSX
  );
}
```

---

## 3. Testing Implementation

### 3.1 Backend Testing Strategy (pytest)

#### Unit Tests
- **Coverage Target**: Core calculation logic must be 100% tested
- **Test Files**: `tests/test_*.py`
- **What to Test**:
  - Calculation accuracy (simple interest formula)
  - Edge cases (minimum values, maximum values, rounding)
  - Input validation
  - API endpoint responses
  - Error handling

#### Test Structure Example:
```python
import pytest
from decimal import Decimal
from services.loan_calculator import calculate_monthly_payment

def test_calculate_monthly_payment_basic():
    """Test basic monthly payment calculation."""
    principal = Decimal('10000')
    rate = Decimal('0.05')  # 5%
    term = 12
    
    result = calculate_monthly_payment(principal, rate, term)
    
    assert result == Decimal('875.00')

def test_calculate_monthly_payment_zero_principal():
    """Test validation for zero principal."""
    with pytest.raises(ValueError):
        calculate_monthly_payment(Decimal('0'), Decimal('0.05'), 12)
```

#### Running Tests:
```bash
uv run pytest tests/ -v --cov=services --cov=routes
```

### 3.2 Frontend Testing Strategy (Vitest + React Testing Library)

#### Component Tests
- **Coverage Target**: All components should have basic rendering and interaction tests
- **Test Files**: `src/tests/*.test.jsx`
- **What to Test**:
  - Component rendering
  - User interactions (form submission, input changes)
  - API call integration (mocked)
  - Display of calculated results
  - Error message display

#### Test Structure Example:
```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoanForm } from '../components/LoanForm';

describe('LoanForm', () => {
  it('renders all input fields', () => {
    render(<LoanForm onCalculate={vi.fn()} />);
    
    expect(screen.getByLabelText(/loan amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/term/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interest rate/i)).toBeInTheDocument();
  });

  it('validates positive numbers', () => {
    // Test validation logic
  });
});
```

#### Running Tests:
```bash
pnpm run test
```

### 3.3 API Testing Tools
- Use FastAPI's automatic Swagger UI documentation (`/docs`)
- Manual testing of API endpoints during development
- Integration testing through frontend-backend interaction

---

## 4. CORS Configuration

Enable CORS in FastAPI for local development. Allow frontend origin (e.g., `http://localhost:5173` for Vite).

**Example Configuration**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["*"],
)
```

---

## 5. Development Environment Setup

### 5.1 Backend Setup
```bash
cd backend
uv python install 3.12           # Install Python 3.12 (if not already available)
uv sync                          # Install dependencies from pyproject.toml
uv run pytest                    # Run tests
uv run uvicorn main:app --reload # Start server
```

> **Note**: `uv` manages Python installation, virtual environments, and dependency resolution automatically. There is no need to install Python separately, create a venv, or use pip. All commands must be executed through `uv run` — never invoke `python` or `pip` directly.

### 5.2 Frontend Setup
```bash
cd frontend
pnpm install
pnpm run test  # Run tests
pnpm run dev  # Start development server
```
## 6. Documentation.
### 6.1 Project Documentation (README)
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

## Document Control

**Version History**:
- v1.2 (April 2026): Updated Python to 3.12+; uv is the sole backend tool (no pip/python/venv directly)
- v1.1 (April 2026): Replaced pip/venv with uv for backend package management; enforced pnpm and uv as mandatory tools
- v1.0 (January 2026): Initial technical reference extracted from Project Constitution

**Review and Updates**:
- This document should be updated whenever the technology stack changes
- Changes to tools, versions, or configurations should be reflected here

---

**End of Technical Stack Reference**
