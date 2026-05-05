Generates the implementation task plan for the ui-redesign change by reading the already created artifacts: specs and design.

## Change Context
Complete redesign of the Loan Calculator UI based on the handoff design system. The backend remains unchanged. Only files in frontend/src/ are modified/replaced.

## Technology stack
- React 18 + Vite, JSX, vanilla CSS
- Styles: inline styles for components + global CSS classes in index.css/App.css
- Font: Inter via Google Fonts (already in index.html)
- No external UI libraries

## Existing files to replace
- frontend/src/App.jsx
- frontend/src/App.css
- frontend/src/index.css
- frontend/src/components/LoanInputForm.jsx + LoanInputForm.css
- frontend/src/components/PaymentDisplay.jsx + PaymentDisplay.css
- frontend/src/components/InstallmentTable.jsx + InstallmentTable.css
- frontend/src/components/ErrorBoundary.jsx + ErrorBoundary.css

## New files To create:
- frontend/src/components/Sidebar.jsx
- frontend/src/components/Field.jsx (CRITICAL: separate module)
- frontend/src/components/EmptyState.jsx
- frontend/src/components/PaymentTable.jsx (replaces InstallmentTable)
- frontend/src/components/Toast.jsx

## Dependency order for tasks:
1. Design tokens and global CSS (base of everything)
2. CSS animations (fadeUp, barFill, stagger classes)
3. Stateless components (Sidebar, Field, EmptyState)
4. Result components (PaymentDisplay, PaymentTable)
5. Toast notification
6. LoanForm (depends on Field)
7. App.jsx (integrates everything)
8. Responsive (final adjustments)
9. Cleanup (remove obsolete CSS files) of components)
10. Visual verification