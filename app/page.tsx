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

const FAQ = [
  {
    q: "Do I need to make an account?",
    a: "No account, no email, no password. Just type your name and go. The only thing you keep is a private link that shows you the leaderboard.",
  },
  {
    q: "Can I see who answered what?",
    a: "Yes. Your private results link shows a leaderboard with everyone who took your quiz and their score. You can share that link with anyone, but only you will have it unless you share it.",
  },
  {
    q: "Can I delete my quiz later?",
    a: "Not yet — deletion is coming. For now, the quiz is hidden if no one has the link. Email us if you need something removed urgently.",
  },
  {
    q: "Is this actually free?",
    a: "Yes, completely free. No hidden tiers, no trial, no credit card. If that ever changes, it'll be announced clearly.",
  },
  {
    q: "Who sees my answers?",
    a: "Only the person who made the quiz sees your score and name on their leaderboard. No one else. Your individual answers are not shared with other takers.",
  },
];

export default function Home() {
  return (
    <>
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[15px] font-bold text-text tracking-tight">
            WhoKnowsMe
          </span>
          <Link
            href="/create"
            className="text-[13px] font-semibold text-accent-soft hover:text-text transition-colors"
          >
            Create quiz
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* ── Hero ── */}
        <section className="px-6 pt-10 pb-14 sm:pt-16 sm:pb-20">
          <div className="max-w-7xl mx-auto grid gap-14 sm:grid-cols-2 sm:items-center">
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
                Make a quiz about yourself, send one link, and find out
                who&apos;s paying attention — and who&apos;s been on autopilot
                this whole time.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/create">
                  <Button className="px-7">Create your quiz</Button>
                </Link>
                <span className="text-[13px] text-text-muted">
                  No sign-up &middot; takes 2 min
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

        {/* ── Share-card example ── */}
        <section className="px-6 pb-14 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
              <div>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
                  The result
                </div>
                <h2 className="text-[22px] sm:text-[28px] font-extrabold text-text leading-tight mb-3">
                  A share-card for every taker
                </h2>
                <p className="text-[14px] text-text-muted leading-relaxed">
                  When someone finishes your quiz they get a score and a
                  shareable image —&nbsp;the kind people actually post in the
                  group chat. That image is the whole growth loop: someone
                  sees it, gets curious, makes their own quiz.
                </p>
              </div>

              <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.35)]">
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-4 text-center">
                  WhoKnowsMe
                </div>
                <div className="text-center">
                  <div className="text-[64px] sm:text-[80px] font-extrabold text-text leading-none mb-2">
                    83%
                  </div>
                  <p className="text-[14px] text-text-muted">
                    Priya on Ravi&apos;s quiz
                  </p>
                  <p className="text-[13px] text-accent-soft mt-2">
                    Pretty solid &mdash; they&apos;ve been paying attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="px-6 pb-14 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
                How it works
              </div>
              <h2 className="text-[22px] sm:text-[28px] font-extrabold text-text">
                Three steps, two minutes
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
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
          </div>
        </section>

        {/* ── Second CTA ── */}
        <section className="px-6 pb-14 sm:pb-20">
          <div className="max-w-7xl mx-auto text-center rounded-2xl border border-border bg-surface p-10 sm:p-14">
            <h2 className="text-[22px] sm:text-[28px] font-extrabold text-text mb-3">
              Ready to find out who actually knows you?
            </h2>
            <p className="text-[14px] text-text-muted mb-6 max-w-md mx-auto">
              Make your quiz, send one link, and watch the scores roll in.
              No sign-up, no catch.
            </p>
            <Link href="/create">
              <Button className="px-8">Create your quiz</Button>
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-6 pb-14 sm:pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
                Questions?
              </div>
              <h2 className="text-[22px] sm:text-[28px] font-extrabold text-text">
                Frequently asked
              </h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border bg-surface overflow-hidden"
                >
                  <summary className="px-5 py-4 text-[14px] font-semibold text-text cursor-pointer list-none flex items-center justify-between select-none hover:bg-surface-raised transition-colors">
                    {item.q}
                    <span className="text-accent-soft text-[18px] leading-none transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-[13.5px] text-text-muted leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[12px] text-text-muted">
            <span className="font-semibold text-text">WhoKnowsMe</span>
            <span aria-hidden="true">&middot;</span>
            <a href="/privacy" className="hover:text-text transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-text transition-colors">
              Terms
            </a>
            <span aria-hidden="true">&middot;</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <a
              href="/create"
              className="font-semibold text-accent-soft hover:text-text transition-colors"
            >
              Create your quiz
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
