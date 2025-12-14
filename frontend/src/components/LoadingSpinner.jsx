import './LoadingSpinner.css';

function LoadingSpinner({ message = 'Analyzing repository...' }) {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
}

export default LoadingSpinner;

