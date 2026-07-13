import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc, and } from "drizzle-orm";
import { db } from "@/db/client";
import { quizzes, responses } from "@/db/schema";
import { hashToken } from "@/lib/ids";
import { ManageLinks } from "@/components/ManageLinks";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function ManagePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="flex-1 flex flex-col px-6 py-10 sm:py-16">
        <div className="max-w-md w-full mx-auto">
          <div className="rounded-2xl bg-surface border border-border p-6">
            <h2 className="text-[18px] font-bold text-text mb-2">Private link required</h2>
            <p className="text-[13.5px] text-text-muted">
              This page is only accessible via the private results link you received
              when you published your quiz.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const quiz = await db.query.quizzes.findFirst({
    where: and(
      eq(quizzes.slug, slug),
      eq(quizzes.editTokenHash, hashToken(token))
    ),
  });

  if (!quiz) notFound();

  const leaderboard = await db.query.responses.findMany({
    where: eq(responses.quizId, quiz.id),
    orderBy: [desc(responses.scorePercent), desc(responses.createdAt)],
  });

  return (
    <main className="flex-1 flex flex-col px-6 py-10 sm:py-16">
      <div className="max-w-md w-full mx-auto">
        <div className="rounded-2xl bg-surface border border-border p-6">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
            Your quiz results
          </div>
          <h2 className="text-[20px] font-bold text-text mb-1">
            {quiz.creatorName}&apos;s leaderboard
          </h2>
          <p className="text-[13px] text-text-muted mb-5">
            {leaderboard.length === 0
              ? "No one has taken your quiz yet — share the link!"
              : `${leaderboard.length} ${leaderboard.length === 1 ? "person has" : "people have"} taken it`}
          </p>

          {leaderboard.length > 0 ? (
            <div className="space-y-2 mb-6 max-h-[360px] overflow-y-auto pr-1">
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface-raised px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[12px] text-accent-soft w-5 shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[13.5px] text-text truncate">
                      {entry.takerName}
                    </span>
                  </div>
                  <span className="font-mono text-[13px] font-semibold text-text shrink-0 ml-3">
                    {Math.round(parseFloat(entry.scorePercent))}%
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <ManageLinks slug={slug} creatorName={quiz.creatorName} />

          <Link
            href="/"
            className="block text-center text-[12px] text-text-muted hover:text-text mt-5 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
