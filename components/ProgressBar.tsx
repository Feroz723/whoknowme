export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between text-[11px] font-mono text-text-muted mb-1.5">
        <span>
          {current} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
