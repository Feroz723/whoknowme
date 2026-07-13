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
  const [instaCopied, setInstaCopied] = useState(false);

  const resultPath = `/q/${slug}/result/${responseId}`;
  const text = shareText(takerName, creatorName, scorePercent);

  function absoluteUrl(): string {
    return `${window.location.origin}${resultPath}?shared=true`;
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <Button
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
          onClick={async () => {
            await navigator.clipboard.writeText(absoluteUrl());
            setInstaCopied(true);
            setTimeout(() => setInstaCopied(false), 1500);
            window.open("https://www.instagram.com", "_blank", "noopener");
          }}
        >
          {instaCopied ? "Link Copied!" : "Share on Instagram"}
        </Button>
        <Button
          variant="secondary"
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

      <Button
        variant="secondary"
        className="w-full"
        onClick={async () => {
          await navigator.clipboard.writeText(absoluteUrl());
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
}
