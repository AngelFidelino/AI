import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { X } from 'lucide-react';
import './Toast.css';

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'error';
  onClose: (id: string) => void;
}

function ToastItem({ id, message, type, onClose }: ToastItemProps) {
  return (
    <div 
      className={`toast toast--${type}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="toast__message">
        {message}
      </span>
      <button
        className="toast__close"
        onClick={() => onClose(id)}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function Toast() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      ))}
    </div>
  );
}