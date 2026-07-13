import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, responses } from "@/db/schema";
import { scoreTier } from "@/lib/scoring";
import { ResultShare } from "@/components/ResultShare";
import { DownloadButton } from "@/components/DownloadButton";
import { SpotlightCard } from "@/components/SpotlightCard";

type Props = {
  params: Promise<{ slug: string; responseId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, responseId } = await params;

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.slug, slug),
  });
  if (!quiz) return { title: "Result — WhoKnowsMe" };

  const response = await db.query.responses.findFirst({
    where: and(
      eq(responses.id, responseId),
      eq(responses.quizId, quiz.id)
    ),
  });
  if (!response) return { title: "Result — WhoKnowsMe" };

  const score = Math.round(parseFloat(response.scorePercent));
  const title = `${response.takerName} scored ${score}% — WhoKnowsMe`;

  return {
    title,
    description: `How well does ${response.takerName} know ${quiz.creatorName}?`,
    openGraph: {
      title,
      images: [`/q/${slug}/result/${responseId}/opengraph-image`],
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { slug, responseId } = await params;

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.slug, slug),
  });
  if (!quiz) notFound();

  const response = await db.query.responses.findFirst({
    where: and(
      eq(responses.id, responseId),
      eq(responses.quizId, quiz.id)
    ),
  });
  if (!response) notFound();

  const score = parseFloat(response.scorePercent);
  const tier = scoreTier(score);

  return (
    <main className="flex-1 flex flex-col px-6 py-10 sm:py-16">
      <div className="w-full mx-auto">
        <div className="relative w-full max-w-lg mx-auto sm:max-w-xl lg:max-w-2xl">
          <div className="absolute inset-x-3 -bottom-3 h-full rounded-2xl bg-surface-raised border border-border rotate-[-2.5deg]" />
          <div className="absolute inset-x-1.5 -bottom-1.5 h-full rounded-2xl bg-surface border border-border rotate-[1.5deg]" />

          <SpotlightCard className="relative rounded-2xl bg-surface border border-border p-6 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.35)]">
            <div id="result-card" className="relative">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
              Your score
            </div>

            <div
              id="score-card"
              className="relative mx-auto mb-6 w-full max-w-sm overflow-hidden rounded-3xl p-5"
              style={{
                aspectRatio: "9 / 16",
                background:
                  "radial-gradient(120% 70% at 15% 5%, rgba(124,58,237,0.55) 0%, transparent 50%), radial-gradient(120% 70% at 95% 100%, rgba(76,29,149,0.6) 0%, transparent 50%), linear-gradient(160deg, #1a1033 0%, #2d1b69 48%, #0d0a1f 100%)",
              }}
            >
              <div
                className="absolute left-[-20%] top-[34%] h-[2px] w-[140%] -rotate-6"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #a78bfa, transparent)",
                  boxShadow: "0 0 12px 2px rgba(167,139,250,0.8)",
                }}
              />

              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-8 text-center">
                <div className="mb-6 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-soft">
                  WhoKnowsMe
                </div>

                <div
                  className="mb-4 text-[104px] font-extrabold leading-none text-white"
                  style={{ textShadow: "0 0 28px rgba(124,58,237,0.7)" }}
                >
                  {Math.round(score)}%
                </div>

                <p className="mb-7 text-[15px] text-white/80">
                  {response.takerName} on {quiz.creatorName}&apos;s quiz
                </p>

                <div className="inline-block rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[14px] font-medium text-white">
                  {tier}
                </div>

                <p className="mt-8 text-[11px] text-white/45">
                  Make yours at whoknowsme.com
                </p>
              </div>
            </div>

            <ResultShare
              slug={slug}
              responseId={responseId}
              takerName={response.takerName}
              creatorName={quiz.creatorName}
              scorePercent={score}
            />

            <div className="mt-6 pt-5 border-t border-border space-y-2.5">
              <Link
                href="/create"
                className="block w-full min-h-[44px] px-5 rounded-xl font-semibold text-[15px] transition-colors bg-accent text-white hover:bg-[#6d28d9] text-center leading-[44px]"
              >
                Make your own quiz
              </Link>
              <Link
                href={`/q/${slug}`}
                className="block w-full min-h-[44px] px-5 rounded-xl font-semibold text-[15px] transition-colors bg-transparent border border-border text-text hover:border-accent-soft text-center leading-[44px]"
              >
                Back to quiz
              </Link>
              <DownloadButton targetId="score-card" filename={`whoknowsme-${slug}-${responseId.slice(0, 8)}.png`} />
            </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </main>
  );
}
