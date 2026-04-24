# Research: Installment Table

**Feature**: 004-installment-table
**Date**: 2026-04-15

## Research Tasks

All technology choices are established from prior features (001-loan-calculation-api, 002-loan-input-form, 003-payment-display) and `preparation/technical.md`. No NEEDS CLARIFICATION items in Technical Context. Research below covers best practices for table design, accessibility, responsive behavior, performance, and component state management specific to this amortization schedule component.

---

## 1. Semantic HTML Table Structure for Amortization Schedule

**Context**: FR-001 requires a structured data table with proper semantic markup including distinct header, body, and footer sections. FR-010 requires a table caption and scope attributes on header cells. FR-004 requires a summary/totals row in the table footer.

**Decision**: Use native HTML `<table>` with `<caption>`, `<thead>`, `<tbody>`, and `<tfoot>` sections. Column headers use `<th scope="col">`. The summary row resides in `<tfoot>`.

**Rationale**: Native HTML table semantics provide the strongest accessibility support. Screen readers automatically announce cell-header associations when `scope="col"` is used on `<th>` elements. `<caption>` serves as the table's accessible name (FR-010: "Loan Amortization Schedule"). `<tfoot>` semantically distinguishes the totals row from data rows, and browsers render it correctly even when placed before `<tbody>` in source order.

**Alternatives Considered**:
- **CSS Grid/Flexbox layout**: Would lose native table semantics and require extensive ARIA role assignments (`role="table"`, `role="row"`, `role="columnheader"`, `role="cell"`) to replicate what `<table>` provides natively. More complex and less robust for screen readers.
- **`role="table"` on `<div>` elements**: Technically valid but unnecessarily complex. HTML tables are the correct semantic element for tabular data.
- **Third-party table library (react-table, AG Grid)**: Overkill for a read-only display table with no sorting, filtering, or pagination. Adds a dependency the project doesn't need.

**Implementation Notes**:
```html
<table class="installment-table__table">
  <caption class="installment-table__caption">Loan Amortization Schedule</caption>
  <thead class="installment-table__head">
    <tr>
      <th scope="col">Payment #</th>
      <th scope="col">Payment Amount</th>
      <th scope="col">Principal</th>
      <th scope="col">Interest</th>
      <th scope="col">Remaining Balance</th>
      <th scope="col">Progress</th>
    </tr>
  </thead>
  <tbody class="installment-table__body">
    <!-- Data rows -->
  </tbody>
  <tfoot class="installment-table__foot">
    <!-- Summary/totals row -->
  </tfoot>
</table>
```

---

## 2. Sticky Column Headers and Sticky Payment # Column

**Context**: FR-012 requires sticky column headers during vertical scroll, and a sticky Payment # column on mobile during horizontal scroll. The clarification session confirmed "position-sticky" for the Payment # column.

**Decision**: Use CSS `position: sticky` for both the `<thead>` (vertical scroll) and the first column cells (horizontal scroll on mobile). The table container uses `overflow-x: auto` to enable horizontal scrolling on narrow viewports.

**Rationale**: `position: sticky` is well-supported in modern browsers (Chrome, Firefox, Safari, Edge — all target browsers per spec assumptions). It doesn't require JavaScript, works with semantic HTML tables, and provides the expected behavior: the element stays fixed relative to the scroll container while scrolling past its normal position.

**Alternatives Considered**:
- **JavaScript-based scroll listeners**: Adds unnecessary complexity and jank. `position: sticky` handles this natively with GPU-accelerated compositing.
- **Fixed-position overlay**: Would require duplicating the header/column content and synchronizing scroll positions. Fragile and complex.
- **Virtualized table (react-window, react-virtuoso)**: Designed for very large datasets (10k+ rows). A 360-row table (SC-008 maximum) renders within 100ms with native DOM. Virtualization adds complexity without measurable benefit at this scale.

**Implementation Notes**:
```css
/* Sticky header */
.installment-table__head th {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #ffffff;
}

/* Sticky first column (mobile) */
@media (max-width: 767px) {
  .installment-table__body td:first-child,
  .installment-table__head th:first-child,
  .installment-table__foot td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: inherit;
  }

  /* Corner cell (header + first column intersection) */
  .installment-table__head th:first-child {
    z-index: 3;
  }
}
```
- The table wrapper needs `overflow-x: auto` and a constrained width on mobile to trigger horizontal scroll.
- `z-index` layering: corner cell (3) > header row (2) > sticky column (1) > body cells (auto).
- `background-color: inherit` on sticky cells prevents content behind from showing through.

---

## 3. Progress Bar Accessibility

**Context**: FR-005 requires a visual-only progress bar showing the proportion of the loan paid off with no percentage text displayed. FR-011 requires the numeric progress value to be conveyed to assistive technologies so screen readers can announce the percentage without relying on the visual bar.

**Decision**: Use a `<div>` with `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, and `aria-valuemax="100"`. The visual bar width is set via inline CSS `width: {percentage}%`. The `aria-label` attribute provides a readable description (e.g., "42% of loan repaid").

**Rationale**: The `role="progressbar"` with `aria-valuenow` is the standard ARIA pattern for conveying progress to screen readers. The visual bar uses CSS width for the filled portion, while the ARIA attributes provide the same information to non-visual users. Using `aria-label` instead of visible text satisfies FR-005 (no percentage text displayed) while satisfying FR-011 (screen readers can announce the value).

**Alternatives Considered**:
- **Native `<progress>` element**: Provides built-in accessibility but has limited cross-browser styling control. Custom styling requires vendor-prefix pseudo-elements that are inconsistent across browsers. A `<div>` with ARIA roles provides identical accessibility with full styling control.
- **`aria-valuetext` instead of `aria-label`**: `aria-valuetext` is intended for non-numeric descriptions (e.g., "medium"). Since the progress is a percentage number, `aria-valuenow` + `aria-label` is more appropriate.
- **Visually hidden text**: A `<span class="sr-only">42%</span>` would work but `role="progressbar"` with `aria-valuenow` is the semantically correct approach for a progress indicator.

**Implementation Notes**:
```tsx
const percentage = Math.round(
  ((originalLoanAmount - remainingBalance) / originalLoanAmount) * 100
);

<td>
  <div
    className="installment-table__progress"
    role="progressbar"
    aria-valuenow={percentage}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={`${percentage}% of loan repaid`}
  >
    <div
      className="installment-table__progress-fill"
      style={{ width: `${percentage}%` }}
    />
  </div>
</td>
```
- Progress calculation: `((originalLoanAmount - remainingBalance) / originalLoanAmount) * 100`
- Summary row progress: always 100% (fully filled, per spec)
- Edge case: if `originalLoanAmount` is 0, progress should default to 0 to avoid division by zero

---

## 4. Zebra Striping and Summary Row Styling

**Context**: FR-016 requires alternating row backgrounds for readability. FR-017 requires the summary row to be visually distinct (bold text, prominent top border, slightly darker background). The styling guide specifies clean rows with light gray dividers.

**Decision**: Use CSS `nth-child(even)` pseudo-selector for zebra striping on `<tbody>` rows. The `<tfoot>` summary row uses a distinct class with bold font-weight, a prominent top border (`2px solid`), and a slightly darker background color.

**Rationale**: CSS pseudo-selectors for zebra striping require no JavaScript and automatically apply to dynamically rendered rows. Keeping the summary row in `<tfoot>` with its own class provides natural semantic separation and easy independent styling.

**Alternatives Considered**:
- **JavaScript-based row index tracking**: Unnecessary when CSS `nth-child` handles this natively.
- **Alternating class names in JSX**: Would work but adds complexity to the render logic without benefit over the CSS pseudo-selector approach.
- **Using `<tfoot>` styling alone for the summary**: `<tfoot>` provides the semantic container, but a dedicated class allows more precise styling control.

**Implementation Notes**:
```css
/* Zebra striping */
.installment-table__body tr:nth-child(even) {
  background-color: #F9FAFB;  /* very light gray */
}

/* Summary row */
.installment-table__foot tr {
  font-weight: 700;
  border-top: 2px solid #E5E7EB;
  background-color: #F3F4F6;  /* slightly darker than zebra stripe */
}
```
- Zebra striping only on `<tbody>` rows (not header or footer)
- Summary row background must be distinct from both regular and zebra-striped rows
- On sticky column cells, `background-color: inherit` ensures the stripe/summary colors persist when scrolling horizontally

---

## 5. Interest Column Visual Highlighting

**Context**: FR-014 requires the interest column to be visually highlighted with a distinct color to help users identify the cost-of-borrowing portion. The styling guide specifies orange/amber text (`#D97706`) on light yellow background (`#FEF3C7`).

**Decision**: Apply a CSS class to all interest column cells (`<td>` and `<tfoot td>`) that sets `color: #D97706` and `background-color: #FEF3C7`. The column header remains the standard header style.

**Rationale**: Directly follows the styling guide specifications. The orange/amber on light yellow provides sufficient contrast for WCAG AA compliance (contrast ratio ~4.6:1 for normal text). The highlighting draws visual attention to the cost-of-borrowing column without requiring color alone to convey the information (the column header "Interest" provides the textual label).

**Alternatives Considered**:
- **Bold text only**: Would differentiate the column but not as effectively as color highlighting. The styling guide specifically calls for colored highlighting.
- **Icon/badge per cell**: Adds visual noise to a data-dense table. A consistent column-wide style is cleaner.
- **Conditional highlighting (only for high interest values)**: The spec doesn't require conditional logic — all interest values should be highlighted to consistently draw attention.

**Implementation Notes**:
```css
.installment-table__interest {
  color: #D97706;
  background-color: #FEF3C7;
}
```
- Applied to every interest cell in `<tbody>` and `<tfoot>`
- Important: when combined with zebra striping, the interest cell background should override the row background (higher specificity or explicit override)
- When the interest cell is in a sticky column context, the background must be preserved

---

## 6. Component State Management (Loading, Error, Empty, Data)

**Context**: The component has five distinct states: (1) no data/pre-calculation, (2) loading, (3) error with retry, (4) empty array, and (5) data display with optional warning. FR-006 specifies pre-calculation state. FR-007 specifies loading state. FR-008 specifies error with retry. FR-009 specifies empty array. FR-013 specifies data integrity warning.

**Decision**: The component receives a composite props interface that encodes the current state:
- `installments: Installment[] | null` — the schedule data
- `originalLoanAmount: number` — the original loan amount for progress calculation
- `isLoading: boolean` — loading state flag
- `error: string | null` — error message from failed calculation
- `onRetry: () => void` — callback for retry button

State resolution logic (priority order):
1. `isLoading === true` → render loading skeleton/spinner
2. `error !== null` → render error message with retry button
3. `installments === null` → render "Enter loan details..." placeholder
4. `installments.length === 0` → render "No payment schedule available"
5. Otherwise → render full table, check final balance for warning

**Rationale**: Using multiple props rather than a discriminated union keeps the interface simpler and aligns with the parent `App.tsx` pattern (which already manages `result`, `loanAmount`, and will manage loading/error states). The priority-based resolution ensures loading always takes precedence (FR-007: loading replaces existing table immediately), followed by error, then empty states.

**Alternatives Considered**:
- **Discriminated union type** (`{status: 'idle'} | {status: 'loading'} | {status: 'error', message: string} | {status: 'success', data: Installment[]}`): More type-safe but adds coupling between the parent's state management and the component's type system. Requires the parent to construct the correct variant.
- **Single `data` prop with internal state detection**: Would require complex null/undefined/empty checks in the component. Explicit props are clearer.
- **Separate components per state**: Would fragment the component unnecessarily. A single component with conditional rendering is more maintainable.

**Implementation Notes**:
```tsx
interface InstallmentTableProps {
  installments: Installment[] | null;
  originalLoanAmount: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}
```
- The parent `App.tsx` will need new state: `isLoading: boolean`, `error: string | null`
- The `onRetry` callback invokes the same calculation logic as the original form submission
- The loading state should appear as a simple loading indicator (spinner or "Loading..." text) within the card container
- The error state renders the error message and a "Retry" button within the card container

---

## 7. Performance with Large Tables (360 Rows)

**Context**: SC-008 requires the table to render within 100ms for a 360-payment loan (30-year schedule). The table has 6 columns per row, totaling 2,160+ cells for a full render.

**Decision**: Use standard React rendering with native HTML `<table>`. No virtualization. The `formatCurrency` utility uses a module-level singleton `Intl.NumberFormat` instance (already implemented in 003). The progress percentage is a simple arithmetic operation per row.

**Rationale**: 360 rows with 6 columns (~2,160 cells) is well within the capability of modern browser DOM rendering. React's reconciliation efficiently handles this volume. Key performance considerations:
- The `Intl.NumberFormat` singleton avoids creating a new formatter per cell (already implemented)
- Progress bar percentage is a single division + multiplication per row
- No state management inside the table component (pure props-driven rendering)
- No DOM manipulation or effects needed

**Alternatives Considered**:
- **React virtualization (react-window, react-virtuoso)**: Designed for 10k+ rows. At 360 rows, the overhead of measuring row heights and managing scroll containers exceeds the savings from reduced DOM nodes. Introduces complexity in sticky header/column interaction.
- **Pagination**: Breaks the "complete schedule" requirement. Users need to see all payments to understand the full amortization.
- **`useMemo` for row data**: May be beneficial if the parent re-renders frequently with the same data. Worth adding if profiling shows unnecessary recalculations, but not required initially.
- **Web Workers for formatting**: Formatting 360 currency values takes microseconds with `Intl.NumberFormat`. Not worth the complexity.

**Implementation Notes**:
- If performance testing reveals issues (unlikely), the first optimization step would be `React.memo()` on the component to prevent re-renders when props haven't changed
- The `formatCurrency` singleton pattern from 003 is already optimal
- No `useEffect`, `useState`, or `useRef` needed inside the component (pure functional component receiving props)
- Consider `key={installment.payment_number}` for stable React keys on rows

---

## 8. Responsive Table Layout Strategy

**Context**: FR-012 requires three breakpoint levels. On desktop, all 6 columns visible without horizontal scroll. On mobile, horizontal scroll with sticky Payment # column. The table renders in the main content area beside the sidebar on desktop/tablet, and full-width on mobile.

**Decision**: CSS-based responsive approach using the parent's existing layout grid. The table component uses:
- Desktop (>= 1024px): Full table, all columns visible, no horizontal scroll
- Tablet (768-1023px): Full table, columns may be narrower but all visible
- Mobile (< 768px): Table wrapper with `overflow-x: auto`, Payment # column sticky

**Rationale**: The parent `App.tsx` already manages the two-column (sidebar + main) / single-column (mobile) grid. The InstallmentTable fills the available `<main>` content area. On desktop and tablet, the table width fits within the main area. On mobile, the full-width table is wider than the viewport, so horizontal scroll is enabled with the first column sticky for context.

**Alternatives Considered**:
- **Responsive card layout (each row as a card)**: Common mobile pattern but loses the tabular structure that users expect for amortization schedules. Harder to compare values across payments.
- **Column hiding on mobile**: Would require choosing which columns to hide, but all 6 columns carry important information per the spec.
- **Two separate layouts (table for desktop, cards for mobile)**: Duplicates rendering logic and increases maintenance burden.

**Implementation Notes**:
```css
/* Table container for horizontal scroll */
.installment-table__wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Desktop: ensure columns fit */
@media (min-width: 1024px) {
  .installment-table__table {
    width: 100%;
    table-layout: auto;
  }
}

/* Mobile: enable horizontal scroll, sticky first column */
@media (max-width: 767px) {
  .installment-table__table {
    min-width: 700px;  /* force horizontal scroll */
  }
}
```
- `min-width` on the table ensures it doesn't compress columns below readability on mobile
- `-webkit-overflow-scrolling: touch` provides smooth scrolling on iOS Safari
- Column widths can use relative sizing (e.g., Payment # narrow, amounts moderate, progress bar wider)

---

## 9. Data Integrity Warning (Non-Zero Final Balance)

**Context**: FR-013 requires an inline warning below the table if the final installment's remaining balance is not exactly $0.00. The warning must use a warning color and not obstruct the schedule.

**Decision**: After rendering the table, check the last installment's `remaining_balance`. If it is not exactly 0, render a warning `<div>` below the table with a warning icon, styled in amber/orange tones.

**Rationale**: This is a straightforward conditional render after the table. The check is a single comparison against the last array element. Placing it below the table ensures it doesn't interfere with the table layout or scrolling behavior.

**Alternatives Considered**:
- **Toast/notification**: Would be dismissible and potentially missed. An inline warning is persistent and contextually placed.
- **Highlighted last row**: Would work but the spec says "inline warning message below the table," not within it.
- **Modal/dialog**: Too intrusive for an informational warning.

**Implementation Notes**:
```tsx
const lastInstallment = installments[installments.length - 1];
const hasBalanceWarning = lastInstallment.remaining_balance !== 0;

{hasBalanceWarning && (
  <div className="installment-table__warning" role="alert">
    ⚠ The final payment does not result in a $0.00 balance. 
    Remaining balance: {formatCurrency(lastInstallment.remaining_balance)}. 
    This may indicate a rounding discrepancy in the calculation.
  </div>
)}
```
- `role="alert"` ensures screen readers announce the warning
- Warning styling: amber/orange border, light yellow background (consistent with interest highlighting colors)
- The comparison uses strict numeric equality (`!== 0`), not a string comparison

---

## 10. Card Container and Header Design

**Context**: FR-015 requires the payment count ("{n} payments") in the card header alongside the title. The styling guide shows a "Payment Schedule" title with count on the right. The component follows the project's card-based layout system.

**Decision**: Wrap the table in a card container (`<section>`) with a header row containing the title "Payment Schedule" and a payment count badge (`{n} payments`). The card follows the same styling patterns as PaymentDisplay cards (white background, rounded corners, shadow, padding).

**Rationale**: Consistent with the project's card-based design system. The header provides context (what the table shows) and the count gives immediate scale awareness (how many payments). The `<section>` with `aria-labelledby` links the heading to the section for accessibility.

**Alternatives Considered**:
- **No card wrapper (bare table)**: Would look inconsistent with the rest of the UI. All other components use card containers.
- **`aria-label` instead of `aria-labelledby`**: `aria-labelledby` is preferred when a visible heading exists, as it avoids duplicating the text.

**Implementation Notes**:
```tsx
<section className="installment-table" aria-labelledby="installment-table-title">
  <div className="installment-table__header">
    <h2 id="installment-table-title">Payment Schedule</h2>
    <span className="installment-table__count">{installments.length} payments</span>
  </div>
  <div className="installment-table__wrapper">
    <table>...</table>
  </div>
</section>
```

---

## 11. Parent Component Integration (App.tsx Changes)

**Context**: The existing `App.tsx` manages `result` (LoanResult | null) and `loanAmount` (number). The InstallmentTable needs the installment schedule, original loan amount, loading state, error state, and a retry callback.

**Decision**: Extend `App.tsx` state to include `isLoading` and `error` fields. The `handleCalculate` callback already receives the `LoanResult` — extend the flow to set loading/error states around the API call. Pass installment data as `result?.schedule ?? null`, `originalLoanAmount` as `loanAmount`, and manage loading/error lifecycle.

**Rationale**: The parent component is the natural integration point between the API service layer and the display components. The LoanForm already triggers calculation via `onCalculate`; extending this to handle loading/error states follows the established architecture. The InstallmentTable receives pre-shaped data just like PaymentDisplay.

**Alternatives Considered**:
- **Separate API call for schedule data**: The schedule is already part of the `LoanResult` response. No need for a separate endpoint.
- **Loading/error management inside InstallmentTable**: Would violate separation of concerns — the component should not know about API calls.
- **Context/state management library**: Overkill for this simple data flow pattern.

**Implementation Notes**:
- New state in `App.tsx`: `isLoading: boolean` (default false), `error: string | null` (default null)
- On form submit: `setIsLoading(true)`, `setError(null)`
- On success: `setResult(result)`, `setLoanAmount(principal)`, `setIsLoading(false)`
- On error: `setError(errorMessage)`, `setIsLoading(false)`
- When loading starts: `setResult(null)` to clear previous data (FR-007: loading replaces existing table)
- The `onRetry` callback re-triggers the same API call with the last form values
- Note: The existing `LoanForm.handleCalculate` manages its own internal loading state for the form button. The `App.tsx` loading state is for the InstallmentTable.

---

## 12. Component Testing Strategy

**Context**: Constitution Principle III mandates TDD. SC-007 requires minimum 8 test scenarios covering rendering, formatting, calculations, edge cases, and accessibility.

**Decision**: Single test file `InstallmentTable.test.tsx` with comprehensive test groups covering all component states and behaviors. The existing `formatCurrency.test.ts` already covers currency formatting — no need to duplicate those tests.

**Rationale**: All tests for this component are DOM/rendering tests using React Testing Library. Unlike 003 which needed a separate utility test file, this feature reuses the existing `formatCurrency` utility without modification. A single test file organized by behavior group keeps tests discoverable and maintainable.

**Alternatives Considered**:
- **Separate test files per state (loading, error, data)**: Would fragment related tests. A single file with `describe` blocks is clearer.
- **Integration tests with App.tsx**: Useful but belong in a future integration testing phase per constitution workflow.
- **Snapshot tests**: Brittle for data-rich tables. Behavioral assertions (Testing Library queries) are more maintainable.

**Implementation Notes**:

Test groups (minimum 8 scenarios for SC-007):

1. **Pre-calculation state**: Renders placeholder message when `installments` is `null` and not loading
2. **Loading state**: Renders loading indicator when `isLoading` is true; replaces existing table
3. **Error state**: Renders error message and retry button; retry button calls `onRetry`
4. **Empty array state**: Renders "No payment schedule available" when `installments` is empty array
5. **Data rendering**: Renders correct number of rows; displays payment number, amounts in currency format, progress bars
6. **Summary row**: Displays totals with correct sums; visually distinct styling
7. **Data integrity warning**: Shows warning when final balance is not $0.00; no warning when balance is $0.00
8. **Accessibility**: Table caption present; `scope="col"` on headers; progress bars have `role="progressbar"` with `aria-valuenow`; warning has `role="alert"`
9. **Currency formatting**: All monetary values display `$X,XXX.XX` format
10. **Progress calculation**: Progress bars show correct percentage based on `originalLoanAmount`
11. **Interest highlighting**: Interest column cells have distinct styling class

TDD order:
1. Pre-calculation placeholder state (simplest)
2. Loading state
3. Error state with retry
4. Empty array state
5. Basic data rendering (one row)
6. Multi-row rendering with 12-month schedule
7. Currency formatting verification
8. Summary row with totals
9. Progress bar rendering and accessibility
10. Data integrity warning
11. Interest highlighting
12. Accessibility (caption, scope, ARIA)
