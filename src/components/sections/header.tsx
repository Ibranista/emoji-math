import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

import { selectSeconds } from "@/store/feature/timerSlice";

import Container from "../ui/Container";
import { Typography } from "../ui/typography";

function Header() {
  const seconds = useSelector(selectSeconds);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  return (
    <header className="mt-9">
      <Image
        src="/hero-intro.svg"
        alt="Emoji Math Logo"
        width={100}
        height={100}
        className="mx-auto w-[219px] h-[120.23px]"
      />
      <Container
        as="section"
        className="flex gap-[9px] justify-center mt-[37px]"
      >
        <Container
          as="article"
          className="px-0 max-w-full flex items-center counter-container"
        >
          <Typography className="clock-text">{mm[0]}</Typography>
          <Typography className="clock-text">{mm[1]}</Typography>
          <Typography className="clock-text">:</Typography>
          <Typography className="clock-text">{ss[0]}</Typography>
          <Typography className="clock-text">{ss[1]}</Typography>
        </Container>
        <Container
          as="article"
          className="px-0 max-w-full flex items-center counter-container"
        >
          <Typography className="clock-text">0</Typography>
          <Typography className="clock-text">/</Typography>
          <Typography className="clock-text">10</Typography>
        </Container>
      </Container>
    </header>
  );
}

export default Header;
