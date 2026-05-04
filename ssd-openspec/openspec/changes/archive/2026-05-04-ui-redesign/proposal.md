## Why

The current Loan Calculator UI lacks modern design standards, suffers from inconsistent styling, and missing number formatting features. This redesign is needed to provide users with a professional, intuitive interface that follows established design patterns and improves the overall user experience with proper number formatting.

## What Changes

- Complete visual redesign of the Loan Calculator interface using a new design system with purple gradient sidebar
- Replace all existing React components (LoanInputForm, PaymentDisplay, InstallmentTable, ErrorBoundary) with new implementations using inline styles
- Implement comprehensive design tokens and CSS variables for consistent styling with Inter font
- Add thousands and decimal separators to all numeric displays
- Create responsive layout with sidebar navigation and two-column content area
- Implement fadeUp and barFill animations with staggered animation classes
- Add toast notifications for user feedback without auto-dismiss
- Create paginated payment table with progress indicators and horizontal scroll on mobile

## Capabilities

### New Capabilities
- `ui-design-tokens`: CSS variable system with complete color palette (purple, purple-dark, gradient-total, bg-app, border, input-bg, text-primary, text-label, text-secondary, text-placeholder, badge-interest-bg, badge-interest-text, badge-total-bg, badge-total-text, toast-bg, toast-border), Inter typography (400, 500, 600, 700), and spacing scale
- `ui-layout`: Layout structure with 80px sidebar, main content grid (389px | 1fr), and responsive system with 3 breakpoints (desktop ≥900px, tablet 600-899px, mobile <600px)
- `ui-components`: Implementation of all React components (Sidebar, Field, LoanForm, EmptyState, PaymentDisplay, PaymentTable, Toast) with exact styles and states following handoff specifications
- `ui-animations`: CSS animation system with fadeUp, barFill keyframes and stagger classes (.anim, .anim1, .anim2, .anim3) for displaying results with 300ms base duration and progressive delays

### Modified Capabilities
- None (backend, API services, and calculation logic remain unchanged)

## Impact

- Frontend components will be completely replaced React components
- CSS styling will be updated with inline styles for component-level values and global CSS classes for animations/responsive grid
- Responsive behavior will be enhanced across 3 breakpoints with specific layout changes
- Number formatting will be standardized across the application
- User interaction patterns will be improved with animations and feedback
- Field component will be declared at module level to prevent React unmounting/losing focus
- Results animations will reset on loan recalculation using animKey
- No backend changes required - FastAPI remains unchanged
- No changes to loan calculation logic or API services layer