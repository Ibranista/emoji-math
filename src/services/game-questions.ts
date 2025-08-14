import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types for the questions
export interface GameQuestion {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  id: number;
  expression: string[];
  result: number | null;
}

export interface GameQuestionsResponse {
  questions: GameQuestion[];
}

// RTK Query API for game questions
export const gameQuestionsApi = createApi({
  reducerPath: "gameQuestionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getQuestions: builder.query<GameQuestionsResponse, void>({
      query: () => "questions",
    }),
  }),
});

export const { useGetQuestionsQuery, useLazyGetQuestionsQuery } =
  gameQuestionsApi;
