import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket } from './services/socket';
import { setPollState, setPollResults, setParticipants, addChatMessage, setTimeRemaining, setPollHistory } from './store/pollSlice';
import { setSocketId, setKickedOut, setHasAnswered } from './store/userSlice';
import Welcome from './pages/Welcome';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import KickedOut from './pages/KickedOut';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { role, isKickedOut } = useSelector((state) => state.user);
  const timerRef = useRef(null);

  useEffect(() => {
    const socket = connectSocket();
    
    socket.on('connect', () => {
      dispatch(setSocketId(socket.id));
    });

    socket.on('role-selected', () => {});

    socket.on('poll-state', (state) => {
      dispatch(setPollState(state));
      if (state.timeLimit) {
        dispatch(setTimeRemaining(Math.max(0, state.timeLimit - Math.floor((Date.now() - (state.startTime || Date.now())) / 1000))));
      }
      if (state.isActive && state.startTime) {
        startTimer(state.startTime, state.timeLimit);
      }
    });

    socket.on('poll-created', (data) => {
      dispatch(setPollState({
        currentQuestion: data.question,
        options: data.options,
        timeLimit: data.timeLimit,
        startTime: data.startTime,
        isActive: true,
      }));
      dispatch(setPollResults({}));
      dispatch(setHasAnswered(false)); // Reset answer status for new poll
      dispatch(setTimeRemaining(data.timeLimit));
      startTimer(data.startTime, data.timeLimit);
    });

    socket.on('poll-results', (results) => {
      dispatch(setPollResults(results));
    });

    socket.on('poll-ended', (results) => {
      dispatch(setPollResults(results));
      dispatch(setPollState({
        isActive: false,
        startTime: null
      }));
      dispatch(setTimeRemaining(0));
      stopTimer();
    });

    socket.on('participants-updated', (participants) => {
      dispatch(setParticipants(participants));
    });

    socket.on('poll-history', (history) => {
      dispatch(setPollHistory(history));
    });

    socket.on('chat-message', (message) => {
      dispatch(addChatMessage(message));
    });

    socket.on('kicked-out', () => {
      dispatch(setKickedOut(true));
    });

    socket.on('error', (error) => {
      alert(error.message);
    });

    return () => {
      stopTimer();
      socket.off('connect');
      socket.off('role-selected');
      socket.off('poll-state');
      socket.off('poll-created');
      socket.off('poll-results');
      socket.off('poll-ended');
      socket.off('participants-updated');
      socket.off('poll-history');
      socket.off('chat-message');
      socket.off('kicked-out');
      socket.off('error');
    };
  }, [dispatch]);

  const startTimer = (startTime, timeLimit) => {
    stopTimer();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);
      dispatch(setTimeRemaining(remaining));
      
      if (remaining === 0) {
        stopTimer();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (isKickedOut) {
    return <KickedOut />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route 
          path="/teacher" 
          element={role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/student" 
          element={role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

