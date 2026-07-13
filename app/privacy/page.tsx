import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — WhoKnowsMe",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-6 py-14 sm:py-20">
      <div className="max-w-4xl mx-auto text-[14px] text-text-muted leading-relaxed space-y-5">
        <h1 className="text-[22px] font-bold text-text">Privacy Policy</h1>
        <p className="text-[12px]">Last updated: July 2026</p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          What we collect
        </h2>
        <p>
          When you create a quiz we store your chosen name, the questions and
          options you write, and which option is correct. When you take a quiz
          we store your name and your answers. We also store a salted hash of
          your IP address — never the raw IP — used only to prevent duplicate
          responses.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          What we don&apos;t collect
        </h2>
        <p>
          No account, no email, no password, no cookies for tracking, no
          location data. We never ask for or store your real name.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          How we use it
        </h2>
        <p>
          Your quiz data powers the leaderboard and score calculation. We do
          not share, sell, or export individual response data. Aggregated,
          anonymized stats (e.g. &ldquo;123 quizzes created today&rdquo;) may
          be used publicly.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          Content moderation
        </h2>
        <p>
          Quiz content is passed through an automated moderation API (OpenAI)
          to detect hate speech, harassment, sexual content, and violence.
          Flagged quizzes are reviewed manually and may be removed.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          Third-party services
        </h2>
        <p>
          We use Vercel (hosting), Neon (PostgreSQL database), Upstash (Redis
          rate limiting), Cloudflare Turnstile (bot detection), and Resend
          (admin email alerts). Each service has its own privacy policy.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          Data retention
        </h2>
        <p>
          Quiz data is kept until the quiz creator&apos;s private link is used
          to delete it, or until we remove inactive quizzes after 12 months.
          Contact us if you need something removed sooner.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          Contact
        </h2>
        <p>
          Email privacy@whoknowsme.com for data requests or concerns.
        </p>

        <div className="pt-6">
          <Link
            href="/"
            className="text-[13px] text-accent-soft hover:text-text transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
