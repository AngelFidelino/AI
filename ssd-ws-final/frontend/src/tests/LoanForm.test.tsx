import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoanForm } from '../components/LoanForm';
import type { LoanResult } from '../types/loan';

// Mock the loanApi module
vi.mock('../services/loanApi', () => ({
  calculateLoan: vi.fn(),
  LoanApiError: class LoanApiError extends Error {
    public readonly fieldErrors?: Record<string, string>;
    constructor(message: string, fieldErrors?: Record<string, string>) {
      super(message);
      this.name = 'LoanApiError';
      this.fieldErrors = fieldErrors;
    }
  },
}));

import { calculateLoan, LoanApiError } from '../services/loanApi';

const mockResult: LoanResult = {
  monthly_payment: 856.07,
  total_payment: 10272.89,
  total_interest: 272.89,
  schedule: [
    {
      payment_number: 1,
      payment_amount: 856.07,
      principal_portion: 814.40,
      interest_portion: 41.67,
      remaining_balance: 9185.60,
    },
  ],
};

describe('LoanForm', () => {
  const mockOnCalculate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // === T014: Component Rendering Tests ===

  describe('rendering', () => {
    it('renders "Loan Details" heading', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(
        screen.getByRole('heading', { name: /loan details/i })
      ).toBeInTheDocument();
    });

    it('renders loan amount input with correct label and placeholder', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      const input = screen.getByLabelText(/loan amount \(\$\)/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'e.g., 10000');
    });

    it('renders loan term input with correct label and placeholder', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      const input = screen.getByLabelText(/loan term \(months\)/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'e.g., 12');
    });

    it('renders annual interest rate input with correct label and placeholder', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      const input = screen.getByLabelText(/annual interest rate \(%\)/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'e.g., 5.0');
    });

    it('renders "Calculate" submit button', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(
        screen.getByRole('button', { name: /calculate/i })
      ).toBeInTheDocument();
    });
  });

  // === T015: Form Submission Tests ===

  describe('submission', () => {
    it('calls API with correct params on valid submission', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockResolvedValue(mockResult);

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(calculateLoan).toHaveBeenCalledWith({
          amount: 10000,
          term_months: 12,
          annual_rate: 5.0,
        });
      });
    });

    it('shows "Calculating..." and disables button during API call', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: LoanResult) => void;
      vi.mocked(calculateLoan).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Calculating...');
        expect(button).toBeDisabled();
      });

      // Resolve the promise to clean up
      resolvePromise!(mockResult);
    });

    it('calls onCalculate with LoanResult on successful response', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockResolvedValue(mockResult);

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(mockOnCalculate).toHaveBeenCalledWith(mockResult, 10000);
      });
    });

    it('form remains accessible after successful calculation', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockResolvedValue(mockResult);

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(mockOnCalculate).toHaveBeenCalled();
      });

      // Form should still be accessible
      expect(screen.getByLabelText(/loan amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/loan term/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/annual interest rate/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /calculate/i })).not.toBeDisabled();
    });
  });

  // === T023: Validation Display Tests (US2) ===

  describe('validation display', () => {
    it('shows error for empty amount on submit', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByText('Please enter a loan amount')).toBeInTheDocument();
    });

    it('shows error for empty term on submit', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByText('Please enter a loan term')).toBeInTheDocument();
    });

    it('shows error for empty rate on submit', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByText('Please enter an interest rate')).toBeInTheDocument();
    });

    it('shows correct error for negative amount', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '-100');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByText('Loan amount must be greater than 0')).toBeInTheDocument();
    });

    it('shows correct error for exceeding max amount', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000001');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByText('Loan amount must not exceed 10,000,000')).toBeInTheDocument();
    });

    it('shows correct error for decimal term', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12.5');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByText('Please enter a whole number for months')).toBeInTheDocument();
    });

    it('shows correct error for out-of-range rate', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '101');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByText('Interest rate must be between 0 and 100')).toBeInTheDocument();
    });

    it('error messages appear as inline text with role="alert"', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByRole('button', { name: /calculate/i }));

      const alerts = screen.getAllByRole('alert');
      // At least 3 error alerts (one per field) should contain text
      const filledAlerts = alerts.filter((el) => el.textContent !== '');
      expect(filledAlerts.length).toBeGreaterThanOrEqual(3);
    });

    it('does not call API when validation fails', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(calculateLoan).not.toHaveBeenCalled();
    });
  });

  // === T024: Blur Validation Tests (US2) ===

  describe('blur validation', () => {
    it('shows error when blurring an empty amount field', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      const amountInput = screen.getByLabelText(/loan amount/i);
      await user.click(amountInput);
      await user.tab();

      expect(screen.getByText('Please enter a loan amount')).toBeInTheDocument();
    });

    it('shows error when blurring a field with invalid value', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), 'abc');
      await user.tab();

      expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
    });

    it('clears error when correcting a field and blurring', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      const amountInput = screen.getByLabelText(/loan amount/i);
      // First, trigger an error
      await user.type(amountInput, 'abc');
      await user.tab();
      expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();

      // Now correct it
      await user.clear(amountInput);
      await user.type(amountInput, '10000');
      await user.tab();

      expect(screen.queryByText('Please enter a valid number')).not.toBeInTheDocument();
    });

    it('does not make backend request when validation fails on blur', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByLabelText(/loan amount/i));
      await user.tab();

      expect(calculateLoan).not.toHaveBeenCalled();
    });
  });

  // === T030: Error Handling Tests (US3) ===

  describe('error handling', () => {
    it('shows network error message', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockRejectedValue(
        new LoanApiError('Unable to connect to server. Please try again.')
      );

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(
          screen.getByText('Unable to connect to server. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('shows server error message on 500', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockRejectedValue(
        new LoanApiError('An error occurred while calculating. Please try again.')
      );

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(
          screen.getByText('An error occurred while calculating. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('shows timeout error message', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockRejectedValue(
        new LoanApiError('Request timed out. Please try again.')
      );

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(
          screen.getByText('Request timed out. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('displays backend validation errors per field on 400', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockRejectedValue(
        new LoanApiError('Validation error', {
          amount: 'Amount must be positive',
          term: 'Term must be an integer',
        })
      );

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(screen.getByText('Amount must be positive')).toBeInTheDocument();
        expect(screen.getByText('Term must be an integer')).toBeInTheDocument();
      });
    });

    it('preserves form values after error', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan).mockRejectedValue(
        new LoanApiError('Unable to connect to server. Please try again.')
      );

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(
          screen.getByText('Unable to connect to server. Please try again.')
        ).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/loan amount/i)).toHaveValue('10000');
      expect(screen.getByLabelText(/loan term/i)).toHaveValue('12');
      expect(screen.getByLabelText(/annual interest rate/i)).toHaveValue('5.0');
    });

    it('clears error on resubmission', async () => {
      const user = userEvent.setup();
      vi.mocked(calculateLoan)
        .mockRejectedValueOnce(
          new LoanApiError('Unable to connect to server. Please try again.')
        )
        .mockResolvedValueOnce(mockResult);

      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.type(screen.getByLabelText(/loan amount/i), '10000');
      await user.type(screen.getByLabelText(/loan term/i), '12');
      await user.type(screen.getByLabelText(/annual interest rate/i), '5.0');
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(
          screen.getByText('Unable to connect to server. Please try again.')
        ).toBeInTheDocument();
      });

      // Resubmit
      await user.click(screen.getByRole('button', { name: /calculate/i }));

      await waitFor(() => {
        expect(
          screen.queryByText('Unable to connect to server. Please try again.')
        ).not.toBeInTheDocument();
      });
    });
  });

  // === T035: Label and Hint Tests (US4) ===

  describe('labels and hints', () => {
    it('renders "Loan Amount ($)" label', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(screen.getByLabelText('Loan Amount ($)')).toBeInTheDocument();
    });

    it('renders amount placeholder "e.g., 10000"', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(screen.getByPlaceholderText('e.g., 10000')).toBeInTheDocument();
    });

    it('renders "Loan Term (months)" label', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(screen.getByLabelText('Loan Term (months)')).toBeInTheDocument();
    });

    it('renders term placeholder "e.g., 12"', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(screen.getByPlaceholderText('e.g., 12')).toBeInTheDocument();
    });

    it('renders "Annual Interest Rate (%)" label', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(screen.getByLabelText('Annual Interest Rate (%)')).toBeInTheDocument();
    });

    it('renders rate placeholder "e.g., 5.0"', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(screen.getByPlaceholderText('e.g., 5.0')).toBeInTheDocument();
    });

    it('renders "Loan Details" heading', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);
      expect(screen.getByRole('heading', { name: 'Loan Details' })).toBeInTheDocument();
    });
  });

  // === T038: Accessibility Tests (US5) ===

  describe('accessibility', () => {
    it('tab order follows amount → term → rate → Calculate', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.tab();
      expect(screen.getByLabelText(/loan amount/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/loan term/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/annual interest rate/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /calculate/i })).toHaveFocus();
    });

    it('all inputs have accessible labels via <label for>', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);

      const amountInput = screen.getByLabelText('Loan Amount ($)');
      expect(amountInput).toHaveAttribute('id', 'amount');

      const termInput = screen.getByLabelText('Loan Term (months)');
      expect(termInput).toHaveAttribute('id', 'term');

      const rateInput = screen.getByLabelText('Annual Interest Rate (%)');
      expect(rateInput).toHaveAttribute('id', 'rate');
    });

    it('error messages have role="alert"', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByRole('button', { name: /calculate/i }));

      const amountError = document.getElementById('amount-error');
      expect(amountError).toHaveAttribute('role', 'alert');

      const termError = document.getElementById('term-error');
      expect(termError).toHaveAttribute('role', 'alert');

      const rateError = document.getElementById('rate-error');
      expect(rateError).toHaveAttribute('role', 'alert');
    });

    it('inputs with errors have aria-invalid="true"', async () => {
      const user = userEvent.setup();
      render(<LoanForm onCalculate={mockOnCalculate} />);

      await user.click(screen.getByRole('button', { name: /calculate/i }));

      expect(screen.getByLabelText(/loan amount/i)).toHaveAttribute(
        'aria-invalid',
        'true'
      );
      expect(screen.getByLabelText(/loan term/i)).toHaveAttribute(
        'aria-invalid',
        'true'
      );
      expect(screen.getByLabelText(/annual interest rate/i)).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('inputs have aria-describedby pointing to error span', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);

      expect(screen.getByLabelText(/loan amount/i)).toHaveAttribute(
        'aria-describedby',
        'amount-error'
      );
      expect(screen.getByLabelText(/loan term/i)).toHaveAttribute(
        'aria-describedby',
        'term-error'
      );
      expect(screen.getByLabelText(/annual interest rate/i)).toHaveAttribute(
        'aria-describedby',
        'rate-error'
      );
    });

    it('valid inputs have aria-invalid="false"', () => {
      render(<LoanForm onCalculate={mockOnCalculate} />);

      expect(screen.getByLabelText(/loan amount/i)).toHaveAttribute(
        'aria-invalid',
        'false'
      );
      expect(screen.getByLabelText(/loan term/i)).toHaveAttribute(
        'aria-invalid',
        'false'
      );
      expect(screen.getByLabelText(/annual interest rate/i)).toHaveAttribute(
        'aria-invalid',
        'false'
      );
    });
  });
});
