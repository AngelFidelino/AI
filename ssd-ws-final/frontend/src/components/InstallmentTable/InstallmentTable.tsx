import type { InstallmentTableProps } from '../../types/loan';
import { formatCurrency } from '../../utils/formatCurrency';
import './InstallmentTable.css';

function calculateProgress(
  originalLoanAmount: number,
  remainingBalance: number
): number {
  if (originalLoanAmount <= 0) return 0;
  return Math.round(
    ((originalLoanAmount - remainingBalance) / originalLoanAmount) * 100
  );
}

export function InstallmentTable({
  installments,
  originalLoanAmount,
  isLoading,
  error,
  onRetry,
}: InstallmentTableProps) {
  // State resolution (priority order): loading → error → null → empty → data
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="installment-table__loading" aria-live="polite">
          <p>Loading payment schedule...</p>
        </div>
      );
    }

    if (error !== null) {
      return (
        <div className="installment-table__error" role="alert">
          <p className="installment-table__error-message">{error}</p>
          <button
            className="installment-table__retry-button"
            type="button"
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      );
    }

    if (installments === null) {
      return (
        <div className="installment-table__placeholder">
          <p>Enter loan details and calculate to see payment schedule.</p>
        </div>
      );
    }

    if (installments.length === 0) {
      return (
        <div className="installment-table__empty">
          <p>No payment schedule available.</p>
        </div>
      );
    }

    // Compute summary totals
    const summary = installments.reduce(
      (acc, inst) => ({
        totalPayments: acc.totalPayments + inst.payment_amount,
        totalPrincipal: acc.totalPrincipal + inst.principal_portion,
        totalInterest: acc.totalInterest + inst.interest_portion,
      }),
      { totalPayments: 0, totalPrincipal: 0, totalInterest: 0 }
    );

    return (
      <div className="installment-table__wrapper">
        <table className="installment-table__table">
          <caption className="installment-table__caption">
            Loan Amortization Schedule
          </caption>
          <thead className="installment-table__head">
            <tr>
              <th scope="col" className="installment-table__th">
                Payment #
              </th>
              <th scope="col" className="installment-table__th">
                Payment Amount
              </th>
              <th scope="col" className="installment-table__th">
                Principal
              </th>
              <th
                scope="col"
                className="installment-table__th installment-table__th--interest"
              >
                Interest
              </th>
              <th scope="col" className="installment-table__th">
                Remaining Balance
              </th>
              <th scope="col" className="installment-table__th">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="installment-table__body">
            {installments.map((inst) => {
              const progress = calculateProgress(
                originalLoanAmount,
                inst.remaining_balance
              );
              return (
                <tr
                  key={inst.payment_number}
                  className="installment-table__row"
                >
                  <td className="installment-table__cell installment-table__payment-number">
                    {inst.payment_number}
                  </td>
                  <td className="installment-table__cell installment-table__amount">
                    {formatCurrency(inst.payment_amount)}
                  </td>
                  <td className="installment-table__cell installment-table__principal">
                    {formatCurrency(inst.principal_portion)}
                  </td>
                  <td className="installment-table__cell installment-table__interest">
                    {formatCurrency(inst.interest_portion)}
                  </td>
                  <td className="installment-table__cell installment-table__balance">
                    {formatCurrency(inst.remaining_balance)}
                  </td>
                  <td className="installment-table__cell installment-table__progress-cell">
                    <div
                      className="installment-table__progress"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${progress}% of loan repaid`}
                    >
                      <div
                        className="installment-table__progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="installment-table__foot">
            <tr className="installment-table__row installment-table__row--summary">
              <td className="installment-table__cell installment-table__payment-number">
                Total
              </td>
              <td className="installment-table__cell installment-table__amount">
                {formatCurrency(summary.totalPayments)}
              </td>
              <td className="installment-table__cell installment-table__principal">
                {formatCurrency(summary.totalPrincipal)}
              </td>
              <td className="installment-table__cell installment-table__interest">
                {formatCurrency(summary.totalInterest)}
              </td>
              <td className="installment-table__cell installment-table__balance"></td>
              <td className="installment-table__cell installment-table__progress-cell">
                <div
                  className="installment-table__progress"
                  role="progressbar"
                  aria-valuenow={100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="100% of loan repaid"
                >
                  <div
                    className="installment-table__progress-fill"
                    style={{ width: '100%' }}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  // Data integrity warning check
  const hasBalanceWarning =
    installments !== null &&
    installments.length > 0 &&
    !isLoading &&
    error === null &&
    installments[installments.length - 1].remaining_balance !== 0;

  const showCount =
    installments !== null && installments.length > 0 && !isLoading && error === null;

  return (
    <section
      className="installment-table"
      aria-labelledby="installment-table-title"
    >
      <div className="installment-table__header">
        <h2 id="installment-table-title">Payment Schedule</h2>
        {showCount && (
          <span className="installment-table__count">
            {installments!.length} payments
          </span>
        )}
      </div>
      {renderContent()}
      {hasBalanceWarning && (
        <div className="installment-table__warning" role="alert">
          The final payment does not result in a $0.00 balance. Remaining
          balance: {formatCurrency(installments![installments!.length - 1].remaining_balance)}.
          This may indicate a rounding discrepancy in the calculation.
        </div>
      )}
    </section>
  );
}
