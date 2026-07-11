// Usage: node scripts/gsc-report.mjs
// Prints the top 10 search queries (by clicks) for the last 28 days from
// Search Console.
//
// Requires GOOGLE_APPLICATION_CREDENTIALS in .env to point at the same
// service-account JSON key used for GA4, added as a user on the
// sc-domain:qring.jp property in Search Console > Settings > Users and
// permissions. See .claude/skills/google-apis/SKILL.md for setup steps.

import "dotenv/config";
import { GoogleAuth } from "google-auth-library";

const SITE_URL = "sc-domain:qring.jp";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});

const client = await auth.getClient();

// Unlike GA4, Search Console's API requires literal YYYY-MM-DD dates — relative
// strings like "28daysAgo" are rejected with a 400.
const toISODate = (date) => date.toISOString().slice(0, 10);
const today = new Date();
const twentyEightDaysAgo = new Date(today);
twentyEightDaysAgo.setDate(today.getDate() - 28);

const res = await client.request({
  url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
  method: "POST",
  data: {
    startDate: toISODate(twentyEightDaysAgo),
    endDate: toISODate(today),
    dimensions: ["query"],
    rowLimit: 10,
  },
});

const rows = res.data.rows ?? [];

if (rows.length === 0) {
  console.log("No search data yet for the last 28 days.");
} else {
  for (const row of rows) {
    console.log(row.keys[0], "clicks:", row.clicks, "impressions:", row.impressions);
  }
}
