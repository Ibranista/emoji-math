"use client";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type MotionBtnProps = {
  onClick: () => void;
  disabled: boolean;
  setRevealed: (value: boolean) => void;
  label: string;
  className?: string;
};

export function MotionBtn({
  onClick,
  disabled,
  label,
  className,
}: MotionBtnProps) {
  return (
    <motion.button
      className={cn("play-btn play-txt mt-6", className)}
      whileHover={{
        scale: 1.05,
        boxShadow:
          "0px 8px 16px rgba(206, 163, 2, 0.15), 0px 4px 0px #FFF469, inset 0px -5px 4px #CEA302, inset 0px 4px 4px rgba(255,255,255,0.6)",
        cursor: "pointer",
      }}
      whileTap={{
        scale: 0.95,
        boxShadow:
          "0px 2px 0px #FFF469, inset 0px -2px 2px #CEA302, inset 0px 2px 2px rgba(255,255,255,0.6)",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </motion.button>
  );
}
