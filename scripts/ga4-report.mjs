// Usage: node scripts/ga4-report.mjs
// Prints active users for the last 7 days from the GA4 property.
//
// Requires GOOGLE_APPLICATION_CREDENTIALS in .env to point at a service-account
// JSON key that has been added as a viewer on the GA4 property in
// Analytics Admin > Property Access Management. See
// .claude/skills/ga4-api/SKILL.md for setup steps.

import "dotenv/config";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  console.error("Missing GA4_PROPERTY_ID in .env (the numeric GA4 property ID, not the G-XXXX measurement ID).");
  process.exit(1);
}

const client = new BetaAnalyticsDataClient();

const [response] = await client.runReport({
  property: `properties/${propertyId}`,
  dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
  dimensions: [{ name: "date" }],
  metrics: [{ name: "activeUsers" }],
});

for (const row of response.rows ?? []) {
  console.log(row.dimensionValues[0].value, row.metricValues[0].value);
}
