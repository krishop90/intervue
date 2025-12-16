import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../store/userSlice';
import { getSocket } from '../services/socket';
import './Welcome.css';

const Welcome = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = getSocket();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    dispatch(setRole(selectedRole));
    
    if (selectedRole === 'teacher') {
      socket.emit('select-role', { role: 'teacher', name: 'Teacher' });
      navigate('/teacher');
    } else {
      // For students, always collect name on the next screen
      navigate('/student');
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-header">
          <span className="poll-tag">Intervue Poll</span>
        </div>
        <h1 className="welcome-title">Welcome to the Live Polling System</h1>
        <p className="welcome-subtitle">
          Please select the role that best describes you to begin using the live polling system.
        </p>

        <div className="role-selection">
          <div
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('student')}
          >
            <h3>I'm a Student</h3>
            <p>Submit answers and view live poll results in real-time.</p>
          </div>

          <div
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('teacher')}
          >
            <h3>I'm a Teacher</h3>
            <p>You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
          </div>
        </div>

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Welcome;

