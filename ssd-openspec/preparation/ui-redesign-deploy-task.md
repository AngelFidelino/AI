Additional context to avoid known errors:

1. The Field component MUST be in its own file, frontend/src/components/Field.jsx, and imported by LoanForm—NEVER declared inside LoanForm.jsx.

If declared inside, React unmounts/remounts it on every render, and the input loses focus when typing.

2. Styles are applied as inline styles in JSX components, NOT in separate CSS files for each component. Only index.css contains the global classes:

.anim, .anim1, .anim2, .anim3, @keyframes fadeUp, @keyframes barFill,

.main-layout, .payment-grid, .breakdown-grid, .sidebar, .main-content,

and the @media queries.

3. When recalculating, App.jsx uses `animKey` as a key prop in the results container to force a remount and restart animations.

4. PaymentTable page on the client: 12 rows per page; the page state is reset when new rows are received via props.