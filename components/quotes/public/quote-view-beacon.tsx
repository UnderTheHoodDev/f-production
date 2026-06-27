"use client";

import * as React from "react";

/** Marks the quote as VIEWED after mount, without blocking render. */
export function QuoteViewBeacon({ token }: { token: string }) {
  React.useEffect(() => {
    const url = `/api/q/${token}/view`;
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
      } else {
        fetch(url, { method: "POST", keepalive: true }).catch(() => {});
      }
    } catch {
      // best-effort only
    }
  }, [token]);

  return null;
}
