"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { StackedCard } from "@/components/StackedCard";
import { type DraftQuestion, isDraftComplete } from "@/lib/draft-question";

export function QuestionEditor({
  draft,
  position,
  total,
  onSave,
  onCancel,
}: {
  draft: DraftQuestion;
  position: number;
  total: number;
  onSave: (q: DraftQuestion) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState<DraftQuestion>(draft);

  const setOption = (i: number, value: string) => {
    const next = [...q.options] as DraftQuestion["options"];
    next[i] = value;
    setQ({ ...q, options: next });
  };

  const duplicate =
    new Set(q.options.map((o) => o.trim().toLowerCase()).filter(Boolean))
      .size !== q.options.filter((o) => o.trim()).length;

  return (
    <StackedCard eyebrow={`Question ${position} of ${total}`}>
      <TextField
        label="Question"
        placeholder="What do I always do before an exam?"
        value={q.prompt}
        maxLength={140}
        onChange={(e) => setQ({ ...q, prompt: e.target.value })}
      />

      <div className="mt-5 space-y-2.5">
        <span className="block text-[12px] font-medium text-text-muted">
          4 options — tap the circle next to the correct one
        </span>
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label={`Mark option ${i + 1} as correct`}
              onClick={() => setQ({ ...q, correctIndex: i })}
              className={`shrink-0 w-5 h-5 rounded-full border-2 transition-colors ${
                q.correctIndex === i
                  ? "bg-success border-success"
                  : "border-border"
              }`}
            />
            <TextField
              placeholder={`Option ${i + 1}`}
              value={opt}
              maxLength={60}
              onChange={(e) => setOption(i, e.target.value)}
              className="flex-1"
            />
          </div>
        ))}
        {duplicate ? (
          <p className="text-[12px] text-error">
            Two options are identical — make each one different.
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex gap-2.5">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Back
        </Button>
        <Button
          onClick={() => onSave(q)}
          disabled={!isDraftComplete(q) || duplicate}
          className="flex-1"
        >
          Save question
        </Button>
      </div>
    </StackedCard>
  );
}
