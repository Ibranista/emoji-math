import Image from "next/image";
import React from "react";

import Container from "../ui/Container";
import { Typography } from "../ui/typography";

function Header() {
  return (
    <header>
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
          <Typography className="clock-text">0</Typography>
          <Typography className="clock-text">0</Typography>
          <Typography className="clock-text">:</Typography>
          <Typography className="clock-text">0</Typography>
          <Typography className="clock-text">0</Typography>
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
