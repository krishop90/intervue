import React from 'react';
import './PollHistory.css';

const PollHistory = ({ history, onClose }) => {
  if (!history || history.length === 0) {
    return (
      <div className="poll-history-overlay" onClick={onClose}>
        <div className="poll-history-panel" onClick={(e) => e.stopPropagation()}>
          <div className="poll-history-header">
            <h2>View Poll History</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <p className="no-history">No poll history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="poll-history-overlay" onClick={onClose}>
      <div className="poll-history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="poll-history-header">
          <h2>View Poll History</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="poll-history-list">
          {history.map((poll, index) => (
            <div key={index} className="poll-history-item">
              <h3>Question {index + 1}: {poll.question}</h3>
              <div className="history-results">
                {poll.options.map((option, optIndex) => {
                  const result = poll.results[optIndex] || { count: 0, percentage: 0 };
                  return (
                    <div key={optIndex} className="history-result-item">
                      <div className="history-result-header">
                        <span className="history-option-number">{optIndex + 1}</span>
                        <span className="history-option-text">{option}</span>
                        <span className="history-percentage">{result.percentage}%</span>
                      </div>
                      <div className="history-result-bar-container">
                        <div
                          className="history-result-bar"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;

