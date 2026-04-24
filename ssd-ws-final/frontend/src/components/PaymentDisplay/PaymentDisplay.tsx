import type { PaymentDisplayProps } from '../../types/loan';
import { formatCurrency } from '../../utils/formatCurrency';
import './PaymentDisplay.css';

export function PaymentDisplay({ data }: PaymentDisplayProps) {
  return (
    <div className="payment-display" aria-live="polite">
      {data === null ? (
        <section className="payment-display__placeholder">
          <p>Calculate a loan to see results</p>
        </section>
      ) : (
        <div className="payment-display__cards">
          {/* Monthly Payment Card */}
          <section
            className="payment-display__card payment-display__card--monthly"
            aria-label="Monthly Payment"
          >
            <div className="payment-display__card-header">
              <h3 className="payment-display__card-label">Monthly Payment</h3>
              <span className="payment-display__card-icon" aria-hidden="true">$</span>
            </div>
            <p className="payment-display__amount payment-display__amount--primary">
              {formatCurrency(data.monthlyPayment)}
            </p>
            <p className="payment-display__card-description">
              Amount due each month
            </p>
          </section>

          {/* Total Payment Card (Featured) */}
          <section
            className="payment-display__card payment-display__card--total"
            aria-label="Total Payment"
          >
            <div className="payment-display__card-header">
              <h3 className="payment-display__card-label">Total Payment</h3>
              <span className="payment-display__card-icon" aria-hidden="true">&uarr;</span>
            </div>
            <p className="payment-display__amount">
              {formatCurrency(data.totalPayment)}
            </p>
            <p className="payment-display__card-description">
              Over loan lifetime
            </p>
          </section>

          {/* Payment Breakdown Card */}
          <section
            className="payment-display__card payment-display__card--breakdown"
            aria-label="Payment Breakdown"
          >
            <h3 className="payment-display__card-label">Payment Breakdown</h3>
            <div className="payment-display__breakdown-grid">
              <div className="payment-display__breakdown-item">
                <span className="payment-display__breakdown-label">Principal Amount</span>
                <span className="payment-display__breakdown-value">
                  {formatCurrency(data.principal)}
                </span>
              </div>
              <div className="payment-display__breakdown-item">
                <span className="payment-display__breakdown-label">Total Interest</span>
                <span className="payment-display__breakdown-value">
                  {formatCurrency(data.totalInterest)}
                </span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
