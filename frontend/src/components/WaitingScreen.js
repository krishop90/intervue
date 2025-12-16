import React from 'react';
import './WaitingScreen.css';

const WaitingScreen = () => {
  return (
    <div className="waiting-container">
      <div className="waiting-card">
        <div className="waiting-header">
          <span className="poll-tag">Intervue Poll</span>
        </div>
        <div className="waiting-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h1>Wait for the teacher to ask questions..</h1>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;

