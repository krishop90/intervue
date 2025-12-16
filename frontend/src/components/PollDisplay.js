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
        <div className="poll-display-header">
          <span className="poll-tag">Intervue Poll</span>
        </div>

        <div className="poll-question-section">
          <div className="question-header">
            <h2>Question 1</h2>
            {typeof timeRemaining === 'number' && timeRemaining > 0 && (
              <span className="timer">{formatTime(timeRemaining)}</span>
            )}
          </div>
          <h1 className="question-text">{currentQuestion}</h1>
        </div>

        <div className="poll-options">
          {options.map((option, index) => (
            <label
              key={index}
              className={`option-label ${selectedAnswer === index ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="poll-answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => setSelectedAnswer(index)}
                disabled={isTeacher}
              />
              <span className="option-number">{index + 1}</span>
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>

        {!isTeacher && (
          <>
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit
            </button>
            <p className="wait-message">Wait for the teacher to ask a new question.</p>
          </>
        )}

        {isTeacher && (
          <div className="teacher-info">
            <p>Students are answering...</p>
            <p className="participant-count">
              {participants.filter(p => p.role === 'student' && p.hasAnswered).length} / {participants.filter(p => p.role === 'student').length} answered
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollDisplay;

