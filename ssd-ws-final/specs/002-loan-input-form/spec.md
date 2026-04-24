# Feature Specification: Loan Input Form

**Feature Branch**: `002-loan-input-form`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "Loan Input Form — primary user interface for entering loan parameters (amount, term, interest rate) with client-side validation, responsive layout, and API integration for calculation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter Loan Parameters and Calculate (Priority: P1)

A consumer exploring loan options navigates to the loan simulator and sees a form with three clearly labeled input fields: loan amount, loan term in months, and annual interest rate. The user fills in all three fields with valid values and submits the form. The system validates the inputs, sends them to the backend for calculation, and displays the results alongside the form (on larger screens) or below the form (on mobile).

**Why this priority**: This is the core functionality of the entire feature. Without the ability to enter parameters and receive calculation results, the form has no value. Every other story depends on this flow working correctly.

**Independent Test**: Can be fully tested by entering valid loan parameters (e.g., amount: 10000, term: 12, rate: 5.0), submitting the form, and verifying that calculation results are displayed. Delivers the fundamental value of the loan simulation tool.

**Acceptance Scenarios**:

1. **Given** the form is displayed with three empty input fields, **When** the user enters a valid loan amount (e.g., 10000), a valid term (e.g., 12 months), and a valid interest rate (e.g., 5.0%), **Then** all fields accept the input without errors and the submit button remains enabled.
2. **Given** the user has entered valid values in all three fields, **When** the user clicks the "Calculate" button, **Then** the system sends the parameters to the backend, shows a loading indicator, and displays the calculation results upon success.
3. **Given** the user has entered valid values and submitted the form, **When** the calculation completes successfully, **Then** the results are displayed and the form remains accessible so the user can modify inputs and recalculate.
4. **Given** the form is rendered on a desktop or tablet viewport (768px or wider), **When** the user views the page, **Then** the form appears in a persistent left side-panel alongside the results area.
5. **Given** the form is rendered on a mobile viewport (below 768px), **When** the user views the page, **Then** the form appears at full width above the results area in a stacked layout.

---

### User Story 2 - Receive Validation Feedback on Invalid Input (Priority: P2)

A consumer enters invalid or missing information in one or more form fields and attempts to submit. The system performs client-side validation before any request is made and displays clear, inline error messages next to each problematic field, explaining what is wrong and how to fix it. The form remains editable so the user can correct errors and resubmit.

**Why this priority**: Validation feedback is critical for usability and preventing unnecessary backend calls. Without it, users would submit bad data and receive confusing server errors. This story ensures a smooth, guided experience.

**Independent Test**: Can be tested by leaving fields empty or entering invalid values (negative numbers, non-numeric text, out-of-range values) and verifying that appropriate error messages appear inline without making a backend request.

**Acceptance Scenarios**:

1. **Given** the user leaves the loan amount field empty, **When** the user submits the form, **Then** an inline error message "Please enter a loan amount" appears near the loan amount field and no backend request is made.
2. **Given** the user enters a loan amount of 0 or a negative number, **When** the user submits the form, **Then** an error message "Loan amount must be greater than 0" appears near the field.
3. **Given** the user enters a non-numeric value in any field, **When** the user submits the form, **Then** an error message "Please enter a valid number" appears near that field.
4. **Given** the user enters a loan term of 0, a negative number, or a decimal (e.g., 12.5), **When** the user submits the form, **Then** an appropriate error message appears (e.g., "Loan term must be at least 1 month" or "Please enter a whole number for months").
5. **Given** the user enters an interest rate below 0 or above 100, **When** the user submits the form, **Then** an error message "Interest rate must be between 0 and 100" appears near the field.
6. **Given** a field has a validation error displayed, **When** the user corrects the input and resubmits, **Then** the error message is cleared and the form processes normally.

---

### User Story 3 - Handle Backend and Network Errors Gracefully (Priority: P3)

A consumer submits a valid form but the backend is unavailable or returns an error. The system catches the error and displays a user-friendly message. The form remains editable so the user can retry without losing their inputs.

**Why this priority**: Error resilience is important for user trust, but it is a secondary concern after core input and validation flows. Users need to know what happened and be able to try again.

**Independent Test**: Can be tested by simulating a network failure or server error response and verifying that a friendly error message is shown while the form remains editable with the previously entered values intact.

**Acceptance Scenarios**:

1. **Given** the user submits valid form data, **When** the backend is unreachable (network error), **Then** the message "Unable to connect to server. Please try again." is displayed and the form remains editable with all previously entered values preserved.
2. **Given** the user submits valid form data, **When** the backend returns a server error (e.g., 500 status), **Then** the message "An error occurred while calculating. Please try again." is displayed and the form remains editable.
3. **Given** the user submits valid form data, **When** the backend returns a validation error with specific messages, **Then** the specific error messages from the backend are displayed to the user.
4. **Given** an error message is displayed from a failed submission, **When** the user modifies inputs and resubmits, **Then** the previous error message is cleared and the new submission proceeds normally.

---

### User Story 4 - Understand Input Requirements Through Labels and Hints (Priority: P4)

A consumer unfamiliar with loan terminology opens the form and can immediately understand what information is required. Each field has a descriptive label that clarifies the expected input (e.g., "Loan Term (months)" makes it clear the value should be in months, not years; "Annual Interest Rate (%)" clarifies it is an annual percentage). Placeholder text shows example values.

**Why this priority**: While helpful for first-time users, clear labeling is a usability enhancement. The form can still function with basic labels; this story ensures an optimal onboarding experience.

**Independent Test**: Can be tested by rendering the form and verifying that all labels include unit clarifications (months, %), placeholders show example values, and the section header "Loan Details" is displayed.

**Acceptance Scenarios**:

1. **Given** the form is rendered, **When** the user views the loan amount field, **Then** it has the label "Loan Amount ($)" and a placeholder "e.g., 10000".
2. **Given** the form is rendered, **When** the user views the loan term field, **Then** it has the label "Loan Term (months)" and a placeholder "e.g., 12".
3. **Given** the form is rendered, **When** the user views the interest rate field, **Then** it has the label "Annual Interest Rate (%)" and a placeholder "e.g., 5.0".
4. **Given** the form is rendered, **When** the user views the form header, **Then** the title "Loan Details" is displayed above the input fields.

---

### User Story 5 - Navigate and Complete Form Using Keyboard Only (Priority: P5)

A user who relies on keyboard navigation (or assistive technology) can tab through all form fields in a logical order, see visible focus indicators, and submit the form using the Enter key. Error messages are announced to screen readers when they appear.

**Why this priority**: Accessibility is essential for inclusivity and compliance, but for this PoC it is a lower priority than core functionality. It ensures the form is usable by all users regardless of input method.

**Independent Test**: Can be tested by navigating through the form using only the Tab and Enter keys, verifying visible focus indicators appear on each field, and confirming that screen reader announcements work for error messages.

**Acceptance Scenarios**:

1. **Given** the form is rendered, **When** the user presses Tab, **Then** focus moves through the fields in logical order: loan amount, loan term, interest rate, calculate button.
2. **Given** a field has focus, **When** the user views the field, **Then** a visible focus indicator (colored border) is displayed.
3. **Given** all fields are filled with valid data and the calculate button has focus, **When** the user presses Enter, **Then** the form is submitted.
4. **Given** the user submits a form with validation errors, **When** error messages appear, **Then** the error messages are announced to screen readers.
5. **Given** the form has input fields, **When** a screen reader reads the form, **Then** all fields have accessible labels and any error messages are associated with their respective fields via ARIA attributes.

---

### Edge Cases

- What happens when the user enters an extremely large loan amount (e.g., exceeding 10,000,000)? The system should reject it with a validation message indicating the maximum allowed value.
- What happens when the user enters a loan term of 601 months or higher (exceeding the 600-month maximum)? The system should reject it with a range validation error.
- What happens when the user enters an interest rate of exactly 0%? This is a valid edge case (interest-free loan) and should be accepted.
- What happens when the user rapidly clicks the submit button multiple times during an API call? Duplicate submissions should be prevented by disabling the button during processing.
- What happens when the user submits valid data and then immediately modifies a field while results are loading? The system should allow modification but the in-flight request should complete normally.
- What happens when the user enters values with excessive decimal places (e.g., rate: 5.12345)? The system should accept up to 2 decimal places for interest rate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The form MUST display three input fields: loan amount (decimal numbers allowed), loan term (integers only), and annual interest rate (decimal numbers allowed, up to 2 decimal places).
- **FR-002**: The form MUST perform client-side validation on all fields before sending any request to the backend. Validation MUST trigger on blur (when a field loses focus) and on form submission.
- **FR-003**: The loan amount field MUST be required, accept only positive numbers greater than 0, and reject values exceeding 10,000,000.
- **FR-004**: The loan term field MUST be required, accept only positive integers (whole numbers), and reject values outside the range of 1 to 600 months.
- **FR-005**: The annual interest rate field MUST be required, accept values from 0 to 100 (inclusive), and allow up to 2 decimal places.
- **FR-006**: Validation error messages MUST appear inline near the relevant field in red text, clearly explaining what is wrong.
- **FR-007**: The form MUST display specific validation error messages for each error type (empty field, out of range, invalid format) as defined in the acceptance scenarios.
- **FR-008**: The submit button (labeled "Calculate") MUST be disabled during API processing and show a loading indicator.
- **FR-009**: The form MUST prevent duplicate submissions while a calculation request is in progress.
- **FR-010**: The form MUST send validated inputs via POST to `/api/v1/loans/calculate` with a JSON body containing `amount`, `term`, and `rate` fields, and pass the results (monthly payment, total payment, total interest) to the parent display component.
- **FR-011**: The form MUST display user-friendly error messages when the backend is unreachable or returns an error, and the form MUST remain editable with previously entered values preserved.
- **FR-012**: The form MUST display backend-specific validation errors if the API returns them.
- **FR-012a**: The form MUST enforce a 10-second timeout on API requests. If the timeout is exceeded, the message "Request timed out. Please try again." MUST be displayed and the form MUST remain editable with previously entered values preserved.
- **FR-013**: The form MUST render inside a persistent left side-panel on desktop (1024px and above) and tablet (768px to 1023px) viewports, alongside the results area.
- **FR-014**: The form MUST render at full width in a stacked layout above the results on mobile viewports (below 768px).
- **FR-015**: All input fields MUST have descriptive labels including units (e.g., "Loan Amount ($)", "Loan Term (months)", "Annual Interest Rate (%)") and placeholder text with example values.
- **FR-016**: The form MUST be fully navigable using keyboard only (Tab for navigation, Enter for submission) with visible focus indicators.
- **FR-017**: The form MUST use ARIA attributes to associate error messages with their respective fields for screen reader accessibility.
- **FR-018**: After a successful calculation, the form MUST remain accessible so users can modify inputs and recalculate.
- **FR-019**: The form MUST follow the project's visual design system: white card container with shadow, purple primary action button, light gray input backgrounds, and consistent typography.

### Key Entities

- **Loan Parameters**: Represents the set of inputs required for a loan calculation — loan amount (currency value), loan term (duration in months), and annual interest rate (percentage). These three values together define a complete loan simulation request.
- **Validation Error**: Represents a field-level validation issue — includes the target field identifier, the error type (missing, out of range, invalid format), and a human-readable error message.
- **Calculation Request**: Represents the submitted loan parameters sent to the backend for processing — includes amount, term, and rate values that have passed client-side validation.
- **Calculation Result**: Represents the response data returned from the backend after a successful calculation — contains monthly payment amount, total payment amount, and total interest paid. Passed to the parent component for display.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete form entry (all three fields) and submit within 30 seconds on first use.
- **SC-002**: 100% of invalid inputs are caught by client-side validation before any backend request is made.
- **SC-003**: Users who encounter a validation error can understand the error message and correct their input within 10 seconds.
- **SC-004**: The form and calculation results are visible simultaneously on screens 768px and wider, eliminating the need to scroll between input and output.
- **SC-005**: The form is fully operable using keyboard-only navigation with no mouse dependency.
- **SC-006**: Duplicate calculation requests are prevented — only one request is in flight at any time.
- **SC-007**: When the backend is unavailable, 100% of users see a clear, actionable error message and can retry without re-entering their data.
- **SC-008**: The form renders correctly and is fully functional across major browsers (Chrome, Firefox, Safari, Edge).

## Clarifications

### Session 2026-04-15

- Q: What fields does the backend calculation endpoint return? → A: Monthly payment + total payment + total interest.
- Q: What is the API endpoint path for loan calculation? → A: POST /api/v1/loans/calculate.
- Q: What should the API request timeout be and what happens when exceeded? → A: 10-second timeout with "Request timed out. Please try again." message.
- Q: What frontend framework should be used? → A: React with TypeScript.
- Q: What validation trigger strategy should be used? → A: Validate on blur + on submit.

## Assumptions

- The frontend is built using React with TypeScript.
- Users have a modern web browser with JavaScript enabled.
- The backend loan calculation API is available and running at the expected endpoint during normal operation.
- The form is part of a larger application that provides the overall page layout, navigation sidebar, and responsive container management.
- The form component itself is layout-agnostic and fills whatever container it is placed in; responsive breakpoint behavior is managed by the parent application.
- Currency is assumed to be USD (dollar sign in labels) for this version; internationalization is out of scope.
- The loan term is always expressed in months; a year-based input option is out of scope for this version.
- No data persistence is required — form data is not saved between page loads or sessions.
- Only one loan calculation can be performed at a time; side-by-side comparison of multiple loans is out of scope.
- CORS configuration on the backend is already in place to accept requests from the frontend origin.
