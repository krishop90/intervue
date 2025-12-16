import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: null,
  options: [],
  answers: {},
  results: {},
  participants: [],
  pollHistory: [],
  timeLimit: 60,
  startTime: null,
  isActive: false,
  timeRemaining: 0,
  chatMessages: [],
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPollState: (state, action) => {
      const { currentQuestion, options, timeLimit, startTime, isActive } = action.payload;
      state.currentQuestion = currentQuestion;
      state.options = options;
      state.timeLimit = timeLimit;
      state.startTime = startTime;
      state.isActive = isActive;
    },
    setPollResults: (state, action) => {
      state.results = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    resetPoll: (state) => {
      state.currentQuestion = null;
      state.options = [];
      state.answers = {};
      state.results = {};
      state.isActive = false;
      state.startTime = null;
      state.timeRemaining = 0;
    },
  },
});

export const {
  setPollState,
  setPollResults,
  setParticipants,
  setPollHistory,
  addChatMessage,
  setTimeRemaining,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;

