import { useState } from 'react';
import LoanForm from './components/LoanForm.jsx';
import Results from './components/Results.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Import API service dynamically to avoid build errors
      const { default: apiService } = await import('./services/api');
      
      const response = await apiService.calculateLoan(
        formData.amount,
        formData.rate,
        formData.term
      );
      
      setResults(response);
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Loan Calculator</h1>
        <p>Calculate loan payments and generate amortization schedules</p>
      </header>

      <main>
        <LoanForm onCalculate={handleCalculate} isLoading={isLoading} />
        <ErrorMessage message={error} onRetry={handleRetry} />
        <Results monthlyPayment={results?.monthlyPayment} installments={results?.installments} />
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 Loan Calculator. Educational proof of concept.</p>
      </footer>
    </div>
  );
}

export default App;