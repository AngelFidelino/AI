Change name: ui-redesign

I want to completely redesign the Loan Calculator interface to match the design system in the handoff file, replacing the existing React components with a new UI based on the specified design tokens, layout, and animations. And add thousands and decimal separators to all numbers

## Context
- Existing application: React 18 + Vite, frontend on port 5173
- Existing backend remains unchanged (FastAPI on port 8000)
- Current components (LoanInputForm, PaymentDisplay, InstallmentTable, ErrorBoundary) will be replaced or completely rewritten
- Font: Inter (400, 500, 600, 700) via Google Fonts

## What I want to build

### Main layout
- 80px vertical sidebar with gradient #4f39f6 → #372aac (hidden at < 900px)
- Two-column layout: 389px form | 1fr results (collapses to 1 col on < 900px)
- App background: #f8fafc
- Primary padding: 48px 40px (shrink to 24px 20px on < 900px)

### Design tokens to implement
- --purple: #4f39f6 (primary action, button, gradient sidebar)
- --purple-dark: #372aac (hover button, gradient sidebar end)
- --gradient-total: linear-gradient(135deg, #615fff, #432dd7) (card Total Payment)
- --bg-app: #f8fafc
- --white: #ffffff (card backgrounds)
- --border: #e2e8f0
- --input-bg: #f3f3f5
- --text-primary: #0f172b
- --text-label: #314158
- --text-secondary: #62748e
- --text-placeholder: #717182
- --badge-interest-bg: #fffbeb / --badge-interest-text: #bb4d00
- --badge-total-bg: #fef3c6 / --badge-total-text: #973c00
- --toast-bg: #f0fdf4 / --toast-border: #bbf7d0

### Components to create/replace

**Sidebar**
- 80px wide, vertical gradient #4f39f6 → #372aac
- Centered calculator icon with rgba(255,255,255,0.10) background, 14px br

**Field** (CRITICAL: define at the module level, NOT within LoanForm)
- height 44px, br 8px, bg #f3f3f5
- Border default: 1.5px #e2e8f0 | focus: 1.5px #4f39f6 | error: 1.5px #ef4444
- Focus ring: 0 0 0 3px rgba(79,57,246,0.12)
- Transition: 150ms ease
- Placeholder color: #717182

**LoanForm**
- 3 Field fields: Loan Amount ($), Annual Interest Rate (%), Loan Term (months)
- Calculate button: height 44px, 100% width, bg #4f39f6, hover #3d29d4
- Disabled button: opacity 0.7, cursor not-allowed, text "Calculating…"
- Activate: scale(0.98) on mousedown

**EmptyState**
- Document icon in container #f1f5f9, br 16px, 80x80
- Title: "Ready to Calculate" 20px/600/#0f172b
- Description: 16px/400/#62748e

**PaymentDisplay**
- Card gradient (Total Payment): linear-gradient(135deg,#615fff,#432dd7), 
br 16px, p 24px 25px, number 36px/700/white, subtitle #e0e7ff
- White card (Monthly Payment): same structure but bg #fff, color number #1d293d
- Card Payment Breakdown: grid 1fr 1fr → 1fr @600px, stat boxes at #f8fafc br 14px, 
values ​​18px/700/#1d293d
- Dual progress bar: main at #615fff→#4f39f6, interest at #e0e7ff, 
animation barFill 700ms ease with 150ms delay

**PaymentTable** (replaces InstallmentTable)
- Pagination: 12 rows per page
- Table with min-width 600px and auto overflow-x
- Columns: Period | Principal | Interest | Balance | Progress
- Interest column: badge #fffbeb/#bb4d00, br 8px, 4px 10px
- Total Row: badge #fef3c6/#973c00, background linear-gradient(90deg,#f8fafc,#eef2ff)
- Hover row: background #fafbff, transition 100ms
- Progress column: mini progress bar 64x6px + percentage text

**Toast notification**
- Position: fixed top 24px right 24px
- Bg #f0fdf4, border 1px #bbf7d0, br 14px, p 14px 18px
- Green checkmark icon #22c55e, text #0d542b 14px/500
- × button to close (opacity 0.6 → 1.0 on hover, NO auto-dismiss)

### Animations
- @keyframes fadeUp: opacity 0→1, translateY 10px→0
- @keyframes barFill: width 0→target%
- .anim: 300ms / .anim1: 300ms 50ms / .anim2: 300ms 100ms / .anim3: 300ms 150ms
- Results appear with stagger in order: cards payment → breakdown → table

### Responsive
- < 900px: sidebar hidden, layout 1 column, padding 24px 20px
- < 600px: payment-grid 1 col, breakdown-grid 1 col, padding 20px 16px
- Table: overflow-x auto, min-width 600px

## Capabilities to specify
- ui-design-tokens: CSS variables with the complete color palette, typography (Inter), spacing, border-radius, and shadows of the design system
- ui-layout: Layout structure with sidebar, main-content, two-column grid

and responsive system with the 3 breakpoints (desktop/tablet/mobile)
- ui-components: Implementation of all React components (Sidebar, Field, LoanForm, EmptyState, PaymentDisplay, PaymentTable, Toast) with their inline styles

exactly following the handoff specs
- ui-animations: Animation system with fadeUp, barFill, and stagger classes

## Non-goals
- Changes in the backend (FastAPI remains unchanged)
- Changes in the loan calculation logic
- Changes in the API services layer (services/api.js)
- Introduce external UI libraries (Tailwind, MUI, etc.)
- Dark Mode