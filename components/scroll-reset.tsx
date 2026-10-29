"use client";

import { useLayoutEffect } from "react";

export default function ScrollReset() {
  useLayoutEffect(() => {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;

    if (navigation?.type !== "reload") return;

    history.scrollRestoration = "manual";

    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    window.scrollTo(0, 0);
    const timeout = window.setTimeout(() => window.scrollTo(0, 0), 60);

    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}
