import React from 'react';
import './PollHistory.css';

const PollHistory = ({ history, onClose }) => {
  return (
    <div className="poll-history-overlay" onClick={onClose}>
      <div className="poll-history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="history-page-header">
           <h1>View <strong>Poll History</strong></h1>
           <button className="close-btn-history" onClick={onClose}>×</button>
        </div>
        
        <div className="history-scroll-container">
            {(!history || history.length === 0) ? (
                <p className="no-history-msg">No polls recorded yet.</p>
            ) : (
                history.map((poll, index) => (
                    <div key={index} className="history-item-block">
                        <h3 className="history-q-label">Question {index + 1}</h3>
                        
                        <div className="history-q-box-dark">
                            <span className="h-q-text">{poll.question}</span>
                        </div>

                        <div className="history-results-stack">
                            {poll.options.map((option, optIndex) => {
                                const result = poll.results[optIndex] || { count: 0, percentage: 0 };
                                return (
                                    <div key={optIndex} className="h-result-row">
                                        <div 
                                            className="h-fill-bar" 
                                            style={{ width: `${result.percentage}%` }}
                                        ></div>
                                        <div className="h-content">
                                            <div className="h-left">
                                                <span className="h-circle">{optIndex + 1}</span>
                                                <span className="h-opt-text">{option}</span>
                                            </div>
                                            <span className="h-percent">{result.percentage}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;