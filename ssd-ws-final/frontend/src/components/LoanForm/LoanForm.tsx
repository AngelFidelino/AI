import { useState } from 'react';
import type { LoanFormState, LoanFormProps, ValidationErrors } from '../../types/loan';
import { validateLoanForm, validateField } from '../../utils/validation';
import { calculateLoan, LoanApiError } from '../../services/loanApi';
import './LoanForm.css';

export function LoanForm({ onCalculate, onLoadingChange, onError }: LoanFormProps) {
  const [formState, setFormState] = useState<LoanFormState>({
    amount: '',
    term: '',
    rate: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (field: keyof LoanFormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field: keyof LoanFormState) => () => {
    const error = validateField(field, formState[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous API errors
    setApiError(null);

    // Validate all fields
    const validationErrors = validateLoanForm(formState);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    onLoadingChange?.(true);
    onError?.(null);

    try {
      const result = await calculateLoan({
        amount: Number(formState.amount),
        term_months: Number(formState.term),
        annual_rate: Number(formState.rate),
      });
      onCalculate(result, Number(formState.amount));
    } catch (error) {
      if (error instanceof LoanApiError) {
        if (error.fieldErrors) {
          setErrors((prev) => ({ ...prev, ...error.fieldErrors }));
        } else {
          setApiError(error.message);
          onError?.(error.message);
        }
      } else {
        const message = 'An error occurred while calculating. Please try again.';
        setApiError(message);
        onError?.(message);
      }
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <form className="loan-form" onSubmit={handleSubmit}>
      <h2>Loan Details</h2>

      <div className={`form-field${errors.amount ? ' form-field--error' : ''}`}>
        <label htmlFor="amount">Loan Amount ($)</label>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="e.g., 10000"
          value={formState.amount}
          onChange={handleChange('amount')}
          onBlur={handleBlur('amount')}
          aria-describedby="amount-error"
          aria-invalid={!!errors.amount}
        />
        <span id="amount-error" className="error-message" role="alert">
          {errors.amount || ''}
        </span>
      </div>

      <div className={`form-field${errors.term ? ' form-field--error' : ''}`}>
        <label htmlFor="term">Loan Term (months)</label>
        <input
          id="term"
          type="text"
          inputMode="numeric"
          placeholder="e.g., 12"
          value={formState.term}
          onChange={handleChange('term')}
          onBlur={handleBlur('term')}
          aria-describedby="term-error"
          aria-invalid={!!errors.term}
        />
        <span id="term-error" className="error-message" role="alert">
          {errors.term || ''}
        </span>
      </div>

      <div className={`form-field${errors.rate ? ' form-field--error' : ''}`}>
        <label htmlFor="rate">Annual Interest Rate (%)</label>
        <input
          id="rate"
          type="text"
          inputMode="decimal"
          placeholder="e.g., 5.0"
          value={formState.rate}
          onChange={handleChange('rate')}
          onBlur={handleBlur('rate')}
          aria-describedby="rate-error"
          aria-invalid={!!errors.rate}
        />
        <span id="rate-error" className="error-message" role="alert">
          {errors.rate || ''}
        </span>
      </div>

      {apiError && (
        <div className="api-error" role="alert">
          {apiError}
        </div>
      )}

      <button
        type="submit"
        className={`submit-button${isLoading ? ' submit-button--loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
}
