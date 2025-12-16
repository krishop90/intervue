import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../services/socket';
import './Chat.css';

const Chat = ({ onClose, initialTab = 'chat' }) => {
  const socket = getSocket();
  const { chatMessages, participants } = useSelector((state) => state.poll);
  const { role } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat-message', { message: message.trim() });
      setMessage('');
    }
  };

  const participantStudents = participants.filter((p) => p.role === 'student');

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
        <div className="chat-tabs">
          <button
            className={`chat-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={`chat-tab ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {activeTab === 'chat' ? (
          <>
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <p className="no-messages">No messages yet. Start the conversation!</p>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${msg.id === socket.id ? 'own-message' : ''}`}
                  >
                    <span className="message-name">{msg.name}</span>
                    <span className="message-text">{msg.message}</span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button type="submit" className="send-button">Send</button>
            </form>
          </>
        ) : (
          <div className="participants-tab">
            {participantStudents.length === 0 ? (
              <p className="no-messages">No students yet.</p>
            ) : (
              participantStudents.map((student) => (
                <div key={student.id} className="participant-row">
                  <span className="participant-name">{student.name}</span>
                  {role === 'teacher' && (
                    <button
                      className="kick-link"
                      onClick={() => socket.emit('remove-student', { studentId: student.id })}
                    >
                      Kick out
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

