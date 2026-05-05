# Data Model: Styling Adjustment Feature

**Feature**: 005-styling-adjustment  
**Date**: April 24, 2026  
**Phase**: 1 - Design & Contracts

## Entity Model Overview

This feature introduces three primary entities for UI state management and configuration. All entities are frontend-only with no backend persistence requirements.

## Entity Definitions

### 1. ToastNotification

**Purpose**: Transient UI feedback entity for user action responses

**Properties**:
```typescript
interface ToastNotification {
  id: string;              // UUID for unique identification
  type: 'info' | 'error';  // Toast type determines styling
  message: string;         // Display message content
  timestamp: number;       // Creation timestamp for auto-dismiss
}
```

**State Management**:
- Managed through React Context at App shell level
- Auto-dismiss based on type (4000ms for info, 6000ms for error)
- Maximum 3 concurrent notifications
- FIFO dismissal when limit exceeded

**Validation Rules**:
- Message string: non-empty, max 200 characters
- Type enumeration: must be 'info' or 'error'
- ID: must be unique UUID string

### 2. ToolbarState

**Purpose**: Persistent navigation element state management

**Properties**:
```typescript
interface ToolbarState {
  isActive: boolean;       // Loan Simular section in view
  iconFocused: boolean;   // Keyboard focus state for accessibility
}
```

**State Transitions**:
- `isActive` true when loan form visible in viewport
- `iconFocused` managed through focus/blur events
- No persistence - runtime state only

### 3. LayoutConfiguration

**Purpose**: Responsive layout breakpoint configuration

**Properties**:
```typescript
interface LayoutConfiguration {
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  toolbarWidth: number;        // 76px desktop/tablet, 56px mobile
  cardLayout: 'grid' | 'stack'; // Grid for desktop/tablet, stack for mobile
  contentOffset: number;       // Left padding to avoid toolbar overlap
}
```

**Responsive Rules**:
- Desktop (≥1024px): toolbarWidth: 76px, cardLayout: 'grid', contentOffset: 76px
- Tablet (≥768px < 1024px): toolbarWidth: 76px, cardLayout: 'grid', contentOffset: 76px  
- Mobile (<768px): toolbarWidth: 56px, cardLayout: 'stack', contentOffset: 56px

## Component Data Flow

### Payment Display Component

**Data Input**:
```typescript
interface PaymentData {
  totalPayment: number;
  monthlyPayment: number;
  principalAmount: number;
  totalInterest: number;
}
```

**Layout State**:
- Grid position determined by current breakpoint
- Card order: [Total Payment, Monthly Payment] top row
- Payment Breakdown: full width below top row

### Toast Context Provider

**Context Interface**:
```typescript
interface ToastContext {
  toasts: ToastNotification[];
  showToast: (type: 'info' | 'error', message: string) => void;
  dismissToast: (id: string) => void;
}
```

**Usage Pattern**:
- Consumer components call `showToast(type, message)` on events
- Context manages queue, auto-dismiss, and cleanup
- Toast components rendered centrally from context state

### Vertical Toolbar Component

**Props Interface**:
```typescript
interface VerticalToolbarProps {
  onLoanSimulatorClick: () => void; // Scroll/focus handler
  isActive?: boolean;                // Visual active state
  width?: number;                    // Responsive width
}
```

**Event Handling**:
- Click triggers smooth scroll to `#loan-form` element
- Focus sets focus on first input field in loan form
- Keyboard activation (Enter/Space) supported

## State Relationships

```
App Shell
├── ToastContext (global)
│   ├── ToastNotification[] (max 3)
│   └── showToast / dismissToast functions
├── LayoutConfiguration (responsive)
│   ├── breakpoint detection
│   ├── toolbar width calculation
│   └── content offset positioning
└── VerticalToolbar
    ├── ToolbarState (active/focused)
    └── scroll interaction handlers
```

## Data Validation

### Input Validation
- Toast messages: strip HTML, trim whitespace, length validation
- Layout breakpoints: use CSS media queries, no manual validation needed
- Toolbar interactions: null checks for scroll targets

### Output Formatting
- Currency values: Use existing formatting from PaymentDisplay
- Toast messages: Plain text with error message interpolation
- Layout classes: BEM naming convention with breakpoint suffixes

## Performance Considerations

### Memory Management
- Toast notifications: automatic cleanup after dismissal
- Timer management: clearTimeout on component unmount
- Event listeners: cleanup on component unmount

### Render Optimization
- Context value memoization to prevent unnecessary re-renders
- CSS-only animations for toast enter/exit
- Debounced layout measurement for responsive changes

## Integration Points

### Existing Components Modified
- **PaymentDisplay**: Grid layout structure only
- **App**: Add ToastProvider and VerticalToolbar
- **LoanForm**: Toast integration on submit events

### No Backend Integration
- All entities managed in frontend memory
- No API endpoints required
- No data persistence needed

## Testing Data Requirements

### Mock Data for Testing
```typescript
const mockToast: ToastNotification = {
  id: 'test-toast-id',
  type: 'info',
  message: 'Test message',
  timestamp: Date.now()
};

const mockPaymentData: PaymentData = {
  totalPayment: 10272.84,
  monthlyPayment: 856.07,
  principalAmount: 10000.00,
  totalInterest: 272.84
};
```

### Test Scenarios Coverage
- Toast creation, auto-dismiss, manual dismiss
- Grid layout order at each breakpoint  
- Toolbar scroll and focus behavior
- Responsive width calculations
- Component integration flows