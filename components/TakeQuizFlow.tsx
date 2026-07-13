"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { StackedCard } from "@/components/StackedCard";
import { ProgressBar } from "@/components/ProgressBar";

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

type QuizData = {
  creatorName: string;
  language: string;
  questions: QuizQuestion[];
};

type Phase = "loading" | "intro" | "name" | "questions" | "submitting" | "notfound" | "error";

export function TakeQuizFlow({ slug }: { slug: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [takerName, setTakerName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          setPhase("notfound");
          return;
        }
        const data = await res.json();
        setQuiz(data);
        setPhase("intro");
      })
      .catch(() => setPhase("error"));
  }, [slug]);

  async function submitQuiz(finalAnswers: number[]) {
    setPhase("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/quiz/${slug}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ takerName, answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
        setPhase("questions");
        setCurrentIndex(quiz!.questions.length - 1);
        setSelected(finalAnswers[finalAnswers.length - 1] ?? null);
        return;
      }
      router.push(`/q/${slug}/result/${data.responseId}`);
    } catch {
      setErrorMsg("Couldn't reach the server. Check your connection and try again.");
      setPhase("questions");
    }
  }

  async function reportQuiz(reason: string) {
    setReporting(true);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, reason }),
      });
      setReported(true);
    } finally {
      setReporting(false);
    }
  }

  if (phase === "loading") {
    return (
      <StackedCard eyebrow="Loading">
        <p className="text-[14px] text-text-muted">Fetching quiz…</p>
      </StackedCard>
    );
  }

  if (phase === "notfound") {
    return (
      <StackedCard eyebrow="Not found">
        <h2 className="text-[18px] font-bold text-text mb-2">This quiz doesn&apos;t exist</h2>
        <p className="text-[13.5px] text-text-muted mb-5">
          The link might be wrong, or the quiz was removed.
        </p>
        <Button className="w-full" onClick={() => router.push("/")}>
          Go home
        </Button>
      </StackedCard>
    );
  }

  if (phase === "error" || !quiz) {
    return (
      <StackedCard eyebrow="Error">
        <p className="text-[14px] text-text-muted mb-5">
          Couldn&apos;t load this quiz. Check your connection and try again.
        </p>
        <Button className="w-full" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </StackedCard>
    );
  }

  if (phase === "intro") {
    return (
      <StackedCard eyebrow="Friendship quiz">
        <h2 className="text-[22px] font-bold text-text mb-2">
          How well do you know {quiz.creatorName}?
        </h2>
        <p className="text-[13.5px] text-text-muted mb-6">
          {quiz.questions.length} questions · about 2 minutes · no login needed
        </p>
        <Button className="w-full" onClick={() => setPhase("name")}>
          Start quiz
        </Button>
        <ReportLink
          reported={reported}
          reporting={reporting}
          onReport={reportQuiz}
        />
      </StackedCard>
    );
  }

  if (phase === "name") {
    return (
      <StackedCard eyebrow="Before we start">
        <h2 className="text-[18px] font-bold text-text mb-1">What&apos;s your name?</h2>
        <p className="text-[13px] text-text-muted mb-5">
          This goes on the leaderboard — use what your friends call you.
        </p>
        <TextField
          label="Your name"
          placeholder="e.g. Alex"
          value={takerName}
          maxLength={40}
          onChange={(e) => setTakerName(e.target.value)}
        />
        <Button
          className="w-full mt-6"
          disabled={takerName.trim().length === 0}
          onClick={() => {
            setCurrentIndex(0);
            setSelected(null);
            setPhase("questions");
          }}
        >
          Let&apos;s go
        </Button>
      </StackedCard>
    );
  }

  if (phase === "submitting") {
    return (
      <StackedCard eyebrow="Scoring">
        <p className="text-[14px] text-text-muted">Tallying your answers…</p>
      </StackedCard>
    );
  }

  const q = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;

  return (
    <StackedCard eyebrow={`Question ${currentIndex + 1} of ${quiz.questions.length}`}>
      <div className="mb-4">
        <ProgressBar current={currentIndex + 1} total={quiz.questions.length} />
      </div>

      <p className="text-[17px] font-semibold text-text leading-snug mb-5">
        {q.prompt}
      </p>

      <div className="space-y-2.5">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left text-[13.5px] rounded-lg border px-4 py-3 transition-colors ${
              selected === i
                ? "border-accent bg-accent/10 text-text"
                : "border-border text-text-muted hover:border-accent-soft"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {errorMsg ? (
        <p className="text-[13px] text-error mt-4">{errorMsg}</p>
      ) : null}

      <div className="flex gap-2.5 mt-6">
        {currentIndex > 0 ? (
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              const prev = currentIndex - 1;
              setCurrentIndex(prev);
              setSelected(answers[prev] ?? null);
            }}
          >
            Back
          </Button>
        ) : null}
        <Button
          className="flex-1"
          disabled={selected === null}
          onClick={() => {
            const nextAnswers = [...answers];
            nextAnswers[currentIndex] = selected!;
            setAnswers(nextAnswers);

            if (isLast) {
              submitQuiz(nextAnswers);
            } else {
              setCurrentIndex(currentIndex + 1);
              setSelected(nextAnswers[currentIndex + 1] ?? null);
            }
          }}
        >
          {isLast ? "See my score" : "Next"}
        </Button>
      </div>
    </StackedCard>
  );
}

function ReportLink({
  reported,
  reporting,
  onReport,
}: {
  reported: boolean;
  reporting: boolean;
  onReport: (reason: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (reported) {
    return (
      <p className="text-[11px] text-text-muted text-center mt-5">
        Report submitted — thanks.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="block mx-auto mt-5 text-[11px] text-text-muted hover:text-error transition-colors"
      >
        Report this quiz
      </button>
    );
  }

  return (
    <div className="mt-5 pt-4 border-t border-border">
      <p className="text-[11px] text-text-muted mb-2 text-center">
        Why are you reporting this?
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {(["inappropriate", "spam", "harassment", "other"] as const).map((r) => (
          <button
            key={r}
            disabled={reporting}
            onClick={() => onReport(r)}
            className="text-[11px] px-2.5 py-1 rounded-md border border-border text-text-muted hover:border-error hover:text-error transition-colors disabled:opacity-40"
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
