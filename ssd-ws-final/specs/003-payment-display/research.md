# Research: Payment Display

**Feature**: 003-payment-display
**Date**: 2026-04-15

## Research Tasks

All technology choices are established from prior features (001-loan-calculation-api, 002-loan-input-form) and `preparation/technical.md`. No NEEDS CLARIFICATION items in Technical Context. Research below covers best practices for component design, currency formatting, accessibility, and responsive layout specific to this display-only component.

---

## 1. US Currency Formatting Strategy

**Context**: FR-004 requires all monetary values formatted as US currency with dollar sign, comma thousands separators, and exactly 2 decimal places (e.g., "$10,272.84"). The component must handle values up to $999,999.99 (FR-012).

**Decision**: Use `Intl.NumberFormat` with `en-US` locale and `currency: 'USD'` style, encapsulated in a reusable `formatCurrency` utility function.

**Rationale**: `Intl.NumberFormat` is a browser-native API that handles locale-aware currency formatting including the dollar sign, thousands separators, and decimal places automatically. It's zero-dependency, performant, and handles edge cases (e.g., $0.00, large numbers) correctly. Extracting it into a utility function (`utils/formatCurrency.ts`) enables independent unit testing and reuse by future components (e.g., InstallmentTable).

**Alternatives Considered**:
- **`Number.toFixed(2)` + manual formatting**: Works but requires manual comma insertion. Error-prone for edge cases and doesn't produce the dollar sign.
- **Third-party library (accounting.js, currency.js)**: Adds a dependency for a problem fully solved by the native API. Overkill for this scope.
- **Inline formatting in component**: Would duplicate logic if other components need currency formatting. Violates DRY.

**Implementation Notes**:
```typescript
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
```
- The formatter instance is created once (module-level singleton) for performance.
- Output: `formatCurrency(10272.84)` → `"$10,272.84"`
- Edge cases: `formatCurrency(0)` → `"$0.00"`, `formatCurrency(999999.99)` → `"$999,999.99"`

---

## 2. Props Interface Design — Field Naming Convention

**Context**: The spec states the props should use `monthlyPayment`, `totalPayment`, `totalInterest`, `principal` (camelCase). However, the existing `LoanResult` interface from 002 uses snake_case (`monthly_payment`, `total_payment`, `total_interest`), and `principal` is not part of the API response — it's passed from parent form state.

**Decision**: Define a new `PaymentDisplayProps` interface with camelCase field names as specified, and have the parent (`App.tsx`) map from the existing `LoanResult` (snake_case) + form state to this interface. The `PaymentDisplay` component receives a `data` prop of type `PaymentDisplayData | null`.

**Rationale**: The spec explicitly mandates camelCase field names (`monthlyPayment`, `totalPayment`, `totalInterest`, `principal`). The mapping responsibility belongs in the parent component — the integration point between the API data model (snake_case) and the component contract (camelCase). This keeps `PaymentDisplay` independent of the API response shape and testable with simple camelCase props.

**Alternatives Considered**:
- **Use snake_case props directly from LoanResult**: Violates the spec's explicit field naming requirement. Would also couple the component to the API response shape.
- **Transform in a service/adapter layer**: Adds unnecessary indirection for a single mapping point. The parent component is the natural location for this transformation.
- **Add camelCase aliases to LoanResult**: Would create a confusing hybrid interface mixing conventions.

**Implementation Notes**:
```typescript
interface PaymentDisplayData {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
}

interface PaymentDisplayProps {
  data: PaymentDisplayData | null;
}
```
- Parent mapping in `App.tsx`:
```tsx
<PaymentDisplay
  data={result ? {
    monthlyPayment: result.monthly_payment,
    totalPayment: result.total_payment,
    totalInterest: result.total_interest,
    principal: loanAmount,  // from form state
  } : null}
/>
```

---

## 3. Card-Based Layout Design

**Context**: The spec requires a card-based layout (FR-011) with visual hierarchy: monthly payment most prominent, followed by total payment (featured card), then breakdown details (FR-010). The styling guide (`preparation/styling.md`) defines specific card designs.

**Decision**: Three-card layout structure following the styling guide:
1. **Monthly Payment card** (white background, large prominent number)
2. **Total Payment card** (featured, purple gradient background, white text)
3. **Payment Breakdown card** (white background, two-column showing principal and total interest)

**Rationale**: Directly follows the styling guide specifications and satisfies the visual hierarchy requirement (FR-010). The featured card (total payment) uses the purple gradient to draw attention to the overall cost. The monthly payment uses large display numbers for immediate identification (SC-001). The breakdown card groups related supplementary information.

**Alternatives Considered**:
- **Single card with all data**: Doesn't satisfy the card-based layout requirement (FR-011) or the visual hierarchy (FR-010).
- **Four separate cards (one per metric)**: Possible but the spec groups principal and total interest as a "breakdown" (User Story 3), suggesting they belong together.
- **Tab-based interface**: Violates FR-009 (no user interactions) and hides information that should be simultaneously visible (SC-003).

**Implementation Notes**:
- Monthly Payment card: Dollar sign icon (top right), "Monthly Payment" label, 48px bold amount, description text
- Total Payment card: Purple gradient (#5B4FFF), trend icon (top right), "Total Payment" label, 48px bold white amount, "Over loan lifetime" subtitle
- Payment Breakdown card: "Payment Breakdown" header, two-column layout — "Principal Amount" (left) + "Total Interest" (right)
- All cards: 16px border radius, consistent 24-32px internal padding, 24px gap between cards

---

## 4. Responsive Layout Strategy for Cards

**Context**: FR-007 requires three breakpoints. FR-008 requires the component to display in the main content area beside the form on desktop/tablet, and below the form on mobile. The parent `App.tsx` already handles the sidebar/main grid layout.

**Decision**: CSS Grid within the `PaymentDisplay` component for card arrangement, with media queries adapting the grid at each breakpoint. The component fills the `<main>` area managed by the parent layout.

**Rationale**: The parent `App.tsx` already manages the two-column (sidebar + main) / single-column (mobile) grid. The `PaymentDisplay` component only needs to arrange its internal cards appropriately for the available width at each breakpoint:
- **Desktop (>= 1024px)**: Cards use available horizontal space — monthly payment and total payment side by side, breakdown below
- **Tablet (768–1023px)**: Narrower main area — cards adapt, potentially stacking more
- **Mobile (< 768px)**: Single-column stacked cards

**Alternatives Considered**:
- **Flexbox-only**: Works for simple layouts but CSS Grid provides more control over two-dimensional card arrangement.
- **Container queries**: Modern alternative to media queries based on parent container width. Better conceptually for components, but browser support is not universal for all target environments. Media queries are safer.
- **No internal grid (always stack)**: Would waste horizontal space on desktop where cards could be side-by-side.

**Implementation Notes**:
- Desktop: `grid-template-columns: 1fr 1fr` for first two cards, full-width breakdown below
- Tablet: Same approach but cards may be narrower, still side-by-side
- Mobile: `grid-template-columns: 1fr` — all cards stack vertically
- Monthly payment card always appears first in the visual flow for prominence

---

## 5. Accessibility Implementation

**Context**: FR-013 requires semantic HTML with `aria-label` on card regions and `aria-live="polite"` on the results container. The clarification session confirmed "Semantic HTML with ARIA labels and aria-live for updates."

**Decision**: Use `<section>` elements with `aria-label` for each card, wrap the results container in a `<div>` with `aria-live="polite"`, and use proper heading hierarchy.

**Rationale**: `aria-live="polite"` announces content changes to screen readers without interrupting the user's current action — appropriate for calculation results that update after form submission. `<section>` with `aria-label` creates navigable landmarks for screen reader users. Semantic headings (`<h2>`, `<h3>`) provide document structure.

**Alternatives Considered**:
- **`aria-live="assertive"`**: Would interrupt the user immediately. Too aggressive for a result update triggered by explicit user action.
- **`role="region"` instead of `<section>`**: Functionally equivalent, but `<section>` is the semantic HTML element and is preferred per accessibility best practices.
- **No ARIA attributes**: Would fail FR-013 and reduce accessibility for screen reader users.

**Implementation Notes**:
- Outer container: `<div aria-live="polite">` wrapping the entire results area
- Each card: `<section aria-label="Monthly Payment">`, `<section aria-label="Total Payment">`, `<section aria-label="Payment Breakdown">`
- Heading hierarchy: `<h2>` for the component title (if any), `<h3>` for individual card labels
- Placeholder state: Semantic `<p>` element with descriptive text

---

## 6. Placeholder State Design

**Context**: FR-005 requires a placeholder message when no calculation data is available. The component must not be hidden entirely to prevent layout shift. The existing `App.tsx` already has a `results-placeholder` class with dashed border styling.

**Decision**: Render a styled placeholder `<section>` with the message "Calculate a loan to see results" when `data` is `null`. The placeholder occupies the same layout area as the results to prevent layout shift.

**Rationale**: Keeping the component always rendered (with either placeholder or results) prevents layout shift when results arrive (FR-005). The dashed-border style already established in `App.css` provides a visual cue that this area will be populated. The message directly tells the user what action to take.

**Alternatives Considered**:
- **Hide the component entirely (`display: none`)**: Violates FR-005 — would cause layout shift when results appear.
- **Show empty cards with dashes or zeros**: Could confuse users into thinking a calculation has occurred with zero values.
- **Skeleton/shimmer loading state**: Overkill — the spec doesn't require a loading state for this component (FR-006 says keep previous results visible; the LoanForm handles its own loading indicator).

**Implementation Notes**:
- When `data` is `null`: render placeholder section with dashed border, centered text
- When `data` is provided: render the three-card layout
- The `aria-live="polite"` container wraps both states, so screen readers are notified when transitioning from placeholder to results

---

## 7. Data Update Strategy (Recalculation)

**Context**: FR-006 requires that during recalculation, previous results remain visible until new data arrives. No loading spinner or overlay is required. User Story 5 (P5) requires smooth updates without visual glitches.

**Decision**: React's natural re-render behavior handles this correctly. Since the component receives `data` as a prop, and the parent only updates `data` when the new API response arrives, the previous results remain visible during the API call. No additional state management needed.

**Rationale**: The existing architecture already satisfies this requirement:
1. User submits new calculation → LoanForm shows "Calculating..." (its own loading state)
2. PaymentDisplay continues showing previous `data` prop (unchanged)
3. API responds → parent updates `data` → PaymentDisplay re-renders with new values
4. No intermediate `null` state during recalculation

**Alternatives Considered**:
- **Add loading overlay on PaymentDisplay**: Spec explicitly says no loading spinner/overlay is required (FR-006).
- **Clear data on recalculation start**: Would violate FR-006 — user would see placeholder during API call.
- **Use transition animations**: Nice UX but not in spec scope. Could be added later without architectural changes.

**Implementation Notes**:
- The parent (`App.tsx`) should NOT set `result` to `null` when a new calculation starts
- The parent should only update `result` when the new `LoanResult` arrives
- This is already the behavior in the existing `App.tsx` (`handleCalculate` only sets state on success)
- Tests should verify: render with data A → update props to data B → verify all four metrics reflect data B

---

## 8. Component Testing Strategy

**Context**: Constitution Principle III mandates TDD. SC-008 requires all behavior verified by automated tests. The project uses Vitest + React Testing Library.

**Decision**: Two test files following TDD:
1. `formatCurrency.test.ts` — Unit tests for the currency formatting utility
2. `PaymentDisplay.test.tsx` — Component tests for rendering, formatting, placeholder state, data updates, and accessibility

**Rationale**: Separating the formatting utility tests from the component tests follows the same pattern established in 002 (validation utility tests separate from component tests). The formatting utility is a pure function that can be tested exhaustively without DOM rendering. Component tests use React Testing Library to verify behavior from the user's perspective.

**Alternatives Considered**:
- **Single test file**: Would mix pure function tests with component tests. Less organized.
- **Visual regression tests (Storybook, Chromatic)**: Not in the project's testing stack. Unit and component tests are sufficient for this scope.
- **E2E tests (Cypress, Playwright)**: Integration testing is planned for a later phase per the constitution.

**Implementation Notes**:
- `formatCurrency.test.ts` test cases:
  - Basic formatting: `1234.56` → `"$1,234.56"`
  - Zero value: `0` → `"$0.00"`
  - Large value: `999999.99` → `"$999,999.99"`
  - Rounding: `850.1` → `"$850.10"` (always 2 decimal places)
  - Small value: `0.01` → `"$0.01"`
- `PaymentDisplay.test.tsx` test cases:
  - Renders placeholder when `data` is null
  - Renders monthly payment with correct formatting
  - Renders total payment in featured card
  - Renders principal and total interest in breakdown
  - All values use correct currency formatting
  - Updates all values when data changes
  - Mathematical consistency (principal + interest = total)
  - ARIA attributes present (`aria-label` on sections, `aria-live` on container)
  - Placeholder disappears when data is provided
  - Reverts to placeholder when data is set to null
- TDD order:
  1. `formatCurrency` utility (pure function, easiest)
  2. `PaymentDisplay` placeholder state
  3. `PaymentDisplay` data rendering
  4. `PaymentDisplay` data updates
  5. `PaymentDisplay` accessibility
