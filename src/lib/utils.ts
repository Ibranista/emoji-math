import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { TBoardGroup } from "@/types/general.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNextBoardId = (
  questions: Record<string, TBoardGroup>,
  boardId: string | null,
): string | null => {
  if (!boardId) return null;
  const keys = Object.keys(questions);
  const nextIndex = keys.indexOf(boardId) + 1;
  return nextIndex < keys.length ? keys[nextIndex] : null;
};
