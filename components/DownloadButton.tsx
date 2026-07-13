"use client";

import { useState, useCallback } from "react";
import { toPng } from "html-to-image";

export function DownloadButton({ targetId, filename }: { targetId: string; filename?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    // Reset scroll positions of any scrolling containers or parent window
    // temporarily to prevent offset calculation bugs during DOM cloning.
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    window.scrollTo(0, 0);

    // Read the true RENDERED pixel size from the live DOM.
    const rect = el.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);

    setLoading(true);
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: "#16121f",
        pixelRatio: 2,
        // Set canvas to the high-res size (pixelRatio * CSS size)
        canvasWidth: width * 2,
        canvasHeight: height * 2,
        width,
        height,
        // Override styles on the cloned root element to remove margins/position shifts
        // that crop/cut off the content inside the SVG viewBox.
        style: {
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "none",
          maxHeight: "none",
          minWidth: "none",
          minHeight: "none",
          margin: "0",
          position: "relative",
          left: "0",
          top: "0",
          transform: "none",
          aspectRatio: "unset",
          overflow: "hidden",
        } as any,
        filter: (node: HTMLElement) => {
          if (!(node instanceof HTMLElement)) return true;
          return true;
        },
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = filename ?? "whoknowsme-score.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Failed to generate image:", e);
    } finally {
      // Restore the original scroll position
      window.scrollTo(scrollX, scrollY);
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
