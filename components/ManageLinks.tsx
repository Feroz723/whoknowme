"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export function ManageLinks({
  slug,
  creatorName,
}: {
  slug: string;
  creatorName: string;
}) {
  const [copied, setCopied] = useState(false);

  const takeUrl = `/q/${slug}`;

  function absoluteUrl(): string {
    return `${window.location.origin}${takeUrl}`;
  }

  function shareWhatsApp() {
    const text = `${creatorName} made a quiz to see who actually knows them. Think it's you? ${absoluteUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5">
        <code className="flex-1 text-[12px] font-mono text-text truncate">
          {takeUrl}
        </code>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(absoluteUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="shrink-0 text-[11.5px] font-semibold text-accent-soft hover:text-text"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <Button className="w-full" onClick={shareWhatsApp}>
        Share quiz link
      </Button>
    </div>
  );
}
