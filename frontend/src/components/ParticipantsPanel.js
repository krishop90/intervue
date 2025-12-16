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
          <h2>Participants</h2>
          <button className="close-button" onClick={onClose}>×</button>
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
                    className="kick-button"
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

