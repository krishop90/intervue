import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../services/socket';
import { setPollHistory, resetPoll, setPollResults } from '../store/pollSlice';
import PollCreator from '../components/PollCreator';
import PollResults from '../components/PollResults';
import Chat from '../components/Chat';
import PollHistory from '../components/PollHistory';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const { currentQuestion, isActive, participants, pollHistory, timeRemaining } = useSelector((state) => state.poll);
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatTab, setChatTab] = useState('chat');

  useEffect(() => {
    socket.emit('get-poll-state');
    socket.emit('get-poll-history');

    socket.on('poll-history', (history) => {
      dispatch(setPollHistory(history));
    });

    return () => {
      socket.off('poll-history');
    };
  }, [socket, dispatch]);

  const handleAskNewQuestion = () => {
    // Reset poll state to allow asking a new question
    dispatch(resetPoll());
    dispatch(setPollResults({}));
    setShowHistory(false);
  };

  return (
    <div className="teacher-dashboard">

      <div className="dashboard-content">
        <div className="main-content">
          {!isActive && !currentQuestion ? (
            <PollCreator />
          ) : (
            <PollResults
              isTeacher={true}
              isActive={isActive}
              timeRemaining={timeRemaining}
              onAskNewQuestion={handleAskNewQuestion}
            />
          )}
        </div>

        <div className="sidebar-controls">
          <button
            className="sidebar-button history-sidebar-button"
            onClick={() => {
              socket.emit('get-poll-history');
              setShowHistory(true);
            }}
          >
            👁 View Poll History
          </button>
        </div>
      </div>

      <button
        className="chat-toggle"
        onClick={() => {
          setChatTab('chat');
          setShowChat(true);
        }}
      >
        💬
      </button>

      {showChat && (
        <Chat onClose={() => setShowChat(false)} initialTab={chatTab} />
      )}

      {showHistory && (
        <PollHistory
          history={pollHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;

