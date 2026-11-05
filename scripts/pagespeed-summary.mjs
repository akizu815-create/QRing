export function summarizePageSpeed(data, strategy) {
  const audits = data.lighthouseResult?.audits ?? {};
  const value = (key) => audits[key]?.numericValue ?? null;
  const field = (experience) => ({
    status: experience?.metrics ? "available" : "unavailable",
    id: experience?.id ?? null,
    LCP_ms_p75: experience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
    INP_ms_p75: experience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
    // CrUX's CUMULATIVE_LAYOUT_SHIFT_SCORE percentiles use a scale of 100.
    CLS_p75: experience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile == null ? null : experience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100,
  });
  return {
    url: data.id, strategy, measuredAt: data.analysisUTCTimestamp ?? null,
    lab: { source: "Lighthouse simulation", performanceScore: data.lighthouseResult?.categories?.performance?.score ?? null,
      LCP_ms: value("largest-contentful-paint"), CLS: value("cumulative-layout-shift"), TBT_ms: value("total-blocking-time"), INP_ms: null },
    fieldPage: field(data.loadingExperience), fieldOrigin: field(data.originLoadingExperience),
    note: "TBT is not INP. Origin data does not establish page performance. Missing field metrics remain unknown; use existing GSC CWV / CrUX when PSI does not provide field data.",
  };
}
