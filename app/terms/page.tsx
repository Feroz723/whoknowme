import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — WhoKnowsMe",
};

export default function TermsPage() {
  return (
    <main className="flex-1 px-6 py-14 sm:py-20">
      <div className="max-w-4xl mx-auto text-[14px] text-text-muted leading-relaxed space-y-5">
        <h1 className="text-[22px] font-bold text-text">Terms of Service</h1>
        <p className="text-[12px]">Last updated: July 2026</p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          1. What this is
        </h2>
        <p>
          WhoKnowsMe is a free friendship-quiz tool. You make a quiz, share a
          link, and people take it. That&apos;s it.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          2. Who can use it
        </h2>
        <p>
          You must be at least 13 years old to use WhoKnowsMe. If you are
          between 13 and 18, you confirm that a parent or guardian has
          reviewed and agreed to these terms.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          3. Content rules
        </h2>
        <p>
          Do not create quizzes containing hate speech, harassment, sexual
          content, violence, or anything illegal. Automated moderation checks
          run on every quiz, and we will remove violating content and may ban
          repeat offenders without notice.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          4. Reporting
        </h2>
        <p>
          Every quiz has a &ldquo;Report this quiz&rdquo; link. Reports are
          reviewed by a human and acted on within 72 hours.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          5. No warranty
        </h2>
        <p>
          This service is provided &ldquo;as is&rdquo; with no guarantees of
          uptime or data durability. We may modify or discontinue the service
          at any time.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          6. Liability
        </h2>
        <p>
          WhoKnowsMe is not liable for any damages arising from your use of
          the service. Quiz content is the sole responsibility of the person
          who created it.
        </p>

        <h2 className="text-[16px] font-semibold text-text pt-2">
          7. Changes
        </h2>
        <p>
          We may update these terms. Continued use after changes means you
          accept the new terms.
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
