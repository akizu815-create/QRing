type Props = {
  eyebrow?: string;
  en: string;
  jp?: string;
  align?: "left" | "center";
  invert?: boolean;
};

export default function SectionTitle({
  eyebrow,
  en,
  jp,
  align = "left",
  invert,
}: Props) {
  return (
    <div
      className={`flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start"
      } ${invert ? "text-ivory" : "text-ink"}`}
    >
      {eyebrow && (
        <span
          className={`text-[11px] tracking-[0.35em] uppercase mb-6 ${
            invert ? "text-softgold" : "text-moss"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif font-light leading-[1.15] tracking-tight text-4xl md:text-5xl lg:text-6xl`}
      >
        {en}
      </h2>
      {jp && (
        <p
          className={`mt-5 text-sm md:text-base tracking-[0.2em] ${
            invert ? "text-ivory/70" : "text-ink/60"
          }`}
        >
          {jp}
        </p>
      )}
      <span
        className={`mt-8 block h-px w-12 ${
          invert ? "bg-softgold" : "bg-moss"
        }`}
      />
    </div>
  );
}
