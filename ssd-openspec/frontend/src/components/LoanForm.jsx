import { useState } from 'react';
import './LoanForm.css';

const LoanForm = ({ onCalculate, isLoading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    rate: '',
    term: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Loan amount must be greater than 0';
    } else if (parseFloat(formData.amount) < 1000) {
      newErrors.amount = 'Loan amount must be at least $1,000';
    } else if (parseFloat(formData.amount) > 10000000) {
      newErrors.amount = 'Loan amount cannot exceed $10,000,000';
    }
    
    if (!formData.rate || parseFloat(formData.rate) < 0) {
      newErrors.rate = 'Interest rate must be 0 or greater';
    } else if (parseFloat(formData.rate) > 100) {
      newErrors.rate = 'Interest rate cannot exceed 100%';
    }
    
    if (!formData.term || parseInt(formData.term) <= 0) {
      newErrors.term = 'Loan term must be greater than 0';
    } else if (parseInt(formData.term) > 360) {
      newErrors.term = 'Loan term cannot exceed 360 months (30 years)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onCalculate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="loan-form">
      <div className="form-group">
        <label htmlFor="amount">Loan Amount ($)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="100000"
          step="0.01"
          min="0"
        />
        {errors.amount && <span className="error">{errors.amount}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="rate">Annual Interest Rate (%)</label>
        <input
          type="number"
          id="rate"
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          placeholder="6.5"
          step="0.01"
          min="0"
          max="100"
        />
        {errors.rate && <span className="error">{errors.rate}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="term">Loan Term (months)</label>
        <input
          type="number"
          id="term"
          name="term"
          value={formData.term}
          onChange={handleChange}
          placeholder="360"
          min="1"
          max="360"
        />
        {errors.term && <span className="error">{errors.term}</span>}
      </div>
      
      <button type="submit" disabled={isLoading} className="calculate-btn">
        {isLoading ? 'Calculating...' : 'Calculate Loan'}
      </button>
    </form>
  );
};

export default LoanForm;