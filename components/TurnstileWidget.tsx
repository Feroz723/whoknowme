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
  // Store callbacks in refs so the effect doesn't re-run when they change.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    const container = containerRef.current;
    const key: string = siteKey;

    function renderWidget() {
      if (!window.turnstile || !container) return;
      // Remove any previous widget before rendering a new one.
      if (widgetId.current) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // Widget may already be gone.
        }
        widgetId.current = null;
      }
      widgetId.current = window.turnstile.render(container, {
        sitekey: key,
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        theme: "dark",
      });
    }

    // If the Turnstile script is already loaded, render immediately.
    if (window.turnstile) {
      renderWidget();
    } else if (!document.querySelector('script[src*="turnstile"]')) {
      // Load the script if it hasn't been loaded yet.
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      // Script tag exists but hasn't loaded yet — poll for it.
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      // Cleanup: remove the widget when the component unmounts.
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // Widget may already be gone.
        }
        widgetId.current = null;
      }
    };
  }, [siteKey]); // Only re-run if siteKey changes (practically never).

  if (!siteKey) {
    return (
      <p className="text-[11px] text-text-muted text-center py-2">
        Security check unavailable — you can still publish.
      </p>
    );
  }

  return <div ref={containerRef} className="flex justify-center my-3" />;
}
