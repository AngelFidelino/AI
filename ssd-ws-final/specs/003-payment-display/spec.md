# Feature Specification: Payment Display

**Feature Branch**: `003-payment-display`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "The Payment Display component presents calculated monthly payment and loan summary metrics after a successful loan calculation, with proper currency formatting, card-based layout, and responsive design across Desktop, Tablet, and Mobile breakpoints."

## Clarifications

### Session 2026-04-15

- Q: How should the Payment Display component receive the principal (original loan amount) value? → A: Parent passes principal from form input state.
- Q: What should happen when no calculation data is available? → A: Show placeholder message in the results area.
- Q: What should the Payment Display show while a new calculation is in progress? → A: Keep previous results visible until new data arrives.
- Q: What level of accessibility should the Payment Display component provide? → A: Semantic HTML with ARIA labels and aria-live for updates.
- Q: What field names should the Payment Display component's props interface use? → A: monthlyPayment, totalPayment, totalInterest, principal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Monthly Payment Result (Priority: P1)

After submitting loan details and receiving a successful calculation, the user sees their monthly payment amount displayed prominently. The monthly payment is the primary answer to the user's question "What will I pay each month?" and must be immediately visible, clearly labeled, and formatted as US currency.

**Why this priority**: This is the core value proposition of the feature — the user's primary reason for using the loan calculator. Without a visible monthly payment result, the calculator provides no output.

**Independent Test**: Can be fully tested by providing calculation data and verifying the monthly payment amount renders with correct currency formatting and a clear label. Delivers immediate value as a standalone result display.

**Acceptance Scenarios**:

1. **Given** a successful loan calculation has been completed, **When** the payment display renders, **Then** the monthly payment amount is shown in large, prominent text with a "Monthly Payment" label and formatted as US currency (e.g., "$856.07").
2. **Given** a monthly payment of $1,234.56, **When** the payment display renders, **Then** the amount shows with a dollar sign, comma thousands separator, and exactly 2 decimal places ("$1,234.56").
3. **Given** no calculation has been performed yet, **When** the payment display area is rendered, **Then** a placeholder message is shown (e.g., "Calculate a loan to see results") and no errors occur.

---

### User Story 2 - Understand Total Loan Cost (Priority: P2)

After seeing the monthly payment, the user wants to understand the full cost of their loan over its lifetime. A featured total payment card shows the cumulative amount they will pay, giving them perspective on the overall financial commitment beyond the monthly figure.

**Why this priority**: Total loan cost provides critical context that helps users make informed borrowing decisions. It complements the monthly payment by revealing the true cost of the loan including interest.

**Independent Test**: Can be tested by providing calculation data with a known total payment amount and verifying it renders in a visually prominent card with correct currency formatting and a descriptive subtitle.

**Acceptance Scenarios**:

1. **Given** a successful loan calculation with a total payment of $10,272.84, **When** the payment display renders, **Then** a featured card shows "$10,272.84" with a "Total Payment" label and a subtitle indicating it represents the full loan lifetime cost.
2. **Given** calculation data is available, **When** the user views the payment display, **Then** the total payment card is visually distinguished from other cards (e.g., through color or prominence) to draw attention to the overall cost.

---

### User Story 3 - Review Payment Breakdown (Priority: P3)

The user wants to see a breakdown of their loan showing how much of the total payment goes toward the original principal versus interest. This helps the user understand the cost of borrowing and compare loans.

**Why this priority**: The breakdown provides educational value and supports informed decision-making, but is supplementary to the primary monthly payment and total cost figures.

**Independent Test**: Can be tested by providing calculation data with known principal and total interest values and verifying both appear with correct labels and currency formatting in a breakdown section.

**Acceptance Scenarios**:

1. **Given** a loan with a principal of $10,000.00 and total interest of $272.84, **When** the payment display renders, **Then** a breakdown section shows "Principal Amount: $10,000.00" and "Total Interest: $272.84" with clear labels.
2. **Given** calculation data is present, **When** the user views the breakdown, **Then** the principal and total interest values are mathematically consistent (principal + total interest = total payment).

---

### User Story 4 - View Results on Any Device (Priority: P4)

The user accesses the loan calculator from different devices — desktop computer, tablet, or mobile phone. On each device, the payment display adapts its layout to remain readable and well-organized, with the monthly payment always prominent.

**Why this priority**: Responsive layout ensures accessibility across devices but is a presentation concern rather than a functional one. The core data display works regardless of layout.

**Independent Test**: Can be tested by rendering the payment display at different viewport widths and verifying the layout adapts appropriately — horizontal grid on desktop, adjusted grid on tablet, and single-column stacked layout on mobile.

**Acceptance Scenarios**:

1. **Given** the user is on a desktop device (viewport width 1024px or wider), **When** the payment display renders, **Then** the cards are displayed in the main content area beside the loan form side-panel, using available horizontal space.
2. **Given** the user is on a tablet device (viewport width 768px to 1023px), **When** the payment display renders, **Then** the cards adapt to the narrower main content area while maintaining visual hierarchy.
3. **Given** the user is on a mobile device (viewport width below 768px), **When** the payment display renders, **Then** the cards stack vertically in a single column below the loan form, remaining readable at mobile scale.

---

### User Story 5 - See Updated Results After Recalculation (Priority: P5)

The user modifies their loan parameters and submits a new calculation. The payment display updates smoothly to reflect the new results without visual glitches, flicker, or stale data.

**Why this priority**: Smooth updates are important for user experience but secondary to initial display of correct data. The feature is still valuable even if updates require a brief loading state.

**Independent Test**: Can be tested by rendering the display with one set of data, then providing new data, and verifying all values update correctly without display artifacts.

**Acceptance Scenarios**:

1. **Given** the payment display is showing results for a previous calculation, **When** a new calculation is in progress, **Then** the previous results remain visible until new data arrives. Once the new calculation completes, all displayed metrics update to reflect the new data without flickering.
2. **Given** the user initiates a new calculation, **When** the new results arrive, **Then** the monthly payment, total payment, principal, and total interest all reflect the new calculation.

---

### Edge Cases

- What happens when the calculation data contains a monthly payment of exactly $0.00? The display should render "$0.00" with proper formatting rather than hiding the value.
- What happens when the loan amount is very large (e.g., $999,999.99)? Currency formatting must handle large numbers with correct thousands separators without truncation.
- What happens when the calculation data is removed or set to null after previously displaying results? The component should revert to displaying the placeholder message without errors.
- What happens when values have rounding edge cases (e.g., $850.10 vs. $850.1)? All amounts must always display exactly 2 decimal places.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the monthly payment amount prominently with a clear "Monthly Payment" label when calculation data is available.
- **FR-002**: System MUST display the total payment amount in a visually featured card with a label indicating it represents the full loan lifetime cost.
- **FR-003**: System MUST display a payment breakdown showing the principal amount and total interest as separate line items with clear labels.
- **FR-004**: System MUST format all monetary values as US currency with a dollar sign, comma thousands separators, and exactly 2 decimal places (e.g., "$10,272.84").
- **FR-005**: System MUST show a placeholder message (e.g., "Calculate a loan to see results") in the results area when no calculation data is available. The component MUST NOT be hidden entirely, to prevent layout shift when results appear.
- **FR-006**: System MUST update all displayed values when new calculation data is provided, without visual glitches or stale data. During recalculation, the component MUST keep the previous results visible until new data arrives; no loading spinner or overlay is required (the Loan Input Form already provides its own loading indicator).
- **FR-007**: System MUST adapt its layout across three breakpoints: desktop (1024px and above), tablet (768px to 1023px), and mobile (below 768px).
- **FR-008**: System MUST display the component in the main content area beside the loan form on desktop and tablet, and below the loan form on mobile.
- **FR-009**: System MUST be display-only — no user interactions, input fields, buttons, or data manipulation within this component.
- **FR-010**: System MUST maintain visual hierarchy where the monthly payment is the most prominent metric, followed by total payment, then the breakdown details.
- **FR-011**: System MUST use a card-based layout with consistent spacing between cards and consistent internal padding within each card.
- **FR-012**: System MUST handle large monetary values (up to $999,999.99) with proper formatting and without truncation or overflow.
- **FR-013**: System MUST use semantic HTML elements (headings, sections) with `aria-label` attributes on card regions and an `aria-live="polite"` attribute on the results container so screen readers announce updated results when calculation data changes.

### Key Entities

- **Calculation Result**: The data received from the loan calculation, provided as a props interface with four fields: `monthlyPayment` (number), `totalPayment` (number), `totalInterest` (number) — sourced from the API response — and `principal` (number) — passed by the parent component from the form input state. This entity is read-only from the display's perspective.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify their monthly payment amount within 2 seconds of the results appearing on screen.
- **SC-002**: 100% of displayed monetary values are formatted correctly with dollar sign, comma separators, and exactly 2 decimal places.
- **SC-003**: All four key metrics (monthly payment, total payment, principal, total interest) are visible without scrolling on desktop viewports.
- **SC-004**: The payment display renders correctly at all three responsive breakpoints (desktop, tablet, mobile) without content overflow or truncation.
- **SC-005**: When calculation data updates, all displayed values reflect the new data with no stale values remaining visible.
- **SC-006**: The display correctly handles the "no data" state by showing a placeholder message, with zero rendering errors.
- **SC-007**: The displayed total payment equals the sum of the displayed principal and total interest (mathematical consistency).
- **SC-008**: All component behavior is verified by automated tests before implementation is considered complete.

## Assumptions

- Users have already submitted loan parameters via the Loan Input Form and received a successful calculation response before the Payment Display renders data.
- The calculation data structure uses four camelCase fields: `monthlyPayment`, `totalPayment`, `totalInterest`, and `principal` (original loan amount).
- The loan calculator uses simple interest calculations only; compound interest or other calculation methods are out of scope.
- All monetary values are in US dollars (USD); multi-currency support is not required.
- The Payment Display does not persist or store calculation results — all data is ephemeral and provided by the parent application state.
- The Installment Table component (if it exists) consumes the same calculation data as this component but is a separate feature.
- The visual design follows a modern financial SaaS aesthetic with card-based layout, as described in the project style guide.
