import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateLoan, LoanApiError } from '../services/loanApi';
import type { LoanCalculateRequest } from '../types/loan';

const mockRequest: LoanCalculateRequest = {
  amount: 10000,
  term_months: 12,
  annual_rate: 5.0,
};

const mockSuccessResponse = {
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

describe('calculateLoan', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends correct request to API endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockSuccessResponse),
    });
    vi.stubGlobal('fetch', mockFetch);

    await calculateLoan(mockRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/loans/calculate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 10000,
          term_months: 12,
          annual_rate: 5.0,
        }),
      })
    );
  });

  it('returns LoanResult on successful 200 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })
    );

    const result = await calculateLoan(mockRequest);
    expect(result).toEqual(mockSuccessResponse);
  });

  it('throws LoanApiError with field errors on 400 validation error', async () => {
    const errorResponse = {
      error: 'validation_error',
      details: [
        { field: 'term_months', message: 'Must be a positive integer' },
        { field: 'annual_rate', message: 'Must be between 0 and 100' },
      ],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })
    );

    try {
      await calculateLoan(mockRequest);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(LoanApiError);
      const apiError = error as LoanApiError;
      expect(apiError.fieldErrors).toEqual({
        term: 'Must be a positive integer',
        rate: 'Must be between 0 and 100',
      });
    }
  });

  it('maps backend field names to frontend field names in 400 errors', async () => {
    const errorResponse = {
      error: 'validation_error',
      details: [
        { field: 'amount', message: 'Amount is required' },
        { field: 'term_months', message: 'Term is required' },
        { field: 'annual_rate', message: 'Rate is required' },
      ],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })
    );

    try {
      await calculateLoan(mockRequest);
      expect.fail('Should have thrown');
    } catch (error) {
      const apiError = error as LoanApiError;
      expect(apiError.fieldErrors).toEqual({
        amount: 'Amount is required',
        term: 'Term is required',
        rate: 'Rate is required',
      });
    }
  });

  it('throws LoanApiError with generic message on 500 server error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'internal_error' }),
      })
    );

    try {
      await calculateLoan(mockRequest);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(LoanApiError);
      expect((error as LoanApiError).message).toBe(
        'An error occurred while calculating. Please try again.'
      );
      expect((error as LoanApiError).fieldErrors).toBeUndefined();
    }
  });

  it('throws LoanApiError with network error message on fetch failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    );

    try {
      await calculateLoan(mockRequest);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(LoanApiError);
      expect((error as LoanApiError).message).toBe(
        'Unable to connect to server. Please try again.'
      );
    }
  });

  it('throws LoanApiError with timeout message on AbortError', async () => {
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    try {
      await calculateLoan(mockRequest);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(LoanApiError);
      expect((error as LoanApiError).message).toBe(
        'Request timed out. Please try again.'
      );
    }
  });

  it('uses AbortSignal with 10-second timeout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })
    );

    await calculateLoan(mockRequest);

    const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const options = fetchCall[1];
    expect(options.signal).toBeDefined();
  });
});
