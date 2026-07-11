// Usage: node scripts/pagespeed-check.mjs [url]
// Prints the Lighthouse performance score for a URL (default: https://www.qring.jp/).
//
// Unlike GA4/Search Console, PageSpeed Insights is a public API that only needs
// GCP_API_KEY (no service account, no per-site permission) since it just analyzes
// a public URL rather than reading account data. See
// .claude/skills/google-apis/SKILL.md for details.

import "dotenv/config";

const url = process.argv[2] ?? "https://www.qring.jp/";
const apiKey = process.env.GCP_API_KEY;

if (!apiKey) {
  console.error("Missing GCP_API_KEY in .env.");
  process.exit(1);
}

const endpoint = new URL("https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed");
endpoint.searchParams.set("url", url);
endpoint.searchParams.set("key", apiKey);
endpoint.searchParams.set("category", "performance");

const res = await fetch(endpoint);
const data = await res.json();

if (data.error) {
  console.error("ERROR:", data.error.message);
  process.exit(1);
}

console.log("URL analyzed:", data.id);
console.log("Performance score:", data.lighthouseResult.categories.performance.score);
