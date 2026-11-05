"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || !el.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let animation: Animation | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animation = el.animate(
            [{ opacity: 0, transform: "translateY(1.5rem)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 1200, delay, easing: "ease-out", fill: "backwards" },
          );
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => { io.disconnect(); animation?.cancel(); };
  }, [delay]);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      data-reveal=""
    >
      {children}
    </Component>
  );
}
