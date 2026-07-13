import { NextRequest, NextResponse } from "next/server";
import { eq, asc, and } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, questions, responses } from "@/db/schema";
import { respondSchema } from "@/lib/validation";
import { hashIp } from "@/lib/ids";
import { scoreAnswers } from "@/lib/scoring";
import { clientIpFrom } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const body = await req.json().catch(() => null);
  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 }
    );
  }

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

  if (parsed.data.answers.length !== qs.length) {
    return NextResponse.json(
      { error: "Answer count doesn't match this quiz." },
      { status: 400 }
    );
  }

  const ipHash = hashIp(clientIpFrom(req.headers));
  const existing = await db.query.responses.findFirst({
    where: and(
      eq(responses.quizId, quiz.id),
      eq(responses.ipHash, ipHash)
    ),
  });
  if (existing) {
    return NextResponse.json(
      { error: "You've already taken this quiz from this device." },
      { status: 409 }
    );
  }

  const { correctCount, scorePercent } = scoreAnswers(qs, parsed.data.answers);

  const [response] = await db
    .insert(responses)
    .values({
      quizId: quiz.id,
      takerName: parsed.data.takerName,
      answers: parsed.data.answers,
      scorePercent,
      ipHash,
    })
    .returning({ id: responses.id });

  return NextResponse.json(
    {
      responseId: response.id,
      scorePercent: parseFloat(scorePercent),
      correctCount,
      totalQuestions: qs.length,
      creatorName: quiz.creatorName,
    },
    { status: 201 }
  );
}
