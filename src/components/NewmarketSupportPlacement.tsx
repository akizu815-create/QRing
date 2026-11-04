// NEWS以外の掲載位置・短文版は、2026-11-04にユーザーから承認取得済みと確認。
import Link from "next/link";
import NewmarketSupportCopy from "@/components/NewmarketSupportCopy";
import { NEWMARKET_SUPPORT, isNewmarketSupportActive } from "@/content/newmarketSupport";

type Placement = Extract<(typeof NEWMARKET_SUPPORT.placements)[number], { status: "approved-additional" }>["id"];

export default function NewmarketSupportPlacement({ placement, compact = false }: { placement: Placement; compact?: boolean }) {
  if (!isNewmarketSupportActive()) return null;
  const content = <><p className="mb-6 text-sm font-medium leading-relaxed text-ink md:text-base">{NEWMARKET_SUPPORT.shortHeading}</p><NewmarketSupportCopy variant="short" /><Link href={NEWMARKET_SUPPORT.path} className="link-underline mt-6 inline-block text-xs leading-7 text-moss">お知らせを見る →</Link></>;
  return compact
    ? <aside data-newmarket-placement={placement} className="mt-10 border-y border-ink/10 py-8 text-left" aria-label="支援対象製品に関するお知らせ">{content}</aside>
    : <aside data-newmarket-placement={placement} className="bg-ivory py-12 md:py-16" aria-label="支援対象製品に関するお知らせ"><div className="container-narrow border-y border-ink/10 py-8 md:py-10">{content}</div></aside>;
}
