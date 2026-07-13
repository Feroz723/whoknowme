/**
 * Notification helpers for moderation / admin alerts.
 *
 * Uses Resend (free tier: 100 emails/day) to email the admin when a quiz
 * is reported. Falls back to console.log when RESEND_API_KEY is not set.
 *
 * Set these in your Vercel project environment variables:
 *   RESEND_API_KEY  — from https://resend.com
 *   ADMIN_EMAIL     — the address that receives report notifications
 */

type ReportPayload = {
  reason: string;
  quizSlug: string;
  quizId: string;
};

export async function notifyReport(payload: ReportPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) {
    console.log(
      `[report] ${payload.quizSlug} — reason: ${payload.reason} (email not configured)`
    );
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "WhoKnowsMe Reports <reports@whoknowsme.com>",
      to: adminEmail,
      subject: `Quiz reported: ${payload.quizSlug}`,
      text: [
        `A quiz has been reported on WhoKnowsMe.`,
        ``,
        `Quiz slug: ${payload.quizSlug}`,
        `Quiz ID:   ${payload.quizId}`,
        `Reason:    ${payload.reason}`,
        ``,
        `Review at: https://whoknowsme.com/q/${payload.quizSlug}/manage`,
      ].join("\n"),
    }),
  });
}
