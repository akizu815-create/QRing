"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Reveal from "@/components/Reveal";

const STEPS = [
  {
    no: "01",
    title: "登録してつける",
    body: (
      <>
        QRコードに連絡先を登録し、
        <br />
        持ち物やペット用品などに取り付けます。
      </>
    ),
    image: "/images/how-it-works-step-01.png",
    imageAlt: "バッグに取り付けられたQRチャームの線画",
  },
  {
    no: "02",
    title: "見つけた人がスキャンする",
    body: (
      <>
        拾った方・見つけた方がQRコードを
        <br />
        スマートフォンでスキャンします。
      </>
    ),
    image: "/images/how-it-works-step-02.png",
    imageAlt: "スマートフォンでQRコードをスキャンする線画",
  },
  {
    no: "03",
    title: "必要な相手とつながる",
    body: (
      <>
        画面の案内に沿って進むだけで、
        <br />
        必要な相手へ連絡できます。
      </>
    ),
    image: "/images/how-it-works-step-03.png",
    imageAlt: "スマートフォンから必要な相手へつながる線画",
  },
] as const;

const arrowProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function StepArtwork({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative h-[210px] w-full md:h-[230px]">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 360px, (min-width: 1024px) 28vw, 80vw"
        className="object-contain"
      />
    </div>
  );
}

const motionClassName =
  "transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none";

function FlowArrow({
  visible,
  delay,
}: {
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className={`${motionClassName} flex items-center justify-center py-7 lg:h-[230px] lg:py-0 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 58" className="h-12 w-5 text-moss/60 lg:hidden">
        <path d="M12 3v46M5 43l7 8 7-8" {...arrowProps} />
      </svg>
      <svg viewBox="0 0 60 24" className="hidden h-5 w-12 text-moss/60 lg:block">
        <path d="M3 12h48M44 5l8 7-8 7" {...arrowProps} />
      </svg>
    </div>
  );
}

function Step({
  step,
  visible,
  delay,
}: {
  step: (typeof STEPS)[number];
  visible: boolean;
  delay: number;
}) {
  return (
    <article
      className={`${motionClassName} flex min-w-0 flex-col items-center text-center ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      <StepArtwork image={step.image} alt={step.imageAlt} />
      <p className="mt-5 text-[11px] font-medium tracking-[0.32em] text-moss md:mt-6">
        STEP {step.no}
      </p>
      <span className="mt-4 h-px w-8 bg-moss/55" aria-hidden="true" />
      <h3 className="mt-5 font-serif text-[26px] font-light leading-snug md:text-[clamp(24px,2vw,30px)]">
        {step.title}
      </h3>
      <p className="body-jp mt-4 max-w-sm text-sm leading-[2] text-ink/70 xl:text-[15px]">
        {step.body}
      </p>
    </article>
  );
}

export default function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const element = stepsRef.current;
    if (!element || stepsVisible) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      setStepsVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const reveal = () => {
      setStepsVisible(true);
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
    };

    const checkPosition = () => {
      frame = 0;
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.88) {
        reveal();
      }
    };

    const scheduleCheck = () => {
      if (!frame) frame = window.requestAnimationFrame(checkPosition);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);
    checkPosition();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [stepsVisible]);

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-ivory py-24 md:scroll-mt-24 md:py-32">
      <div className="container-wide">
        <div className="mx-auto max-w-6xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-moss/80">
              How it works
            </p>
            <span className="mx-auto mt-5 block h-px w-9 bg-moss/55" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-8 font-serif text-[clamp(34px,4.2vw,64px)] font-light leading-[1.3] tracking-tight md:whitespace-nowrap">
              もしものとき、
              <br className="md:hidden" />
              QRから<span className="text-moss">つながる</span>。
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="body-jp mx-auto mt-7 max-w-3xl text-sm leading-[2] text-ink/70 md:text-base">
              専用アプリは不要。QRコードをきっかけに、
              <br className="md:hidden" />
              必要な相手とつながれます。
            </p>
          </Reveal>
        </div>

        <div
          ref={stepsRef}
          className="mx-auto mt-16 grid max-w-[1280px] grid-cols-1 md:mt-20 lg:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)_48px_minmax(0,1fr)] lg:items-start lg:gap-x-3 xl:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)_56px_minmax(0,1fr)] xl:gap-x-8"
        >
          <Step step={STEPS[0]} visible={stepsVisible} delay={0} />
          <FlowArrow visible={stepsVisible} delay={150} />
          <Step step={STEPS[1]} visible={stepsVisible} delay={300} />
          <FlowArrow visible={stepsVisible} delay={450} />
          <Step step={STEPS[2]} visible={stepsVisible} delay={600} />
        </div>
      </div>
    </section>
  );
}
