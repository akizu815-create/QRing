import ColumnListing, { listingMetadata } from "@/components/columns/ColumnListing";
import { getArticleCards } from "@/lib/columns";
import { columnPageCount } from "@/lib/columns/navigation";
export const dynamic = "force-static";
export const dynamicParams = false;
// Page 1 is a noindex alias (canonical /column/); navigational links always use /column/.
export function generateStaticParams() { return Array.from({ length: columnPageCount(getArticleCards().length) }, (_, i) => ({ page: String(i + 1) })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) { const n = Number((await params).page); return listingMetadata(false, n, n === 1); }
export default async function ColumnPage({ params }: { params: Promise<{ page: string }> }) { return <ColumnListing pageNumber={Number((await params).page)} />; }
