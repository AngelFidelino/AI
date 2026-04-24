# Implementation Plan: Styling Adjustment - Card Reorder, Vertical Toolbar & Toast Notifications

**Branch**: `005-styling-adjustment` | **Date**: April 24, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-styling-adjustment/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

This feature implements three UI enhancements to the existing loan calculator application: swapping card positions in the PaymentDisplay component (Total Payment left, Monthly Payment right), adding a persistent 76px purple vertical toolbar on the far left with a calculator icon that scrolls to the loan form, and implementing a toast notification system with green success messages (4s) and red error messages (6s) triggered by form submission responses.

## Technical Context

**Language/Version**: TypeScript 4.5+, React 18+  
**Primary Dependencies**: React 18, Vite, Vitest, React Testing Library, CSS Grid, Fetch API  
**Storage**: N/A - ephemeral UI state only  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Web (Desktop, Tablet, Mobile - responsive)  
**Project Type**: web-service  
**Performance Goals**: 16ms frame time target (60fps) for toast animations  
**Constraints**: WCAG 2.1 AA compliance, toast auto-dismiss (4s success, 6s error)  
**Scale/Scope**: 3 UI components modified, responsive breakpoints (≥1024px, ≥768px, <768px)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✓ Single project boundary maintained
- ✓ Component-based design within existing structure
- ✓ No external APIs or data persistence
- ✓ Pure UI enhancements with clear testability

## Project Structure

### Documentation (this feature)

```text
specs/005-styling-adjustment/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure
frontend/
├── src/
│   ├── components/
│   │   ├── PaymentDisplay.jsx     # Modified - card grid layout
│   │   ├── VerticalToolbar.jsx    # New - purple toolbar component
│   │   └── Toast/
│   │       ├── ToastContext.jsx   # New - toast state management
│   │       └── Toast.jsx          # New - toast component
│   ├── hooks/
│   │   └── useToast.jsx           # New - toast hook
│   ├── styles/
│   │   ├── PaymentDisplay.css     # Modified - grid layout
│   │   ├── VerticalToolbar.css    # New - toolbar styles
│   │   └── Toast.css              # New - toast styles
│   └── App.jsx                    # Modified - add ToastProvider and VerticalToolbar
└── tests/
    ├── components/
    │   ├── PaymentDisplay.test.jsx # Modified - test card order
    │   └── Toast/
    │       └── Toast.test.jsx     # New - toast behavior tests
    └── hooks/
        └── useToast.test.jsx      # New - toast hook tests
```

**Structure Decision**: Web application structure with frontend-only modifications. All changes are UI-focused within the existing React frontend, no backend changes required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |