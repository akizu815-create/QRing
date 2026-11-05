import ColumnListing, { listingMetadata } from "@/components/columns/ColumnListing";
import { getArticleCards } from "@/lib/columns";
import { columnPageCount } from "@/lib/columns/navigation";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return Array.from({ length: columnPageCount(getArticleCards().filter((a) => a.primaryAudience === "municipal").length) }, (_, i) => ({ page: String(i + 1) })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) { const n = Number((await params).page); return listingMetadata(true, n, n === 1); }
export default async function MunicipalColumnPage({ params }: { params: Promise<{ page: string }> }) { return <ColumnListing municipal pageNumber={Number((await params).page)} />; }
