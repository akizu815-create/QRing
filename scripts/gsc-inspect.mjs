// Read-only extension of the existing GSC tool. No submission or live-index test.
export function inspectionUrls(args) {
  const urls = [...new Set(args.length ? args : ["https://www.qring.jp/", "https://www.qring.jp/service/", "https://www.qring.jp/column/"])];
  if (urls.length > 20) throw new Error("Inspect at most 20 explicit URLs per run.");
  return urls.map((value) => {
    const url = new URL(value);
    if (url.origin !== "https://www.qring.jp" || url.search || url.hash || url.username || url.password) throw new Error("Only canonical https://www.qring.jp/ URLs are allowed.");
    return url.href;
  });
}
export async function inspectGsc(client, urls) {
  const report = { checkedAt: new Date().toISOString(), siteUrl: "sc-domain:qring.jp", source: "Google indexed version (not a live URL test)", sitemaps: null, pages: [] };
  const read = async (options) => (await client.request({ timeout: 20000, retry: false, ...options })).data;
  try {
    report.sitemaps = await read({ url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(report.siteUrl)}/sitemaps`, method: "GET" });
  } catch (error) { report.sitemaps = { status: "unavailable", httpStatus: error.response?.status ?? null }; }
  for (const inspectionUrl of urls) {
    try {
      const data = await read({ url: "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", method: "POST", data: { inspectionUrl, siteUrl: report.siteUrl, languageCode: "ja-JP" } });
      report.pages.push({ url: inspectionUrl, status: "retrieved", result: data.inspectionResult ?? null });
    } catch (error) { report.pages.push({ url: inspectionUrl, status: "unavailable", httpStatus: error.response?.status ?? null }); }
  }
  return report;
}
export async function runInspection() {
  const urls = inspectionUrls(process.argv.slice(process.argv.indexOf("--inspect") + 1));
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] });
  try {
    const report = await inspectGsc(await auth.getClient(), urls);
    console.log(JSON.stringify(report, null, 2));
    if (report.sitemaps?.status === "unavailable" || report.pages.some((p) => p.status !== "retrieved")) process.exitCode = 1;
  } catch {
    // Do not log request objects, headers, tokens, credentials or credential paths.
    console.error("GSC inspection unavailable. Configure the existing server-side Google credentials and GSC read permission; no index verdict was produced.");
    process.exitCode = 1;
  }
}
