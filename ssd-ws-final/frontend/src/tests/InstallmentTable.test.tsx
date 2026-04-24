import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InstallmentTable } from '../components/InstallmentTable';
import type { Installment } from '../types/loan';

const defaultProps = {
  installments: null as Installment[] | null,
  originalLoanAmount: 0,
  isLoading: false,
  error: null as string | null,
  onRetry: vi.fn(),
};

// --- Phase 2: Foundational State Tests ---

describe('InstallmentTable - Pre-calculation placeholder', () => {
  it('renders placeholder message when installments is null, isLoading is false, error is null', () => {
    render(<InstallmentTable {...defaultProps} />);
    expect(
      screen.getByText('Enter loan details and calculate to see payment schedule.')
    ).toBeInTheDocument();
  });
});

describe('InstallmentTable - Loading state', () => {
  it('renders loading message when isLoading is true', () => {
    render(<InstallmentTable {...defaultProps} isLoading={true} />);
    expect(
      screen.getByText('Loading payment schedule...')
    ).toBeInTheDocument();
  });
});

describe('InstallmentTable - Error state', () => {
  it('renders error message and Retry button, clicking Retry calls onRetry', async () => {
    const onRetry = vi.fn();
    render(
      <InstallmentTable
        {...defaultProps}
        error="Something went wrong"
        onRetry={onRetry}
      />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    await userEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('InstallmentTable - Empty array state', () => {
  it('renders empty message when installments is an empty array', () => {
    render(<InstallmentTable {...defaultProps} installments={[]} />);
    expect(
      screen.getByText('No payment schedule available.')
    ).toBeInTheDocument();
  });
});

// --- Phase 3: User Story 1 Tests ---

function createInstallments(count: number, loanAmount: number): Installment[] {
  const monthlyRate = 0.05 / 12;
  const payment =
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -count));
  const installments: Installment[] = [];
  let balance = loanAmount;

  for (let i = 1; i <= count; i++) {
    const interest = balance * monthlyRate;
    const principal = payment - interest;
    balance = Math.max(0, balance - principal);
    installments.push({
      payment_number: i,
      payment_amount: Math.round(payment * 100) / 100,
      principal_portion: Math.round(principal * 100) / 100,
      interest_portion: Math.round(interest * 100) / 100,
      remaining_balance: Math.round(balance * 100) / 100,
    });
  }
  return installments;
}

const sampleInstallments = createInstallments(12, 10000);

describe('InstallmentTable - Table structure (US1)', () => {
  it('renders table with caption, 6 column headers with scope="col", and correct number of data rows', () => {
    render(
      <InstallmentTable
        {...defaultProps}
        installments={sampleInstallments}
        originalLoanAmount={10000}
      />
    );

    // Caption
    const caption = screen.getByText('Loan Amortization Schedule');
    expect(caption).toBeInTheDocument();
    expect(caption.tagName).toBe('CAPTION');

    // 6 column headers
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(6);
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
    });

    // Correct number of data rows (12 data + 1 summary in tfoot)
    const rows = screen.getAllByRole('row');
    // 1 header row + 12 data rows + 1 summary row = 14
    expect(rows).toHaveLength(14);
  });
});

describe('InstallmentTable - Currency formatting (US1)', () => {
  it('all monetary values display $X,XXX.XX format', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 856.07,
        principal_portion: 814.40,
        interest_portion: 41.67,
        remaining_balance: 9185.60,
      },
    ];

    render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={10000}
      />
    );

    // With 1 row, payment_amount and totals are the same, so use getAllByText
    const paymentAmounts = screen.getAllByText('$856.07');
    expect(paymentAmounts.length).toBeGreaterThanOrEqual(1);

    const principalAmounts = screen.getAllByText('$814.40');
    expect(principalAmounts.length).toBeGreaterThanOrEqual(1);

    const interestAmounts = screen.getAllByText('$41.67');
    expect(interestAmounts.length).toBeGreaterThanOrEqual(1);

    // Remaining balance only appears in the data row (not in summary)
    expect(screen.getByText('$9,185.60')).toBeInTheDocument();
  });
});

describe('InstallmentTable - Progress bars (US1)', () => {
  it('each row has a progress bar with role="progressbar", correct aria-valuenow, and aria-label', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 856.07,
        principal_portion: 814.40,
        interest_portion: 41.67,
        remaining_balance: 7500,
      },
    ];

    render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={10000}
      />
    );

    const progressBars = screen.getAllByRole('progressbar');
    // 1 data row + 1 summary row = 2 progress bars
    expect(progressBars.length).toBeGreaterThanOrEqual(1);
    const dataProgressBar = progressBars[0];
    expect(dataProgressBar).toHaveAttribute('aria-valuenow', '25');
    expect(dataProgressBar).toHaveAttribute('aria-valuemin', '0');
    expect(dataProgressBar).toHaveAttribute('aria-valuemax', '100');
    expect(dataProgressBar).toHaveAttribute(
      'aria-label',
      '25% of loan repaid'
    );
  });
});

describe('InstallmentTable - Card header (US1)', () => {
  it('card header displays "Payment Schedule" title and payment count badge', () => {
    render(
      <InstallmentTable
        {...defaultProps}
        installments={sampleInstallments}
        originalLoanAmount={10000}
      />
    );

    expect(screen.getByText('Payment Schedule')).toBeInTheDocument();
    expect(screen.getByText('12 payments')).toBeInTheDocument();
  });
});

// --- Phase 4: User Story 2 Tests ---

describe('InstallmentTable - Summary row (US2)', () => {
  it('tfoot summary row shows Total label and correct sums for payments, principal, interest', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 500,
        principal_portion: 450,
        interest_portion: 50,
        remaining_balance: 550,
      },
      {
        payment_number: 2,
        payment_amount: 500,
        principal_portion: 460,
        interest_portion: 40,
        remaining_balance: 90,
      },
      {
        payment_number: 3,
        payment_amount: 500,
        principal_portion: 470,
        interest_portion: 30,
        remaining_balance: 0,
      },
    ];

    render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={1000}
      />
    );

    // "Total" label in summary row
    expect(screen.getByText('Total')).toBeInTheDocument();

    // Sum of payments: 500 + 500 + 500 = 1500
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    // Sum of principal: 450 + 460 + 470 = 1380
    expect(screen.getByText('$1,380.00')).toBeInTheDocument();
    // Sum of interest: 50 + 40 + 30 = 120
    expect(screen.getByText('$120.00')).toBeInTheDocument();
  });

  it('summary row has .installment-table__row--summary class and summary progress bar shows 100%', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 1000,
        principal_portion: 950,
        interest_portion: 50,
        remaining_balance: 0,
      },
    ];

    render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={1000}
      />
    );

    // Summary row class
    const totalCell = screen.getByText('Total');
    const summaryRow = totalCell.closest('tr');
    expect(summaryRow).toHaveClass('installment-table__row--summary');

    // Summary progress bar is 100%
    const progressBars = screen.getAllByRole('progressbar');
    const summaryProgressBar = progressBars[progressBars.length - 1];
    expect(summaryProgressBar).toHaveAttribute('aria-valuenow', '100');
  });
});

// --- Phase 5: User Story 3 Tests ---

describe('InstallmentTable - Interest highlighting (US3)', () => {
  it('all interest cells in tbody and tfoot have .installment-table__interest class', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 500,
        principal_portion: 450,
        interest_portion: 50,
        remaining_balance: 550,
      },
      {
        payment_number: 2,
        payment_amount: 500,
        principal_portion: 460,
        interest_portion: 40,
        remaining_balance: 0,
      },
    ];

    const { container } = render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={1000}
      />
    );

    // Interest cells in tbody (2 data rows)
    const tbodyInterestCells = container.querySelectorAll(
      '.installment-table__body .installment-table__interest'
    );
    expect(tbodyInterestCells).toHaveLength(2);

    // Interest cell in tfoot (1 summary row)
    const tfootInterestCells = container.querySelectorAll(
      '.installment-table__foot .installment-table__interest'
    );
    expect(tfootInterestCells).toHaveLength(1);
  });
});

// --- Phase 6: User Story 4 Tests ---

describe('InstallmentTable - Zebra striping (US4)', () => {
  it('table body rows have .installment-table__row class', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 500,
        principal_portion: 450,
        interest_portion: 50,
        remaining_balance: 500,
      },
      {
        payment_number: 2,
        payment_amount: 500,
        principal_portion: 460,
        interest_portion: 40,
        remaining_balance: 0,
      },
    ];

    const { container } = render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={1000}
      />
    );

    const bodyRows = container.querySelectorAll(
      '.installment-table__body .installment-table__row'
    );
    expect(bodyRows).toHaveLength(2);
  });
});

describe('InstallmentTable - Table wrapper (US4)', () => {
  it('table wrapper has .installment-table__wrapper class for horizontal scroll', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 1000,
        principal_portion: 950,
        interest_portion: 50,
        remaining_balance: 0,
      },
    ];

    const { container } = render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={1000}
      />
    );

    const wrapper = container.querySelector('.installment-table__wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});

// --- Phase 7: User Story 5 Tests ---

describe('InstallmentTable - Accessibility (US5)', () => {
  it('caption, scope, aria-labelledby, aria-live, and role attributes are present', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 1000,
        principal_portion: 950,
        interest_portion: 50,
        remaining_balance: 0,
      },
    ];

    const { container } = render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={1000}
      />
    );

    // Caption
    const caption = container.querySelector('caption');
    expect(caption).toBeInTheDocument();
    expect(caption?.textContent).toBe('Loan Amortization Schedule');

    // All th have scope="col"
    const headers = container.querySelectorAll('th');
    headers.forEach((th) => {
      expect(th).toHaveAttribute('scope', 'col');
    });

    // Section has aria-labelledby
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-labelledby', 'installment-table-title');
  });

  it('loading container has aria-live="polite"', () => {
    const { container } = render(
      <InstallmentTable {...defaultProps} isLoading={true} />
    );

    const loading = container.querySelector('.installment-table__loading');
    expect(loading).toHaveAttribute('aria-live', 'polite');
  });

  it('error container has role="alert"', () => {
    const { container } = render(
      <InstallmentTable
        {...defaultProps}
        error="Some error"
      />
    );

    const errorContainer = container.querySelector('.installment-table__error');
    expect(errorContainer).toHaveAttribute('role', 'alert');
  });
});

describe('InstallmentTable - Data integrity warning (US5)', () => {
  it('shows warning when final remaining_balance is not 0', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 500,
        principal_portion: 497,
        interest_portion: 3,
        remaining_balance: 0.03,
      },
    ];

    const { container } = render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={500}
      />
    );

    const warning = container.querySelector('.installment-table__warning');
    expect(warning).toBeInTheDocument();
    expect(warning).toHaveAttribute('role', 'alert');
    expect(warning?.textContent).toContain('$0.00 balance');
  });

  it('does not show warning when final remaining_balance is 0', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 1000,
        principal_portion: 950,
        interest_portion: 50,
        remaining_balance: 0,
      },
    ];

    const { container } = render(
      <InstallmentTable
        {...defaultProps}
        installments={installments}
        originalLoanAmount={1000}
      />
    );

    const warning = container.querySelector('.installment-table__warning');
    expect(warning).not.toBeInTheDocument();
  });
});

// --- Phase 8: App Integration Tests ---

describe('InstallmentTable - App integration (T046)', () => {
  it('renders with correct props mapping from App state', () => {
    const installments: Installment[] = [
      {
        payment_number: 1,
        payment_amount: 875,
        principal_portion: 833.33,
        interest_portion: 41.67,
        remaining_balance: 9166.67,
      },
    ];
    const onRetry = vi.fn();

    render(
      <InstallmentTable
        installments={installments}
        originalLoanAmount={10000}
        isLoading={false}
        error={null}
        onRetry={onRetry}
      />
    );

    // Verify data renders — table is displayed
    // Values may appear in data row, summary row, and/or warning
    const paymentAmounts = screen.getAllByText('$875.00');
    expect(paymentAmounts.length).toBeGreaterThanOrEqual(1);
    const principalAmounts = screen.getAllByText('$833.33');
    expect(principalAmounts.length).toBeGreaterThanOrEqual(1);
    const balanceAmounts = screen.getAllByText('$9,166.67');
    expect(balanceAmounts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('1 payments')).toBeInTheDocument();
    expect(screen.getByText('Payment Schedule')).toBeInTheDocument();
  });
});
