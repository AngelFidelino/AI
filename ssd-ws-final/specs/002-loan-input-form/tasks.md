# Tasks: Loan Input Form

**Input**: Design documents from `/specs/002-loan-input-form/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — TDD is mandated by the project constitution (Principle III) and plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` — React + TypeScript SPA component

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the frontend project with Vite + React + TypeScript and configure tooling

- [X] T001 Create `frontend/` directory and initialize Vite project with React-TS template using pnpm (`pnpm create vite . --template react-ts`)
- [X] T002 Install dev dependencies for testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- [X] T003 Configure Vitest in `frontend/vite.config.ts` with jsdom environment, globals, and setupFiles pointing to `./src/tests/setup.ts`
- [X] T004 Create test setup file at `frontend/src/tests/setup.ts` with `@testing-library/jest-dom` import
- [X] T005 [P] Configure API proxy in `frontend/vite.config.ts` to forward `/api` requests to `http://localhost:8000`
- [X] T006 [P] Configure TypeScript strict mode in `frontend/tsconfig.json` (ensure `strict: true`)
- [X] T007 Create project directory structure: `frontend/src/components/LoanForm/`, `frontend/src/services/`, `frontend/src/types/`, `frontend/src/utils/`, `frontend/src/tests/`

**Checkpoint**: Project scaffolded, test runner configured, directory structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared TypeScript types and the API service layer that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational Phase

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] Write validation utility unit tests in `frontend/src/tests/validation.test.ts` — test all validation rules for amount, term, and rate fields (required, numeric, range, decimal places) per data-model.md error message catalogue
- [X] T009 [P] Write API service unit tests in `frontend/src/tests/loanApi.test.ts` — test successful calculation, 400 validation error parsing, 500 server error, network error, 10-second timeout, and field name mapping (term_months↔term, annual_rate↔rate)

### Implementation for Foundational Phase

- [X] T010 [P] Define TypeScript interfaces in `frontend/src/types/loan.ts`: `LoanFormState`, `LoanCalculateRequest`, `LoanResult`, `Installment`, `ValidationErrors`, `ApiError`, `FieldError`, `LoanFormProps`, `LoanApiError` class per data-model.md and contracts/component-api.md
- [X] T011 [P] Implement validation utility in `frontend/src/utils/validation.ts`: `validateLoanForm(values)` and `validateField(field, value)` functions with exact error messages from data-model.md error catalogue
- [X] T012 Implement API service in `frontend/src/services/loanApi.ts`: `calculateLoan(params)` function using Fetch API with 10-second AbortController timeout, field name mapping (amount→amount, term→term_months, rate→annual_rate), and error handling per contracts/component-api.md response handling table
- [X] T013 Verify foundational tests pass: run `pnpm vitest run` in `frontend/` — all validation and API service tests must be green

**Checkpoint**: Foundation ready — types, validation, and API service are tested and implemented. User story implementation can now begin.

---

## Phase 3: User Story 1 — Enter Loan Parameters and Calculate (Priority: P1) 🎯 MVP

**Goal**: User can fill in three loan fields (amount, term, rate), submit the form, and see calculation results displayed. Form renders in a side-panel layout on desktop/tablet and stacked on mobile.

**Independent Test**: Enter valid loan parameters (amount: 10000, term: 12, rate: 5.0), submit the form, verify that calculation results are displayed. Form renders correctly at all three breakpoints.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T014 [US1] Write component rendering tests in `frontend/src/tests/LoanForm.test.tsx` — test: form renders three input fields with correct labels ("Loan Amount ($)", "Loan Term (months)", "Annual Interest Rate (%)"), placeholders ("e.g., 10000", "e.g., 12", "e.g., 5.0"), "Loan Details" header, and "Calculate" submit button
- [X] T015 [US1] Write form submission tests in `frontend/src/tests/LoanForm.test.tsx` — test: valid submission triggers API call, loading indicator shows "Calculating..." with disabled button, successful response calls `onCalculate` with `LoanResult`, form remains accessible after successful calculation

### Implementation for User Story 1

- [X] T016 [US1] Create `LoanForm` component in `frontend/src/components/LoanForm/LoanForm.tsx` — implement three controlled input fields (amount, term, rate) with `useState` for form state (`LoanFormState`), loading state (`isLoading`), and API error state (`apiError`). Wire `onSubmit` to validate → call `calculateLoan()` → call `onCalculate(result)` prop on success
- [X] T017 [US1] Create form styles in `frontend/src/components/LoanForm/LoanForm.css` — white card container with shadow, light gray input backgrounds (#F3F4F6), purple submit button (#5B4FFF with #4A3FE8 hover), loading state button styling, responsive form layout within its container
- [X] T018 [US1] Create barrel export in `frontend/src/components/LoanForm/index.ts` — named export of `LoanForm` component
- [X] T019 [US1] Implement responsive App layout in `frontend/src/App.tsx` — CSS Grid layout: desktop (>=1024px) `grid-template-columns: 300-350px 1fr`, tablet (768-1023px) `250-280px 1fr`, mobile (<768px) single column stacked. Render `LoanForm` in sidebar and results placeholder in main area
- [X] T020 [US1] Create App layout styles in `frontend/src/App.css` — responsive CSS Grid with three media query breakpoints per plan.md (desktop >=1024px, tablet 768-1023px, mobile <768px)
- [X] T021 [US1] Update `frontend/src/main.tsx` to render the App component (clean up Vite boilerplate if needed)
- [X] T022 [US1] Verify User Story 1 tests pass: run `pnpm vitest run` in `frontend/` — all rendering and submission tests green

**Checkpoint**: User Story 1 is fully functional — user can enter valid parameters, submit, and see results. Responsive layout works at all breakpoints. This is the MVP.

---

## Phase 4: User Story 2 — Receive Validation Feedback on Invalid Input (Priority: P2)

**Goal**: User receives inline error messages near each field when entering invalid or missing data. Validation triggers on blur and on submit. No backend request is made for invalid input.

**Independent Test**: Leave fields empty or enter invalid values (negative numbers, non-numeric text, out-of-range values, decimals in term field) and verify appropriate error messages appear inline without making a backend request.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T023 [US2] Write validation display tests in `frontend/src/tests/LoanForm.test.tsx` — test: empty field submission shows "Please enter a loan amount" / "Please enter a loan term" / "Please enter an interest rate"; invalid values show correct error messages per data-model.md catalogue; error messages appear as inline red text near the relevant field
- [X] T024 [US2] Write blur validation tests in `frontend/src/tests/LoanForm.test.tsx` — test: blurring an empty field shows its error; blurring a field with invalid value shows error; correcting a field and blurring clears the error; no backend request made when validation fails

### Implementation for User Story 2

- [X] T025 [US2] Add blur validation to `LoanForm` component in `frontend/src/components/LoanForm/LoanForm.tsx` — wire `onBlur` handler on each input to call `validateField()` and update `errors` state for that field; on submit, call `validateLoanForm()` for all fields and prevent API call if errors exist
- [X] T026 [US2] Add inline error display to `frontend/src/components/LoanForm/LoanForm.tsx` — render `<span id="{field}-error" class="error-message" role="alert">` for each field showing the error message when present; add `aria-describedby="{field}-error"` and `aria-invalid="true"` on inputs with errors; apply `.form-field--error` CSS class on the wrapper div
- [X] T027 [US2] Add validation error styles to `frontend/src/components/LoanForm/LoanForm.css` — red error text, error state input border styling, `.form-field--error` and `.error-message` classes per contracts/component-api.md CSS classes contract
- [X] T028 [US2] Add error clearing behavior in `frontend/src/components/LoanForm/LoanForm.tsx` — clear field-specific error when user corrects and resubmits; clear all errors on new valid submission
- [X] T029 [US2] Verify User Story 2 tests pass: run `pnpm vitest run` in `frontend/` — all validation display and blur tests green

**Checkpoint**: User Story 2 complete — invalid inputs are caught client-side with clear inline error messages. Validation works on both blur and submit.

---

## Phase 5: User Story 3 — Handle Backend and Network Errors Gracefully (Priority: P3)

**Goal**: When the backend is unreachable, returns a server error, returns validation errors, or times out, the user sees a friendly error message. The form remains editable with previously entered values preserved.

**Independent Test**: Simulate a network failure, server 500 error, and 10-second timeout. Verify that the appropriate error message is displayed and the form remains editable with values preserved.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T030 [US3] Write error handling tests in `frontend/src/tests/LoanForm.test.tsx` — test: network error shows "Unable to connect to server. Please try again."; server 500 shows "An error occurred while calculating. Please try again."; timeout shows "Request timed out. Please try again."; backend validation errors (400) display per-field error messages; form values preserved after error; error cleared on resubmission

### Implementation for User Story 3

- [X] T031 [US3] Add API error display to `frontend/src/components/LoanForm/LoanForm.tsx` — render `<div class="api-error" role="alert">` with `apiError` state message; handle `LoanApiError` from `calculateLoan()`: if `fieldErrors` present, merge into `errors` state for inline display; otherwise show general message in the api-error div
- [X] T032 [US3] Add error clearing on resubmission in `frontend/src/components/LoanForm/LoanForm.tsx` — clear `apiError` and previous backend field errors when user modifies inputs and resubmits
- [X] T033 [US3] Add API error styles to `frontend/src/components/LoanForm/LoanForm.css` — `.api-error` class styling (error banner, visible when message present, red/orange alert styling)
- [X] T034 [US3] Verify User Story 3 tests pass: run `pnpm vitest run` in `frontend/` — all error handling tests green

**Checkpoint**: User Story 3 complete — all backend/network error scenarios handled gracefully. Form remains editable after errors.

---

## Phase 6: User Story 4 — Understand Input Requirements Through Labels and Hints (Priority: P4)

**Goal**: Each field has a descriptive label with units, placeholder text with example values, and a "Loan Details" form header.

**Independent Test**: Render the form and verify all labels include unit clarifications (months, %, $), placeholders show example values, and the "Loan Details" header is displayed.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T035 [US4] Write label and hint tests in `frontend/src/tests/LoanForm.test.tsx` — test: "Loan Amount ($)" label present, placeholder "e.g., 10000"; "Loan Term (months)" label present, placeholder "e.g., 12"; "Annual Interest Rate (%)" label present, placeholder "e.g., 5.0"; "Loan Details" heading present

### Implementation for User Story 4

- [X] T036 [US4] Verify labels and placeholders in `frontend/src/components/LoanForm/LoanForm.tsx` — ensure `<h2>Loan Details</h2>` heading is present, all labels include unit indicators per spec, all inputs have `placeholder` attributes with example values per contracts/component-api.md DOM structure. (These elements should already exist from US1 — this task validates and adds any missing elements)
- [X] T037 [US4] Verify User Story 4 tests pass: run `pnpm vitest run` in `frontend/` — all label and hint tests green

**Checkpoint**: User Story 4 complete — form is self-documenting with clear labels, units, and example values.

---

## Phase 7: User Story 5 — Navigate and Complete Form Using Keyboard Only (Priority: P5)

**Goal**: Form is fully keyboard-navigable with logical tab order, visible focus indicators, Enter-to-submit, and screen reader support via ARIA attributes.

**Independent Test**: Navigate the form using only Tab and Enter keys. Verify focus indicators appear on each field, tab order is amount → term → rate → Calculate, and error messages are announced to screen readers.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T038 [US5] Write accessibility tests in `frontend/src/tests/LoanForm.test.tsx` — test: tab order follows amount → term → rate → Calculate; all inputs have accessible labels (`<label for>`); error messages have `role="alert"`; inputs with errors have `aria-invalid="true"` and `aria-describedby` pointing to error span; focus indicators are visible (CSS test or computed style check)

### Implementation for User Story 5

- [X] T039 [US5] Verify ARIA attributes in `frontend/src/components/LoanForm/LoanForm.tsx` — ensure `aria-describedby="{field}-error"` on all inputs, `aria-invalid="true"` toggled on validation error, `role="alert"` on error spans, `<label for="{field}">` associations. (Most should exist from US2 — this task validates completeness and adds any missing attributes)
- [X] T040 [US5] Add focus indicator styles to `frontend/src/components/LoanForm/LoanForm.css` — visible colored border on focused inputs (purple focus ring #5B4FFF per research.md styling notes), ensure focus is not hidden by outline:none, submit button focus state
- [X] T041 [US5] Verify User Story 5 tests pass: run `pnpm vitest run` in `frontend/` — all accessibility tests green

**Checkpoint**: User Story 5 complete — form is fully accessible via keyboard and screen reader.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, edge case handling, and cross-story validation

- [X] T042 [P] Handle edge case: duplicate submission prevention — verify button `disabled` state during API processing in `frontend/src/components/LoanForm/LoanForm.tsx` (FR-008, FR-009)
- [X] T043 [P] Handle edge case: extremely large loan amount (>10,000,000) and high term (>600) — verify validation catches these in `frontend/src/utils/validation.ts`
- [X] T044 [P] Handle edge case: interest rate of exactly 0% — verify this is accepted as valid in `frontend/src/utils/validation.ts`
- [X] T045 [P] Handle edge case: excessive decimal places in rate (e.g., 5.12345) — verify validation rejects >2 decimal places in `frontend/src/utils/validation.ts`
- [X] T046 Clean up Vite boilerplate: remove default Vite/React assets and styles not needed for the loan form in `frontend/src/`
- [X] T047 Run full test suite: `pnpm vitest run` in `frontend/` — ALL tests must pass
- [X] T048 Run quickstart.md validation: verify `pnpm run dev` starts successfully and the form renders at `http://localhost:5173`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase — delivers MVP
- **User Story 2 (Phase 4)**: Depends on Foundational phase and US1 (enhances the form built in US1)
- **User Story 3 (Phase 5)**: Depends on Foundational phase and US1 (adds error handling to existing form)
- **User Story 4 (Phase 6)**: Depends on US1 (validates/enhances labels already created in US1)
- **User Story 5 (Phase 7)**: Depends on US1 and US2 (adds accessibility to form with validation)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 — adds validation display to the form component
- **User Story 3 (P3)**: Depends on US1 — adds error handling to the form submission flow
- **User Story 4 (P4)**: Depends on US1 — validates/enhances labels and placeholders
- **User Story 5 (P5)**: Depends on US1 + US2 — adds ARIA attributes tied to validation errors
- **US2, US3, US4 can run in parallel** after US1 is complete (they modify different aspects of the form)
- **US5 should run after US2** (accessibility depends on error display structure)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation follows test guidance
- Story verification run at end of each phase
- Story complete before moving to next priority (unless parallelizing US2/US3/US4)

### Parallel Opportunities

- **Phase 1**: T005 and T006 can run in parallel (different config files)
- **Phase 2**: T008 and T009 can run in parallel (different test files); T010 and T011 can run in parallel (different source files)
- **After US1**: US2, US3, and US4 can potentially run in parallel (they enhance different aspects of the form, though they all touch `LoanForm.tsx`)
- **Phase 8**: T042, T043, T044, T045 can all run in parallel (different validation/edge case checks)

---

## Parallel Example: Foundational Phase

```bash
# Launch tests in parallel (different files):
Task: "Write validation utility tests in frontend/src/tests/validation.test.ts"
Task: "Write API service tests in frontend/src/tests/loanApi.test.ts"

# Launch implementations in parallel (different files):
Task: "Define TypeScript interfaces in frontend/src/types/loan.ts"
Task: "Implement validation utility in frontend/src/utils/validation.ts"
```

## Parallel Example: After User Story 1

```bash
# These can run in parallel (different aspects of the form):
Task: "US2 - Add blur validation and inline error display"
Task: "US3 - Add API error handling and display"
Task: "US4 - Verify labels and placeholder completeness"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (project scaffolding)
2. Complete Phase 2: Foundational (types, validation, API service)
3. Complete Phase 3: User Story 1 (form + responsive layout)
4. **STOP and VALIDATE**: Test User Story 1 independently — enter valid parameters, submit, see results
5. Deploy/demo if ready — the form works end-to-end

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP ready!**
3. Add User Story 2 → Validation feedback active → Deploy/Demo
4. Add User Story 3 → Error resilience added → Deploy/Demo
5. Add User Story 4 → Labels and hints polished → Deploy/Demo
6. Add User Story 5 → Full accessibility → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. One developer completes User Story 1 (MVP)
3. Once US1 is done:
   - Developer A: User Story 2 (validation display)
   - Developer B: User Story 3 (error handling)
   - Developer C: User Story 4 (labels/hints)
4. Developer A continues with User Story 5 (accessibility — needs US2)
5. All developers contribute to Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD — Red-Green-Refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
