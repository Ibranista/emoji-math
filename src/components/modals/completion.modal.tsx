import Image from "next/image";
import React from "react";
import { createPortal } from "react-dom";

import { Typography } from "../ui/typography";

function CompletionModal({
  open,
  onClose,
  total,
  correct,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  correct: number;
}) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-2xl py-8 px-[18.5px] flex flex-col items-center relative w-[363px] max-w-full border-[3px] border-primary transform transition-all animate-pop-in">
        <Image
          src="/emojis/celebration.svg"
          alt="Celebration Emoji"
          width={130}
          height={130}
        />
        <Typography className="text-2xl font-bold text-primary mb-3">
          {correct}/{total} Questions answered!
        </Typography>
        <Typography className="text-2xl text-muted-foreground mb-6 text-center">
          You won 55MB Daily + 55mb Night Internet Package
        </Typography>
        <button
          className="cursor-pointer mt-2 px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 w-72"
          onClick={onClose}
        >
          Play Again(2 coins)
        </button>
        <button
          className="cursor-pointer mt-2 px-8 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 w-72"
          onClick={onClose}
        >
          Ok
        </button>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : ({} as HTMLElement),
  );
}

export default CompletionModal;
