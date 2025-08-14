import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface QuestionsState {
  selectedAnswers: Record<string, { answer: string; seconds: number }>;
}

const initialState: QuestionsState = {
  selectedAnswers: {},
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{
        boardId: string;
        answer: string;
        seconds: number;
      }>,
    ) => {
      state.selectedAnswers[action.payload.boardId] = {
        answer: action.payload.answer,
        seconds: action.payload.seconds,
      };
    },
  },
});

export const { setAnswer } = questionSlice.actions;
export const selectSelectedAnswers = (state: RootState) =>
  state.questions.selectedAnswers;
export default questionSlice.reducer;
