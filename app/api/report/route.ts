import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, reports } from "@/db/schema";
import { reportSchema } from "@/lib/validation";
import { notifyReport } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid report" },
      { status: 400 }
    );
  }

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.slug, parsed.data.slug),
  });
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  await db.insert(reports).values({
    quizId: quiz.id,
    reason: parsed.data.reason,
  });

  // Notify admin — fire-and-forget, don't block the response.
  notifyReport({
    reason: parsed.data.reason,
    quizSlug: parsed.data.slug,
    quizId: quiz.id,
  }).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
