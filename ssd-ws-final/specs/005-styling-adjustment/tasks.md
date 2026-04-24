---

description: "Task list for feature implementation - Styling Adjustment - Card Reorder, Vertical Toolbar & Toast Notifications"
---

# Tasks: Styling Adjustment - Card Reorder, Vertical Toolbar & Toast Notifications

**Input**: Design documents from `/specs/005-styling-adjustment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)
**Tests**: Tests are OPTIONAL - no tests explicitly requested in the feature specification
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below assume web application structure based on existing codebase

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create feature branch `005-styling-adjustment` from main
- [ ] T002 Verify existing project structure and dependencies are intact

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Create Toast context provider in frontend/src/contexts/ToastContext.tsx
- [ ] T004 Create toast component in frontend/src/components/Toast/Toast.tsx
- [ ] T005 Create toolbar component in frontend/src/components/Toolbar/Toolbar.tsx
- [ ] T006 Install or verify icon library availability (Heroicons/Lucide) for toolbar icons

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Reordered Card Layout (Priority: P1) 🎯 MVP

**Goal**: Swap positions of Total Payment and Monthly Payment cards for better visual hierarchy

**Independent Test**: Render PaymentDisplay component with valid data and verify Total Payment card is on the left and Monthly Payment card is on the right in desktop view

### Implementation for User Story 1

- [ ] T007 [US1] Reorder card layout in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx
- [ ] T008 [P] [US1] Update CSS grid layout in frontend/src/components/PaymentDisplay/PaymentDisplay.css for two-column display
- [ ] T009 [P] [US1] Add responsive breakpoint in frontend/src/components/PaymentDisplay/PaymentDisplay.css for mobile stacking (Total Payment, Monthly Payment, Payment Breakdown)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Vertical Purple Toolbar (Priority: P2)

**Goal**: Add a persistent purple vertical toolbar on the far left edge with calculator icon

**Independent Test**: Mount the application and verify the toolbar renders with purple background, correct width (76px), and click functionality

### Implementation for User Story 2

- [ ] T010 [P] [US2] Create toolbar component structure in frontend/src/components/Toolbar/Toolbar.tsx
- [ ] T011 [US2] Style toolbar with purple background (#5B4FFF) and 76px width in frontend/src/components/Toolbar/Toolbar.css
- [ ] T012 [P] [US2] Add calculator icon from icon library with white color in frontend/src/components/Toolbar/Toolbar.tsx
- [ ] T013 [US2] Implement smooth scroll functionality to loan form on click in frontend/src/components/Toolbar/Toolbar.tsx
- [ ] T014 [US2] Add mobile responsiveness (56px width) in frontend/src/components/Toolbar/Toolbar.css
- [ ] T015 [US2] Integrate toolbar into App.tsx in frontend/src/App.tsx
- [ ] T016 [US2] Offset main content with 76px left margin in frontend/src/App.css to avoid overlap

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Toast Notifications (Priority: P3)

**Goal**: Implement transient toast notifications for calculation success and failure feedback

**Independent Test**: Trigger toast notifications and verify they appear, persist for correct duration, and dismiss properly

### Implementation for User Story 3

- [ ] T017 [P] [US3] Complete toast component with success/error styling in frontend/src/components/Toast/Toast.tsx
- [ ] T018 [US3] Style toast with green success and red error colors in frontend/src/components/Toast/Toast.css
- [ ] T019 [US3] Implement auto-dismiss timers (4s success, 6s error) in frontend/src/contexts/ToastContext.tsx
- [ ] T020 [US3] Add toast stacking logic (max 3 visible) in frontend/src/contexts/ToastContext.tsx
- [ ] T021 [US3] Integrate toast context in App.tsx with toast display component
- [ ] T022 [US3] Trigger success toast on successful calculation in frontend/src/App.tsx
- [ ] T023 [US3] Trigger error toast on calculation failure in frontend/src/App.tsx
- [ ] T024 [US3] Add responsive toast layout for mobile (full width) in frontend/src/components/Toast/Toast.css

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T025 [P] Test accessibility compliance with WCAG 2.1 AA standards in all new components
- [ ] T026 [P] Validate all interactive elements remain accessible with toolbar at all breakpoints
- [ ] T027 [P] Performance optimization for toast animations (16ms frame time target)
- [ ] T028 Test edge cases: multiple rapid toasts, rapid toolbar clicks, very small screens
- [ ] T029 Update project documentation if needed
- [ ] T030 Final validation testing across all user stories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May need to integrate with App.tsx after US1/US2

### Within Each User Story

- Component structure before styling
- Styling before functionality/integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all styling tasks for User Story 1 together:
Task: "Update CSS grid layout in frontend/src/components/PaymentDisplay/PaymentDisplay.css for two-column display"
Task: "Add responsive breakpoint in frontend/src/components/PaymentDisplay/PaymentDisplay.css for mobile stacking"

# Continue with implementation:
Task: "Reorder card layout in frontend/src/components/PaymentDisplay/PaymentDisplay.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Validate toast functionality with both success and error scenarios
- Ensure toolbar scroll functionality works properly across all screen sizes
- Test responsive behavior for all breakpoints (desktop, tablet, mobile)
- Verify accessibility compliance throughout implementation