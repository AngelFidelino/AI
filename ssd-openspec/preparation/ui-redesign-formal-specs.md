Change Name: ui-redesign

## Proposal (Executive Summary)
Completely redesign the Loan Calculator interface to implement the handoff design system: purple gradient sidebar, two-column layout, React components with inline styles, fadeUp/barFill animations, and a responsive system with 3 breakpoints.

## Capabilities to Specify

### 1. ui-design-tokens
CSS variable system with the complete color palette, typography, and spacing scale of the design system.

Requirements:
- The variable `--purple` must be defined as the primary action color.
- `--purple-dark` must be defined for hover and sidebar gradient ends.
- `--gradient-total` must be defined for the Total Payment card.
- `--bg-app` must be defined as the page background.
- `--border` must be defined for card, input, and table borders.
- `--input-bg` must be defined for input field backgrounds.
- `--text-primary` must be defined for headers and balance values.
- `--text-label` must be defined for card, form, and table labels.
- `--text-secondary` must be defined for descriptions and... Subtitles
- You MUST define `--text-placeholder: #717182` for input placeholders
- You MUST define `--badge-interest-bg: #fffbeb` and `--badge-interest-text: #bb4d00` for row interest badges
- You MUST define `--badge-total-bg: #fef3c6` and `--badge-total-text: #973c00` for total row badges
- You MUST define `--toast-bg: #f0fdf4` and `--toast-border: #bbf7d0` for success notifications
- You MUST use the Inter font (400, 500, 600, 700) loaded via Google Fonts
- When rendering headings, then use `font-weight 700` and `letter-spacing -0.02em`
- When rendering form labels, then use `font-size 14px` / font-weight 500
- WHEN table headers are rendered, THEN use font-size 12px / font-weight 600 / color #45556c

### 2. ui-layout
Layout structure with sidebar, main content, two-column grid, and a responsive system with 3 breakpoints.


Requirements:
- There MUST be an 80px wide sidebar with a vertical gradient from #4f39f6 to #372aac
- The main layout MUST use a display grid with 389px columns and 1fr spacing and a 24px gap
- The main content MUST have 48px padding and 40px spacing between sections
- When the viewport is < 900px, the sidebar is hidden (display:none)
- When the viewport is < 900px, the grid collapses to 1 column
- When the viewport is < 900px, the padding is reduced to 24px
- When the viewport is < 600px, the payment grid collapses to 1 column
- When the viewport is < 600px, the breakdown grid collapses to 1 column
- When the viewport is < 600px, THEN the padding is reduced to 20px 16px
- White cards MUST have border-radius 16px, border 1px solid #e2e8f0 and box-shadow 0 1px 2px rgba(0,0,0,0.08)
- The table MUST have overflow-x auto and min-width 600px for horizontal scrolling on mobile

### 3. ui-components
Implementation of all React components with their exact styles and states
of the design system.

Requirements:

**Sidebar:**
- WHEN the sidebar renders, THEN it displays a calculator icon in a 48x48 container with a background of rgba(255,255,255,0.10) and a border-radius of 14px.

**Field (CRITICAL):**
- The Field component MUST be declared at the module level, NEVER within LoanForm.
- WHEN the input has focus, THEN the border changes to 1.5px #4f39f6 with a focus ring of 0 0 0 and a 3px rgba(79,57,246,0.12).
- WHEN the field has an error and has been touched, THEN the border changes to 1.5px #ef4444.
- WHEN the field is idle, THEN the border is 1.5px #e2e8f0.
- All border and shadow transitions MUST be 150ms. ease

**LoanForm:**
- MUST have 3 fields: "Loan Amount ($)", "Annual Interest Rate (%)", "Loan Term (months)"
- WHEN the form is submitted with errors, THEN all fields display their errors
- WHEN the button is disabled, THEN display the text "Calculating…" with an opacity of 0.7
- WHEN the mousedown occurs on the button, THEN apply the transform scale(0.98)

**EmptyState:**
- WHEN there are no results, THEN display a document icon in an 80x80 box / #f1f5f9 / br 16px
- WHEN there are no results, THEN display the title "Ready to Calculate" 20px/600

**PaymentDisplay:**
- WHEN the calculation is successful, THEN the Total Payment card displays the gradient linear-gradient(135deg,#615fff,#432dd7)
- WHEN the calculation is successful, THEN the Monthly Payment card displays a white background with a number at #1d293d / 36px / 700
- WHEN Payment Breakdown is rendered, THEN it displays stat boxes with a background of #f8fafc and a border-radius of 14px
- WHEN the progress bar is rendered, THEN the main section uses the gradient #615fff → #4f39f6 and the interest section uses #e0e7ff

**PaymentTable:**
- MUST display 12 rows per page with pagination
- WHEN an interest cell is rendered, THEN it uses a badge with a background of #fffbeb / color of #bb4d00 / br 8px / padding 4px 10px
- WHEN the Total row is rendered, THEN the badge of interest uses bg #fef3c6 / color #973c00 / font-weight 700
- WHEN the Total row is rendered, THEN the background is linear-gradient(90deg,#f8fafc,#eef2ff)
- WHEN the cursor is over a row, THEN the background changes to #fafbff with a 100ms transition
- WHEN the Progress column is rendered, THEN it displays a 64x6px mini progress bar plus percentage text

**Toast:**
- WHEN the calculation is complete, THEN a notification appears fixed at top 24px / right 24px
- WHEN the user clicks the ×, THEN the notification closes
- The notification MUST NOT automatically disappear (no auto-dismiss timer)
- WHEN the cursor is over the ×, THEN the opacity changes from 0.6 Version 1.0

### 4. ui-animations
CSS animation system with fadeUp, barFill, and stagger classes for displaying results.


Requirements:
- MUST exist: @keyframes fadeUp: opacity 0→1, translateY 10px→0
- MUST exist: @keyframes barFill: width 0→target%
- MUST exist: .anim class with animation: fadeUp 300ms ease 0ms
- MUST exist: .anim1 class with animation: fadeUp 300ms ease 50ms
- MUST exist: .anim2 class with animation: fadeUp 300ms ease 100ms
- MUST exist: .anim3 class with animation: fadeUp 300ms ease 150ms
- WHEN the results appear, THEN the cards use stagger: .anim → .anim1 → .anim2 → .anim3
- WHEN the progress bar appears, THEN it uses barFill animation: 700ms ease with 150ms delay
- WHEN the toast It appears, THEN use fadeUp 250ms ease
- WHEN the loan is recalculated, THEN the results component is reset with animKey to restart the animations

## Design Decisions
- **Inline Styles vs CSS Classes**: Inline styles are used for dynamic and component-specific values; Global CSS classes for animations, resets, and responsive grid — reason: consistency with the original handoff that uses this mixed pattern
- **Font Inter via CDN**: Loaded from Google Fonts just like in the handoff — discarded alternative: self-hosted (unnecessary for PoC)
- **Field at module level**: Declared outside of LoanForm to prevent React from unmounting/remounting the input on each re-render and losing focus while typing — this is a critical requirement of the handoff
- **Client-side pagination**: The table paginates the data on the client at a rate of 12 rows/page — no changes to the API
- **animKey for animation reset**: On recalculation, a key is incremented in the results container so that React forces the re-render and the animations restart