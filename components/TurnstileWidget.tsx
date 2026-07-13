"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          theme?: "dark" | "light" | "auto";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    const key: string = siteKey;

    function renderWidget() {
      if (!window.turnstile || !containerRef.current) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: key,
        callback: onVerify,
        "expired-callback": handleExpire,
        theme: "dark",
      });
    }

    if (document.querySelector('script[src*="turnstile"]')) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.head.appendChild(script);
  }, [siteKey, onVerify, handleExpire]);

  if (!siteKey) {
    return (
      <p className="text-[11px] text-text-muted text-center py-2">
        Security check unavailable — you can still publish.
      </p>
    );
  }

  return <div ref={containerRef} className="flex justify-center my-3" />;
}
