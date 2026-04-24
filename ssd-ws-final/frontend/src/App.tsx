import { useState } from 'react';
import { LoanForm } from './components/LoanForm';
import { PaymentDisplay } from './components/PaymentDisplay';
import { InstallmentTable } from './components/InstallmentTable';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ToastProvider } from './contexts/ToastContext';
import { Toast } from './components/Toast/Toast';
import { useToast } from './contexts/ToastContext';
import type { LoanResult, PaymentDisplayData } from './types/loan';
import './App.css';

function AppContent() {
  const { showToast } = useToast();
  const [result, setResult] = useState<LoanResult | null>(null);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (calcResult: LoanResult, principal: number) => {
    setResult(calcResult);
    setLoanAmount(principal);
    setError(null);
    showToast('Calculation completed successfully', 'success');
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      // Clear previous result when a new calculation starts (FR-007)
      setResult(null);
      setError(null);
    }
  };

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
    if (errorMessage) {
      showToast(`Calculation failed: ${errorMessage}`, 'error');
    }
  };

  const handleRetry = () => {
    // Retry triggers a new form submission by the user;
    // the form retains its last values so user can click Calculate again.
    // For now, this clears the error state to show the placeholder.
    setError(null);
  };

  const displayData: PaymentDisplayData | null = result
    ? {
        monthlyPayment: result.monthly_payment,
        totalPayment: result.total_payment,
        totalInterest: result.total_interest,
        principal: loanAmount,
      }
    : null;

return (
    <div className="app-layout">
      <Toolbar />
      <aside className="sidebar">
        <LoanForm
          onCalculate={handleCalculate}
          onLoadingChange={handleLoadingChange}
          onError={handleError}
        />
      </aside>
      <main className="results">
        <PaymentDisplay data={displayData} />
        <InstallmentTable
          installments={result?.schedule ?? null}
          originalLoanAmount={loanAmount}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </main>
      <Toast />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
