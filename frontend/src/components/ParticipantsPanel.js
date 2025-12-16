import React from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../services/socket';
import './ParticipantsPanel.css';

const ParticipantsPanel = ({ participants, onClose }) => {
  const { role } = useSelector((state) => state.user);
  const socket = getSocket();

  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      socket.emit('remove-student', { studentId });
    }
  };

  const students = participants.filter(p => p.role === 'student');

  return (
    <div className="participants-panel-overlay" onClick={onClose}>
      <div className="participants-panel" onClick={(e) => e.stopPropagation()}>
        <div className="participants-panel-header">
          <div className="header-title">
            <h2>Participants <span className="count-badge">{students.length}</span></h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="participants-list-header">
            <span>Name</span>
            <span>Action</span>
        </div>

        <div className="participants-list">
          {students.length === 0 ? (
            <p className="no-participants">No students joined yet</p>
          ) : (
            students.map((student) => (
              <div key={student.id} className="participant-item">
                <span className="participant-name">{student.name}</span>
                {role === 'teacher' && (
                  <button
                    className="kick-link"
                    onClick={() => handleRemoveStudent(student.id)}
                  >
                    Kick out
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPanel;