"use client";

import { useState, useCallback } from "react";
import { toPng } from "html-to-image";

export function DownloadButton({ targetId, filename }: { targetId: string; filename?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const width = el.offsetWidth;
    const height = el.offsetHeight;

    // Let one frame of layout settle before capture so container/aspect
    // sizing is final.
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    setLoading(true);
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#16121f",
        pixelRatio: 2,
        width,
        height,
        // Applied to the cloned node html-to-image renders from — neutralises
        // any transform/scale and pins the clone to the on-screen geometry so
        // the canvas and content match (no clipping / blank space).
        style: {
          transform: "none",
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
          aspectRatio: "auto",
        },
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
