import ColumnListing, { listingMetadata } from "@/components/columns/ColumnListing";
export function generateMetadata() { return listingMetadata(false, 1); }
export default function ColumnPage() { return <ColumnListing />; }
