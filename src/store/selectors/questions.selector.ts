import { RootState } from "@/store/store";

export const selectSelectedAnswers = (state: RootState) =>
  state.questions.selectedAnswers;
