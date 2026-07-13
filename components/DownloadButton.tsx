"use client";

import { useState, useCallback } from "react";
import { toPng } from "html-to-image";

export function DownloadButton({ targetId, filename }: { targetId: string; filename?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#16121f",
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = filename ?? "whoknowsme-score.png";
      link.href = dataUrl;
      link.click();
    } catch {
      // Capture can fail if external images haven't loaded — the
      // OG image preview inside the card is decorative for the
      // download; the score text is what matters.
    } finally {
      setLoading(false);
    }
  }, [targetId, filename]);

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="block w-full min-h-[44px] px-5 rounded-xl font-semibold text-[15px] transition-colors bg-transparent border border-border text-text hover:border-accent-soft text-center leading-[44px] disabled:opacity-40"
    >
      {loading ? "Generating\u2026" : "Download image"}
    </button>
  );
}
