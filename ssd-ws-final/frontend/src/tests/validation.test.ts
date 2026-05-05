import { describe, it, expect } from 'vitest';
import { validateLoanForm, validateField } from '../utils/validation';
import type { LoanFormState } from '../types/loan';

describe('validateField', () => {
  // Amount field validation
  describe('amount', () => {
    it('returns error when amount is empty', () => {
      expect(validateField('amount', '')).toBe('Please enter a loan amount');
    });

    it('returns error when amount is whitespace', () => {
      expect(validateField('amount', '   ')).toBe('Please enter a loan amount');
    });

    it('returns error when amount is non-numeric', () => {
      expect(validateField('amount', 'abc')).toBe('Please enter a valid number');
    });

    it('returns error when amount is zero', () => {
      expect(validateField('amount', '0')).toBe('Loan amount must be greater than 0');
    });

    it('returns error when amount is negative', () => {
      expect(validateField('amount', '-100')).toBe('Loan amount must be greater than 0');
    });

    it('returns error when amount exceeds 10,000,000', () => {
      expect(validateField('amount', '10000001')).toBe('Loan amount must not exceed 10,000,000');
    });

    it('returns null for valid amount', () => {
      expect(validateField('amount', '10000')).toBeNull();
    });

    it('returns null for amount at upper boundary (10,000,000)', () => {
      expect(validateField('amount', '10000000')).toBeNull();
    });

    it('returns null for small valid amount', () => {
      expect(validateField('amount', '0.01')).toBeNull();
    });
  });

  // Term field validation
  describe('term', () => {
    it('returns error when term is empty', () => {
      expect(validateField('term', '')).toBe('Please enter a loan term');
    });

    it('returns error when term is whitespace', () => {
      expect(validateField('term', '  ')).toBe('Please enter a loan term');
    });

    it('returns error when term is non-numeric', () => {
      expect(validateField('term', 'abc')).toBe('Please enter a valid number');
    });

    it('returns error when term is zero', () => {
      expect(validateField('term', '0')).toBe('Loan term must be at least 1 month');
    });

    it('returns error when term is negative', () => {
      expect(validateField('term', '-5')).toBe('Loan term must be at least 1 month');
    });

    it('returns error when term is a decimal', () => {
      expect(validateField('term', '12.5')).toBe('Please enter a whole number for months');
    });

    it('returns error when term exceeds 600', () => {
      expect(validateField('term', '601')).toBe('Loan term must not exceed 600 months');
    });

    it('returns null for valid term', () => {
      expect(validateField('term', '12')).toBeNull();
    });

    it('returns null for term at minimum (1)', () => {
      expect(validateField('term', '1')).toBeNull();
    });

    it('returns null for term at maximum (600)', () => {
      expect(validateField('term', '600')).toBeNull();
    });
  });

  // Rate field validation
  describe('rate', () => {
    it('returns error when rate is empty', () => {
      expect(validateField('rate', '')).toBe('Please enter an interest rate');
    });

    it('returns error when rate is whitespace', () => {
      expect(validateField('rate', '  ')).toBe('Please enter an interest rate');
    });

    it('returns error when rate is non-numeric', () => {
      expect(validateField('rate', 'abc')).toBe('Please enter a valid number');
    });

    it('returns error when rate is negative', () => {
      expect(validateField('rate', '-1')).toBe('Interest rate must be between 0 and 100');
    });

    it('returns error when rate exceeds 100', () => {
      expect(validateField('rate', '101')).toBe('Interest rate must be between 0 and 100');
    });

    it('returns error when rate has more than 2 decimal places', () => {
      expect(validateField('rate', '5.123')).toBe('Interest rate allows up to 2 decimal places');
    });

    it('returns error when rate has 3 decimal places', () => {
      expect(validateField('rate', '5.12345')).toBe('Interest rate allows up to 2 decimal places');
    });

    it('returns null for valid rate', () => {
      expect(validateField('rate', '5.0')).toBeNull();
    });

    it('returns null for rate of 0 (zero interest)', () => {
      expect(validateField('rate', '0')).toBeNull();
    });

    it('returns null for rate at maximum (100)', () => {
      expect(validateField('rate', '100')).toBeNull();
    });

    it('returns null for rate with 2 decimal places', () => {
      expect(validateField('rate', '5.25')).toBeNull();
    });

    it('returns null for rate with 1 decimal place', () => {
      expect(validateField('rate', '3.5')).toBeNull();
    });
  });
});

describe('validateLoanForm', () => {
  it('returns empty object for valid form', () => {
    const values: LoanFormState = { amount: '10000', term: '12', rate: '5.0' };
    expect(validateLoanForm(values)).toEqual({});
  });

  it('returns errors for all empty fields', () => {
    const values: LoanFormState = { amount: '', term: '', rate: '' };
    const errors = validateLoanForm(values);
    expect(errors.amount).toBe('Please enter a loan amount');
    expect(errors.term).toBe('Please enter a loan term');
    expect(errors.rate).toBe('Please enter an interest rate');
  });

  it('returns errors only for invalid fields', () => {
    const values: LoanFormState = { amount: '10000', term: '', rate: '5.0' };
    const errors = validateLoanForm(values);
    expect(errors.amount).toBeUndefined();
    expect(errors.term).toBe('Please enter a loan term');
    expect(errors.rate).toBeUndefined();
  });

  it('returns multiple errors for multiple invalid fields', () => {
    const values: LoanFormState = { amount: '-100', term: '12.5', rate: '101' };
    const errors = validateLoanForm(values);
    expect(errors.amount).toBe('Loan amount must be greater than 0');
    expect(errors.term).toBe('Please enter a whole number for months');
    expect(errors.rate).toBe('Interest rate must be between 0 and 100');
  });
});
