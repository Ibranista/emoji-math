"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

import { emojis } from "@/data/emojis";
import { decrypt } from "@/lib/crypto-web";
import { useLazyGetQuestionsQuery } from "@/services/game-questions";
import { TQuestion } from "@/types/general.types";

import CompletionModal from "../modals/completion.modal";
import { MotionBtn } from "../motion-btn";
import {
  AnswersCard,
  ArithmeticDisplay,
  EmojiCard,
  EmojiResultCard,
  Equals,
  LineItems,
  Plus,
} from "../ui/card";
import Container from "../ui/Container";
import { Typography } from "../ui/typography";

function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [questions, setQuestions] = useState<Record<string, TQuestion[]>>({});
  const [loading, setLoading] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [trigger] = useLazyGetQuestionsQuery();

  const handlePlay = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleAnswerSelect = (boardId: string, answer: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev, [boardId]: answer };

      const boardQuestions = questions[boardId] || [];
      const allAnswered = boardQuestions
        .filter((q) => q.choices)
        .every(() => newAnswers[boardId]);

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

      return newAnswers;
    });
  };

  const totalQuestions = Object.values(questions).reduce(
    (acc, arr) => acc + arr.filter((q) => q.choices).length,
    0,
  );

  return (
    <main className="mt-6">
      <CompletionModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          window.location.reload();
        }}
        total={totalQuestions}
        correct={totalQuestions}
      />
      <Container
        as="article"
        className="relative px-[27px] !max-w-none !w-[366px] flex justify-center items-start flex-col gap-y-6"
        style={{
          backgroundImage: "url('/click-start-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "366px",
          height: "352px",
        }}
      >
        {loading ? (
          <>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="w-full h-10 rounded-lg bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 animate-pulse mb-2 opacity-50 blur-2xl"
                style={{ maxWidth: 320, minHeight: 40 }}
              />
            ))}
          </>
        ) : revealed && currentBoard ? (
          questions[currentBoard]?.map((q: TQuestion, idx: number) => (
            <motion.div
              key={`${currentBoard}-${q.id}`}
              initial={{
                opacity: 0,
                y: 10,
                filter: "blur(8px) brightness(0.95)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "none",
                transition: {
                  opacity: { delay: 0.2 + idx * 0.13, duration: 0.45 },
                  y: {
                    delay: 0.2 + idx * 0.13,
                    type: "spring",
                    stiffness: 350,
                    damping: 22,
                  },
                  filter: { delay: 0.2 + idx * 0.13, duration: 0.4 },
                },
              }}
            >
              {q.expression && (
                <LineItems className="relative">
                  {q.expression.map((item: string, i: number) =>
                    ["plus", "minus", "multiply", "divide"].includes(item) ? (
                      <ArithmeticDisplay
                        key={i}
                        symbol={
                          item as "plus" | "minus" | "multiply" | "divide"
                        }
                      />
                    ) : (
                      <EmojiCard
                        key={i}
                        emoji={emojis[item as keyof typeof emojis]}
                        name={item}
                      />
                    ),
                  )}
                  <Equals />
                  <EmojiResultCard result={q.result ?? "?"} />
                </LineItems>
              )}
            </motion.div>
          ))
        ) : (
          <>
            {[0, 1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                initial={{
                  opacity: idx === 0 || idx === 3 ? 1 : 0,
                  y: 10,
                  filter:
                    idx === 0 || idx === 3
                      ? "blur(8px) brightness(0.95)"
                      : "none",
                }}
                animate={{
                  opacity: idx === 0 || idx === 3 ? 1 : 0,
                  y: 10,
                  filter:
                    idx === 0 || idx === 3
                      ? "blur(8px) brightness(0.95)"
                      : "none",
                  transition: {
                    opacity: { duration: 0.3 },
                    y: { duration: 0.3 },
                    filter: { duration: 0.3 },
                  },
                }}
              >
                <LineItems
                  className={
                    idx === 0 || idx === 3 ? "relative blurry-bg" : "opacity-0"
                  }
                >
                  <EmojiCard emoji={emojis.grin} name="grin" />
                  <Plus />
                  <EmojiCard emoji={emojis.grin} name="grin" />
                  <Plus />
                  <EmojiCard emoji={emojis.grin} name="grin" />
                  <Equals />
                  <EmojiResultCard result="10" />
                </LineItems>
              </motion.div>
            ))}
          </>
        )}

        {!revealed && !loading && (
          <Container
            as="article"
            className="px-0 max-w-full flex flex-col gap-y-3 justify-center items-center absolute inset-0"
          >
            <Typography className="click-to-play">
              Click Play to start the game
            </Typography>
            <Typography className="max-w-[283px] text-center solve-fun mx-auto">
              Solve fun math puzzles using emojis instead of numbers!
            </Typography>
          </Container>
        )}
      </Container>

      <MotionBtn
        onClick={handlePlay}
        disabled={revealed || loading}
        label={loading ? "Loading..." : "Play"}
        setRevealed={setRevealed}
        className={revealed ? "!hidden" : ""}
      />

      {currentBoard && (
        <Container
          as="article"
          className="px-0 !max-w-full flex flex-col justify-center items-center mt-3.5"
        >
          <Typography className="answer-question-text font-wendy-one">
            Select the right answer from the three choices below
          </Typography>
          <Container
            as="article"
            className="!max-w-none !px-0 flex gap-x-[30px] justify-center items-center mt-2.5"
          >
            {questions[currentBoard]?.map((q) =>
              q.choices ? (
                <Container
                  key={`${currentBoard}-${q.id}`}
                  className="flex gap-x-4 justify-center items-center mt-2.5"
                >
                  {
                    //@ts-expect-error choices is not a map
                    q.choices.map((choice: string) => (
                      <AnswersCard
                        key={choice}
                        answer={choice}
                        onClick={() => handleAnswerSelect(currentBoard, choice)}
                        isAnswered={selectedAnswers[currentBoard] === choice}
                      />
                    ))
                  }
                </Container>
              ) : null,
            )}
          </Container>
        </Container>
      )}
    </main>
  );
}

export default Hero;
