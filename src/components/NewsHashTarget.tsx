"use client";

import { useEffect } from "react";

/** Keep NEWS server-rendered; expand an accordion addressed by a HOME link. */
export default function NewsHashTarget() {
  useEffect(() => {
    let frame = 0;
    const openTarget = () => {
      cancelAnimationFrame(frame);
      if (!/^#news-\d{8}$/.test(window.location.hash)) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (!(target instanceof HTMLDetailsElement)) return;

      target.open = true;
      // Scroll after expansion and Next.js navigation have committed their layout.
      frame = requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start", behavior: "instant" });
      });
    };

    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openTarget);
    };
  }, []);

  return null;
}
