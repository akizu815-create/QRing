import ColumnListing, { listingMetadata } from "@/components/columns/ColumnListing";
export function generateMetadata() { return listingMetadata(true, 1); }
export default function MunicipalColumnsPage() { return <ColumnListing municipal />; }
