import { describe, expect, it } from "vitest";
import { getCertifications } from "@/sites/certifications/data";
import { absoluteUrl } from "@/core/seo/metadata";
import { certificationPath } from "@/sites/certifications/routes";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes every published certification detail page exactly once", () => {
    const entries = sitemap();
    const urls = entries.map(({ url }) => url);
    const certificationUrls = getCertifications().map((certification) =>
      absoluteUrl(certificationPath(certification)),
    );

    expect(certificationUrls).toHaveLength(520);
    expect(new Set(urls).size).toBe(urls.length);
    expect(certificationUrls.every((url) => urls.includes(url))).toBe(true);
    expect(urls).toContain(absoluteUrl("/certifications/social-worker-level-1"));
  });

  it("uses each certification update time as its last-modified value", () => {
    const certification = getCertifications().find(({ slug }) => slug === "social-worker-level-1");
    const entry = sitemap().find(
      ({ url }) => url === absoluteUrl("/certifications/social-worker-level-1"),
    );

    expect(certification).toBeDefined();
    expect(entry?.lastModified).toEqual(new Date(certification!.updatedAt));
    expect(entry?.changeFrequency).toBe("weekly");
    expect(entry?.priority).toBe(0.8);
  });
});
