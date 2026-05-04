import React, { useEffect } from 'react';

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        // No auto-dismiss - this is intentional per requirements
      }, 250); // Just for animation timing
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="anim" 
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        backgroundColor: 'var(--toast-bg)',
        border: '1px solid var(--toast-border)',
        borderRadius: '14px',
        padding: '14px 18px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '400px'
      }}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: '#22c55e', flexShrink: 0 }}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
      </svg>
      
      <span style={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#0d542b',
        flex: 1
      }}>
        {message}
      </span>
      
      <button
        onClick={onClose}
        style={{
          BackgroundColor: 'transparent',
          border: 'none',
          fontSize: '18px',
          color: '#0d542b',
          cursor: 'pointer',
          padding: '0',
          opacity: 0.6,
          transition: 'opacity 0.2s ease',
          lineHeight: 1
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1.0';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.6';
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;