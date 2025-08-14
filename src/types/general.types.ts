export type TQuestion = {
  expression: string[] | null;
  result: string | null;
  choices: string | null;
  answer: string | null;
  id: string;
};

export type TEncryptedQuestion = {
  id: number;
  expression: string | null;
  result: string | null;
  choices?: string;
};
