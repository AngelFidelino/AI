import React, { useState } from 'react';
import Field from './Field.jsx';

const LoanForm = ({ onCalculate, isLoading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    rate: '',
    term: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleBlur = (field) => (e) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Loan amount must be greater than 0';
    }
    
    if (!formData.rate || formData.rate <= 0 || formData.rate > 100) {
      newErrors.rate = 'Interest rate must be between 0 and 100';
    }
    
    if (!formData.term || formData.term <= 0 || formData.term > 1200) {
      newErrors.term = 'Loan term must be between 1 and 1200 months';
    }
    
    setErrors(newErrors);
    setTouched({ amount: true, rate: true, term: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCalculate({
        amount: parseFloat(formData.amount),
        rate: parseFloat(formData.rate),
        term: parseInt(formData.term)
      });
    }
  };

  const isMouseDown = useState(false);

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      padding: '24px'
    }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 24px 0'
        }}>
          Loan Details
        </h2>
        
        <Field
          label="Loan Amount ($)"
          type="number"
          placeholder="100,000"
          value={formData.amount}
          onChange={handleChange('amount')}
          onBlur={handleBlur('amount')}
          error={errors.amount}
          touched={touched.amount}
          disabled={isLoading}
        />
        
        <Field
          label="Annual Interest Rate (%)"
          type="number"
          step="0.1"
          placeholder="5.5"
          value={formData.rate}
          onChange={handleChange('rate')}
          onBlur={handleBlur('rate')}
          error={errors.rate}
          touched={touched.rate}
          disabled={isLoading}
        />
        
        <Field
          label="Loan Term (months)"
          type="number"
          placeholder="360"
          value={formData.term}
          onChange={handleChange('term')}
          onBlur={handleBlur('term')}
          error={errors.term}
          touched={touched.term}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            height: '44px',
            backgroundColor: 'var(--purple)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {isLoading ? 'Calculating…' : 'Calculate'}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;