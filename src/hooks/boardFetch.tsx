import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetQuestionsQuery } from "@/services/game-questions";
import { decrypt } from "@/lib/crypto-web";
import { TQuestion } from "@/types/general.types";
import {
  selectSelectedAnswers,
  setAnswer,
} from "@/store/feature/questionsSlice";

export function useBoardFetch() {
  const dispatch = useDispatch();
  const selectedAnswers = useSelector(selectSelectedAnswers);

  const [showModal, setShowModal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [questions, setQuestions] = useState<Record<string, TQuestion[]>>({});
  const [currentBoard, setCurrentBoard] = useState<string | null>(null);

  const [trigger, { isLoading: loading, data }] = useLazyGetQuestionsQuery();

  const handlePlay = async () => {
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
                  await decrypt(q.expression as unknown as string, key)
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
          }))
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
    // Compute the new selected answers locally
    const newSelectedAnswers = {
      ...selectedAnswers,
      [boardId]: answer,
    };

    // Dispatch to Redux
    dispatch(setAnswer({ boardId, answer }));

    // Check if all questions with choices are answered
    const boardQuestions = questions[boardId] || [];
    const allAnswered = boardQuestions
      .filter((q) => q.choices)
      .every(() => newSelectedAnswers[boardId]); // use local copy here

    if (allAnswered) {
      const boardKeys = Object.keys(questions);
      const nextBoardIndex = boardKeys.indexOf(boardId) + 1;
      if (nextBoardIndex < boardKeys.length) {
        setCurrentBoard(boardKeys[nextBoardIndex]);
      } else {
        setCurrentBoard(null);
        setTimeout(() => setShowModal(true), 400);
      }
    }
  };

  const totalQuestions = Object.values(questions).reduce(
    (acc, arr) => acc + arr.filter((q) => q.choices).length,
    0
  );

  return {
    showModal,
    setShowModal,
    revealed,
    setRevealed,
    questions,
    setQuestions,
    currentBoard,
    setCurrentBoard,
    selectedAnswers, // from Redux
    trigger,
    loading,
    data,
    handlePlay,
    handleAnswerSelect,
    totalQuestions,
  };
}
