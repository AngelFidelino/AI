
import './Results.css';

const Results =({ monthlyPayment, installments }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotalInterest = () => {
    return installments.reduce((total, installment) => total + installment.interest, 0);
  };

  const calculateTotalPayment = () => {
    return installments.reduce((total, installment) => total + installment.payment, 0);
  };

  if (!monthlyPayment || !installments || installments.length === 0) {
    return null;
  }

  return (
    <div className="results">
      <div className="summary">
        <h2>Loan Calculation Results</h2>
        <div className="monthly-payment">
          <span className="label">Monthly Payment:</span>
          <span className="amount">{formatCurrency(monthlyPayment)}</span>
        </div>
        <div className="summary-stats">
          <div className="stat">
            <span className="label">Total of {installments.length} Payments:</span>
            <span className="value">{formatCurrency(calculateTotalPayment())}</span>
          </div>
          <div className="stat">
            <span className="label">Total Interest Paid:</span>
            <span className="value">{formatCurrency(calculateTotalInterest())}</span>
          </div>
        </div>
      </div>

      <div className="amortization-table">
        <h3>Amortization Schedule</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payment #</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {installments.map((installment) => (
                <tr key={installment.period}>
                  <td>{installment.period}</td>
                  <td>{formatCurrency(installment.payment)}</td>
                  <td>{formatCurrency(installment.principal)}</td>
                  <td>{formatCurrency(installment.interest)}</td>
                  <td>{formatCurrency(installment.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;