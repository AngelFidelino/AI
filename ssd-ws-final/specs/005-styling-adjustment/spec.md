# Feature Specification: Styling Adjustment - Card Reorder, Vertical Toolbar & Toast Notifications

**Feature Branch**: `[005-styling-adjustment]`  
**Created**: April 24, 2026  
**Status**: Draft  
**Input**: User description: "@preparation/5.styling-adjustment.md"

## Clarifications

### Session 2026-04-24

- Q: Toast Message Content Specification → A: Use generic templated messages: "Calculation completed successfully" and "Calculation failed: [specific error]"
- Q: Accessibility Compliance Standard → A: WCAG 2.1 AA compliance (contrast ratios, keyboard navigation, screen reader support)
- Q: Toast Trigger Event Specification → A: Trigger on form submission response only (successful API call or validation error)
- Q: Performance Target for Toast Animations → A: 16ms frame time target (60fps) for smooth animations

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reordered Card Layout (Priority: P1)

As a consumer viewing the loan payment results, I want to see the Total Payment card on the left and the Monthly Payment card on the right so that the most comprehensive cost metric leads visually and monthly payment is the natural answer on the right.

**Why this priority**: This is a simple UI rearrangement that improves the visual hierarchy and user comprehension without changing functionality.

**Independent Test**: Can be fully tested by rendering the PaymentDisplay component and verifying the card positions in the layout grid.

**Acceptance Scenarios**:

1. **Given** the PaymentDisplay component renders with valid calculation data, **When** viewing on desktop or tablet, **Then** Total Payment card appears in the left column and Monthly Payment in the right column
2. **Given** the PaymentDisplay component renders with valid calculation data, **When** viewing on mobile, **Then** cards stack vertically in order: Total Payment, Monthly Payment, Payment Breakdown

---

### User Story 2 - Vertical Purple Toolbar (Priority: P2)

As a consumer using the application, I want to see a vertical purple toolbar on the far left of the screen with a Loan Simulator icon so that I have a persistent, branded navigation anchor point for the application.

**Why this priority**: Provides a consistent navigation element that enhances brand presence and offers quick access to the main feature.

**Independent Test**: Can be fully tested by mounting the application and verifying the toolbar renders with correct styling and interaction behavior.

**Acceptance Scenarios**:

1. **Given** the application renders, **When** viewing on any device, **Then** a purple vertical toolbar is visible on the far left edge
2. **Given** the toolbar is visible, **When** a user clicks or taps the calculator icon, **Then** the page scrolls smoothly to the Loan Input Form

---

### User Story 3 - Toast Notifications (Priority: P3)

As a consumer interacting with the loan calculator, I want to see brief notifications when a calculation completes or an error occurs so that I have clear, immediate feedback about the result of my actions without navigating away from my current view.

**Why this priority**: Improves user experience by providing non-intrusive feedback for actions and errors.

**Independent Test**: Can be fully tested by triggering toast notifications and verifying they appear, persist, and dismiss correctly.

**Acceptance Scenarios**:

1. **Given** a form submission completes successfully, **When** the API response indicates success, **Then** a green toast appears with "Calculation completed successfully" message and auto-dismisses after 4 seconds
2. **Given** a form submission fails, **When** the API response or validation indicates error, **Then** a red toast appears with "Calculation failed: [specific error]" message and auto-dismisses after 6 seconds

---

### Edge Cases

- What happens when multiple toasts are triggered in quick succession? - Stack vertically with max 3 visible, dismiss oldest when limit exceeded
- How does system handle rapid toolbar icon clicks? - Only single scroll action triggered, subsequent clicks ignored while scrolling
- What happens on very small mobile screens? - Toolbar reduces to 56px width, toasts adapt to full width

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST swap the horizontal positions of Total Payment and Monthly Payment cards in the Payment Display component
- **FR-002**: System MUST render a 76px wide vertical toolbar with purple background (#5B4FFF) on the far left edge  
- **FR-003**: System MUST display a white calculator icon in the toolbar that scrolls to the Loan Input Form when activated
- **FR-004**: System MUST show green success toasts with message "Calculation completed successfully" for calculation completion with 4-second auto-dismiss
- **FR-005**: System MUST show red error toasts with message "Calculation failed: [specific error]" for calculation failures with 6-second auto-dismiss
- **FR-006**: System MUST position main application content with 76px left offset to avoid_overlap with toolbar
- **FR-007**: System MUST adapt layout for mobile with 56px toolbar and single-column card stacking

### Key Entities *(include if feature involves data)*

- **Toast Notification**: A transient UI feedback entity with properties (type: info/error, message: string, duration: ms, animation target: 16ms frame time)
- **Vertical Toolbar**: A persistent navigation element with properties (width: 76/56px, color: #5B4FFF, icon: calculator)
- **Payment Display Cards**: The three metric cards (Total Payment, Monthly Payment, Payment Breakdown) with new layout rules

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify Total Payment as the primary metric within 2 seconds of viewing the results
- **SC-002**: All interactive elements remain accessible and not obscured by the toolbar at any breakpoint, complying with WCAG 2.1 AA standards
- **SC-003**: Users receive immediate feedback for calculations with no navigation away from current view
- **SC-004**: 100% of users can navigate to Loan Simulator with single click/tap from any page position

## Assumptions

- Existing PaymentDisplay component structure will remain unchanged except for layout order
- Toast notifications will be managed through a React context provider at the App shell level  
- Toolbar will use standard web scrolling APIs to navigate to the loan form
- Icon library (Heroicons, Lucide, or equivalent) is already available in the project
- CSS Grid will be used for the two-column card layout without additional dependencies