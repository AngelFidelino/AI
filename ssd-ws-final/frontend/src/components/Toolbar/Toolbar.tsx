import React from 'react';
import { Calculator } from 'lucide-react';
import './Toolbar.css';

export function Toolbar() {
  const scrollToLoanForm = () => {
    const loanFormElement = document.querySelector('.sidebar');
    if (loanFormElement) {
      loanFormElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <aside className="toolbar" aria-label="Navigation">
      <button
        className="toolbar__button"
        onClick={scrollToLoanForm}
        aria-label="Scroll to Loan Calculator"
        title="Go to Loan Calculator"
      >
        <Calculator size={24} />
      </button>
    </aside>
  );
}