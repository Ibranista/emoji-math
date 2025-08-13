import { motion } from "framer-motion";
import React, { useState } from "react";

import { emojis } from "@/data/emojis";

import { MotionBtn } from "../motion-btn";
import {
  EmojiCard,
  EmojiResultCard,
  Equals,
  LineItems,
  Plus,
} from "../ui/card";
import Container from "../ui/Container";
import { Typography } from "../ui/typography";

function Hero() {
  const [revealed, setRevealed] = useState(false);

  const getLineClass = (idx: number) => {
    if (revealed) return "relative";
    if (idx === 0 || idx === 3) return "relative blurry-bg";
    return "opacity-0";
  };

  return (
    <main className="mt-6">
      <Container
        as="article"
        className="relative px-[27px] !max-w-none !w-[366px] flex justify-center items-center flex-col gap-y-6"
        style={{
          backgroundImage: "url('/click-start-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "366px",
          height: "352px",
        }}
      >
        {[0, 1, 2, 3].map((idx) => (
          <motion.div
            key={idx}
            initial={{
              opacity: idx === 0 || idx === 3 ? 1 : 0,
              y: 10,
              filter:
                idx === 0 || idx === 3 ? "blur(8px) brightness(0.95)" : "none",
            }}
            animate={
              revealed
                ? {
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
                  }
                : {
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
                  }
            }
          >
            <LineItems className={getLineClass(idx)}>
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

        {!revealed && (
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
        onClick={() => setRevealed(true)}
        disabled={revealed}
        label="Play"
        setRevealed={setRevealed}
      />
    </main>
  );
}

export default Hero;
