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

  const getTotalVotes = () => {
    return Object.values(results).reduce((sum, result) => sum + result.count, 0);
  };

  if (!currentQuestion || (Object.keys(results).length === 0 && !(isTeacher && isActive))) {
    return null;
  }

  const effectiveResults = options.map((option, index) => results[index] || { count: 0, percentage: 0, option });

  return (
    <div className="poll-results-container">
      <div className="poll-results-card">
        <div className="poll-results-header">
          <span className="poll-tag">Intervue Poll</span>
        </div>

        <div className="results-question-section">
          <div className="results-top-row">
            <h2>Question 1</h2>
            {isActive && typeof timeRemaining === 'number' && (
              <span className="timer">{formatTime(timeRemaining)}</span>
            )}
          </div>
          <h1 className="results-question-text">{currentQuestion}</h1>
        </div>

        <div className="results-list">
          {effectiveResults.map((result, index) => {
            return (
              <div key={index} className="result-item">
                <div className="result-header">
                  <span className="result-option-number">{index + 1}</span>
                  <span className="result-option-text">{result.option || options[index]}</span>
                  <span className="result-percentage">{result.percentage}%</span>
                </div>
                <div className="result-bar-container">
                  <div
                    className="result-bar"
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="results-footer">
          <p className="total-votes">Total Votes: {getTotalVotes()}</p>
          {isTeacher && !isActive && (
            <div className="teacher-actions">
              <button className="ask-new-question-button" onClick={handleAskNewQuestion}>
                + Ask a new question
              </button>
            </div>
          )}
          {!isTeacher && (
            <p className="wait-message">Wait for the teacher to ask a new question.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default PollResults;

