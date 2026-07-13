"use client";

import { useState, useCallback } from "react";
import { toPng } from "html-to-image";

export function DownloadButton({ targetId, filename }: { targetId: string; filename?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const originalStyle = el.getAttribute("style");
    const width = el.offsetWidth;
    const height = Math.round((width * 16) / 9);

    // Force explicit pixel dimensions on the real element so the cloned
    // node renders at full height (html-to-image reads computed styles,
    // and `aspect-ratio` is unreliable inside the clone).
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.aspectRatio = "auto";

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
      // score text is what matters.
    } finally {
      if (originalStyle !== null) {
        el.setAttribute("style", originalStyle);
      } else {
        el.removeAttribute("style");
      }
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
