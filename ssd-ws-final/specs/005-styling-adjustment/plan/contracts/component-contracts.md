# Component Contracts: Styling Adjustment Feature

**Feature**: 005-styling-adjustment  
**Date**: April 24, 2026  
**Phase**: 1 - Design & Contracts

## Component Interface Contracts

### 1. PaymentDisplay Component Contract

**Purpose**: Display loan calculation results with reordered layout

**Props Interface**:
```typescript
interface PaymentDisplayProps {
  paymentData: PaymentData;
  layoutConfig?: LayoutConfiguration;
}

interface PaymentData {
  totalPayment: number;
  monthlyPayment: number;
  principalAmount: number;
  totalInterest: number;
}
```

**Behavior Contract**:
- Render Total Payment card in left column (desktop/tablet) or top (mobile)
- Render Monthly Payment card in right column (desktop/tablet) or second position (mobile)
- Render Payment Breakdown card spanning full width below top row
- Maintain existing styling and formatting
- Support responsive breakpoints per LayoutConfiguration

**DOM Structure**:
```jsx
<div className="payment-display-grid">
  <div className="card card-total-payment">...</div>
  <div className="card card-monthly-payment">...</div>
  <div className="card card-payment-breakdown">...</div>
</div>
```

### 2. VerticalToolbar Component Contract

**Purpose**: Persistent navigation anchor with loan simulator access

**Props Interface**:
```typescript
interface VerticalToolbarProps {
  isActive?: boolean;
  onLoanSimulatorClick: () => void;
  width?: number;
}
```

**Behavior Contract**:
- Fixed position on far left edge of viewport
- Display calculator icon centered horizontally
- Click/tap triggers scroll to loan form section
- Keyboard accessible (tabIndex 0, Enter/Space activation)
- Show active state when loan form section is in viewport
- Support responsive width (76px desktop/tablet, 56px mobile)

**DOM Structure**:
```jsx
<nav 
  role="navigation" 
  aria-label="Application navigation"
  className="vertical-toolbar"
>
  <button
    aria-label="Go to Loan Simulator"
    className="toolbar-icon-btn"
    onClick={onLoanSimulatorClick}
  >
    {/* Calculator icon SVG */}
  </button>
</nav>
```

### 3. Toast System Contracts

#### ToastContext Contract
```typescript
interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
  toasts: ToastNotification[];
}
```

**Provider Contract**:
- Create React Context with default empty state
- Provide toast state management functions
- Maximum 3 concurrent toasts enforced
- Auto-dismiss based on toast type (4s info, 6s error)

#### Toast Component Contract
```typescript
interface ToastProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}
```

**Behavior Contract**:
- Render toast at top-center of viewport
- Green background for 'info' type, red for 'error' type
- Include dismiss button (×) for manual dismissal
- Auto-dismiss after configured duration
- Stack vertically if multiple toasts
- Smooth enter/exit animations (16ms frame target)

## CSS Class Contracts

### Payment Display Grid
```css
.payment-display-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.card-total-payment {
  grid-column: 1;
}

.card-monthly-payment {
  grid-column: 2;
}

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

### Vertical Toolbar Classes
```css
.vertical-toolbar {
  position: fixed;
  left: 0;
  top: 0;
  width: 76px;
  height: 100vh;
  background-color: #5B4FFF;
  z-index: 100;
}

@media (max-width: 767px) {
  .vertical-toolbar {
    width: 56px;
  }
}

.toolbar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  padding: 10px;
}
```

### Toast Component Classes
```css
.toast-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.toast-info {
  background-color: #16A34A;
}

.toast-error {
  background-color: #DC2626;
}

@media (max-width: 767px) {
  .toast-container {
    left: 16px;
    right: 16px;
    transform: none;
  }
}
```

## Event Contracts

### Toolbar Interaction Events
```typescript
// Event fired when toolbar icon is activated
interface ToolbarClickEvent {
  type: 'toolbar-icon-click';
  target: 'loan-simulator';
  action: 'scroll-to-form' | 'focus-input';
}

// Event for keyboard activation
interface ToolbarKeyboardEvent {
  type: 'toolbar-keyboard';
  key: 'Enter' | 'Space';
  target: 'loan-simulator';
}
```

### Toast System Events
```typescript
// Event fired when toast is created
interface ToastCreateEvent {
  type: 'toast-create';
  toast: ToastNotification;
  timestamp: number;
}

// Event fired when toast is dismissed
interface ToastDismissEvent {
  type: 'toast-dismiss';
  toastId: string;
  reason: 'manual' | 'auto' | 'timeout';
}
```

## Accessibility Contracts

### WCAG 2.1 AA Requirements
- Toolbar: role="navigation", aria-label="Application navigation"
- Toolbar button: aria-label="Go to Loan Simulator"
- Toast info: role="status", aria-live="polite"
- Toast error: role="alert", aria-live="assertive"
- All interactive elements keyboard accessible
- Color contrast ratios exceed 4.5:1

### Focus Management
- Toolbar button:focus-visible shows focus ring
- Listen toasts do not trap focus
- Form scroll action focuses first input field
- Tab navigation follows logical order

## Performance Contracts

### Animation Performance
- Toast enter/exit animations: 16ms frame time (60fps)
- Use CSS transforms for position changes
- RequestAnimationFrame for complex animations
- GPU acceleration where applicable

### Memory Management
- Toast timers cleared on component unmount
- Event listeners cleaned up on unmount
- Toast queue limited to 3 items maximum
- No memory leaks in context state

## Integration Contracts

### App Shell Integration
```typescript
// Modified App component structure
const App = () => (
  <ToastProvider>
    <div className="app-shell">
      <VerticalToolbar onLoanSimulatorClick={handleScrollToLoanForm} />
      {/* Existing App content */}
    </div>
  </ToastProvider>
);
```

### Loan Form Integration
```typescript
// Modified LoanForm toast integration
const LoanForm = () => {
  const { showToast } = useToast();
  
  const handleSubmit = async (data: FormData) => {
    try {
      await submitLoanData(data);
      showToast('info', 'Calculation completed successfully');
    } catch (error) {
      showToast('error', `Calculation failed: ${error.message}`);
    }
  };
};
```

## Testing Contracts

### Component Test Interfaces
```typescript
// Test helper for PaymentDisplay
interface PaymentDisplayTestProps {
  mockPaymentData: PaymentData;
  mockLayoutConfig?: LayoutConfiguration;
}

// Test helper for VerticalToolbar  
interface ToolbarTestProps {
  mockScrollToForm: () => void;
  mockIsActive?: boolean;
}

// Test helper for Toast system
interface ToastTestProps {
  mockToastContext: ToastContextValue;
  mockToast: ToastNotification;
}
```

### Test Assertions Contract
- Verify card order DOM structure at each breakpoint
- Validate toolbar scroll behavior with mock DOM
- Test toast creation, display, and dismissal timing
- Confirm accessibility attributes presence and values
- Measure animation frame rate compliance