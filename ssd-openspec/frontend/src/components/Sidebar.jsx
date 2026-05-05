import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '20px 0'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(255,255,255,0.10)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'white' }}
          >
            <path d="M13 7H11V13H13V7ZM13 17H11V15H13V17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;