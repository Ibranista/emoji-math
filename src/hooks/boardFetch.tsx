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
import { TQuestion } from "@/types/general.types";

export function useBoardFetch() {
  const dispatch = useDispatch();
  const selectedAnswers = useSelector(selectSelectedAnswers);
  const seconds = useSelector(selectSeconds);

  const [showModal, setShowModal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [questions, setQuestions] = useState<Record<string, TQuestion[]>>({});
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

    const allBoards: Record<string, TQuestion[]> = {};

    for (const boardKey in res.questions) {
      if (res.questions.hasOwnProperty(boardKey)) {
        const boardQuestions = res.questions[boardKey];
        const decryptedBoard = await Promise.all(
          boardQuestions.map(async (q: TQuestion) => ({
            ...q,
            expression: q.expression
              ? JSON.parse(
                  await decrypt(q.expression as unknown as string, key),
                )
              : null,
            result:
              q.result !== null && q.result !== undefined
                ? Number(await decrypt(q.result, key))
                : null,
            choices: q.choices
              ? JSON.parse(await decrypt(q.choices, key))
              : null,
            answer: q.answer ? await decrypt(q.answer, key) : null,
          })),
        );
        allBoards[boardKey] = decryptedBoard;
      }
    }

    setQuestions(allBoards);
    const firstBoardKey = Object.keys(allBoards)[0];
    setCurrentBoard(firstBoardKey);
    setRevealed(true);
  };

  const handleAnswerSelect = (boardId: string, answer: string) => {
    // Include current seconds in local copy
    const newSelectedAnswers = {
      ...selectedAnswers,
      [boardId]: { answer, seconds },
    };

    // Dispatch to Redux
    dispatch(setAnswer({ boardId, answer, seconds }));

    // Reset timer
    dispatch(resetTimer());

    // Check if all questions with choices are answered using local copy
    const boardQuestions = questions[boardId] || [];
    const allAnswered = boardQuestions
      .filter((q) => q.choices)
      .every(() => newSelectedAnswers[boardId]);

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
    (acc, arr) => acc + arr.filter((q) => q.choices).length,
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
