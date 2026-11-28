import type { Article } from "./types";

export const SERVICE_CTAS = {
  elderly: { href: "/use-cases/elderly/", label: "外出時のもしもに備える連絡方法を見る" },
  pets: { href: "/use-cases/pets/", label: "電話番号を公開しない迷子札について見る" },
  belongings: { href: "/use-cases/belongings/", label: "持ち物から連絡できる仕組みを見る" },
  privacy: { href: "/service/#privacy-call", label: "電話番号を公開せずに通話できる仕組みを見る" },
} as const;
export function articleCtaKind(article: Pick<Article, "category">) {
  switch (article.category) {
    case "elderly-dementia": case "family-care": return "elderly";
    case "pets": return "pets";
    case "lost-items": return "belongings";
    case "privacy-life": return "privacy";
    default: return "existing";
  }
}
/** Existing authored footer guidance wins. Do not append a second sales CTA. */
export function additionalServiceCta(article: Article) {
  if (article.publicationPending || article.primaryAudience !== "personal" || article.cta !== "none" || article.relatedService || article.relatedLinks?.some((l) => /^\/(use-cases|service|municipalities|collaboration)\//.test(l.href))) return null;
  // Historical/technical trivia and emergency functions need no automatic commercial suggestion.
  if (["qr-code-inventor", "smartphone-emergency-sos", "dog-owner-voice", "cat-owner-memory", "pets-earthquake-prediction", "disaster-family-contact", "dementia-early-signs", "dementia-forgetfulness", "young-onset-dementia", "care-levels", "care-insurance-age", "senior-care-facility-types"].includes(article.slug)) return null;
  const kind = articleCtaKind(article);
  return kind === "existing" ? null : { ...SERVICE_CTAS[kind], kind };
}
