import { z } from "zod";
import { MAX_QUESTIONS, MIN_QUESTIONS } from "@/lib/question-bank";

const NAME_MAX = 40;
const PROMPT_MAX = 140;
const OPTION_MAX = 60;

/** Rejects HTML/script content outright — this text is rendered back to
 *  other users (results page, share card), so no markup is ever allowed. */
const noMarkup = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((v) => !/<[^>]*>/.test(v), `${label} can't contain HTML`)
    .refine((v) => !/https?:\/\//i.test(v), `${label} can't contain links`);

export const createQuizSchema = z.object({
  creatorName: noMarkup("Your name").pipe(z.string().max(NAME_MAX)),
  language: z.enum(["en", "hi"]).default("en"),
  questions: z
    .array(
      z.object({
        prompt: noMarkup("Question").pipe(z.string().max(PROMPT_MAX)),
        options: z
          .array(noMarkup("Option").pipe(z.string().max(OPTION_MAX)))
          .length(4, "Each question needs exactly 4 options"),
        correctIndex: z.number().int().min(0).max(3),
      })
    )
    .min(MIN_QUESTIONS, `Add at least ${MIN_QUESTIONS} questions`)
    .max(MAX_QUESTIONS, `Add at most ${MAX_QUESTIONS} questions`),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const respondSchema = z.object({
  takerName: noMarkup("Your name").pipe(z.string().max(NAME_MAX)),
  answers: z
    .array(z.number().int().min(0).max(3))
    .min(MIN_QUESTIONS, "Invalid answers")
    .max(MAX_QUESTIONS, "Invalid answers"),
});

export type RespondInput = z.infer<typeof respondSchema>;

export const reportSchema = z.object({
  slug: z.string().min(1),
  reason: z.enum(["inappropriate", "spam", "harassment", "other"]),
});

export type ReportInput = z.infer<typeof reportSchema>;

/**
 * Structural + moderation gate for anything a creator submits, run after
 * schema validation and before writing to the database (spec Section 13).
 */
export function structuralSpamCheck(input: CreateQuizInput): string | null {
  const allText = [
    input.creatorName,
    ...input.questions.flatMap((q) => [q.prompt, ...q.options]),
  ];

  // Reject repeated-character spam, e.g. "aaaaaaaaaaaaaaaa"
  if (allText.some((t) => /(.)\1{9,}/.test(t))) {
    return "One of your answers looks like spam — please rewrite it.";
  }

  // All 4 options identical is either a mistake or an attempt to game scoring.
  for (const q of input.questions) {
    const unique = new Set(q.options.map((o) => o.trim().toLowerCase()));
    if (unique.size < q.options.length) {
      return "Each question's 4 options must be different from each other.";
    }
  }

  return null;
}

/**
 * OpenAI Moderation API wrapper.
 *
 * Requires the OPENAI_API_KEY environment variable. If the key is missing
 * the call is skipped and the content is allowed through — this avoids a
 * hard failure during local dev while still being safe in production where
 * the env var must be set.
 *
 * https://platform.openai.com/docs/guides/moderation
 */
export async function moderateText(text: string): Promise<{ flagged: boolean; categories?: string[] }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return { flagged: false };
  }

  const res = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ input: text }),
  });

  if (!res.ok) {
    return { flagged: false };
  }

  const body = await res.json() as {
    results: Array<{ flagged: boolean; categories: Record<string, boolean> }>;
  };

  const result = body.results?.[0];
  if (!result?.flagged) {
    return { flagged: false };
  }

  const flaggedCategories = Object.entries(result.categories ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  return { flagged: true, categories: flaggedCategories };
}
