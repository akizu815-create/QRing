import { NEWMARKET_SUPPORT, isNewmarketSupportActive } from "@/content/newmarketSupport";

export default function NewmarketSupportCopy() {
  if (!isNewmarketSupportActive()) return null;
  return (
    <div data-approved-support-copy className="body-jp space-y-5 text-sm text-ink/75 md:text-base">
      {NEWMARKET_SUPPORT.paragraphs.map((text, index) => (
        <p key={index} className={index === 2 ? "text-xs leading-relaxed text-ink/65 md:text-sm" : undefined}>{text}</p>
      ))}
    </div>
  );
}
