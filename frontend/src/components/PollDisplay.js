import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './PollDisplay.css';

const PollDisplay = ({ isTeacher, onSubmit }) => {
  const { currentQuestion, options, timeRemaining, participants } = useSelector((state) => state.poll);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && onSubmit) {
      onSubmit(selectedAnswer);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="poll-display-container">
      <div className="poll-display-card">
        
        <div className="question-header-row">
            <h2 className="q-label">Question 1</h2>
            {typeof timeRemaining === 'number' && timeRemaining > 0 && (
              <span className="timer-badge">⏱ {formatTime(timeRemaining)}</span>
            )}
        </div>

        <div className="question-dark-box">
             <h1 className="question-text">{currentQuestion}</h1>
        </div>

        <div className="poll-options-stack">
          {options.map((option, index) => (
            <div 
                key={index} 
                className={`option-card ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => !isTeacher && setSelectedAnswer(index)}
            >
              <div className="option-indicator">{index + 1}</div>
              <span className="option-text">{option}</span>
              {/* Radio hidden but functional */}
              <input
                type="radio"
                name="poll-answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => setSelectedAnswer(index)}
                disabled={isTeacher}
                style={{display: 'none'}}
              />
            </div>
          ))}
        </div>

        {!isTeacher && (
          <div className="student-actions">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit
            </button>
          </div>
        )}

        {isTeacher && (
          <div className="teacher-info">
             <div className="teacher-status-bar">
                <span className="status-dot"></span>
                Students are answering...
             </div>
             <div className="count-badge">
              {participants.filter(p => p.role === 'student' && p.hasAnswered).length} / {participants.filter(p => p.role === 'student').length} answered
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollDisplay;