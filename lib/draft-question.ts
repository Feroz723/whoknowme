export type DraftQuestion = {
  /** Local-only id for React keys / editing - not sent to the server. */
  localId: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  bankId?: string;
};

export function emptyDraftQuestion(bankId?: string, prompt = ""): DraftQuestion {
  return {
    localId: crypto.randomUUID(),
    prompt,
    options: ["", "", "", ""],
    correctIndex: 0,
    bankId,
  };
}

export function isDraftComplete(q: DraftQuestion): boolean {
  return (
    q.prompt.trim().length > 0 &&
    q.options.every((o) => o.trim().length > 0) &&
    new Set(q.options.map((o) => o.trim().toLowerCase())).size === 4
  );
}
