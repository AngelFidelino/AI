import React from 'react';

const EmptyState = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#f1f5f9',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: '#62748e' }}
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
        </svg>
      </div>
      
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: '0 0 8px 0'
      }}>
        Ready to Calculate
      </h2>
      
      <p style={{
        fontSize: '16px',
        fontWeight: '400',
        color: 'var(--text-secondary)',
        margin: '0',
        textAlign: 'center'
      }}>
        Enter your loan details and click calculate to see the payment breakdown
      </p>
    </div>
  );
};

export default EmptyState;