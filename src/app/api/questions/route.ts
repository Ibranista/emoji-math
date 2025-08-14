import { NextResponse } from "next/server";

import { encrypt } from "@/lib/crypto";
import { TEncryptedQuestion } from "@/types/general.types";

export async function GET() {
  const questions = {
    board1: [
      {
        id: 1,
        expression: ["grin", "plus", "grin", "divide", "grin"],
        result: 30,
      },
      {
        id: 2,
        expression: ["grin", "plus", "side-eyes", "minus", "side-eyes"],
        result: 18,
      },
      { id: 3, expression: ["side-eyes", "plus", "pumpkin"], result: 2 },
      {
        id: 4,
        expression: ["pumpkin", "minus", "grin", "divide", "side-eyes"],
        result: null,
      },
      { id: 5, choices: ["10", "20", "30"] },
      // { id: 6, answer: "20" },
    ],
    board2: [
      { id: 1, expression: ["pumpkin", "plus", "pumpkin"], result: 4 },
      { id: 2, expression: ["grin", "multiply", "side-eyes"], result: 12 },
      {
        id: 3,
        expression: ["pumpkin", "minus", "grin", "divide", "side-eyes"],
        result: null,
      },
      { id: 4, choices: ["5", "10", "15"] },
      // { id: 5, answer: "10" },
    ],
  };

  const encryptedQuestions: Record<string, TEncryptedQuestion[]> = {};

  for (const board in questions) {
    const b = board as keyof typeof questions;
    encryptedQuestions[b] = questions[b].map((q) => ({
      id: q.id,
      expression: q.expression ? encrypt(JSON.stringify(q.expression)) : null,
      result:
        q.result !== undefined && q.result !== null
          ? encrypt(q.result.toString())
          : null,
      choices: q.choices ? encrypt(JSON.stringify(q.choices)) : undefined,
    }));
  }

  return NextResponse.json({ questions: encryptedQuestions });
}
