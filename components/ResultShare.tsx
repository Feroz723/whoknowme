"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { whatsappShareUrl, resultShareText } from "@/lib/whatsapp";

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

      <div className="flex gap-2.5">
        <a
          href={whatsappShareUrl(
            resultShareText(takerName, creatorName, scorePercent, resultUrl)
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full">Share score</Button>
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
    </div>
  );
}
