import { describe, expect, it } from "vitest";
import { certificationDeepDiveNames, getCertificationDeepDive } from "./certificationDeepDives";
import { getCertifications } from "./data";

describe("certification deep dives", () => {
  it("provides verified, substantial content for ten priority certifications", () => {
    expect(certificationDeepDiveNames).toHaveLength(10);

    for (const name of certificationDeepDiveNames) {
      const content = getCertificationDeepDive(name);
      expect(getCertifications().some((certification) => certification.name === name)).toBe(true);
      expect(content?.examSubjects.length).toBeGreaterThan(0);
      expect(content?.seoTitle).toContain("2026");
      expect(content?.seoTitle.length).toBeLessThanOrEqual(38);
      expect(content?.seoDescription.length).toBeGreaterThanOrEqual(55);
      expect(content?.seoDescription.length).toBeLessThanOrEqual(160);
      expect(content?.passRule.length).toBeGreaterThan(30);
      expect(content?.eligibility.length).toBeGreaterThan(20);
      expect(content?.studyPlan).toHaveLength(3);
      expect(content?.faqs).toHaveLength(3);
      expect(content?.officialSource).toMatch(/^https:\/\//);
      expect(content?.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
