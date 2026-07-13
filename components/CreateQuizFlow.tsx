"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { StackedCard } from "@/components/StackedCard";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionPicker } from "@/components/QuestionPicker";
import { QuestionEditor } from "@/components/QuestionEditor";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  type DraftQuestion,
  emptyDraftQuestion,
} from "@/lib/draft-question";
import { MIN_QUESTIONS, MAX_QUESTIONS, type BankQuestion } from "@/lib/question-bank";
import { whatsappShareUrl, quizShareText } from "@/lib/whatsapp";

type Phase = "setup" | "bank" | "editing" | "review" | "success" | "error";

export function CreateQuizFlow() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [creatorName, setCreatorName] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [draft, setDraft] = useState<DraftQuestion | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileExpired, setTurnstileExpired] = useState(false);
  const [result, setResult] = useState<{ takeUrl: string; editUrl: string } | null>(
    null
  );

  const usedBankIds = useMemo(
    () => new Set(questions.map((q) => q.bankId).filter(Boolean) as string[]),
    [questions]
  );

  async function submitQuiz() {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName,
          language,
          turnstileToken,
          questions: questions.map((q) => ({
            prompt: q.prompt,
            options: q.options,
            correctIndex: q.correctIndex,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
        setPhase("review");
        return;
      }
      setResult({ takeUrl: data.takeUrl, editUrl: data.editUrl });
      setPhase("success");
    } catch {
      setErrorMsg("Couldn't reach the server. Check your connection and try again.");
      setPhase("review");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- SETUP ----------
  if (phase === "setup") {
    return (
      <StackedCard eyebrow="Step 1 of 3">
        <h2 className="text-[20px] font-bold text-text mb-1">
          Let&apos;s set up your quiz
        </h2>
        <p className="text-[13.5px] text-text-muted mb-6">
          Just your name — no account needed.
        </p>
        <TextField
          label="Your name"
          placeholder="e.g. Feroz"
          value={creatorName}
          maxLength={40}
          onChange={(e) => setCreatorName(e.target.value)}
        />

        <div className="mt-5">
          <span className="block text-[12px] font-medium text-text-muted mb-1.5">
            Language
          </span>
          <div className="flex gap-2">
            {(["en", "hi"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-4 py-2 rounded-lg text-[13.5px] font-medium border transition-colors ${
                  language === l
                    ? "bg-accent border-accent text-white"
                    : "border-border text-text-muted"
                }`}
              >
                {l === "en" ? "English" : "हिंदी"}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-7"
          disabled={creatorName.trim().length === 0}
          onClick={() => setPhase("bank")}
        >
          Continue
        </Button>
      </StackedCard>
    );
  }

  // ---------- BANK (pick or write) ----------
  if (phase === "bank") {
    return (
      <StackedCard eyebrow={`${questions.length} of ${MIN_QUESTIONS}-${MAX_QUESTIONS} questions`}>
        <div className="mb-4">
          <ProgressBar current={questions.length} total={MIN_QUESTIONS} />
        </div>
        <h2 className="text-[17px] font-bold text-text mb-3">
          Pick a question, or write your own
        </h2>
        <QuestionPicker
          usedBankIds={usedBankIds}
          onPick={(bq: BankQuestion) => {
            setDraft(emptyDraftQuestion(bq.id, bq.prompt));
            setPhase("editing");
          }}
          onCustom={() => {
            setDraft(emptyDraftQuestion());
            setPhase("editing");
          }}
        />

        {questions.length >= MIN_QUESTIONS ? (
          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => setPhase("review")}
          >
            I have enough questions — review &amp; publish
          </Button>
        ) : null}
      </StackedCard>
    );
  }

  // ---------- EDITING ----------
  if (phase === "editing" && draft) {
    return (
      <QuestionEditor
        draft={draft}
        position={questions.length + 1}
        total={MAX_QUESTIONS}
        onCancel={() => setPhase("bank")}
        onSave={(q) => {
          setQuestions((prev) => [...prev, q]);
          setDraft(null);
          setPhase(
            questions.length + 1 >= MAX_QUESTIONS ? "review" : "bank"
          );
        }}
      />
    );
  }

  // ---------- REVIEW ----------
  if (phase === "review") {
    return (
      <StackedCard eyebrow="Step 2 of 3 — review">
        <h2 className="text-[17px] font-bold text-text mb-4">
          {questions.length} questions ready
        </h2>

        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-5">
          {questions.map((q, i) => (
            <div
              key={q.localId}
              className="rounded-lg border border-border bg-surface-raised px-3.5 py-2.5 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-[13px] text-text truncate">
                  {i + 1}. {q.prompt}
                </p>
                <p className="text-[11px] text-text-muted truncate">
                  Correct: {q.options[q.correctIndex]}
                </p>
              </div>
              <button
                onClick={() =>
                  setQuestions((prev) => prev.filter((x) => x.localId !== q.localId))
                }
                className="shrink-0 text-[11px] text-error hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <TurnstileWidget
          onVerify={setTurnstileToken}
          onExpire={() => {
            setTurnstileExpired(true);
            setTurnstileToken(null);
          }}
        />

        {turnstileExpired ? (
          <p className="text-[13px] text-error mb-3">
            Security check expired. Please verify again.
          </p>
        ) : null}

        {errorMsg ? (
          <p className="text-[13px] text-error mb-3">{errorMsg}</p>
        ) : null}

        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setPhase("bank")}
            disabled={questions.length >= MAX_QUESTIONS}
          >
            Add more
          </Button>
          <Button
            className="flex-1"
            disabled={questions.length < MIN_QUESTIONS || submitting || !turnstileToken}
            onClick={submitQuiz}
          >
            {submitting ? "Publishing…" : "Publish quiz"}
          </Button>
        </div>
        {questions.length < MIN_QUESTIONS ? (
          <p className="text-[12px] text-text-muted mt-3">
            Add at least {MIN_QUESTIONS - questions.length} more to publish.
          </p>
        ) : null}
      </StackedCard>
    );
  }

  // ---------- SUCCESS ----------
  if (phase === "success" && result) {
    return (
      <StackedCard eyebrow="Step 3 of 3 — done">
        <h2 className="text-[20px] font-bold text-text mb-1">
          Your quiz is live 🎉
        </h2>
        <p className="text-[13.5px] text-text-muted mb-6">
          Send the link below — everyone who takes it becomes the next
          person who might make one too.
        </p>

        <LinkRow label="Quiz link — share this" value={result.takeUrl} />
        <div className="h-3" />
        <LinkRow
          label="Your private results link — save this, it won't be shown again"
          value={result.editUrl}
          muted
        />

        <Button
          className="w-full mt-6"
          onClick={() => {
            const url = `${window.location.origin}${result.takeUrl}`;
            const text = quizShareText(creatorName, url);
            window.open(whatsappShareUrl(text), "_blank", "noopener");
          }}
        >
          Share on WhatsApp
        </Button>
      </StackedCard>
    );
  }

  return null;
}

function LinkRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <span className="block text-[11.5px] font-medium text-text-muted mb-1.5">
        {label}
      </span>
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 ${
          muted ? "border-border bg-surface" : "border-accent/40 bg-accent/10"
        }`}
      >
        <code className="flex-1 text-[12px] font-mono text-text truncate">
          {value}
        </code>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(`${window.location.origin}${value}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="shrink-0 text-[11.5px] font-semibold text-accent-soft hover:text-text"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
