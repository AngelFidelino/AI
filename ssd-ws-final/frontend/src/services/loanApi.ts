import type { LoanCalculateRequest, LoanResult, ApiError } from '../types/loan';

const BACKEND_TO_FRONTEND_FIELD_MAP: Record<string, string> = {
  amount: 'amount',
  term_months: 'term',
  annual_rate: 'rate',
};

export class LoanApiError extends Error {
  public readonly fieldErrors?: Record<string, string>;

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'LoanApiError';
    this.fieldErrors = fieldErrors;
  }
}

export async function calculateLoan(
  params: LoanCalculateRequest
): Promise<LoanResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('/api/v1/loans/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: params.amount,
        term_months: params.term_months,
        annual_rate: params.annual_rate,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: LoanResult = await response.json();
      return data;
    }

    if (response.status === 400) {
      const errorData: ApiError = await response.json();
      const fieldErrors: Record<string, string> = {};

      for (const detail of errorData.details) {
        const frontendField =
          BACKEND_TO_FRONTEND_FIELD_MAP[detail.field] || detail.field;
        fieldErrors[frontendField] = detail.message;
      }

      throw new LoanApiError('Validation error', fieldErrors);
    }

    throw new LoanApiError(
      'An error occurred while calculating. Please try again.'
    );
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof LoanApiError) {
      throw error;
    }

    if (
      error instanceof DOMException &&
      error.name === 'AbortError'
    ) {
      throw new LoanApiError('Request timed out. Please try again.');
    }

    throw new LoanApiError(
      'Unable to connect to server. Please try again.'
    );
  }
}
