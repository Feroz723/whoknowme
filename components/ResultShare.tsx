"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { whatsappShareUrl, resultShareText } from "@/lib/whatsapp";

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

  const resultUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/q/${slug}/result/${responseId}`
      : `/q/${slug}/result/${responseId}`;

  const text = shareText(takerName, creatorName, scorePercent);

  const ogUrl = `/q/${slug}/result/${responseId}/opengraph-image`;

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
        <a
          href={whatsappShareUrl(
            resultShareText(takerName, creatorName, scorePercent, resultUrl)
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full">Share on WhatsApp</Button>
        </a>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={async () => {
            await navigator.clipboard.writeText(resultUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>

      <div className="flex gap-2.5">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(resultUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="secondary" className="w-full">
            Share on X
          </Button>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resultUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="secondary" className="w-full">
            Share on Facebook
          </Button>
        </a>
      </div>
    </div>
  );
}
