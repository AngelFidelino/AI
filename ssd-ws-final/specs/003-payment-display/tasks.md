# Tasks: Payment Display

**Input**: Design documents from `/specs/003-payment-display/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-api.md, quickstart.md

**Tests**: Included — TDD mandated by constitution Principle III and SC-008.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` (established in 002-loan-input-form)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create component directory structure, add shared types, and set up the currency formatting utility that all user stories depend on.

- [X] T001 Create PaymentDisplay component directory at frontend/src/components/PaymentDisplay/
- [X] T002 Add `PaymentDisplayData` and `PaymentDisplayProps` interfaces to frontend/src/types/loan.ts
- [X] T003 [P] Write formatCurrency utility tests in frontend/src/tests/formatCurrency.test.ts
- [X] T004 [P] Implement formatCurrency utility in frontend/src/utils/formatCurrency.ts

**Checkpoint**: Types defined, formatting utility tested and working. Ready for component implementation.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the base PaymentDisplay component shell with placeholder state and barrel export. All user stories build on this foundation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Write placeholder state tests (data is null renders placeholder message) in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T006 Create PaymentDisplay component shell with placeholder state in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx
- [X] T007 [P] Create barrel export in frontend/src/components/PaymentDisplay/index.ts
- [X] T008 Create base PaymentDisplay CSS with placeholder styling in frontend/src/components/PaymentDisplay/PaymentDisplay.css

**Checkpoint**: Foundation ready — PaymentDisplay renders placeholder when `data` is null. Tests pass. User story implementation can now begin.

---

## Phase 3: User Story 1 — View Monthly Payment Result (Priority: P1) 🎯 MVP

**Goal**: Display the monthly payment amount prominently with correct US currency formatting and a clear label when calculation data is available.

**Independent Test**: Provide `PaymentDisplayData` with a known `monthlyPayment` value and verify it renders with correct currency formatting, "Monthly Payment" label, and prominent styling.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [US1] Write test: renders monthly payment with correct currency formatting ($X,XXX.XX) in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T010 [US1] Write test: monthly payment card has "Monthly Payment" label and description text in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T011 [US1] Write test: monthly payment of $0.00 renders correctly (edge case) in frontend/src/tests/PaymentDisplay.test.tsx

### Implementation for User Story 1

- [X] T012 [US1] Implement monthly payment card rendering with formatCurrency in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx
- [X] T013 [US1] Add monthly payment card CSS (prominent large text, card header with dollar icon) in frontend/src/components/PaymentDisplay/PaymentDisplay.css
- [X] T014 [US1] Add aria-label="Monthly Payment" on the monthly payment card section and aria-live="polite" on root container in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx

**Checkpoint**: Monthly payment displays with correct formatting, prominent styling, and accessibility attributes. Tests pass. This is the MVP — the core value proposition is deliverable.

---

## Phase 4: User Story 2 — Understand Total Loan Cost (Priority: P2)

**Goal**: Display the total payment in a visually featured (purple gradient) card showing the full loan lifetime cost.

**Independent Test**: Provide `PaymentDisplayData` with a known `totalPayment` value and verify it renders in a featured card with correct currency formatting and "Total Payment" label.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [US2] Write test: renders total payment with correct currency formatting in featured card in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T016 [US2] Write test: total payment card has "Total Payment" label and "Over loan lifetime" subtitle in frontend/src/tests/PaymentDisplay.test.tsx

### Implementation for User Story 2

- [X] T017 [US2] Implement total payment featured card rendering with formatCurrency in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx
- [X] T018 [US2] Add total payment card CSS (purple gradient background, white text, featured styling) in frontend/src/components/PaymentDisplay/PaymentDisplay.css
- [X] T019 [US2] Add aria-label="Total Payment" on the total payment card section in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx

**Checkpoint**: Monthly payment and total payment both display correctly. Featured card is visually distinguished. Tests pass.

---

## Phase 5: User Story 3 — Review Payment Breakdown (Priority: P3)

**Goal**: Display a breakdown card showing principal amount and total interest as separate line items with clear labels.

**Independent Test**: Provide `PaymentDisplayData` with known `principal` and `totalInterest` values and verify both appear with correct labels and currency formatting. Verify principal + totalInterest = totalPayment (mathematical consistency SC-007).

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T020 [US3] Write test: renders principal amount with correct currency formatting and "Principal Amount" label in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T021 [US3] Write test: renders total interest with correct currency formatting and "Total Interest" label in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T022 [US3] Write test: breakdown card has "Payment Breakdown" heading in frontend/src/tests/PaymentDisplay.test.tsx

### Implementation for User Story 3

- [X] T023 [US3] Implement payment breakdown card with two-column layout rendering principal and total interest in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx
- [X] T024 [US3] Add breakdown card CSS (two-column grid, breakdown labels and values) in frontend/src/components/PaymentDisplay/PaymentDisplay.css
- [X] T025 [US3] Add aria-label="Payment Breakdown" on the breakdown card section in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx

**Checkpoint**: All three cards render correctly — monthly payment, total payment, and breakdown. All monetary values formatted as US currency. Tests pass.

---

## Phase 6: User Story 4 — View Results on Any Device (Priority: P4)

**Goal**: Adapt the card layout across three responsive breakpoints (desktop >= 1024px, tablet 768-1023px, mobile < 768px).

**Independent Test**: Render the payment display at different viewport widths and verify layout adapts — horizontal grid on desktop/tablet, single-column stacked on mobile.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T026 [US4] Write test: cards container uses CSS grid class for responsive layout in frontend/src/tests/PaymentDisplay.test.tsx

### Implementation for User Story 4

- [X] T027 [US4] Add responsive CSS media queries: desktop (>= 1024px) two-column grid for monthly+total, tablet (768-1023px) adapted grid, mobile (< 768px) single-column stack in frontend/src/components/PaymentDisplay/PaymentDisplay.css
- [X] T028 [US4] Ensure monthly payment card always appears first in visual flow at all breakpoints in frontend/src/components/PaymentDisplay/PaymentDisplay.css

**Checkpoint**: Card layout adapts across all three breakpoints. Monthly payment remains most prominent at all sizes. Tests pass.

---

## Phase 7: User Story 5 — See Updated Results After Recalculation (Priority: P5)

**Goal**: When new calculation data arrives, all displayed metrics update correctly without flickering or stale data. Previous results remain visible during recalculation.

**Independent Test**: Render with one set of data, update props with new data, verify all four values update correctly.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T029 [US5] Write test: all four metrics update when data prop changes (rerender with new data) in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T030 [US5] Write test: component reverts to placeholder when data is set to null after showing results in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T031 [US5] Write test: large monetary values ($999,999.99) render without truncation in frontend/src/tests/PaymentDisplay.test.tsx

### Implementation for User Story 5

- [X] T032 [US5] Verify PaymentDisplay re-renders correctly with new data (React natural behavior — no additional code expected, but confirm tests pass) in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx
- [X] T033 [US5] Add CSS for overflow handling to prevent truncation of large monetary values in frontend/src/components/PaymentDisplay/PaymentDisplay.css

**Checkpoint**: Data updates work smoothly. Previous results persist during recalculation. Large values display correctly. Tests pass.

---

## Phase 8: Integration & Polish

**Purpose**: Integrate PaymentDisplay into App.tsx, update LoanForm callback, and finalize cross-cutting concerns.

- [X] T034 Modify LoanForm onCalculate callback to pass principal as second argument — update LoanFormProps in frontend/src/types/loan.ts
- [X] T035 Update LoanForm component to pass loan amount in onCalculate callback in frontend/src/components/LoanForm/LoanForm.tsx
- [X] T036 Update App.tsx: import PaymentDisplay, add loanAmount state, map LoanResult to PaymentDisplayData, render PaymentDisplay in main content area in frontend/src/App.tsx
- [X] T037 [P] Update App.css for PaymentDisplay integration in main content area layout if needed in frontend/src/App.css
- [X] T038 [P] Write integration test: PaymentDisplay receives null initially and data after calculation in frontend/src/tests/PaymentDisplay.test.tsx
- [X] T039 Run full test suite (`pnpm run test` in frontend/) and fix any failures
- [X] T040 Run quickstart.md verification checklist — validate all items pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (types and formatCurrency must exist)
- **User Stories (Phases 3-7)**: All depend on Phase 2 completion (component shell exists)
  - US1 (Phase 3): Can start after Phase 2 — no dependencies on other stories
  - US2 (Phase 4): Can start after Phase 2 — no dependencies on other stories
  - US3 (Phase 5): Can start after Phase 2 — no dependencies on other stories
  - US4 (Phase 6): Depends on Phase 5 completion (needs all cards to exist for responsive layout)
  - US5 (Phase 7): Depends on Phase 3 completion (needs at least monthly payment to test updates)
- **Integration & Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — core monthly payment display
- **US2 (P2)**: Independent — total payment card (can be parallel with US1)
- **US3 (P3)**: Independent — breakdown card (can be parallel with US1, US2)
- **US4 (P4)**: Depends on US1+US2+US3 — needs all cards for responsive layout
- **US5 (P5)**: Depends on US1 minimum — needs rendered data to test updates

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation follows test requirements
- Accessibility attributes included with implementation
- Story complete before moving to next priority (or run in parallel if independent)

### Parallel Opportunities

- T003 and T004 can run in parallel (different files)
- T007 can run in parallel with T005/T006 (barrel export is independent)
- US1 (Phase 3), US2 (Phase 4), US3 (Phase 5) can all run in parallel after Phase 2
- T037 and T038 can run in parallel (different files)

---

## Parallel Example: Setup Phase

```text
# Launch in parallel (different files):
Task T003: "Write formatCurrency utility tests in frontend/src/tests/formatCurrency.test.ts"
Task T004: "Implement formatCurrency utility in frontend/src/utils/formatCurrency.ts"
```

## Parallel Example: User Stories 1-3

```text
# After Phase 2, launch these user stories in parallel:
Phase 3 (US1): Monthly Payment card (T009-T014)
Phase 4 (US2): Total Payment card (T015-T019)
Phase 5 (US3): Payment Breakdown card (T020-T025)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types + formatCurrency)
2. Complete Phase 2: Foundational (component shell with placeholder)
3. Complete Phase 3: User Story 1 (monthly payment card)
4. **STOP and VALIDATE**: Monthly payment renders with correct formatting — core value delivered
5. Can integrate into App.tsx at this point for early demo

### Incremental Delivery

1. Setup + Foundational → Component shell with placeholder ready
2. Add US1 → Monthly payment card → Test independently → **MVP!**
3. Add US2 → Total payment featured card → Test independently
4. Add US3 → Payment breakdown → Test independently → All cards complete
5. Add US4 → Responsive layout → Test at all breakpoints
6. Add US5 → Data updates → Test recalculation flow
7. Integration → Wire into App.tsx with LoanForm callback update → Full feature

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (monthly payment)
   - Developer B: User Story 2 (total payment)
   - Developer C: User Story 3 (breakdown)
3. After all cards exist: US4 (responsive) and US5 (updates)
4. Integration phase brings it all together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD: Write tests first, verify they fail, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The `formatCurrency` utility is shared infrastructure — used by all cards
- LoanForm callback modification (T034-T035) is deferred to Integration phase to avoid breaking existing functionality during story development
