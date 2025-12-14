import './SummaryDisplay.css';

function SummaryDisplay({ summary }) {
  return (
    <div className="summary-display card">
      <h3 className="section-title">
        <span className="title-icon">📋</span>
        Summary
      </h3>
      <p className="summary-text">{summary}</p>
    </div>
  );
}

export default SummaryDisplay;

