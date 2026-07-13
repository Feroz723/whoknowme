export function scoreAnswers(
  questions: { correctIndex: number }[],
  answers: number[]
): { correctCount: number; scorePercent: string } {
  const correctCount = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
  const scorePercent = ((correctCount / questions.length) * 100).toFixed(2);
  return { correctCount, scorePercent };
}

export function scoreTier(scorePercent: number): string {
  if (scorePercent >= 90) return "You actually know them. Suspicious.";
  if (scorePercent >= 70) return "Pretty solid — they've been paying attention.";
  if (scorePercent >= 50) return "Room for improvement. Do you even hang out?";
  return "Yikes. Friendship in crisis.";
}
