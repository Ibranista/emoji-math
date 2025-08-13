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
      src="/plus.svg"
      alt="Plus Emoji"
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
