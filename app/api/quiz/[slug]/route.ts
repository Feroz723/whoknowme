import { NextRequest, NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, questions } from "@/db/schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.slug, slug),
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const qs = await db.query.questions.findMany({
    where: eq(questions.quizId, quiz.id),
    orderBy: [asc(questions.position)],
  });

  return NextResponse.json({
    creatorName: quiz.creatorName,
    language: quiz.language,
    // correctIndex is intentionally omitted here — a taker's browser must
    // never receive the answer key. Scoring happens server-side in the
    // /respond route (built in the next phase).
    questions: qs.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: q.options,
    })),
  });
}
