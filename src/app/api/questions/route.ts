import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { encrypt } from "@/lib/crypto";
import { TEncryptedQuestion } from "@/types/general.types";

export async function GET() {
  const rawQuestions = [
    {
      board: [
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
      ],
      choices: ["10", "20", "30"],
      question: "Compute the missing result for the row where result is null.",
      modelId: "emoji1",
    },
    {
      board: [
        { id: 1, expression: ["pumpkin", "plus", "pumpkin"], result: 4 },
        { id: 2, expression: ["grin", "multiply", "side-eyes"], result: 12 },
        {
          id: 3,
          expression: ["pumpkin", "minus", "grin", "divide", "side-eyes"],
          result: null,
        },
      ],
      choices: ["5", "10", "15"],
      question: "Compute the missing result for the row where result is null.",
      modelId: "emoji2",
    },
    {
      board: [
        { id: 1, expression: ["grin", "plus", "grin"], result: 20 },
        { id: 2, expression: ["side-eyes", "minus", "pumpkin"], result: 0 },
        {
          id: 3,
          expression: ["grin", "multiply", "side-eyes", "divide", "pumpkin"],
          result: null,
        },
      ],
      choices: ["1", "2", "3"],
      question: "Compute the missing result for the row where result is null.",
      modelId: "emoji3",
    },
  ];

  // Encrypt expressions, results, and choices
  const questions: TEncryptedQuestion[] = rawQuestions.map((q) => ({
    id: uuidv4(),
    board: q.board.map((b) => ({
      id: b.id,
      expression: b.expression ? encrypt(JSON.stringify(b.expression)) : null,
      result:
        b.result !== null && b.result !== undefined
          ? encrypt(b.result.toString())
          : null,
    })),
    choices: q.choices ? encrypt(JSON.stringify(q.choices)) : undefined,
    question: q.question ? encrypt(q.question) : "",
    modelId: q.modelId ? encrypt(q.modelId) : "",
  }));

  return NextResponse.json({ questions });
}
