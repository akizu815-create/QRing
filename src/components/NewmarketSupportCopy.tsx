import { NEWMARKET_SUPPORT, isNewmarketSupportActive } from "@/content/newmarketSupport";

export default function NewmarketSupportCopy({ variant = "full" }: { variant?: "full" | "short" }) {
  if (!isNewmarketSupportActive()) return null;
  const paragraphs = variant === "short" ? NEWMARKET_SUPPORT.paragraphs.slice(1) : NEWMARKET_SUPPORT.paragraphs;
  return (
    <div data-approved-support-copy data-copy-variant={variant} className="body-jp space-y-5 text-sm text-ink/75 md:text-base">
      {paragraphs.map((text, index) => (
        <p key={index} className={index === paragraphs.length - 1 ? "text-xs leading-relaxed text-ink/65 md:text-sm" : undefined}>{text}</p>
      ))}
    </div>
  );
}
