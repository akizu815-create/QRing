// 追加承認用プレビュー専用。承認済みNEWSの本番ブランチには含めない。
import Link from "next/link";
import NewmarketSupportCopy from "@/components/NewmarketSupportCopy";
import { NEWMARKET_SUPPORT, isNewmarketSupportActive } from "@/content/newmarketSupport";

type Placement = Extract<(typeof NEWMARKET_SUPPORT.placements)[number], { status: "additional-approval-required" }>["id"];

export default function NewmarketSupportPlacement({ placement, compact = false }: { placement: Placement; compact?: boolean }) {
  if (!isNewmarketSupportActive()) return null;
  const content = <><p className="mb-6 text-[10px] font-medium tracking-[0.26em] text-ink/60">SUPPORT</p><NewmarketSupportCopy /><Link href={NEWMARKET_SUPPORT.path} className="link-underline mt-6 inline-block text-xs leading-7 text-moss">お知らせを見る →</Link></>;
  return compact
    ? <aside data-newmarket-placement={placement} className="mt-10 border-y border-ink/10 py-8 text-left" aria-label="支援対象製品に関するお知らせ">{content}</aside>
    : <aside data-newmarket-placement={placement} className="bg-ivory py-12 md:py-16" aria-label="支援対象製品に関するお知らせ"><div className="container-narrow border-y border-ink/10 py-8 md:py-10">{content}</div></aside>;
}
