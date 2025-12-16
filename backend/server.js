const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store poll state
const createInitialPollState = () => ({
  currentQuestion: null,
  options: [],
  answers: {},
  participants: [],
  pollHistory: [],
  timeLimit: 60,
  startTime: null,
  isActive: false
});

let pollState = createInitialPollState();

// Store user sessions
const userSessions = new Map();

io.on('connection', (socket) => {
  // Handle role selection
  socket.on('select-role', ({ role, name }) => {
    const user = {
      id: socket.id,
      role,
      name: name || `User-${socket.id.substring(0, 6)}`,
      joinedAt: new Date()
    };

    userSessions.set(socket.id, user);

    if (role === 'student') {
      // Add student to participants if not already added
      const existingStudent = pollState.participants.find(p => p.id === socket.id);
      if (!existingStudent) {
        pollState.participants.push({
          id: socket.id,
          name: user.name,
          role: 'student',
          hasAnswered: false
        });
      }
    } else if (role === 'teacher') {
      // New teacher session: reset poll state (questions, answers, history, timers)
      const existingStudents = pollState.participants.filter(p => p.role === 'student');
      pollState = createInitialPollState();
      pollState.participants = [...existingStudents];

      // Check if teacher already exists
      const existingTeacher = pollState.participants.find(p => p.role === 'teacher');
      if (!existingTeacher) {
        pollState.participants.push({
          id: socket.id,
          name: user.name,
          role: 'teacher'
        });
      }
    }

    socket.emit('role-selected', { role, name: user.name });
    io.emit('participants-updated', pollState.participants);
    io.emit('poll-state', pollState);
  });

  // Handle teacher creating a poll
  socket.on('create-poll', ({ question, options, timeLimit }) => {
    const user = userSessions.get(socket.id);
    if (!user || user.role !== 'teacher') {
      socket.emit('error', { message: 'Only teachers can create polls' });
      return;
    }

    // Check if can ask new question
    if (pollState.isActive) {
      const allAnswered = pollState.participants
        .filter(p => p.role === 'student')
        .every(p => pollState.answers[p.id] !== undefined);
      
      if (!allAnswered) {
        socket.emit('error', { message: 'Wait for all students to answer the current question' });
        return;
      }
    }

    // Reset poll state
    pollState.currentQuestion = question;
    pollState.options = options;
    pollState.answers = {};
    pollState.timeLimit = timeLimit || 60;
    pollState.startTime = Date.now();
    pollState.isActive = true;

    // Reset student answer status
    pollState.participants.forEach(p => {
      if (p.role === 'student') {
        p.hasAnswered = false;
      }
    });

    io.emit('poll-created', {
      question,
      options,
      timeLimit: pollState.timeLimit,
      startTime: pollState.startTime
    });

    // Auto-end poll after time limit
    setTimeout(() => {
      if (pollState.isActive && pollState.currentQuestion === question) {
        endPoll();
      }
    }, pollState.timeLimit * 1000);
  });

  // Handle student submitting answer
  socket.on('submit-answer', ({ answer }) => {
    const user = userSessions.get(socket.id);
    if (!user || user.role !== 'student') {
      socket.emit('error', { message: 'Only students can submit answers' });
      return;
    }

    if (!pollState.isActive) {
      socket.emit('error', { message: 'No active poll' });
      return;
    }

    const participant = pollState.participants.find(p => p.id === socket.id);
    if (participant) {
      participant.hasAnswered = true;
    }

    pollState.answers[socket.id] = answer;
    
    socket.emit('answer-submitted', { success: true });
    
    // Calculate and broadcast results
    const results = calculateResults();
    io.emit('poll-results', results);
  });

  // Handle teacher removing a student
  socket.on('remove-student', ({ studentId }) => {
    const user = userSessions.get(socket.id);
    if (!user || user.role !== 'teacher') {
      socket.emit('error', { message: 'Only teachers can remove students' });
      return;
    }

    pollState.participants = pollState.participants.filter(p => p.id !== studentId);
    delete pollState.answers[studentId];
    
    io.to(studentId).emit('kicked-out');
    io.emit('participants-updated', pollState.participants);
    
    const results = calculateResults();
    io.emit('poll-results', results);
  });

  // Handle chat messages
  socket.on('chat-message', ({ message }) => {
    const user = userSessions.get(socket.id);
    if (!user) return;

    io.emit('chat-message', {
      id: socket.id,
      name: user.name,
      message,
      timestamp: new Date()
    });
  });

  // Handle requesting poll history
  socket.on('get-poll-history', () => {
    const user = userSessions.get(socket.id);
    if (!user || user.role !== 'teacher') {
      socket.emit('error', { message: 'Only teachers can view poll history' });
      return;
    }

    socket.emit('poll-history', pollState.pollHistory);
  });

  // Handle requesting current poll state
  socket.on('get-poll-state', () => {
    socket.emit('poll-state', pollState);
    
    if (pollState.isActive) {
      const results = calculateResults();
      socket.emit('poll-results', results);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    pollState.participants = pollState.participants.filter(p => p.id !== socket.id);
    delete pollState.answers[socket.id];
    userSessions.delete(socket.id);
    
    io.emit('participants-updated', pollState.participants);
    const results = calculateResults();
    io.emit('poll-results', results);
  });

  function endPoll() {
    if (!pollState.isActive) return;

    pollState.isActive = false;
    const results = calculateResults();

    // Save to history
    pollState.pollHistory.push({
      question: pollState.currentQuestion,
      options: pollState.options,
      results: results,
      timestamp: new Date()
    });

    io.emit('poll-ended', results);
    io.emit('poll-history', pollState.pollHistory);
  }

  function calculateResults() {
    const results = {};
    const totalAnswers = Object.keys(pollState.answers).length;

    pollState.options.forEach((option, index) => {
      const count = Object.values(pollState.answers).filter(a => a === index).length;
      results[index] = {
        option,
        count,
        percentage: totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0
      };
    });

    return results;
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

