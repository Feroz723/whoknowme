import { ReactNode } from "react";

/**
 * The signature visual element of the app: a question sits on a card with
 * two faint edges peeking out behind it, implying there's always another
 * one queued up next. It's a direct visual echo of the product's actual
 * mechanic — the chain never really ends, someone's always making the next
 * card in the sequence.
 */
export function StackedCard({
  children,
  eyebrow,
}: {
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="relative w-full max-w-lg mx-auto sm:max-w-xl lg:max-w-2xl">
      {/* back edges of the stack */}
      <div className="absolute inset-x-3 -bottom-3 h-full rounded-2xl bg-surface-raised border border-border rotate-[-2.5deg]" />
      <div className="absolute inset-x-1.5 -bottom-1.5 h-full rounded-2xl bg-surface border border-border rotate-[1.5deg]" />

      {/* front card */}
      <div className="relative rounded-2xl bg-surface border border-border p-6 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.35)]">
        {eyebrow ? (
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
            {eyebrow}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
