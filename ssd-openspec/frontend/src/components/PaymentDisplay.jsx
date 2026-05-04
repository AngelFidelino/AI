import React from 'react';
import { formatCurrency } from './Field.jsx';

const PaymentDisplay = ({ monthlyPayment, totalPayment, principal, interest, balance, animKey }) => {
  if (!monthlyPayment) {
    return <div />; // Empty when no data
  }

  const monthlyPaymentFloat = parseFloat(monthlyPayment);
  const totalPaymentFloat = parseFloat(totalPayment);
  const principalFloat = parseFloat(principal);
  const interestFloat = parseFloat(interest);
  const balanceFloat = parseFloat(balance);

  const interestPercentage = totalPaymentFloat > 0 ? (interestFloat / totalPaymentFloat) * 100 : 0;
  const principalPercentage = totalPaymentFloat > 0 ? (principalFloat / totalPaymentFloat) * 100 : 0;

  return (
    <div key={animKey}>
      {/* Payment Cards Grid */}
      <div className="payment-grid" style={{ marginBottom: '24px' }}>
        {/* Total Payment Card */}
        <div 
          className="anim" 
          style={{
            background: 'linear-gradient(135deg, #615fff, #432dd7)',
            borderRadius: '16px',
            padding: '24px 25px',
            color: 'white'
          }}
        >
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#e0e7ff' }}>
            Total Payment
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700' }}>
            {formatCurrency(totalPaymentFloat)}
          </div>
        </div>

        {/* Monthly Payment Card */}
        <div 
          className="anim1" 
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            padding: '24px 25px'
          }}
        >
          <div style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Monthly Payment
          </div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#1d293d' }}>
            {formatCurrency(monthlyPaymentFloat)}
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div 
        className="anim2" 
        style={{ marginBottom: '24px' }}
      >
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 16px 0'
        }}>
          Payment Breakdown
        </h3>
        
        <div className="breakdown-grid">
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Principal
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1d293d' }}>
              {formatCurrency(principalFloat)}
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Total Interest
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1d293d' }}>
              {formatCurrency(interestFloat)}
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Balance
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1d293d' }}>
              {formatCurrency(balanceFloat)}
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Interest Rate
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1d293d' }}>
              {interestPercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="anim3">
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          margin: '0 0 16px 0'
        }}>
          Payment Progress
        </h3>
        
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '14px',
          padding: '20px'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Principal vs Interest
            </div>
            <div style={{
              height: '32px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'linear-gradient(90deg, #615fff 0%, #4f39f6 ' + principalPercentage + '%, #e0e7ff ' + principalPercentage + '%, #e0e7ff 100%)'
            }}>
              <div style={{
                width: principalPercentage + '%',
                height: '100%',
                background: 'linear-gradient(90deg, #615fff, #4f39f6)',
                animation: 'barFill 700ms ease 150ms both',
                '--target-width': principalPercentage + '%'
              }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-primary)' }}>
              Principal: {principalPercentage.toFixed(0)}%
            </span>
            <span style={{ color: 'var(--text-primary)' }}>
              Interest: {interestPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDisplay;