## ADDED Requirements

### Requirement: Field component
The system SHALL implement a reusable Field component defined at module level for form inputs.

#### Scenario: Field styling
- **WHEN** field renders
- **THEN** field has 44px height and 8px border radius
- **AND** field has #f3f3f5 background color
- **AND** field has 1.5px border: #e2e8f0 (default), #4f39f6 (focus), #ef4444 (error)
- **AND** field shows focus ring: 0 0 0 3px rgba(79,57,246,0.12) when focused
- **AND** field transitions border changes in 150ms ease
- **AND** placeholder text has color #717182

#### Scenario: Field behavior
- **WHEN** user interacts with field
- **THEN** field accepts keyboard and mouse input
- **AND** field supports focus, blur, and change events

### Requirement: LoanForm component
The system SHALL implement a LoanForm component with three input fields and calculate button.

#### Scenario: Form fields
- **WHEN** LoanForm renders
- **THEN** form displays three Field components: Loan Amount ($), Annual Interest Rate (%), Loan Term (months)
- **AND** fields are arranged vertically with proper spacing

#### Scenario: Calculate button
- **WHEN** Calculate button renders
- **THEN** button has 44px height and 100% width
- **AND** button has #4f39f6 background color, #3d29d4 on hover
- **AND** button scales to 0.98 on mousedown
- **WHEN** calculation is in progress
- **THEN** button shows "Calculating…" text with 0.7 opacity
- **AND** button has cursor not-allowed

### Requirement: EmptyState component
The system SHALL implement an EmptyState component for display before calculations.

#### Scenario: EmptyState display
- **WHEN** no calculation results exist
- **THEN** component shows document icon in #f1f5f9 container with 16px radius and 80x80 size
- **AND** component displays "Ready to Calculate" title (20px/600/#0f172b)
- **AND** component displays description text (16px/400/#62748e)

### Requirement: PaymentDisplay component
The system SHALL implement PaymentDisplay component with payment cards and breakdown.

#### Scenario: Total payment card
- **WHEN** PaymentDisplay renders
- **THEN** system shows gradient card with linear-gradient(135deg, #615fff, #432dd7)
- **AND** card has 16px border radius and 24px 25px padding
- **AND** number displays in 36px/700/white
- **AND** subtitle displays in #e0e7ff

#### Scenario: Monthly payment card
- **WHEN** PaymentDisplay renders
- **THEN** system shows white card with same structure as total payment
- **AND** number displays in #1d293d color
- **AND** card has #ffffff background

#### Scenario: Payment breakdown
- **WHEN** PaymentDisplay renders
- **THEN** system displays breakdown grid: 1fr 1fr → 1fr @600px
- **AND** stat boxes have #f8fafc background and 14px radius
- **AND** values display in 18px/700/#1d293d

#### Scenario: Progress bars
- **WHEN** PaymentDisplay renders
- **THEN** system shows dual progress bar with main bar #615fff→#4f39f6 and interest bar #e0e7ff
- **AND** bars animate with barFill animation (700ms ease, 150ms delay)

### Requirement: PaymentTable component
The system SHALL implement PaymentTable component with pagination and formatting.

#### Scenario: Table structure
- **WHEN** PaymentTable renders
- **THEN** table displays columns: Period | Principal | Interest | Balance | Progress
- **AND** table supports 12 rows per page with pagination controls
- **AND** table has min-width 600px with horizontal overflow-x auto
- **WHEN** column displays Interest
- **THEN** values show in #fffbeb background badges with #bb4d00 text and 8px radius

#### Scenario: Table rows
- **WHEN** user hovers over table row
- **THEN** row background changes to #fafbff with 100ms transition
- **WHEN** showing totals row
- **THEN** row displays in #fef3c6 background with #973c00 text
- **AND** row has linear-gradient(90deg, #f8fafc, #eef2ff) background

#### Scenario: Progress column
- **WHEN** PaymentTable renders
- **THEN** progress column shows mini progress bar (64x6px) with percentage text
- **AND** progress animates based on payment percentage

### Requirement: Toast component
The system SHALL implement Toast component for notifications.

#### Scenario: Toast display
- **WHEN** Toast renders
- **THEN** toast appears at fixed position top 24px right 24px
- **AND** toast has #f0fdf4 background with #bbf7d0 border and 14px radius
- **AND** toast has padding 14px 18px
- **AND** toast shows green checkmark icon #22c55e
- **AND** toast text displays in #0d542n (14px/500)
- **AND** toast includes × button for manual close (opacity 0.6 → 1.0 on hover)
- **AND** toast does not auto-dismiss

### Requirement: Sidebar component
The system SHALL implement Sidebar component for navigation.

#### Scenario: Sidebar display
- **WHEN** viewport width >= 900px
- **THEN** sidebar displays with 80px width
- **AND** sidebar shows gradient #4f39f6 → #372aac
- **AND** sidebar displays centered calculator icon with rgba(255,255,255,0.10) background and 14px radius

#### Scenario: Sidebar responsive behavior
- **WHEN** viewport width < 900px
- **THEN** sidebar is hidden