"use client";

import { useState } from "react";
import { CATEGORIES, QUESTION_BANK, type BankQuestion } from "@/lib/question-bank";
import { Button } from "@/components/Button";

const DIFFICULTY_COLOR: Record<BankQuestion["difficulty"], string> = {
  easy: "text-success",
  medium: "text-accent-soft",
  hard: "text-error",
};

export function QuestionPicker({
  usedBankIds,
  onPick,
  onCustom,
}: {
  usedBankIds: Set<string>;
  onPick: (q: BankQuestion) => void;
  onCustom: () => void;
}) {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);

  const inCategory = QUESTION_BANK.filter(
    (q) => q.category === category && !usedBankIds.has(q.id)
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 text-[12.5px] font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
              c === category
                ? "bg-accent border-accent text-white"
                : "border-border text-text-muted hover:border-accent-soft"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {inCategory.length === 0 ? (
          <p className="text-[13px] text-text-muted py-6 text-center">
            You&apos;ve used every question in this category — try another one,
            or write your own below.
          </p>
        ) : (
          inCategory.map((q) => (
            <button
              key={q.id}
              onClick={() => onPick(q)}
              className="w-full text-left rounded-xl border border-border bg-surface-raised px-4 py-3 hover:border-accent-soft transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-[10.5px] font-mono font-bold uppercase tracking-wide ${DIFFICULTY_COLOR[q.difficulty]}`}
                >
                  {q.difficulty}
                </span>
              </div>
              <p className="text-[14px] text-text leading-snug">{q.prompt}</p>
            </button>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="secondary" onClick={onCustom} className="w-full">
          Write my own question instead
        </Button>
      </div>
    </div>
  );
}
