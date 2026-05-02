
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-content">
        <h3>Error</h3>
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-btn">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;