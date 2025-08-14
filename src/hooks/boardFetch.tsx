import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { decrypt } from "@/lib/crypto-web";
import { useLazyGetQuestionsQuery } from "@/services/game-questions";
import {
  selectSelectedAnswers,
  setAnswer,
} from "@/store/feature/questionsSlice";
import {
  resetTimer,
  selectSeconds,
  setSeconds,
} from "@/store/feature/timerSlice";
import { TBoardGroup, TQuestion } from "@/types/general.types";

export function useBoardFetch() {
  const dispatch = useDispatch();
  const selectedAnswers = useSelector(selectSelectedAnswers);
  const seconds = useSelector(selectSeconds);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [questions, setQuestions] = useState<Record<string, TBoardGroup>>({});
  const [currentBoard, setCurrentBoard] = useState<string | null>(null);

  const [trigger, { isLoading: loading, data }] = useLazyGetQuestionsQuery();

  const startCountdown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    dispatch(setSeconds(10));

    intervalRef.current = setInterval(() => {
      // @ts-expect-error: dispatching a thunk for timer logic
      dispatch((dispatch, getState) => {
        const current = getState().timer.seconds;
        if (current > 0) {
          dispatch(setSeconds(current - 1));
        } else {
          clearInterval(intervalRef.current!);
        }
      });
    }, 1000);
  };

  const getNextBoardId = (boardId: string | null) => {
    if (!boardId) return null;
    const boardKeys = Object.keys(questions);
    const nextIndex = boardKeys.indexOf(boardId) + 1;
    return nextIndex < boardKeys.length ? boardKeys[nextIndex] : null;
  };

  useEffect(() => {
    if (seconds === 0 && currentBoard) {
      const nextBoard = getNextBoardId(currentBoard);
      if (nextBoard) {
        setCurrentBoard(nextBoard);
        dispatch(setSeconds(10)); // restart timer for next board
      } else {
        setCurrentBoard(null);
        setTimeout(() => setShowModal(true), 400);
      }
    }
  }, [seconds, currentBoard, questions, dispatch]);

  const handlePlay = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

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
    startCountdown();
  };

  const handleAnswerSelect = (boardId: string, answer: string) => {
    const updatedAnswers = [
      ...(Array.isArray(selectedAnswers) ? selectedAnswers : []),
      { boardId, answer, seconds },
    ];

    const existingIndex = updatedAnswers.findIndex(
      (a) => a.boardId === boardId,
    );
    if (existingIndex !== -1) {
      updatedAnswers[existingIndex] = { boardId, answer, seconds };
    }

    updatedAnswers.forEach((ans) => dispatch(setAnswer(ans)));

    // Move to next board manually
    const nextBoard = getNextBoardId(boardId);
    if (nextBoard) {
      setCurrentBoard(nextBoard);
      dispatch(setSeconds(10)); // restart timer
    } else {
      setCurrentBoard(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      dispatch(setSeconds(0));
      setTimeout(() => setShowModal(true), 400);
    }
  };

  const totalQuestions = Object.values(questions).reduce(
    (acc, q) => acc + (q.choices ? 1 : 0),
    0,
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      dispatch(resetTimer());
    };
  }, [dispatch]);

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
    seconds,
  };
}
