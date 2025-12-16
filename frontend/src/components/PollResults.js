import React from 'react';
import { useSelector } from 'react-redux';
import './PollResults.css';

const PollResults = ({ isTeacher, isActive, onAskNewQuestion, timeRemaining }) => {
  const { currentQuestion, options, results } = useSelector((state) => state.poll);

  const handleAskNewQuestion = () => {
    if (onAskNewQuestion) {
      onAskNewQuestion();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalVotes = () => {
    return Object.values(results).reduce((sum, result) => sum + result.count, 0);
  };

  if (!currentQuestion) return null;

  const effectiveResults = options.map((option, index) => results[index] || { count: 0, percentage: 0, option });

  return (
    <div className="poll-results-container">
      <div className="poll-results-card">
        
        <div className="poll-header-row">
            <h2 className="question-number">Question 1</h2>
            {isActive && typeof timeRemaining === 'number' && (
              <div className="timer-display">
                 <span className="timer-icon">⏱</span> {formatTime(timeRemaining)}
              </div>
            )}
        </div>

        <div className="question-box-dark">
          <h1 className="question-text-white">{currentQuestion}</h1>
        </div>

        <div className="results-stack">
          {effectiveResults.map((result, index) => {
            return (
              <div key={index} className="result-row-container">
                <div 
                    className="result-fill-bar" 
                    style={{ width: `${result.percentage}%` }}
                ></div>
                
                <div className="result-content-overlay">
                    <div className="left-content">
                        <span className="option-circle">{index + 1}</span>
                        <span className="option-text">{options[index]}</span>
                    </div>
                    <span className="percentage-text">{result.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="results-footer">
          {isTeacher && !isActive && (
            <button className="ask-new-btn" onClick={handleAskNewQuestion}>
              + Ask a new question
            </button>
          )}
          {!isTeacher && (
             <p className="wait-text">Wait for the teacher to ask a new question..</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollResults;