# Quickstart: Loan Input Form

**Feature**: 002-loan-input-form
**Date**: 2026-04-15

## Prerequisites

- **Node.js**: 16.x or later
- **pnpm**: Latest stable (`npm install -g pnpm` if not installed)
- **Backend running**: The loan calculation API must be running at `http://localhost:8000` (see `specs/001-loan-calculation-api/quickstart.md`)

## Frontend Setup

### 1. Initialize the project

```bash
cd frontend
pnpm create vite . --template react-ts
```

> If the `frontend/` directory doesn't exist yet, create it first:
> ```bash
> mkdir frontend && cd frontend
> pnpm create vite . --template react-ts
> ```

### 2. Install dependencies

```bash
cd frontend
pnpm install
```

### 3. Install dev dependencies for testing

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 4. Configure Vitest

Add test configuration to `vite.config.ts`:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
  },
});
```

Create the test setup file at `src/tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

### 5. Configure API proxy (optional for development)

Add proxy configuration to `vite.config.ts` to avoid CORS issues during development:

```typescript
export default defineConfig({
  // ... existing config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

## Running the Application

### Start the backend (required)

```bash
cd backend
uv run uvicorn main:app --reload
```

### Start the frontend

```bash
cd frontend
pnpm run dev
```

The application will be available at `http://localhost:5173`.

## Running Tests

### Run all tests

```bash
cd frontend
pnpm run test
```

### Run tests in watch mode (TDD development)

```bash
cd frontend
pnpm vitest
```

### Run tests with coverage

```bash
cd frontend
pnpm vitest --coverage
```

## Project Structure

```text
frontend/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── components/
│   │   └── LoanForm/
│   │       ├── LoanForm.tsx
│   │       ├── LoanForm.css
│   │       └── index.ts
│   ├── services/
│   │   └── loanApi.ts
│   ├── types/
│   │   └── loan.ts
│   ├── utils/
│   │   └── validation.ts
│   └── tests/
│       ├── setup.ts
│       ├── LoanForm.test.tsx
│       ├── loanApi.test.ts
│       └── validation.test.ts
```

## Key Files

| File | Purpose |
|------|---------|
| `src/components/LoanForm/LoanForm.tsx` | Main form component with validation and API integration |
| `src/components/LoanForm/LoanForm.css` | Form styling (responsive, validation states, design system) |
| `src/services/loanApi.ts` | Fetch-based API client with timeout and error handling |
| `src/types/loan.ts` | TypeScript interfaces for loan data |
| `src/utils/validation.ts` | Client-side validation logic |
| `src/tests/LoanForm.test.tsx` | Component tests |
| `src/tests/loanApi.test.ts` | API service tests |
| `src/tests/validation.test.ts` | Validation utility tests |

## TDD Workflow

Follow the Red-Green-Refactor cycle per the constitution (Principle III):

1. **Write a failing test** in `src/tests/`
2. **Run tests**: `pnpm vitest` (watch mode)
3. **Write minimal code** to make the test pass
4. **Refactor** while keeping tests green
5. **Commit** after each passing test cycle

### Suggested TDD order:

1. Validation utility (pure functions, easiest to test)
2. API service (mocked fetch, no DOM needed)
3. LoanForm component (rendering → validation → submission → error handling → accessibility)
