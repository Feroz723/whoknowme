import Link from "next/link";
import { Button } from "@/components/Button";
import { StackedCard } from "@/components/StackedCard";

const STEPS = [
  {
    n: "01",
    title: "Make a quiz about you",
    body: "8-10 questions, 2 minutes. Favorites, habits, embarrassing stories.",
  },
  {
    n: "02",
    title: "Send one link",
    body: "Drop it in the group chat. No app to install, no login to take it.",
  },
  {
    n: "03",
    title: "Watch the chain",
    body: "Everyone who takes it gets scored — and makes their own right after.",
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="max-w-5xl mx-auto grid gap-14 sm:grid-cols-2 sm:items-center">
          <div>
            <div className="inline-block text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-accent-soft bg-accent/10 border border-accent/30 rounded-full px-3 py-1 mb-6">
              Built for your group chat
            </div>
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-[1.08] tracking-tight text-text mb-5">
              Who actually
              <br />
              knows you best?
            </h1>
            <p className="text-[15px] leading-relaxed text-text-muted max-w-sm mb-8">
              Make a quiz about yourself, send one link, and find out who&apos;s
              paying attention — and who&apos;s been on autopilot this whole time.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/create">
                <Button className="px-7">Create your quiz</Button>
              </Link>
              <span className="text-[13px] text-text-muted">
                No sign-up · takes 2 min
              </span>
            </div>
          </div>

          <StackedCard eyebrow="Question 3 of 9">
            <p className="text-[17px] font-semibold text-text leading-snug mb-5">
              What do I always do right before an exam?
            </p>
            <div className="space-y-2.5">
              {[
                "Reorganize my entire desk",
                "Panic-text the group chat",
                "Pretend I'm calm, I'm not",
                "Actually study, shockingly",
              ].map((opt, i) => (
                <div
                  key={opt}
                  className={`text-[13.5px] rounded-lg border px-4 py-3 ${
                    i === 1
                      ? "border-accent bg-accent/10 text-text"
                      : "border-border text-text-muted"
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </StackedCard>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="font-mono text-accent-soft text-sm font-bold mb-3">
                {s.n}
              </div>
              <h3 className="text-[15px] font-semibold text-text mb-1.5">
                {s.title}
              </h3>
              <p className="text-[13px] text-text-muted leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
