import { describe, expect, it } from "vitest";
import { getCertifications } from "@/sites/certifications/data";
import { absoluteUrl } from "@/core/seo/metadata";
import { certificationPath } from "@/sites/certifications/routes";
import { getCertificationDeepDive } from "@/sites/certifications/certificationDeepDives";
import { getCertificationGuide } from "@/sites/certifications/certificationGuides";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes only substantial certification detail pages exactly once", () => {
    const entries = sitemap();
    const urls = entries.map(({ url }) => url);
    const certificationUrls = getCertifications()
      .filter((certification) => getCertificationDeepDive(certification.name) || getCertificationGuide(certification.name))
      .map((certification) => absoluteUrl(certificationPath(certification)));

    expect(certificationUrls).toHaveLength(30);
    expect(new Set(urls).size).toBe(urls.length);
    expect(certificationUrls.every((url) => urls.includes(url))).toBe(true);
    expect(urls).not.toContain(absoluteUrl("/certifications/social-worker-level-1"));
    expect(urls).toContain(absoluteUrl("/certifications/computer-literacy-level-1"));
  });

  it("uses each certification update time as its last-modified value", () => {
    const certification = getCertifications().find(({ slug }) => slug === "computer-literacy-level-1");
    const entry = sitemap().find(
      ({ url }) => url === absoluteUrl("/certifications/computer-literacy-level-1"),
    );

    expect(certification).toBeDefined();
    expect(entry?.lastModified).toEqual(new Date(certification!.updatedAt));
    expect(entry?.changeFrequency).toBe("weekly");
    expect(entry?.priority).toBe(0.8);
  });
});
