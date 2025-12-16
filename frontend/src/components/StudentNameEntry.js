import React, { useState } from 'react';
import './StudentNameEntry.css';

const StudentNameEntry = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="name-entry-container">
      <div className="name-entry-card">
        <div className="name-entry-header">
          <span className="poll-tag">Intervue Poll</span>
        </div>
        <h1 className="name-entry-title">Let's Get Started</h1>
        <p className="name-entry-subtitle">
          If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates.
        </p>
        <form onSubmit={handleSubmit} className="name-entry-form">
          <label htmlFor="student-name">Enter your Name</label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            required
          />
          <button type="submit" className="continue-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentNameEntry;

