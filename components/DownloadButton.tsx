"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

export function DownloadButton({ targetId, filename }: { targetId: string; filename?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    const el = document.getElementById(targetId);
    if (!el) return;

    setLoading(true);
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#16121f",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = filename ?? "whoknowsme-score.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="block w-full min-h-[44px] px-5 rounded-xl font-semibold text-[15px] transition-colors bg-transparent border border-border text-text hover:border-accent-soft text-center leading-[44px] disabled:opacity-40"
    >
      {loading ? "Generating…" : "Download image"}
    </button>
  );
}
