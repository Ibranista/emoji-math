import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { decrypt } from "@/lib/crypto-web";
import { useLazyGetQuestionsQuery } from "@/services/game-questions";
import {
  selectSelectedAnswers,
  setAnswer,
} from "@/store/feature/questionsSlice";
import {
  incrementTimer,
  resetTimer,
  selectSeconds,
} from "@/store/feature/timerSlice";
import { TBoardGroup, TQuestion } from "@/types/general.types";

export function useBoardFetch() {
  const dispatch = useDispatch();
  const selectedAnswers = useSelector(selectSelectedAnswers);
  const seconds = useSelector(selectSeconds);

  const [showModal, setShowModal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [questions, setQuestions] = useState<Record<string, TBoardGroup>>({});
  const [currentBoard, setCurrentBoard] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [trigger, { isLoading: loading, data }] = useLazyGetQuestionsQuery();

  const handlePlay = async () => {
    // Reset timer before starting
    dispatch(resetTimer());
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => dispatch(incrementTimer()), 1000);

    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!;
    const res = await trigger().unwrap();

    const allBoards: Record<string, TBoardGroup> = {};

    for (const q of res.questions) {
      const decryptedQuestion = q.question
        ? await decrypt(q.question, key)
        : "";
      const decryptedModelId = q.modelId ? await decrypt(q.modelId, key) : "";

      const decryptedBoard = await Promise.all(
        q.board.map(async (b: TQuestion) => ({
          id: b.id,
          expression: b.expression
            ? JSON.parse(await decrypt(b.expression as unknown as string, key))
            : null,
          result:
            b.result !== null && b.result !== undefined
              ? Number(await decrypt(String(b.result), key))
              : null,
        })),
      );

      allBoards[decryptedModelId] = {
        board: decryptedBoard,
        choices: q.choices
          ? JSON.parse(await decrypt(q.choices as string, key))
          : null,
        question: decryptedQuestion,
        modelId: decryptedModelId,
      };
    }

    setQuestions(allBoards);
    const firstBoardKey = Object.keys(allBoards)[0];
    setCurrentBoard(firstBoardKey);
    setRevealed(true);
  };

  const handleAnswerSelect = (boardId: string, answer: string) => {
    // Create a new array with the incoming answer
    const updatedAnswers = [
      ...(Array.isArray(selectedAnswers) ? selectedAnswers : []),
      { boardId, answer, seconds },
    ];

    // If answer for this boardId already exists, replace it
    const existingIndex = updatedAnswers.findIndex(
      (a) => a.boardId === boardId,
    );
    if (existingIndex !== -1) {
      updatedAnswers[existingIndex] = { boardId, answer, seconds };
    }

    // Dispatch updated array to Redux
    updatedAnswers.forEach((ans) => dispatch(setAnswer(ans)));

    // Reset timer
    dispatch(resetTimer());

    // Check if all questions with choices are answered using updated array
    const boardQuestions = questions[boardId]?.board || [];
    // Since choices is at the group level, just check if this boardId has an answer
    const allAnswered =
      boardQuestions.length > 0 &&
      updatedAnswers.some((a) => a.boardId === boardId);

    if (allAnswered) {
      const boardKeys = Object.keys(questions);
      const nextBoardIndex = boardKeys.indexOf(boardId) + 1;
      if (nextBoardIndex < boardKeys.length) {
        setCurrentBoard(boardKeys[nextBoardIndex]);
      } else {
        setCurrentBoard(null);
        setTimeout(() => setShowModal(true), 400);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }
  };

  const totalQuestions = Object.values(questions).reduce(
    (acc, q) => acc + (q.choices ? 1 : 0),
    0,
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    showModal,
    setShowModal,
    revealed,
    setRevealed,
    questions,
    setQuestions,
    currentBoard,
    setCurrentBoard,
    selectedAnswers,
    trigger,
    loading,
    data,
    handlePlay,
    handleAnswerSelect,
    totalQuestions,
    seconds, // add seconds to the returned object
  };
}
