# Feature Specification: Installment Table

**Feature Branch**: `004-installment-table`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "Installment Table — a display component showing the complete amortization schedule for a calculated loan, with payment-by-payment breakdown of principal, interest, remaining balance, and visual progress indicators."

## Clarifications

### Session 2026-04-15

- Q: How is the original loan amount made available to the installment table? → A: Dedicated separate input — original loan amount passed explicitly alongside the installments data.
- Q: What does the "retry" action do when a calculation error is displayed? → A: Signals the parent — retry button emits a callback; the parent component re-triggers the calculation.
- Q: What form should the data integrity warning take when the final balance is not $0.00? → A: Inline text warning below the table — a clearly styled message in a warning color appears beneath the schedule noting the data issue.
- Q: How should the Payment # column behave during horizontal scroll on mobile? → A: Position-sticky — the Payment # column stays fixed in place using CSS as the user scrolls horizontally.
- Q: When a new calculation is triggered while a schedule is already displayed, what should the user see? → A: Loading state replaces the existing table — the previous schedule is replaced by a loading indicator while the new result is fetched.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Complete Payment Schedule (Priority: P1)

As a consumer who has just calculated a loan, I want to see a detailed table showing every monthly payment from first to last, so that I can understand the full repayment journey and how my balance decreases over time.

**Why this priority**: This is the core purpose of the component. Without a rendered payment schedule, the feature delivers no value. Users need the complete picture of their loan repayment to make informed borrowing decisions.

**Independent Test**: Can be fully tested by providing a set of installment data and verifying that a table renders with the correct number of rows, each displaying payment number, payment amount, principal, interest, remaining balance, and a visual progress indicator. Delivers immediate value by showing the full amortization schedule.

**Acceptance Scenarios**:

1. **Given** the loan calculation has completed and installment data is available, **When** the installment table component receives the data, **Then** it displays a table with one row per payment showing payment number, payment amount, principal portion, interest portion, remaining balance, and a progress bar.
2. **Given** a 12-month loan has been calculated, **When** the table renders, **Then** exactly 12 data rows appear in sequential order from payment 1 to payment 12, plus a summary row.
3. **Given** the installment data is available, **When** the table renders, **Then** all monetary values are formatted as US Dollar currency ($X,XXX.XX) with proper thousands separators and two decimal places.
4. **Given** the installment data is available, **When** the table renders, **Then** a visual-only progress bar appears in each row showing the proportion of the loan paid off (no percentage text displayed).

---

### User Story 2 - Verify Loan Payoff Through Summary Totals (Priority: P2)

As a consumer, I want to see a summary row at the bottom of the payment schedule showing aggregate totals (total payments, total principal, total interest) so that I can verify the loan will be fully paid off and understand the total cost of borrowing.

**Why this priority**: The summary row provides critical validation that the loan math is correct and gives users the total cost picture at a glance. It builds trust in the calculation results and complements the row-by-row detail.

**Independent Test**: Can be tested by providing installment data with known totals and verifying the summary row displays the correct sum of all payments, sum of all principal (equal to the original loan amount), and sum of all interest. The final row's remaining balance should be $0.00 and the summary progress bar should be fully filled.

**Acceptance Scenarios**:

1. **Given** a complete set of installments for a $10,000 loan is displayed, **When** the user views the summary row, **Then** the total principal equals $10,000.00, and the total payments and total interest are correct sums of individual values.
2. **Given** the payment schedule is fully displayed, **When** the user views the last payment row, **Then** the remaining balance shows $0.00 and the progress bar is fully filled.
3. **Given** the summary row is displayed, **When** the user views it, **Then** it is visually distinct from data rows (bold text, prominent top border, slightly darker background) and includes a fully filled progress bar.

---

### User Story 3 - Understand Interest vs. Principal Distribution (Priority: P3)

As a consumer, I want to clearly see how much of each payment goes toward interest versus principal, so that I can understand the composition of my monthly payment and how the interest portion decreases over time.

**Why this priority**: Understanding the interest-vs-principal split is the educational core of an amortization table. While the table itself (P1) must render first, the visual differentiation of interest values enhances comprehension significantly.

**Independent Test**: Can be tested by verifying that interest and principal are displayed in separate columns, that interest values are visually highlighted (distinct color), and that for a standard amortizing loan the interest portion in the first payment is greater than in the last payment while principal shows the inverse trend.

**Acceptance Scenarios**:

1. **Given** installments are displayed, **When** the user scans the interest column, **Then** interest values are visually highlighted with a distinct color to draw attention to the cost of borrowing.
2. **Given** a standard amortizing loan schedule, **When** the user compares early and late payments, **Then** the interest portion is higher in early payments and lower in later payments, while principal shows the opposite pattern.

---

### User Story 4 - View Payment Schedule Across Devices (Priority: P4)

As a consumer using a phone or tablet, I want the payment schedule to remain readable and navigable on smaller screens, so that I can review my loan details on any device.

**Why this priority**: Responsive design ensures the feature is accessible to all users regardless of device. While core functionality (P1-P3) takes precedence, usability across screen sizes is important for a good user experience.

**Independent Test**: Can be tested by rendering the component at various viewport widths (desktop, tablet, mobile) and verifying that all data remains accessible, columns are readable, and the table provides appropriate scrolling or layout adjustments.

**Acceptance Scenarios**:

1. **Given** the user is viewing the table on a desktop (1024px or wider), **When** the table renders, **Then** all 6 columns are visible without horizontal scrolling in the main content area beside the side-panel.
2. **Given** the user is viewing the table on a mobile device (under 768px), **When** the table renders, **Then** the table occupies full width and supports horizontal scrolling with the Payment # column remaining visually fixed in place (position-sticky) so users always have row context while scrolling.
3. **Given** the table contains many rows, **When** the user scrolls vertically, **Then** the column headers remain visible (sticky header).

---

### User Story 5 - Accessible Payment Schedule (Priority: P5)

As a user relying on assistive technology (screen reader, keyboard navigation), I want the payment schedule to be fully accessible so that I can understand the loan breakdown without visual cues alone.

**Why this priority**: Accessibility compliance (WCAG AA) is a requirement for inclusive design. While it doesn't add new business features, it ensures all users can benefit from the payment schedule.

**Independent Test**: Can be tested by verifying semantic table markup (caption, column header associations, proper structural sections), keyboard navigability, and that assistive technologies can read the numeric progress value for each progress bar.

**Acceptance Scenarios**:

1. **Given** a screen reader is active, **When** the table is encountered, **Then** the caption "Loan Amortization Schedule" is announced, column headers are properly associated with data cells, and the numeric progress value for each payment is conveyed to the screen reader.
2. **Given** a keyboard-only user, **When** navigating the table, **Then** the user can tab through the table content without requiring a mouse.

---

### Edge Cases

- What happens when the installment data is an empty array? The system displays a message: "No payment schedule available."
- What happens when the installment data is null or undefined? The table component does not render, or displays an appropriate empty state message: "Enter loan details and calculate to see payment schedule."
- What happens when the final installment's remaining balance is not exactly $0.00? An inline warning message styled in a warning color is displayed below the table, indicating a potential data integrity issue without obscuring the schedule.
- What happens when the calculation is still in progress? A loading indicator or skeleton table is shown in place of the data. If a previous schedule was already visible, it is replaced by the loading state immediately when a new calculation begins.
- What happens when the calculation fails with an error? An error message is displayed instead of the table, with a retry option that notifies the parent to re-trigger the calculation. The component does not re-execute the calculation itself.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a structured data table with proper semantic markup — including distinct header, body, and footer sections — containing exactly 6 columns: Payment #, Payment Amount, Principal, Interest, Remaining Balance, and Progress.
- **FR-002**: System MUST display one row per installment in sequential order from payment 1 through the final payment.
- **FR-003**: System MUST format all monetary values as US Dollar currency ($X,XXX.XX) with thousands separators, dollar sign, and exactly two decimal places.
- **FR-004**: System MUST display a summary/totals row in the table footer showing: a "Total" label, sum of all payment amounts, sum of all principal amounts, sum of all interest amounts, and a fully filled progress bar.
- **FR-005**: System MUST render a visual-only progress bar in each row showing the proportion of the loan paid off, calculated as ((original loan amount - remaining balance) / original loan amount) x 100. No percentage text is displayed.
- **FR-006**: System MUST conditionally render the table only when installment data is available. Before calculation, the component either does not render or shows an empty state message.
- **FR-007**: System MUST display a loading state (loading indicator or skeleton table) while a calculation is in progress. If a previous schedule is visible when a new calculation starts, the loading state replaces it immediately — the old data is not retained during the new fetch.
- **FR-008**: System MUST display an error message with a retry option when the calculation fails. The retry action notifies the parent to re-trigger the calculation; the installment table component does not initiate or re-execute the calculation itself.
- **FR-009**: System MUST display a message "No payment schedule available" when an empty installment array is provided.
- **FR-010**: System MUST include a table caption ("Loan Amortization Schedule") and use scope attributes on header cells for accessibility.
- **FR-011**: System MUST convey the numeric progress value of each progress bar to assistive technologies, ensuring screen readers can announce the percentage of the loan repaid without relying on the visual bar alone.
- **FR-012**: System MUST be responsive across three breakpoint levels: Desktop (1024px and above), Tablet (768px to 1023px), and Mobile (below 768px), with appropriate layout adjustments at each level. On Mobile, the Payment # column MUST remain visually fixed (position-sticky) during horizontal scroll so users always retain row context.
- **FR-013**: System MUST display an inline warning message below the table, styled in a warning color, if the final installment's remaining balance is not $0.00. The warning must not block or obscure the payment schedule.
- **FR-014**: System MUST visually distinguish the interest column with a highlighted color to help users identify the cost-of-borrowing portion.
- **FR-015**: System MUST include the payment count ("{n} payments") in the card header alongside the title.
- **FR-016**: System MUST apply zebra striping (alternating row backgrounds) for readability.
- **FR-017**: System MUST visually distinguish the summary row from data rows (bold text, prominent top border, slightly darker background).

### Key Entities

- **Installment**: Represents a single monthly payment in the amortization schedule. Key attributes: payment number (sequential integer), payment amount (fixed monthly amount), principal (portion applied to loan balance), interest (portion representing borrowing cost), remaining balance (outstanding principal after the payment).
- **Payment Schedule**: The complete ordered collection of installments from first payment to final payoff. Associated with a single loan calculation. Includes aggregate totals for payments, principal, and interest.
- **Progress**: A computed value per installment representing the percentage of the original loan that has been repaid. Derived from the explicitly provided original loan amount and the installment's remaining balance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the complete payment schedule immediately after a loan calculation completes, with all payment rows visible within 1 second of data availability.
- **SC-002**: 100% of displayed monetary values accurately match the source calculation data, with correct currency formatting applied to every value.
- **SC-003**: The summary row totals are mathematically correct: total principal equals the original loan amount, total payments equal the sum of all individual payments, and total interest equals the sum of all individual interest amounts (within a $0.01 rounding tolerance).
- **SC-004**: The final payment row shows a $0.00 remaining balance and a fully filled progress bar, confirming complete loan payoff.
- **SC-005**: The table is usable and readable across all device sizes from 320px to 1920px viewport width, with no data hidden or cut off unintentionally.
- **SC-006**: Users relying on assistive technologies can access all table information, including the numeric progress value for each payment row, without relying on visual elements alone.
- **SC-007**: All defined component tests (minimum 8 test scenarios) pass, covering rendering, formatting, calculations, edge cases, and accessibility.
- **SC-008**: The table renders within 100 milliseconds for a 360-payment loan (30-year schedule), ensuring performance at scale.

## Assumptions

- Users have already completed a loan calculation via the Loan Input Form (Feature #2) and the Loan Calculation API (Feature #1) before the installment table displays.
- The installment data structure from the API follows the established contract: an array of objects with paymentNumber, paymentAmount, principal, interest, and remainingBalance fields.
- The original loan amount is passed explicitly as a dedicated input alongside the installments data. The component does not derive it internally from installment values.
- The component is display-only with no user interaction beyond viewing, scrolling, and hovering. There is no sorting, filtering, export, or editing capability.
- Only one loan calculation is displayed at a time; there is no comparison or multi-loan view.
- Simple interest (fixed monthly payment) amortization is the only calculation method supported.
- The Payment Display component (Feature #3) handles the high-level summary; this component provides the granular per-payment detail.
- Modern browsers only (Chrome, Firefox, Safari, Edge — latest versions).
- The component follows the project style guide (preparation/styling.md) for visual design, including card container, typography, color scheme, and spacing conventions.
