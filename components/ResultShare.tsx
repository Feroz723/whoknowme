"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

function shareText(takerName: string, creatorName: string, scorePercent: number): string {
  return `${takerName} scored ${Math.round(scorePercent)}% on ${creatorName}'s friendship quiz. Think you can beat that?`;
}

export function ResultShare({
  slug,
  responseId,
  takerName,
  creatorName,
  scorePercent,
}: {
  slug: string;
  responseId: string;
  takerName: string;
  creatorName: string;
  scorePercent: number;
}) {
  const [copied, setCopied] = useState(false);

  const resultPath = `/q/${slug}/result/${responseId}`;
  const text = shareText(takerName, creatorName, scorePercent);
  const ogUrl = `${resultPath}/opengraph-image`;

  function absoluteUrl(): string {
    return `${window.location.origin}${resultPath}`;
  }

  return (
    <div>
      <div className="rounded-xl border border-border overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogUrl}
          alt={`${takerName} scored ${Math.round(scorePercent)}%`}
          className="w-full h-auto"
        />
      </div>

      <div className="flex gap-2.5 mb-2.5">
        <Button
          className="flex-1"
          onClick={() => {
            const url = absoluteUrl();
            const waText = `${takerName} scored ${Math.round(scorePercent)}% on ${creatorName}'s friendship quiz. Think you can beat that? ${url}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, "_blank", "noopener");
          }}
        >
          Share on WhatsApp
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={async () => {
            await navigator.clipboard.writeText(absoluteUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            const url = absoluteUrl();
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
              "_blank",
              "noopener"
            );
          }}
        >
          Share on X
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl())}`,
              "_blank",
              "noopener"
            );
          }}
        >
          Share on Facebook
        </Button>
      </div>
    </div>
  );
}
