import { motion } from "framer-motion";
import React from "react";

import Container from "../ui/Container";
import { Typography } from "../ui/typography";

function Hero() {
  return (
    <main className="mt-6">
      <Container
        as="article"
        className="px-[27px] max-w-full flex justify-center items-center flex-col"
        style={{
          backgroundImage: "url('/click-start-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Container
          as="article"
          className="px-0 max-w-full flex flex-col gap-y-3 pt-[129px] pb-[122px]"
        >
          <Typography className="click-to-play">
            Click Play to start the game
          </Typography>
          <Typography className="max-w-[283px] text-center solve-fun mx-auto">
            Solve fun math puzzles using emojis instead of numbers!
          </Typography>
        </Container>
      </Container>
      <motion.button
        className="play-btn play-txt mt-6 cursor-pointer"
        whileHover={{
          scale: 1.05,
          boxShadow:
            "0px 8px 16px rgba(206, 163, 2, 0.15), 0px 4px 0px #FFF469, inset 0px -5px 4px #CEA302, inset 0px 4px 4px rgba(255,255,255,0.6)",
        }}
        whileTap={{
          scale: 0.95,
          boxShadow:
            "0px 2px 0px #FFF469, inset 0px -2px 2px #CEA302, inset 0px 2px 2px rgba(255,255,255,0.6)",
        }}
      >
        Play
      </motion.button>{" "}
    </main>
  );
}

export default Hero;
