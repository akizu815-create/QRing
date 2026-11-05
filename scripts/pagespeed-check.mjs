// node scripts/pagespeed-check.mjs [url] [--mobile|--desktop]
// Existing PSI helper: lab metrics are distinct from optional page/origin field data.
import "dotenv/config";
import { summarizePageSpeed } from "./pagespeed-summary.mjs";
const args = process.argv.slice(2);
const url = args.find((arg) => !arg.startsWith("--")) ?? "https://www.qring.jp/";
const strategy = args.includes("--desktop") ? "desktop" : "mobile";
const endpoint = new URL("https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed");
endpoint.searchParams.set("url", url);
if (process.env.GCP_API_KEY) endpoint.searchParams.set("key", process.env.GCP_API_KEY);
endpoint.searchParams.set("category", "performance");
endpoint.searchParams.set("strategy", strategy);
try {
  const res = await fetch(endpoint, { signal: AbortSignal.timeout(55000) });
  const data = await res.json();
  if (!res.ok || data.error || !data.lighthouseResult) throw new Error("unavailable");
  console.log(JSON.stringify(summarizePageSpeed(data, strategy), null, 2));
} catch {
  console.log(JSON.stringify({ url, strategy, status: "unavailable", LCP: null, INP: null, CLS: null, note: "API/network/quota failure. No measurement or pass/fail verdict; no automatic retry." }, null, 2));
  process.exitCode = 1;
}
