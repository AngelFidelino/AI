## 1. Design Tokens Foundation

- [x] 1.1 Create CSS variables file with all required tokens (--purple, --purple-dark, --gradient-total, --bg-app, --border, --input-bg, --text-primary, --text-label, --text-secondary, --text-placeholder, --badge-interest-bg, --badge-interest-text, --badge-total-bg, --badge-total-text, --toast-bg, --toast-border)
- [x] 1.2 Set up Google Fonts integration for Inter font (400, 500, 600, 700 weights)
- [x] 1.3 Define font specifications: headings (700 weight, -0.02em letter-spacing), form labels (14px/500), table headers (12px/600/#45556c)
- [x] 1.4 Implement number formatting utility function (US format: comma separators, 2 decimal places)

## 2. Layout Grid System

- [x] 2.1 Create 80px wide sidebar with vertical gradient #4f39f6 → #372aac
- [x] 2.2 Implement main layout grid: display grid with 389px | 1fr columns, 24px gap
- [x] 2.3 Set up white card styling: border-radius 16px, border 1px solid #e2e8f0, box-shadow 0 1px 2px rgba(0,0,0,0.08)
- [x] 2.4 Add responsive breakpoints: desktop ≥900px (48px 40px padding), tablet 600-899px (sidebar hidden, 1 column, 24px padding), mobile <600px (sidebar hidden, 20px 16px padding)
- [x] 2.5 Implement table overflow-x auto with min-width 600px for horizontal scroll on mobile

## 3. Core Field Component

- [x] 3.1 Implement Field component at module level (CRITICAL: not within LoanForm)
- [x] 3.2 Add Field states: idle (1.5px #e2e8f0 border), focus (1.5px #4f39f6 border + 0 0 0 3px rgba(79,57,246,0.12) focus ring), error (1.5px #ef4444 border)
- [x] 3.3 Set 150ms ease transition for all border and shadow changes
- [x] 3.4 Add #717182 placeholder color and 44px height with 8px radius

## 4. Form Implementation

- [x] 4.1 Create LoanForm component with exactly 3 fields: "Loan Amount ($)", "Annual Interest Rate (%)", "Loan Term (months)"
- [x] 4.2 Implement calculate button with mousedown scale(0.98) transform
- [x] 4.3 Add disabled state with "Calculating…" text and 0.7 opacity
- [x] 4.4 Implement form validation with error display for all fields when submitted
- [x] 4.5 Connect form to existing API service without modifications

## 5. Sidebar Component

- [x] 5.1 Create sidebar with 80px width and gradient #4f39f6 → #372aac
- [x] 5.2 Add calculator icon in 48x48 container with rgba(255,255,255,0.10) background and 14px radius
- [x] 5.3 Implement responsive visibility: show on ≥900px, display:none on <900px

## 6. EmptyState Component

- [x] 6.1 Create document icon in 80x80 container with #f1f5f9 background and 16px radius
- [x] 6.2 Add "Ready to Calculate" title with 20px/600 styling
- [x] 6.3 Implement conditional display when no results exist

## 7. PaymentDisplay Components

- [x] 7.1 Create Total Payment card with gradient linear-gradient(135deg,#615fff,#432dd7)
- [x] 7.2 Create Monthly Payment card with white background and #1d293d color for numbers (36px/700)
- [x] 7.3 Implement Payment Breakdown with #f8fafc background stat boxes and 14px radius
- [x] 7.4 Create dual progress bars: main gradient #615fff → #4f39f6, interest section #e0e7ff
- [x] 7.5 Apply number formatting to all monetary values

## 8. PaymentTable Implementation

- [x] 8.1 Create table with columns: Period | Principal | Interest | Balance | Progress
- [x] 8.2 Implement client-side pagination (12 rows per page)
- [x] 8.3 Add interest column badges: background #fffbeb, color #bb4d00, radius 8px, padding 4px 10px
- [x] 8.4 Create Total row with interest badge: background #fef3c6, color #973c00, font-weight 700
- [x] 8.5 Add Total row background linear-gradient(90deg,#f8fafc,#eef2ff)
- [x] 8.6 Implement Progress column with 64x6px mini progress bar plus percentage text
- [x] 8.7 Add row hover: background #fafbff with 100ms transition

## 9. Animation System

- [x] 9.1 Create @keyframes fadeUp: opacity 0→1, translateY 10px→0
- [x] 9.2 Create @keyframes barFill: width 0→target%
- [x] 9.3 Implement stagger classes: .anim (300ms ease 0ms), .anim1 (300ms ease 50ms), .anim2 (300ms ease 100ms), .anim3 (300ms ease 150ms)
- [x] 9.4 Add toast animation: fadeUp 250ms ease
- [x] 9.5 Implement barFill animation: 700ms ease with 150ms delay
- [x] 9.6 Set up results animation sequence: .anim → .anim1 → .anim2 → .anim3

## 10. Toast Component

- [x] 10.1 Create toast component fixed at top 24px right 24px
- [x] 10.2 Add styling: background #f0fdf4, border 1px #bbf7d0, radius 14px, padding 14px 18px
- [x] 10.3 Implement close button × with opacity 0.6 → 1.0 on hover
- [x] 10.4 Ensure NO auto-dismiss timer (manual close only)
- [x] 10.5 Connect toast to calculation completion events

## 11. Animation Reset System

- [x] 11.1 Implement animKey state in results container
- [x] 11.2 Increment animKey on loan recalculation to force React re-render
- [x] 11.3 Ensure animations restart properly when animKey changes

## 12. Component Integration

- [x] 12.1 Replace existing LoanInputForm with new LoanForm using Field component
- [x] 12.2 Replace existing PaymentDisplay component with new implementation
- [x] 12.3 Replace existing InstallmentTable with new PaymentTable
- [x] 12.4 Remove ErrorBoundary component (no longer needed)
- [x] 12.5 Update main App component to use new layout with sidebar and responsive grid

## 13. Final Testing

- [x] 13.1 Test all three breakpoints: desktop ≥900px, tablet 600-899px, mobile <600px
- [x] 13.2 Verify Field component maintains focus (verify module-level declaration)
- [x] 13.3 Test number formatting across all monetary displays
- [x] 13.4 Verify animation sequences and reset behavior with animKey
- [x] 13.5 Test toast manual close functionality (no auto-dismiss)
- [x] 13.6 Validate API integration remains unchanged
- [x] 13.7 Test table horizontal scroll on mobile with min-width 600px