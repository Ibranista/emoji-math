import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Answer {
  boardId: string;
  answer: string;
  seconds: number;
}

interface QuestionsState {
  selectedAnswers: Answer[];
}

const initialState: QuestionsState = {
  selectedAnswers: [],
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<Answer>) => {
      // Add or update the answer for this boardId
      const existingIndex = state.selectedAnswers.findIndex(
        (a) => a.boardId === action.payload.boardId,
      );

      if (existingIndex !== -1) {
        state.selectedAnswers[existingIndex] = action.payload;
      } else {
        state.selectedAnswers.push(action.payload);
      }
    },
    resetAnswers: (state) => {
      state.selectedAnswers = [];
    },
  },
});

export const { setAnswer, resetAnswers } = questionSlice.actions;

export const selectSelectedAnswers = (state: RootState) =>
  state.questions.selectedAnswers;

export default questionSlice.reducer;
