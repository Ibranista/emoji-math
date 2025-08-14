"use client";

import { motion } from "framer-motion";
import React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";

import { emojis } from "@/data/emojis";
import { useBoardFetch } from "@/hooks/boardFetch";
import { selectSelectedAnswers } from "@/store/selectors/questions.selector";
import { TQuestion } from "@/types/general.types";

import CompletionModal from "../modals/completion.modal";
import { MotionBtn } from "../motion-btn";
import {
  AnswersCard,
  ArithmeticDisplay,
  ClickToPlayBanner,
  EmojiCard,
  EmojiResultCard,
  Equals,
  LineItems,
  LoadingDisplay,
  Plus,
} from "../ui/card";
import Container, { PlayContainer, PlayItemsWrapper } from "../ui/Container";
import { Typography } from "../ui/typography";

function PlaySection() {
  const {
    showModal,
    setShowModal,
    revealed,
    setRevealed,
    questions,
    currentBoard,
    selectedAnswers,
    loading,
    handlePlay,
    handleAnswerSelect,
    totalQuestions,
  } = useBoardFetch();

  const showBoard = revealed && currentBoard;
  const totalAnswers = useSelector(selectSelectedAnswers);
  console.log("Total Answers:", totalAnswers);
  return (
    <>
      {/* Preload grin emoji SVG for faster blurry container rendering */}
      <Head>
        <link rel="preload" as="image" href="/emojis/grin.svg" />
      </Head>
      {/* Hidden image to force browser cache before blurry container renders */}
      <img
        src="/emojis/grin.svg"
        alt="preload-grin"
        style={{ display: "none" }}
      />
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
        <PlayContainer>
          {loading ? (
            <LoadingDisplay />
          ) : showBoard ? (
            questions[currentBoard]?.board.map((q: TQuestion, idx: number) => (
              <PlayItemsWrapper key={`${currentBoard}-${q.id}`} idx={idx}>
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
                      )
                    )}
                    <Equals />
                    <EmojiResultCard
                      result={
                        q.result !== null && q.result !== undefined
                          ? String(q.result)
                          : "?"
                      }
                    />
                  </LineItems>
                )}
              </PlayItemsWrapper>
            ))
          ) : (
            <>
              {/* Blurry container placeholder, now with grin emoji preloaded */}
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
                      idx === 0 || idx === 3
                        ? "relative blurry-bg"
                        : "opacity-0"
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

          {!showBoard && <ClickToPlayBanner />}
        </PlayContainer>

        <MotionBtn
          onClick={handlePlay}
          disabled={revealed || loading}
          label={loading ? "Loading..." : "Play"}
          setRevealed={setRevealed}
          className={revealed ? "!hidden" : ""}
        />

        {showBoard && (
          <Container
            as="article"
            className="px-0 !max-w-full flex flex-col justify-center items-center mt-3.5"
          >
            <Typography className="answer-question-text font-wendy-one">
              {questions[currentBoard]?.question}
            </Typography>
            <Container
              as="article"
              className="!max-w-none !px-0 flex gap-x-[30px] justify-center items-center mt-2.5"
            >
              {questions[currentBoard]?.choices ? (
                <Container
                  key={questions[currentBoard]?.modelId}
                  className="flex gap-x-4 justify-center items-center mt-2.5"
                >
                  {questions[currentBoard]?.choices.map((choice: string) => (
                    <AnswersCard
                      key={choice}
                      answer={choice}
                      onClick={() => handleAnswerSelect(currentBoard!, choice)}
                      isAnswered={
                        selectedAnswers.find((a) => a.boardId === currentBoard)
                          ?.answer === choice
                      }
                    />
                  ))}
                </Container>
              ) : null}
            </Container>
          </Container>
        )}
      </main>
    </>
  );
}

export default PlaySection;
