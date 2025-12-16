import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../services/socket';
import { setName, setHasAnswered } from '../store/userSlice';
import StudentNameEntry from '../components/StudentNameEntry';
import PollDisplay from '../components/PollDisplay';
import PollResults from '../components/PollResults';
import WaitingScreen from '../components/WaitingScreen';
import Chat from '../components/Chat';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const { name, hasAnswered } = useSelector((state) => state.user);
  const { currentQuestion, isActive, results, timeRemaining } = useSelector((state) => state.poll);
  const [showChat, setShowChat] = useState(false);

  const handleNameSubmit = (studentName) => {
    dispatch(setName(studentName));
    socket.emit('select-role', { role: 'student', name: studentName });
  };

  const handleAnswerSubmit = (answer) => {
    socket.emit('submit-answer', { answer });
    dispatch(setHasAnswered(true));
  };

  if (!name) {
    return <StudentNameEntry onSubmit={handleNameSubmit} />;
  }

  if (!isActive && !currentQuestion) {
    return (
      <>
        <WaitingScreen />
        {showChat && <Chat onClose={() => setShowChat(false)} />}
        <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
          💬
        </button>
      </>
    );
  }

  if (isActive && !hasAnswered && timeRemaining > 0) {
    return (
      <>
        <PollDisplay isTeacher={false} onSubmit={handleAnswerSubmit} />
        {showChat && <Chat onClose={() => setShowChat(false)} />}
        <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
          💬
        </button>
      </>
    );
  }

  return (
    <>
      <PollResults isTeacher={false} />
      {showChat && <Chat onClose={() => setShowChat(false)} />}
      <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
        💬
      </button>
    </>
  );
};

export default StudentDashboard;

