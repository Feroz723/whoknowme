import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { quizzes, questions } from "@/db/schema";
import { createQuizSchema, structuralSpamCheck, moderateText } from "@/lib/validation";
import { makeSlug, makeEditToken } from "@/lib/ids";
import { checkRateLimit, clientIpFrom } from "@/lib/rate-limit";

// Quiz *creation* is where we spend rate-limiting/CAPTCHA friction — the
// taking flow (respond route) stays frictionless. See spec Section 13.
const CREATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 }; // 5 quizzes / hour / IP

export async function POST(req: NextRequest) {
  const ip = clientIpFrom(req.headers);
  const { allowed } = await checkRateLimit(`create:${ip}`, CREATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many quizzes created recently. Try again in a bit." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = createQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid quiz" },
      { status: 400 }
    );
  }

  // Verify Cloudflare Turnstile token.
  const turnstileToken = body?.turnstileToken;
  if (turnstileToken) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (secret) {
      const ver = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ secret, response: turnstileToken }),
        }
      );
      const verBody = await ver.json() as { success: boolean };
      if (!verBody.success) {
        return NextResponse.json(
          { error: "Security check failed. Please try again." },
          { status: 400 }
        );
      }
    }
  } else {
    return NextResponse.json(
      { error: "Security check required. Please refresh and try again." },
      { status: 400 }
    );
  }

  const spamReason = structuralSpamCheck(parsed.data);
  if (spamReason) {
    return NextResponse.json({ error: spamReason }, { status: 400 });
  }

  // Content moderation via Groq — check creator name + all question text.
  const allText = [
    parsed.data.creatorName,
    ...parsed.data.questions.flatMap((q) => [q.prompt, ...q.options]),
  ].join(" ");

  try {
    const { flagged, categories } = await moderateText(allText);
    if (flagged) {
      return NextResponse.json(
        {
          error: `Your quiz was flagged by our moderation system${
            categories?.length ? ` (${categories.join(", ")})` : ""
          }. Please review and edit your content.`,
        },
        { status: 400 }
      );
    }
  } catch (e) {
    // If moderation service is down, allow the quiz through rather than
    // blocking all creation with a 500.
    console.error("Moderation check failed:", e);
  }

  const { creatorName, language, questions: qs } = parsed.data;
  const slug = makeSlug();
  const { token, tokenHash } = makeEditToken();

  const [quiz] = await db
    .insert(quizzes)
    .values({
      slug,
      editTokenHash: tokenHash,
      creatorName,
      language,
    })
    .returning({ id: quizzes.id, slug: quizzes.slug });

  await db.insert(questions).values(
    qs.map((q, i) => ({
      quizId: quiz.id,
      prompt: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      position: i,
    }))
  );

  return NextResponse.json(
    {
      slug: quiz.slug,
      takeUrl: `/q/${quiz.slug}`,
      // Shown to the creator exactly once — this is their only copy of the
      // raw token. Only its hash lives in the database (lib/ids.ts).
      editUrl: `/q/${quiz.slug}/manage?token=${token}`,
    },
    { status: 201 }
  );
}
