import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, responses } from "@/db/schema";
import { scoreTier } from "@/lib/scoring";
import { ResultShare } from "@/components/ResultShare";
import { DownloadButton } from "@/components/DownloadButton";

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

          <div id="result-card" className="relative rounded-2xl bg-surface border border-border p-6 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.35)]">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
              Your score
            </div>

            <div id="score-card" className="text-center mb-6">
              <div className="text-[56px] font-extrabold text-text leading-none mb-2">
                {Math.round(score)}%
              </div>
              <p className="text-[14px] text-text-muted">
                {response.takerName} on {quiz.creatorName}&apos;s quiz
              </p>
              <p className="text-[13px] text-accent-soft mt-2">{tier}</p>
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
        </div>
      </div>
    </main>
  );
}
