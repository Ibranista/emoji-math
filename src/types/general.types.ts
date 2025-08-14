// A single board item after decryption
export type TQuestion = {
  id: number;
  expression: string[] | null;
  result: number | null;
};

// A group of board items (a board set)
export type TBoardGroup = {
  board: TQuestion[];
  choices: string[] | null;
  question: string;
  modelId: string;
};

export type TEncryptedQuestion = {
  id: string;
  board: {
    id: number;
    expression: string | null;
    result: string | null;
  }[];
  choices?: string;
  question: string;
  modelId: string;
};
