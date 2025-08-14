import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const timerSlice = createSlice({
  name: "timer",
  initialState: {
    restart: false,
    pause: false,
  },
  reducers: {
    toggleRestart: (state) => {
      state.restart = !state.restart;
    },
    resetTimer: (state) => {
      state.restart = false;
    },
    pauseTimer: (state) => {
      state.pause = true;
    },
  },
});

export const { toggleRestart, resetTimer, pauseTimer } = timerSlice.actions;
export default timerSlice.reducer;
