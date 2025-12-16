import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../services/socket';
import './Chat.css';

const Chat = ({ onClose, initialTab = 'chat' }) => {
  const socket = getSocket();
  const { chatMessages, participants } = useSelector((state) => state.poll);
  const { role, socketId } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const messagesEndRef = useRef(null);

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
  
  const handleKick = (studentId) => {
      if(window.confirm("Kick this student?")) {
          socket.emit('remove-student', { studentId });
      }
  }

  const studentList = participants.filter(p => p.role === 'student');

  return (
    <div className="chat-floating-panel">
        <div className="chat-header-tabs">
            <div 
                className={`tab-item ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
            >
                Chat
            </div>
            <div 
                className={`tab-item ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => setActiveTab('participants')}
            >
                Participants
            </div>
            <button className="close-chat-btn" onClick={onClose}>×</button>
        </div>

        <div className="chat-body-content">
            {activeTab === 'chat' ? (
                <>
                    <div className="messages-area">
                        {chatMessages.map((msg, index) => {
                            const isMe = msg.id === socketId;
                            return (
                                <div key={index} className={`message-bubble-row ${isMe ? 'me' : 'other'}`}>
                                    <span className="msg-sender-name">{isMe ? 'You' : msg.name}</span>
                                    <div className="bubble-text">
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </>
            ) : (
                <div className="participants-list-area">
                    <div className="p-list-header">
                        <span>Name</span>
                        <span>Action</span>
                    </div>
                    {studentList.map((student) => (
                        <div key={student.id} className="p-row">
                            <span className="p-name">{student.name}</span>
                            {role === 'teacher' && (
                                <button className="kick-link-btn" onClick={() => handleKick(student.id)}>
                                    Kick out
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default Chat;