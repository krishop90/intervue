import React, { useState } from 'react';
import { getSocket } from '../services/socket';
import './PollCreator.css';

const PollCreator = () => {
  const socket = getSocket();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [correctOption, setCorrectOption] = useState(0); 

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
        <div className="poll-tag-wrapper">
           <span className="poll-tag">✨ Intervue Poll</span>
        </div>
        
        <h1 className="poll-creator-title">Let’s <strong>Get Started</strong></h1>
        <p className="poll-creator-subtitle">
          you’ll have the ability to create and manage polls, ask questions, and monitor <br/>
          your students’ responses in real-time.
        </p>

        <form onSubmit={handleSubmit} className="poll-creator-form">
          <div className="form-group question-section">
            <div className="label-row">
              <label htmlFor="question">Enter your question</label>
              <div className="timer-dropdown">
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                  <option value={120}>120 seconds</option>
                </select>
              </div>
            </div>
            
            <div className="input-wrapper-large">
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                maxLength={100}
                required
              />
              <span className="char-count">{question.length}/100</span>
            </div>
          </div>

          <div className="form-group options-section">
            <div className="options-header-row">
                <label>Edit Options</label>
                <label className="correct-label">Is it Correct?</label>
            </div>
            
            <div className="options-list">
              {options.map((option, index) => (
                <div key={index} className="option-row">
                   <div className="option-number-badge">{index + 1}</div>
                   <div className="option-input-wrapper">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                   </div>
                   <div className="correct-toggle">
                      <label className={`radio-label ${correctOption === index ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="correct-opt" 
                            checked={correctOption === index}
                            onChange={() => setCorrectOption(index)}
                        />
                        <span className="radio-text">Yes</span>
                      </label>
                      <label className={`radio-label ${correctOption !== index ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="correct-opt" 
                            checked={correctOption !== index}
                            onChange={() => {}}
                        />
                        <span className="radio-text">No</span>
                      </label>
                   </div>
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
        
        <div className="submit-row">
            <button type="submit" className="ask-question-button">
                Ask Question
            </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default PollCreator;