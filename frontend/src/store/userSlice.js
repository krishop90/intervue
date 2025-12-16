import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: null,
  name: null,
  socketId: null,
  hasAnswered: false,
  isKickedOut: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setKickedOut: (state, action) => {
      state.isKickedOut = action.payload;
    },
    resetUser: (state) => {
      state.role = null;
      state.name = null;
      state.socketId = null;
      state.hasAnswered = false;
      state.isKickedOut = false;
    },
  },
});

export const {
  setRole,
  setName,
  setSocketId,
  setHasAnswered,
  setKickedOut,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;

