import { describe, expect, it } from "vitest";
import {
  buildIndexNowPayload,
  buildNotificationUrls,
  findChangedCertifications,
  sitemapContainsChanges,
  stripVolatileFields,
} from "./notify-search-engines";

const before = {
  slug: "sample-cert",
  updatedAt: "2026-08-01T00:00:00.000Z",
  name: "샘플 자격증",
  source: { provider: "공식기관", fetchedAt: "2026-08-01T00:00:00.000Z" },
};

describe("search engine notifications", () => {
  it("ignores collection timestamps but detects material content changes", () => {
    const timestampOnly = {
      ...before,
      updatedAt: "2026-09-01T00:00:00.000Z",
      source: { ...before.source, fetchedAt: "2026-09-01T00:00:00.000Z" },
    };
    const changed = { ...timestampOnly, name: "변경된 자격증" };

    expect(stripVolatileFields(timestampOnly)).toEqual(stripVolatileFields(before));
    expect(findChangedCertifications([before], [timestampOnly])).toEqual([]);
    expect(findChangedCertifications([before], [changed])).toEqual([changed]);
  });

  it("builds canonical URLs and an official IndexNow payload", () => {
    const urls = buildNotificationUrls([before]);
    const payload = buildIndexNowPayload(urls);

    expect(urls).toEqual([
      "https://cert-insight.online",
      "https://cert-insight.online/certifications",
      "https://cert-insight.online/schedules",
      "https://cert-insight.online/certifications/sample-cert",
    ]);
    expect(payload.host).toBe("cert-insight.online");
    expect(payload.keyLocation).toMatch(/^https:\/\/cert-insight\.online\/[a-f0-9]{32}\.txt$/);
    expect(payload.urlList).toEqual(urls);
  });

  it("waits for Google-facing sitemap URLs and exact last-modified values", () => {
    const xml = `<url><loc>https://cert-insight.online/certifications/sample-cert</loc><lastmod>${before.updatedAt}</lastmod></url>`;

    expect(sitemapContainsChanges(xml, [before])).toBe(true);
    expect(sitemapContainsChanges(xml.replace(before.updatedAt, "2026-08-02T00:00:00.000Z"), [before])).toBe(false);
  });
});
