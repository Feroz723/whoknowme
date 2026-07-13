import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, reports } from "@/db/schema";
import { reportSchema } from "@/lib/validation";
import { notifyReport } from "@/lib/notify";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

// Tight limit — reporting should be rare; this blocks spam floods
// that could fill the reports table and spam admin email.
const REPORT_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };

export async function POST(req: NextRequest) {
  const ip = clientIpFrom(req.headers);
  const { allowed } = await checkRateLimit(`report:${ip}`, REPORT_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many reports. Please try again later." },
      { status: 429 }
    );
  }

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
