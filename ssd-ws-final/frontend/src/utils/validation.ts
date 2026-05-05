import type { LoanFormState, ValidationErrors } from '../types/loan';

export function validateField(field: string, value: string): string | null {
  const trimmed = value.trim();

  switch (field) {
    case 'amount': {
      if (trimmed === '') return 'Please enter a loan amount';
      const num = Number(trimmed);
      if (isNaN(num)) return 'Please enter a valid number';
      if (num <= 0) return 'Loan amount must be greater than 0';
      if (num > 10_000_000) return 'Loan amount must not exceed 10,000,000';
      return null;
    }

    case 'term': {
      if (trimmed === '') return 'Please enter a loan term';
      const num = Number(trimmed);
      if (isNaN(num)) return 'Please enter a valid number';
      if (!Number.isInteger(num)) return 'Please enter a whole number for months';
      if (num < 1) return 'Loan term must be at least 1 month';
      if (num > 600) return 'Loan term must not exceed 600 months';
      return null;
    }

    case 'rate': {
      if (trimmed === '') return 'Please enter an interest rate';
      const num = Number(trimmed);
      if (isNaN(num)) return 'Please enter a valid number';
      if (num < 0 || num > 100) return 'Interest rate must be between 0 and 100';
      // Check decimal places
      const decimalMatch = trimmed.match(/\.(\d+)$/);
      if (decimalMatch && decimalMatch[1].length > 2) {
        return 'Interest rate allows up to 2 decimal places';
      }
      return null;
    }

    default:
      return null;
  }
}

export function validateLoanForm(values: LoanFormState): ValidationErrors {
  const errors: ValidationErrors = {};

  const amountError = validateField('amount', values.amount);
  if (amountError) errors.amount = amountError;

  const termError = validateField('term', values.term);
  if (termError) errors.term = termError;

  const rateError = validateField('rate', values.rate);
  if (rateError) errors.rate = rateError;

  return errors;
}
