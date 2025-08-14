import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface QuestionsState {
  selectedAnswers: Record<string, string>;
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
      action: PayloadAction<{ boardId: string; answer: string }>
    ) => {
      state.selectedAnswers[action.payload.boardId] = action.payload.answer;
    },
  },
});

export const { setAnswer } = questionSlice.actions;
export const selectSelectedAnswers = (state: RootState) =>
  state.questions.selectedAnswers;
export default questionSlice.reducer;
