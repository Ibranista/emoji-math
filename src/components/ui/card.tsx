import Image from "next/image";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Typography } from "./typography";

export function EmojiCard({ emoji, name }: { emoji: string; name: string }) {
  return (
    <div className="emoji-card w-full">
      <Image
        src={emoji}
        alt={name}
        width={39}
        height={39}
        className="w-[39px] h-[39px] -mt-1"
      />
    </div>
  );
}

export function AnswersCard({
  answer,
  correct = "neutral",
  isAnswered = false,
  onClick,
}: {
  answer: string;
  correct?: boolean | "neutral";
  isAnswered?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`cursor-pointer emoji-card !w-[79.67px] !h-[80.6px] transition-transform duration-200 ${isAnswered ? "scale-110 z-10" : "scale-100"}`}
      style={{
        backgroundImage:
          correct === true
            ? "url(/correct-answer-bg.svg)"
            : correct === false
              ? "url(/wrong-answer-bg.svg)"
              : "",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={onClick}
    >
      <Typography
        className={`emoji-result transition-colors duration-200 ${
          isAnswered ? "!text-primary" : ""
        }`}
      >
        {answer}
      </Typography>
    </div>
  );
}

export function EmojiResultCard({ result }: { result: string }) {
  return (
    <div className="emoji-card">
      <Typography className="emoji-result">{result}</Typography>
    </div>
  );
}

export function Plus() {
  return (
    <Image
      src="/emojis/plus.svg"
      alt="Plus Emoji"
      width={25}
      height={25}
      className="w-[25px] h-[25px]"
    />
  );
}

export function Minus() {
  return (
    <Image
      src="/emojis/minus.svg"
      alt="Minus Emoji"
      width={25}
      height={25}
      className="w-[25px] h-[25px]"
    />
  );
}

export function Multiply() {
  return (
    <Image
      src="/emojis/multiply.svg"
      alt="Multiply Emoji"
      width={25}
      height={25}
      className="w-[25px] h-[25px]"
    />
  );
}

export function Divide() {
  return (
    <Image
      src="/emojis/divide.svg"
      alt="Divide Emoji"
      width={25}
      height={25}
      className="w-[25px] h-[25px]"
    />
  );
}

export function Equals() {
  return (
    <Image
      src="/equals.svg"
      alt="Equals Emoji"
      width={25}
      height={25}
      className="w-[25px] h-[25px]"
    />
  );
}

export function LineItems({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-x-2 items-center justify-center", className)}>
      {children}
    </div>
  );
}

export function ArithmeticDisplay({
  symbol,
}: {
  symbol: "minus" | "plus" | "multiply" | "divide";
}) {
  const icons = {
    minus: <Minus />,
    plus: <Plus />,
    multiply: <Multiply />,
    divide: <Divide />,
  };

  return <>{icons[symbol]}</>;
}
