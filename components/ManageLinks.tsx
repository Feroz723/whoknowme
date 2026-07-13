"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { whatsappShareUrl, quizShareText } from "@/lib/whatsapp";

export function ManageLinks({
  slug,
  creatorName,
}: {
  slug: string;
  creatorName: string;
}) {
  const [copied, setCopied] = useState(false);

  const takeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/q/${slug}`
      : `/q/${slug}`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5">
        <code className="flex-1 text-[12px] font-mono text-text truncate">
          {takeUrl}
        </code>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(takeUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="shrink-0 text-[11.5px] font-semibold text-accent-soft hover:text-text"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <a
        href={whatsappShareUrl(quizShareText(creatorName, takeUrl))}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button className="w-full">Share quiz link</Button>
      </a>
    </div>
  );
}
