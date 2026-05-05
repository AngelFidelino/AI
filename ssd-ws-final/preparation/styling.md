Design a modern financial calculator web application with the following specifications:

## LAYOUT STRUCTURE
Create a two-column layout:
- LEFT SIDEBAR: Fixed width (~400-450px), containing input form
- MAIN WORKSPACE: Flexible width, displaying calculation results
- VERTICAL NAVIGATION: Narrow sidebar on far left (~76px) with purple background

## COLOR PALETTE
Primary Colors:
- Primary Purple: #5B4FFF (vibrant blue-purple)
- Primary Purple Hover/Active: #4A3FE8 (slightly darker)
- Background Light: #F5F5F7 (off-white/light gray)
- White: #FFFFFF (cards and containers)

Text Colors:
- Heading Text: #1A1A1A (near black)
- Body Text: #6B7280 (medium gray)
- Label Text: #374151 (dark gray)

Accent Colors:
- Success/Highlight: #FEF3C7 (light yellow background)
- Success Text: #D97706 (orange-amber for amounts)
- Progress Bar: #5B4FFF (matches primary purple)

## TYPOGRAPHY
Font Family: Modern sans-serif (Inter, SF Pro Display, or similar system font)

Font Sizes & Weights:
- Main Heading: 32-36px, Bold (700-800)
- Subtitle/Description: 15-16px, Regular (400), gray color
- Section Headers: 18-20px, Semibold (600)
- Card Titles: 14-15px, Medium (500-600)
- Large Display Numbers: 42-48px, Bold (700)
- Body Text: 14-15px, Regular (400)
- Small Labels: 12-13px, Medium (500)
- Table Headers: 11-12px, Semibold (600), uppercase

Line Height: 1.5-1.6 for body text, 1.2-1.3 for headings

## BACKGROUND ELEMENTS
- App Background: Light gray (#F5F5F7)
- Sidebar Navigation: Solid purple gradient (#5B4FFF to #4A3FE8)
- Card Backgrounds: Pure white (#FFFFFF)
- Input Fields: Light gray (#F3F4F6)
- Featured Card (Total Payment): Purple gradient background with subtle pattern/texture

## COMPONENT SPECIFICATIONS

### Left Sidebar - Input Form Card
- White background with subtle shadow
- Rounded corners: 12-16px
- Padding: 32-40px
- Section titled "Loan Details"
- Three input fields with labels:
  * "Loan Amount ($)"
  * "Annual Interest Rate (%)"
  * "Loan Term (months)"
- Input styling: Light gray background, rounded corners (8px), padding (12-16px)
- Calculate button: Full-width, purple background, white text, rounded (8px), padding (14-16px)

### Vertical Navigation Sidebar
- Width: 76px
- Background: Solid purple (#5B4FFF)
- Calculator icon at top (white, ~24px)
- Centered alignment

### Main Workspace Cards

**Total Payment Card (Featured):**
- Purple gradient background (#5B4FFF)
- Rounded corners: 16px
- White text throughout
- Small trend icon (upward arrow) in top right
- Label: "Total Payment" (14px, medium weight)
- Large amount: "$12.05" (48px, bold)
- Subtitle: "Over loan lifetime" (14px, regular, slightly transparent white)
- Padding: 32px

**Monthly Payment Card:**
- White background
- Same rounded corners and shadow as other cards
- Dollar sign icon in top right (light gray)
- Label: "Monthly Payment"
- Large amount: "$12.05" (48px, bold, dark text)
- Description text below (14px, gray)

**Payment Breakdown Card:**
- White background, rounded corners
- Title: "Payment Breakdown" (18px, semibold)
- Two-column layout showing:
  * Left: "Principal Amount" - "$12.00"
  * Right: "Total Interest" - "$0.05"
- Values aligned to right, bold weight

**Payment Schedule Table:**
- White card background
- Title: "Payment Schedule" with "1 payments" count on right
- Table with columns: PERIOD | PRINCIPAL | INTEREST | BALANCE | PROGRESS
- Column headers: Uppercase, small font (11-12px), gray, semibold
- Row styling: Clean, minimal borders (light gray divider lines)
- Period column: Number with green checkmark icon
- Interest amounts: Orange/amber text (#D97706) on light yellow background
- Progress column: Purple progress bar (100% filled) with percentage
- Total row: Bold text, slightly darker background

## SPACING & LAYOUT
- Card spacing: 24px gaps between cards
- Internal card padding: 24-32px
- Input field spacing: 16-20px between fields
- Section spacing: 32-40px between major sections
- Grid gap in main workspace: 24px

## STYLE & AESTHETIC
Design Style: Modern financial SaaS application
- Clean, minimal interface
- Generous white space
- Subtle shadows for depth (0 2px 8px rgba(0,0,0,0.08))
- Rounded corners throughout (8-16px)
- Flat design with subtle depth cues
- Professional and trustworthy appearance

Visual Characteristics:
- Card-based layout system
- Consistent border radius
- Soft shadows for elevation
- Color-coded information hierarchy
- Clear visual separation between input and output

## INTERACTIVE ELEMENTS
- Input fields: Light gray background, focus state with purple border
- Calculate button: Purple with hover state (darker purple)
- Icons: Simple line icons, consistent stroke width (2px)
- Progress indicators: Filled purple bars
- Status indicators: Green checkmarks for completed payments

## ADDITIONAL VISUAL ELEMENTS
Icons:
- Calculator icon (navigation)
- Trend/chart arrow icon (Total Payment card)
- Dollar sign icon (Monthly Payment card)
- Checkmark icon (completed payment periods)
- Downward trend icon (totals row)

Decorative Elements:
- Subtle card shadows for depth
- Border radius consistency
- Light divider lines in tables
- Highlighted amounts with background colors
- Progress bars with rounded ends

Special Effects:
- Gradient on primary purple card
- Subtle hover states on interactive elements
- Clean, crisp borders (1px, light gray)
- No heavy textures or patterns
- Focus on clarity and readability