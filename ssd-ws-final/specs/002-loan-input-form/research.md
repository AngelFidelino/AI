# Research: Loan Input Form

**Feature**: 002-loan-input-form
**Date**: 2026-04-15

## Research Tasks

All items from Technical Context were resolved from the feature spec and `preparation/technical.md`. No NEEDS CLARIFICATION items. The research below covers best practices for each technology choice and integration pattern.

---

## 1. React Form Validation Strategy

**Decision**: Client-side validation using custom validation utilities (no form library)

**Rationale**: The form has only 3 fields with straightforward validation rules. A custom validation approach avoids adding a dependency (Formik, React Hook Form) for a simple use case and keeps the bundle lightweight. The validation logic is extracted into a pure utility function for testability.

**Alternatives Considered**:
- **React Hook Form**: Powerful but overkill for 3 fields. Adds ~10KB to bundle. Would be justified if the project had multiple complex forms.
- **Formik**: More mature but heavier (~20KB). Same rationale as above — too much for this scope.
- **HTML5 native validation**: Insufficient — cannot produce inline error messages with the custom styling required (FR-006, FR-007), and behavior varies across browsers.

**Implementation Notes**:
- Validation triggers on blur (field loses focus) and on submit (FR-002)
- Each field has specific validation rules extracted from spec:
  - Amount: required, numeric, > 0, <= 10,000,000
  - Term: required, integer, >= 1, <= 600
  - Rate: required, numeric, >= 0, <= 100, max 2 decimal places
- Validation function returns a map of field name → error message (or empty map if valid)
- Error messages match the exact wording in spec acceptance scenarios

---

## 2. API Integration with Fetch API

**Decision**: Use native Fetch API with a thin wrapper service

**Rationale**: The spec and technical reference mandate Fetch API (native, no external dependencies). A thin service wrapper (`loanApi.ts`) encapsulates the fetch call, timeout handling, and response parsing, keeping the component clean.

**Alternatives Considered**:
- **Axios**: Feature-rich HTTP client but the technical reference explicitly mandates Fetch API. Would add unnecessary dependency.
- **SWR / React Query**: Data fetching libraries with caching. Overkill for a single POST endpoint with no caching needs.

**Implementation Notes**:
- 10-second timeout via `AbortController` with `AbortSignal.timeout(10000)` (FR-012a)
- Response handling: parse JSON on 200, extract validation errors on 400, display generic error on 500/network failure
- Error types: network error → "Unable to connect to server. Please try again."; server error → "An error occurred while calculating. Please try again."; timeout → "Request timed out. Please try again."
- Backend-specific validation errors (400 with `details` array) are displayed per field (FR-012)

---

## 3. Responsive Layout Strategy

**Decision**: CSS-only responsive layout using CSS Grid and media queries

**Rationale**: The constitution mandates three responsive breakpoints (Desktop >= 1024px, Tablet 768–1023px, Mobile < 768px). CSS Grid provides the layout structure, and media queries handle the breakpoint transitions. No CSS framework needed for this scope.

**Alternatives Considered**:
- **Tailwind CSS**: Utility-first CSS framework. Would speed up styling but adds a build dependency and deviates from the project's plain CSS approach. Not in the technical reference.
- **CSS Modules**: Good encapsulation but adds build complexity. Standard CSS with BEM-like naming is sufficient for the component count.
- **Styled Components / CSS-in-JS**: Adds runtime overhead. Plain CSS is simpler and more performant.

**Implementation Notes**:
- The `LoanForm` component itself is **layout-agnostic** (assumption from spec). It fills whatever container it's placed in.
- The parent `App.tsx` manages the responsive grid layout:
  - Desktop: `grid-template-columns: 300-350px 1fr`
  - Tablet: `grid-template-columns: 250-280px 1fr`
  - Mobile: `grid-template-columns: 1fr` (single column, stacked)
- Form card styling follows `preparation/styling.md`: white card, 12-16px border radius, subtle shadow, 32-40px padding
- Input styling: light gray background (#F3F4F6), 8px border radius, purple focus border (#5B4FFF)
- Button: full-width, purple (#5B4FFF), white text, hover state (#4A3FE8)

---

## 4. Testing Strategy with Vitest + React Testing Library

**Decision**: Vitest as test runner with React Testing Library for component tests, following TDD

**Rationale**: Specified in `preparation/technical.md`. Vitest is Vite-native (fast, compatible configuration). React Testing Library promotes testing from the user's perspective (accessibility-driven queries).

**Alternatives Considered**:
- **Jest**: Industry standard but requires separate configuration from Vite. Vitest is the natural choice for a Vite project.
- **Cypress Component Testing**: Better for visual/integration testing but slower. Unit/component tests with Vitest are faster for TDD cycle.

**Implementation Notes**:
- Test file structure: `src/tests/*.test.tsx` (matching backend convention)
- Test categories:
  1. **Validation utility tests** (`validation.test.ts`): Pure unit tests for validation logic
  2. **Component tests** (`LoanForm.test.tsx`): Rendering, user interactions, form submission, error display, loading state, accessibility
  3. **API service tests** (`loanApi.test.ts`): Mocked fetch calls, timeout handling, error parsing
- Testing setup requires:
  - `@testing-library/react` for render/screen/fireEvent
  - `@testing-library/jest-dom` for DOM matchers (toBeInTheDocument, etc.)
  - `jsdom` environment for Vitest
- Accessibility testing: verify ARIA attributes, focus order, screen reader announcements

---

## 5. TypeScript Type Design

**Decision**: Define interfaces in a dedicated `types/loan.ts` module

**Rationale**: Centralizing types improves reusability across components, services, and tests. Interfaces match the backend API contract exactly.

**Alternatives Considered**:
- **Co-located types**: Define types in the files that use them. Works for small projects but fragments the contract definitions.
- **Generated types from OpenAPI**: The backend doesn't expose an OpenAPI schema file. Manual alignment with the API contract in `specs/001-loan-calculation-api/contracts/api.md` is the pragmatic approach.

**Implementation Notes**:
- `LoanParams`: `{ amount: number; term: number; rate: number }` — form state and API request body (mapped to `{ amount, term_months, annual_rate }` in the API service)
- `LoanResult`: `{ monthly_payment: number; total_payment: number; total_interest: number; schedule: Installment[] }` — API response
- `Installment`: `{ payment_number: number; payment_amount: number; principal_portion: number; interest_portion: number; remaining_balance: number }`
- `ValidationErrors`: `Record<string, string>` — field name to error message mapping (client-side)
- `ApiError`: `{ error: string; details: { field: string; message: string }[] }` — backend validation error response

---

## 6. Form State Management

**Decision**: React `useState` hooks for form state and error state

**Rationale**: The form has 3 input fields and simple validation state. React's built-in `useState` is sufficient. No global state management needed — the form is self-contained and passes results to the parent via a callback prop.

**Alternatives Considered**:
- **useReducer**: Better for complex state machines. The form state is too simple to warrant a reducer.
- **Context API / Redux / Zustand**: Global state management is unnecessary — form state is local, and results are passed up via props.

**Implementation Notes**:
- State: `amount: string`, `term: string`, `rate: string` (strings for controlled inputs)
- Error state: `errors: Record<string, string>` (field → error message)
- Loading state: `isLoading: boolean` (disables button during API call)
- API error state: `apiError: string | null` (general error message)
- On successful calculation: call `onCalculate(result: LoanResult)` callback to parent

---

## 7. API Request/Response Field Mapping

**Decision**: Map frontend field names to backend field names in the API service layer

**Rationale**: The frontend uses `amount`, `term`, `rate` as user-facing field names, while the backend API expects `amount`, `term_months`, `annual_rate`. The mapping happens in `loanApi.ts` to keep the component clean.

**Alternatives Considered**:
- **Use backend field names in form**: Would expose implementation details to the UI layer. Less clean component code.
- **Use frontend field names in API**: Would require backend changes, violating separation of concerns.

**Implementation Notes**:
- Frontend form fields: `amount`, `term`, `rate`
- API request body: `{ amount: Number(amount), term_months: Number(term), annual_rate: Number(rate) }`
- Conversion happens in `loanApi.ts` before the fetch call
- Backend validation error field names (`term_months`, `annual_rate`) are mapped back to frontend field names for display

---

## 8. Duplicate Submission Prevention

**Decision**: Disable submit button and track in-flight requests via `isLoading` state

**Rationale**: FR-008 and FR-009 require preventing duplicate submissions. Disabling the button during API processing is the simplest and most user-visible approach.

**Implementation Notes**:
- Set `isLoading = true` on submit, `false` on response/error
- Button shows loading indicator text (e.g., "Calculating...") during processing
- Button has `disabled` attribute when `isLoading` is true
- AbortController is NOT used to cancel in-flight requests on new submit (spec says "the in-flight request should complete normally" per edge case documentation)
