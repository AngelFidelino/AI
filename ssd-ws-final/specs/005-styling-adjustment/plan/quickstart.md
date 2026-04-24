# Quickstart Guide: Styling Adjustment Feature

**Feature**: 005-styling-adjustment  
**Date**: April 24, 2026  
**Phase**: 1 - Design & Contracts

## Feature Overview

This guide provides quick setup and implementation instructions for the styling adjustment feature, which adds three UI enhancements to the loan calculator:

1. **Card Layout Reorder**: Swap Total Payment and Monthly Payment card positions
2. **Vertical Toolbar**: Persistent purple navigation sidebar (76px) with calculator icon
3. **Toast Notifications**: Success/error message system with auto-dismiss

## Prerequisites

### Development Environment
- Node.js 16.x+ or Python 3.12+ (depending on stack)
- pnpm package manager (frontend)
- Modern web browser with CSS Grid support
- VS Code or preferred code editor

### Existing Project Structure
```
loan-calculator/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── PaymentDisplay.jsx
│   │   │   └── LoanForm.jsx
│   │   ├── App.jsx
│   │   └── styles/
│   └── package.json
├── backend/               # FastAPI (unchanged)
└── README.md
```

## Quick Implementation Steps

### 1. Create Toast System

**Step 1.1**: Create Toast context and provider

```javascript
// src/components/Toast/ToastContext.jsx
import React, { createContext, useState, useCallback } from 'react';

type ToastType = 'info' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContext {
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
  toasts: Toast[];
}

export const ToastContext = createContext<ToastContext | null>(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = new Map();

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }, []);

  const showToast = useCallback((type, message) => {
    const id = crypto.randomUUID();
    const duration = type === 'error' ? 6000 : 4000;

    setToasts(prev => {
      const next = [...prev, { id, type, message }];
      return next.length > 3 ? next.slice(-3) : next;
    });

    const timer = setTimeout(() => dismissToast(id), duration);
    timers.set(id, timer);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
```

**Step 1.2**: Create Toast component

```jsx
// src/components/Toast/ToastContainer.jsx
import React from 'react';
import './Toast.css';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
        >
          <span className="toast-icon">
            {toast.type === 'info' ? '✓' : '!'}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-dismiss"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Step 1.3**: Create Toast CSS

```css
/* src/components/Toast/Toast.css */
.toast-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  max-width: 480px;
  padding: 14px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  animation: toast-enter 0.3s ease-out;
}

.toast-info {
  background-color: #16A34A;
}

.toast-error {
  background-color: #DC2626;
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.toast-message {
  flex: 1;
}

.toast-dismiss {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
}

@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 767px) {
  .toast-container {
    left: 16px;
    right: 16px;
    transform: none;
  }
  .toast {
    min-width: unset;
    max-width: unset;
    width: 100%;
  }
}
```

### 2. Create Vertical Toolbar

**Step 2.1**: Create Toolbar component

```jsx
// src/components/VerticalToolbar.jsx
import React from 'react';
import './VerticalToolbar.css';

export function VerticalToolbar({ onLoanSimulatorClick, isActive = false }) {
  const handleClick = () => {
    const form = document.getElementById('loan-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    }
    if (onLoanSimulatorClick) onLoanSimulatorClick();
  };

  return (
    <nav
      className={`vertical-toolbar ${isActive ? 'is-active' : ''}`}
      role="navigation"
      aria-label="Application navigation"
    >
      <button
        className="toolbar-icon-btn"
        aria-label="Go to Loan Simulator"
        tabIndex={0}
        onClick={handleClick}
        title="Loan Simulator"
      >
        {/* Calculator icon SVG */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="8" y2="10" />
          <line x1="12" y1="10" x2="12" y2="10" />
          <line x1="16" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="8" y2="14" />
          <line x1="12" y1="14" x2="12" y2="14" />
          <line x1="16" y1="14" x2="16" y2="14" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
      </button>
    </nav>
  );
}
```

**Step 2.2**: Create Toolbar CSS

```css
/* src/components/VerticalToolbar.css */
.vertical-toolbar {
  position: fixed;
  left: 0;
  top: 0;
  width: 76px;
  height: 100vh;
  background-color: #5B4FFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  z-index: 100;
}

.toolbar-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.toolbar-icon-btn:hover,
.toolbar-icon-btn:focus-visible {
  background: rgba(255, 255, 255, 0.15);
  outline: none;
}

.toolbar-icon-btn:focus-visible {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
}

.vertical-toolbar.is-active .toolbar-icon-btn {
  background: rgba(255, 255, 255, 0.20);
}

/* App must have padding-left to avoid overlap */
.app-shell {
  padding-left: 76px;
}

@media (max-width: 767px) {
  .vertical-toolbar {
    width: 56px;
  }
  .toolbar-icon-btn svg {
    width: 24px;
    height: 24px;
  }
  .app-shell {
    padding-left: 56px;
  }
}
```

### 3. Modify PaymentDisplay Component

**Step 3.1**: Update PaymentDisplay CSS Grid

```css
/* Update existing PaymentDisplay.css */
.payment-display-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* Total Payment - LEFT column */
.card-total-payment {
  grid-column: 1;
}

/* Monthly Payment - RIGHT column */
.card-monthly-payment {
  grid-column: 2;
}

/* Payment Breakdown - full width below */
.card-payment-breakdown {
  grid-column: 1 / -1;
}

@media (max-width: 767px) {
  .payment-display-grid {
    grid-template-columns: 1fr;
  }
  .card-total-payment,
  .card-monthly-payment,
  .card-payment-breakdown {
    grid-column: 1;
  }
}
```

### 4. Integrate Components

**Step 4.1**: Update App.jsx root component

```jsx
// src/App.jsx
import React from 'react';
import { ToastProvider } from './components/Toast/ToastContext';
import { VerticalToolbar } from './components/VerticalToolbar';
import PaymentDisplay from './components/PaymentDisplay';
import LoanForm from './components/LoanForm';
import './styles/App.css';

const App = () => {
  const handleScrollToLoanForm = () => {
    console.log('Scrolled to loan form');
  };

  return (
    <ToastProvider>
      <div className="app-shell">
        <VerticalToolbar 
          onLoanSimulatorClick={handleScrollToLoanForm}
        />
        <main className="main-content">
          <LoanForm />
          <PaymentDisplay />
        </main>
      </div>
    </ToastProvider>
  );
};

export default App;
```

**Step 4.2**: Add toast triggers to LoanForm

```jsx
// Update existing LoanForm.jsx
import React from 'react';
import { useToast } from './components/Toast/ToastContext';
import './LoanForm.css';

export function LoanForm() {
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Existing form submission logic
      const result = await submitLoanData(formData);
      
      // Add success toast
      showToast('info', 'Calculation completed successfully');
      
    } catch (error) {
      // Add error toast
      showToast('error', `Calculation failed: ${error.message}`);
    }
  };

  return (
    // Existing form JSX
    <form id="loan-form" onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

**Step 4.3**: Create useToast hook

```jsx
// src/hooks/useToast.jsx
import { useContext } from 'react';
import { ToastContext } from '../components/Toast/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
```

## Testing Setup

### Component Tests

```jsx
// src/tests/toast.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../components/Toast/ToastContext';

describe('Toast System', () => {
  it('renders success toast with correct message', async () => {
    const TestComponent = () => {
      const { showToast } = useToast();
      return (
        <button onClick={() => showToast('info', 'Test success')}>
          Show Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(screen.getByText('Test success')).toBeInTheDocument();
    });
  });
});
```

## Running the Feature

### Development Server
```bash
cd frontend
pnpm install
pnpm run dev
```

### Testing
```bash
pnpm run test          # Unit tests
pnpm run test:visual   # Visual regression tests
```

## Verification Checklist

- [ ] Total Payment card appears on left (desktop/tablet)
- [ ] Monthly Payment card appears on right (desktop/tablet)
- [ ] Cards stack vertically on mobile in correct order
- [ ] Vertical toolbar visible on left edge with purple background
- [ ] Toolbar icon scrolling works to loan form
- [ ] Success toast appears with green color after calculation
- [ ] Error toast appears with red color on calculation failure
- [ ] Toasts auto-dismiss after correct timing
- [ ] Manual toast dismiss via × button works
- [ ] Keyboard navigation works on toolbar
- [ ] Responsive layout works at all breakpoints

## Common Issues & Solutions

### Toolbar Overlapping Content
Ensure main app container has `padding-left: 76px` (desktop) or `50px` (mobile).

### Toast Not Showing
Verify ToastProvider wraps entire app and useToast hook is imported.

### Card Order Not Changed
Check PaymentDisplay CSS grid column assignments and responsive media queries.

## Next Steps

1. Run comprehensive tests at all breakpoints
2. Verify WCAG 2.1 AA accessibility compliance
3. Performance test toast animations (16ms frame target)
4. Update README.md with new component documentation
5. Consider adding toast configuration options for future enhancements