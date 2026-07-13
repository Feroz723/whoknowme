import { ImageResponse } from "next/og";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, responses } from "@/db/schema";
import { scoreTier } from "@/lib/scoring";

export const alt = "Quiz result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string; responseId: string }>;
};

export default async function Image({ params }: Props) {
  const { slug, responseId } = await params;

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.slug, slug),
  });

  const response = quiz
    ? await db.query.responses.findFirst({
        where: and(
          eq(responses.id, responseId),
          eq(responses.quizId, quiz.id)
        ),
      })
    : null;

  const score = response ? Math.round(parseFloat(response.scorePercent)) : 0;
  const takerName = response?.takerName ?? "Someone";
  const creatorName = quiz?.creatorName ?? "a friend";
  const tier = response ? scoreTier(score) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d14",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#16121f",
            border: "2px solid #2b2340",
            borderRadius: "24px",
            padding: "60px 80px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#b79bff",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 24,
              fontWeight: 700,
            }}
          >
            WhoKnowsMe
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              color: "#f4f2fb",
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            {score}%
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#9184b8",
              marginBottom: 20,
            }}
          >
            {takerName} on {creatorName}&apos;s quiz
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#7c3aed",
              textAlign: "center",
              maxWidth: 600,
            }}
          >
            {tier}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
