import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface TimerState {
  seconds: number;
}

const initialState: TimerState = {
  seconds: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setSeconds: (state, action: PayloadAction<number>) => {
      state.seconds = action.payload;
    },
    resetTimer: (state) => {
      state.seconds = 0;
    },
    incrementTimer: (state) => {
      state.seconds += 1;
    },
  },
});

export const { setSeconds, resetTimer, incrementTimer } = timerSlice.actions;
export const selectSeconds = (state: RootState) => state.timer.seconds;
export default timerSlice.reducer;
