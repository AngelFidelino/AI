import React from 'react';

// Field component declared at module level (CRITICAL - prevents React unmounting)
const Field = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched,
  disabled = false 
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-label)'
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        style={{
          width: '100%',
          height: '44px',
          padding: '0 16px',
          border: `1.5px ${
            error && touched 
              ? '#ef4444' 
              : 'var(--border)'
          }`,
          borderRadius: '8px',
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          fontSize: '16px',
          transition: 'all 150ms ease',
          outline: 'none',
          boxShadow: error && touched 
            ? 'none' 
            : '0 0 0 3px transparent'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--purple)';
          e.target.style.boxShadow = '0 0 0 3px rgba(79,57,246,0.12)';
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }
          if (onBlur) onBlur(e);
        }}
      />
      {error && touched && (
        <div style={{
          marginTop: '4px',
          fontSize: '12px',
          color: '#ef4444'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// Number formatting utility
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export default Field;