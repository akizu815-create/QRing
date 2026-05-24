type Props = {
  eyebrow: string;
  en: string;
  jp: string;
};

export default function PageHeader({ eyebrow, en, jp }: Props) {
  return (
    <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 bg-cream overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="absolute -right-32 top-1/4 opacity-30">
        <svg width="500" height="400" viewBox="0 0 500 400">
          <defs>
            <radialGradient id="ph-ink" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#5B6E4F" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5B6E4F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="250" cy="200" rx="220" ry="120" fill="url(#ph-ink)" />
        </svg>
      </div>
      <div className="container-wide relative z-10">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display mt-8 text-5xl md:text-7xl lg:text-8xl">{en}</h1>
        <p className="mt-6 text-sm md:text-base tracking-[0.25em] text-ink/60">
          {jp}
        </p>
      </div>
    </section>
  );
}
