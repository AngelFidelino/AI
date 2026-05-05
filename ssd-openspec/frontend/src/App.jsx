import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import LoanForm from './components/LoanForm.jsx';
import PaymentDisplay from './components/PaymentDisplay.jsx';
import PaymentTable from './components/PaymentTable.jsx';
import EmptyState from './components/EmptyState.jsx';
import Toast from './components/Toast.jsx';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleCalculate = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Import API service dynamically to avoid build errors
      const { default: apiService } = await import('./services/api');
      
      const response = await apiService.calculateLoan(
        formData.amount,
        formData.rate,
        formData.term
      );
      
      setResults(response);
      setAnimKey(prev => prev + 1); // Increment animKey to restart animations
      setShowToast(true);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(false);
    setResults(null);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="main-layout">
      <Sidebar />
      
      <div className="main-content">
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 8px 0'
          }}>
            Loan Calculator
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: '0'
          }}>
            Calculate loan payments and generate amortization schedules
          </p>
        </header>

        <main>
          <div className="payment-grid">
            <div>
              <LoanForm onCalculate={handleCalculate} isLoading={isLoading} />
              
              {error && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '14px'
                }}>
                  {error}
                  <button
                    onClick={handleRetry}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      backgroundColor: 'var(--purple)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
            
            <div>
              {!results && !isLoading && <EmptyState />}
              
              {results && (
                <PaymentDisplay
                  monthlyPayment={results.monthlyPayment}
                  totalPayment={results.installments?.reduce((total, installment) => total + installment.payment, 0) || 0}
                  principal={results.installments?.reduce((total, installment) => total + installment.principal, 0) || 0}
                  interest={results.installments?.reduce((total, installment) => total + installment.interest, 0) || 0}
                  balance={results.installments?.[results.installments.length - 1]?.balance || 0}
                  animKey={animKey}
                />
              )}
            </div>
          </div>
          
          {results && (
            <div style={{ marginTop: '40px' }}>
              <PaymentTable
                installments={results.installments || []}
                animKey={animKey}
              />
            </div>
          )}
        </main>
      </div>

      <Toast
        message="Calculation completed successfully!"
        isVisible={showToast}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default App;