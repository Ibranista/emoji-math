import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectTimer = (state: RootState) => state.timer;
export const selectRestart = (state: RootState) => state.timer.restart;
export const selectPause = (state: RootState) => state.timer.pause;
export const selectTimerState = (state: RootState) => ({
  restart: state.timer.restart,
  pause: state.timer.pause,
});
