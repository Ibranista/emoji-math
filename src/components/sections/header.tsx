import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import Container from "../ui/Container";
import { Typography } from "../ui/typography";

function Header() {
  // Timer state in seconds
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Format seconds to mm:ss and split into digits
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
