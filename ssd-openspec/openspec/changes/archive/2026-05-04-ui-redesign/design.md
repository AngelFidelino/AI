## Context

The Loan Calculator currently uses legacy React components with inconsistent styling and no design system. The application has a React 18 + Vite frontend (port 5173) and FastAPI backend (port 8000). The formal specifications document defines a complete UI redesign based on a design system handoff with precise design tokens, layout requirements, component specifications, and animation requirements. Current components (LoanInputForm, PaymentDisplay, InstallmentTable, ErrorBoundary) will be completely replaced.

## Goals / Non-Goals

**Goals:**
- Implement a complete design system with CSS variables and Inter typography (400, 500, 600, 700)
- Create responsive layout with 80px purple gradient sidebar and two-column content area (389px | 1fr)
- Build all React components following handoff specifications exactly with inline styles
- Add proper number formatting with thousands and decimal separators
- Implement fadeUp/barFill animations with stagger classes (.anim, .anim1, .anim2, .anim3)
- Ensure mobile-responsive behavior across three breakpoints (≥900px, 600-899px, <600px)
- Deploy animKey pattern to reset animations on loan recalculation

**Non-Goals:**
- No changes to backend FastAPI services
- No changes to loan calculation logic  
- No changes to API services layer
- No introduction of external UI libraries (Tailwind, MUI, etc.)
- Toast notifications with no auto-dismiss timer

## Decisions

**React Component Architecture:**
- Choose modular component structure with Field component defined at module level (not within LoanForm) to prevent React unmounting/losing focus
- Use inline styles for component-specific values and global CSS classes for animations/responsive grid
- Implement component state management locally to avoid Redux/context complexity
- Use animKey in results container to force React re-render and restart animations on recalculation

**CSS Architecture:**
- Use CSS variables for all design tokens (--purple, --purple-dark, --gradient-total, --bg-app, --border, --input-bg, --text-primary, --text-label, --text-secondary, --text-placeholder, --badge-interest-bg, --badge-interest-text, --badge-total-bg, --badge-total-text, --toast-bg, --toast-border)
- Load Inter font via Google Fonts CDN exactly as specified in handoff
- Implement responsive breakpoints at 900px and 600px with specific layout changes per formal specs
- Use CSS animations (fadeUp, barFill) instead of JavaScript libraries for performance
- Client-side pagination at 12 rows per page, no API changes

**Font Specifications:**
- Inter font weights: 400, 500, 600, 700 via Google Fonts
- Headings: font-weight 700 with letter-spacing -0.02em
- Form labels: font-size 14px / font-weight 500
- Table headers: font-size 12px / font-weight 600 / color #45556c

**Layout Strategy:**
- CSS Grid for main layout structure (80px sidebar + 389px|1fr main content with 24px gap)
- White cards: border-radius 16px, border 1px solid #e2e8f0, box-shadow 0 1px 2px rgba(0,0,0,0.08)
- Table: overflow-x auto, min-width 600px for horizontal scroll on mobile
- Responsive padding: 48px 40px (desktop), 24px (tablet), 20px 16px (mobile)

## Risks / Trade-offs

**[Performance Risk]** - inline styles may increase bundle size → Mitigation: Use style caching and minimize redundant style definitions
**[React State Risk]** - Field component state management across re-renders → Mitigation: Declare Field at module level as specified
**[Animation Reset Risk]** - animations don't restart on recalculation → Mitigation: Use animKey pattern to force React re-render
**[Browser Compatibility Risk]** - CSS Grid and modern CSS features → Mitigation: Implement fallbacks using flexbox where needed
**[Mobile Table Risk]** - horizontal scrolling behavior → Mitigation: Test min-width 600px and overflow-x auto thoroughly