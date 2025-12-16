import React, { useState } from 'react';
import { getSocket } from '../services/socket';
import './PollCreator.css';

const PollCreator = () => {
  const socket = getSocket();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please add at least 2 options');
      return;
    }

    const optionTexts = validOptions.map(opt => opt.trim());
    
    socket.emit('create-poll', {
      question: question.trim(),
      options: optionTexts,
      timeLimit
    });

    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="poll-creator-container">
      <div className="poll-creator-card">
        <div className="poll-creator-header">
          <span className="poll-tag">Intervue Poll</span>
        </div>
        <h1 className="poll-creator-title">Let's Get Started</h1>
        <p className="poll-creator-subtitle">
          You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <form onSubmit={handleSubmit} className="poll-creator-form">
          <div className="form-group">
            <label htmlFor="question">Enter your question</label>
            <div className="question-input-group">
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                maxLength={100}
                required
              />
              <span className="char-count">{question.length}/100</span>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="time-select"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>120 seconds</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Edit Options</label>
            <div className="options-list">
              {options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="option-input"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="add-option-button"
            >
              + Add More option
            </button>
          </div>

          <button type="submit" className="ask-question-button">
            Ask Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default PollCreator;

