# Tasks: Installment Table

**Input**: Design documents from `/specs/004-installment-table/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/component-api.md, quickstart.md

**Tests**: TDD is mandated by Constitution Principle III. Tests are included per SC-007 (minimum 8 test scenarios).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for source, `frontend/src/tests/` for tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure and type definitions needed by all user stories

- [X] T001 Create component directory structure: `frontend/src/components/InstallmentTable/`
- [X] T002 [P] Add `InstallmentTableProps` interface to `frontend/src/types/loan.ts`
- [X] T003 [P] Create barrel export file `frontend/src/components/InstallmentTable/index.ts`
- [X] T004 [P] Create empty component file `frontend/src/components/InstallmentTable/InstallmentTable.tsx` with skeleton accepting `InstallmentTableProps`
- [X] T005 [P] Create empty stylesheet `frontend/src/components/InstallmentTable/InstallmentTable.css`
- [X] T006 [P] Create test file `frontend/src/tests/InstallmentTable.test.tsx` with test setup and imports

**Checkpoint**: Project structure ready — component scaffolding in place, types defined

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core component states and card wrapper that ALL user stories depend on. These states must work before any table rendering logic.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational Phase

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] Write test: pre-calculation placeholder renders "Enter loan details and calculate to see payment schedule." when `installments` is `null`, `isLoading` is `false`, `error` is `null` in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T008 [P] Write test: loading state renders "Loading payment schedule..." when `isLoading` is `true` in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T009 [P] Write test: error state renders error message and "Retry" button, clicking Retry calls `onRetry` callback in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T010 [P] Write test: empty array state renders "No payment schedule available." when `installments` is `[]` in `frontend/src/tests/InstallmentTable.test.tsx`

### Implementation for Foundational Phase

- [X] T011 Implement card wrapper `<section>` with header ("Payment Schedule" title) and `aria-labelledby` in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T012 Implement state resolution logic (priority order: loading → error → null → empty → data) in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T013 Implement pre-calculation placeholder state with `.installment-table__placeholder` in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T014 Implement loading state with `.installment-table__loading` and `aria-live="polite"` in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T015 Implement error state with error message, retry button (`role="alert"`), and `onRetry` callback in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T016 Implement empty array state with `.installment-table__empty` message in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T017 Add base card styling (white background, rounded corners, shadow, padding, header layout) in `frontend/src/components/InstallmentTable/InstallmentTable.css`

**Checkpoint**: Foundation ready — all non-data states work, card container renders. User story implementation can now begin.

---

## Phase 3: User Story 1 — View Complete Payment Schedule (Priority: P1) 🎯 MVP

**Goal**: Render the full amortization schedule table with correct data rows, currency formatting, progress bars, and semantic HTML structure.

**Independent Test**: Provide installment data and verify table renders with correct number of rows, each displaying payment number, payment amount, principal, interest, remaining balance, and visual progress indicator. Card header shows payment count.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T018 [P] [US1] Write test: table renders with `<caption>` "Loan Amortization Schedule", 6 column headers with `scope="col"`, and correct number of data rows for a 12-month schedule in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T019 [P] [US1] Write test: all monetary values display `$X,XXX.XX` format using `formatCurrency` for payment amount, principal, interest, and remaining balance in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T020 [P] [US1] Write test: each row has a progress bar with `role="progressbar"`, correct `aria-valuenow` percentage, `aria-label` text, and visual width matching `((originalLoanAmount - remainingBalance) / originalLoanAmount) * 100` in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T021 [P] [US1] Write test: card header displays "Payment Schedule" title and "{n} payments" count badge in `frontend/src/tests/InstallmentTable.test.tsx`

### Implementation for User Story 1

- [X] T022 [US1] Implement semantic table structure with `<caption>`, `<thead>` (6 columns: Payment #, Payment Amount, Principal, Interest, Remaining Balance, Progress), `<tbody>`, and `<tfoot>` sections in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T023 [US1] Implement data row rendering: map `installments` array to `<tr>` rows with `formatCurrency` for monetary values and sequential payment numbers in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T024 [US1] Implement progress bar per row with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`, and CSS width based on `((originalLoanAmount - remainingBalance) / originalLoanAmount) * 100` in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T025 [US1] Add payment count badge `"{n} payments"` to card header in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T026 [US1] Add table styling: base table layout, column widths, cell padding, header styling (uppercase, semibold, gray), progress bar container and fill (`#5B4FFF`) in `frontend/src/components/InstallmentTable/InstallmentTable.css`

**Checkpoint**: User Story 1 complete — full amortization table renders with formatted data, progress bars, and proper semantics. Independently testable with any set of installment data.

---

## Phase 4: User Story 2 — Verify Loan Payoff Through Summary Totals (Priority: P2)

**Goal**: Display a summary/totals row in `<tfoot>` showing aggregate totals for payments, principal, and interest, with visual distinction from data rows.

**Independent Test**: Provide installment data with known totals and verify the summary row displays correct sums. Total principal should equal `originalLoanAmount`. Summary progress bar should be fully filled (100%).

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T027 [P] [US2] Write test: `<tfoot>` summary row shows "Total" label, correct sum of all payment amounts, sum of all principal portions, sum of all interest portions in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T028 [P] [US2] Write test: summary row is visually distinct — has `.installment-table__row--summary` class, and summary progress bar shows 100% with `aria-valuenow="100"` in `frontend/src/tests/InstallmentTable.test.tsx`

### Implementation for User Story 2

- [X] T029 [US2] Implement summary row computation using `installments.reduce()` to calculate `totalPayments`, `totalPrincipal`, `totalInterest` in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T030 [US2] Render summary row in `<tfoot>` with "Total" label, formatted totals, empty balance cell, and 100% progress bar in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T031 [US2] Add summary row styling: bold font-weight, `2px solid` top border, slightly darker background (`#F3F4F6`), `.installment-table__row--summary` class in `frontend/src/components/InstallmentTable/InstallmentTable.css`

**Checkpoint**: User Story 2 complete — summary row provides aggregate totals for verification. Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 — Understand Interest vs. Principal Distribution (Priority: P3)

**Goal**: Visually highlight the interest column with distinct color (amber/orange on light yellow) to help users identify cost-of-borrowing.

**Independent Test**: Verify interest cells have the highlighting class applied and use the correct color scheme (`#D97706` text on `#FEF3C7` background).

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T032 [P] [US3] Write test: all interest cells in `<tbody>` and `<tfoot>` have `.installment-table__interest` class applied in `frontend/src/tests/InstallmentTable.test.tsx`

### Implementation for User Story 3

- [X] T033 [US3] Ensure interest column cells have `.installment-table__interest` class in both `<tbody>` rows and `<tfoot>` summary row in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T034 [US3] Add interest column highlighting CSS: `color: #D97706`, `background-color: #FEF3C7`, ensure it overrides zebra striping for interest cells in `frontend/src/components/InstallmentTable/InstallmentTable.css`

**Checkpoint**: User Story 3 complete — interest column visually highlighted. Stories 1–3 work independently.

---

## Phase 6: User Story 4 — View Payment Schedule Across Devices (Priority: P4)

**Goal**: Make the table responsive across desktop (>= 1024px), tablet (768–1023px), and mobile (< 768px) with sticky headers, sticky Payment # column on mobile, zebra striping, and horizontal scroll.

**Independent Test**: Render component at various viewport widths and verify all data remains accessible. On mobile, verify horizontal scroll works and Payment # column stays fixed. On vertical scroll, verify column headers remain visible.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T035 [P] [US4] Write test: zebra striping — table body rows alternate backgrounds via `.installment-table__row` and `nth-child(even)` pattern in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T036 [P] [US4] Write test: table wrapper has `.installment-table__wrapper` class for horizontal scroll container in `frontend/src/tests/InstallmentTable.test.tsx`

### Implementation for User Story 4

- [X] T037 [US4] Add zebra striping CSS: `.installment-table__body tr:nth-child(even)` with `background-color: #F9FAFB` in `frontend/src/components/InstallmentTable/InstallmentTable.css`
- [X] T038 [US4] Add sticky header CSS: `.installment-table__head th` with `position: sticky; top: 0; z-index: 2; background-color: #ffffff` in `frontend/src/components/InstallmentTable/InstallmentTable.css`
- [X] T039 [US4] Add responsive breakpoints: desktop (`width: 100%`, `table-layout: auto`), mobile (`min-width: 700px` for forced horizontal scroll), table wrapper (`overflow-x: auto; -webkit-overflow-scrolling: touch`) in `frontend/src/components/InstallmentTable/InstallmentTable.css`
- [X] T040 [US4] Add sticky Payment # column on mobile (`< 768px`): `position: sticky; left: 0; z-index: 1` on first column cells, `z-index: 3` on corner cell (header + first column), `background-color: inherit` in `frontend/src/components/InstallmentTable/InstallmentTable.css`

**Checkpoint**: User Story 4 complete — table is responsive across all breakpoints with sticky behaviors. Stories 1–4 work independently.

---

## Phase 7: User Story 5 — Accessible Payment Schedule (Priority: P5)

**Goal**: Ensure full WCAG AA accessibility: semantic table markup, keyboard navigation, screen reader support for all states and progress bars.

**Independent Test**: Verify caption present, `scope="col"` on headers, `role="progressbar"` with `aria-valuenow` on progress bars, `role="alert"` on error/warning states, `aria-live="polite"` on loading state, `aria-labelledby` on section.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T041 [P] [US5] Write test: accessibility — `<caption>` contains "Loan Amortization Schedule", all `<th>` elements have `scope="col"`, `<section>` has `aria-labelledby`, loading container has `aria-live="polite"`, error container has `role="alert"` in `frontend/src/tests/InstallmentTable.test.tsx`
- [X] T042 [P] [US5] Write test: data integrity warning — when final installment `remaining_balance !== 0`, warning div with `role="alert"` and `.installment-table__warning` class appears below table; no warning when `remaining_balance === 0` in `frontend/src/tests/InstallmentTable.test.tsx`

### Implementation for User Story 5

- [X] T043 [US5] Implement data integrity warning: check last installment's `remaining_balance !== 0`, render warning `<div>` with `role="alert"` and `.installment-table__warning` class below table in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T044 [US5] Verify and ensure all accessibility attributes are correctly placed: `<caption>`, `scope="col"`, `aria-labelledby`, `aria-live="polite"`, `role="alert"`, `role="progressbar"` with full aria attributes in `frontend/src/components/InstallmentTable/InstallmentTable.tsx`
- [X] T045 [US5] Add warning styling: amber/orange border, light yellow background, warning icon, `role="alert"` styling, and visually hidden caption CSS in `frontend/src/components/InstallmentTable/InstallmentTable.css`

**Checkpoint**: User Story 5 complete — full WCAG AA accessibility. All 5 user stories work independently.

---

## Phase 8: App Integration

**Purpose**: Integrate InstallmentTable into App.tsx, refactor API call lifecycle to support loading/error states, add retry functionality.

### Tests for App Integration

- [X] T046 Write test: App.tsx renders InstallmentTable with correct props — `installments`, `originalLoanAmount`, `isLoading`, `error`, `onRetry` in `frontend/src/tests/InstallmentTable.test.tsx`

### Implementation for App Integration

- [X] T047 Refactor `frontend/src/App.tsx`: add `isLoading` and `error` state, lift API call lifecycle from LoanForm to App, add `handleRetry` function
- [X] T048 Import and render `InstallmentTable` in `frontend/src/App.tsx` below `PaymentDisplay` with props: `installments={result?.schedule ?? null}`, `originalLoanAmount={loanAmount}`, `isLoading={isLoading}`, `error={error}`, `onRetry={handleRetry}`
- [X] T049 Update `frontend/src/App.css`: add spacing for InstallmentTable in results area below PaymentDisplay

**Checkpoint**: Full integration complete — InstallmentTable renders in the app with all states managed by App.tsx.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, performance verification, and cleanup

- [X] T050 Run full test suite `pnpm vitest` from `frontend/` — verify all tests pass (minimum 8 scenarios per SC-007)
- [X] T051 Verify table renders within 100ms for 360-row schedule per SC-008 (manual timing check with 30-year loan data)
- [X] T052 Run `pnpm run build` from `frontend/` to verify no TypeScript errors
- [X] T053 Run quickstart.md verification checklist against running application

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–7)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3 → P4 → P5)
  - US1 and US2 can run in parallel (different concerns: data rows vs. summary row)
  - US3, US4, US5 add styling and accessibility enhancements incrementally
- **App Integration (Phase 8)**: Depends on US1 at minimum; best after all user stories
- **Polish (Phase 9)**: Depends on all phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Adds `<tfoot>` to existing table structure from US1; ideally after US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Adds CSS class to interest cells; ideally after US1
- **User Story 4 (P4)**: Can start after US1 — Adds responsive CSS to existing table
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) — Adds accessibility attributes; data integrity warning is independent of table rendering

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Structure before content (HTML before data rendering)
- Logic before styling (functionality before CSS)
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005, T006 can all run in parallel (different files)
- **Phase 2**: T007, T008, T009, T010 test tasks can run in parallel
- **Phase 3**: T018, T019, T020, T021 test tasks can run in parallel
- **Phase 4**: T027, T028 test tasks can run in parallel
- **Phase 5**: T032 test task standalone
- **Phase 6**: T035, T036 test tasks can run in parallel
- **Phase 7**: T041, T042 test tasks can run in parallel
- **User Stories US1 + US2**: Can be worked on in parallel by different developers (different table sections)
- **User Stories US3 + US4 + US5**: Primarily CSS/accessibility — can be parallelized

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write test: table renders with caption, headers, and correct row count in frontend/src/tests/InstallmentTable.test.tsx"
Task: "Write test: all monetary values display $X,XXX.XX format in frontend/src/tests/InstallmentTable.test.tsx"
Task: "Write test: progress bars with correct aria attributes in frontend/src/tests/InstallmentTable.test.tsx"
Task: "Write test: card header shows title and payment count in frontend/src/tests/InstallmentTable.test.tsx"
```

---

## Parallel Example: Foundational Tests

```bash
# Launch all foundational state tests together:
Task: "Write test: placeholder state in frontend/src/tests/InstallmentTable.test.tsx"
Task: "Write test: loading state in frontend/src/tests/InstallmentTable.test.tsx"
Task: "Write test: error state with retry in frontend/src/tests/InstallmentTable.test.tsx"
Task: "Write test: empty array state in frontend/src/tests/InstallmentTable.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T006)
2. Complete Phase 2: Foundational (T007–T017) — all non-data states working
3. Complete Phase 3: User Story 1 (T018–T026) — full table renders
4. **STOP and VALIDATE**: Test US1 independently with sample installment data
5. Optionally integrate into App.tsx for demo

### Incremental Delivery

1. Setup + Foundational → Card shell with all non-data states
2. Add US1 (table rendering) → Test independently → **MVP!**
3. Add US2 (summary row) → Test independently → Enhanced validation
4. Add US3 (interest highlighting) → Test independently → Better comprehension
5. Add US4 (responsive design) → Test independently → Mobile support
6. Add US5 (accessibility + warning) → Test independently → WCAG AA compliance
7. App Integration → Full end-to-end flow
8. Polish → Final validation

### Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD red-green-refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The `formatCurrency` utility from 003-payment-display is reused — no new utility needed
