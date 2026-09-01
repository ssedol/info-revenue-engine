import { describe, expect, it } from "vitest";
import { certificationGuideNames, getCertificationGuide } from "./certificationGuides";
import { getCertifications } from "./data";

describe("certification guides", () => {
  it("publishes substantial guides for 30 popular certifications", () => {
    expect(certificationGuideNames).toHaveLength(30);

    for (const name of certificationGuideNames) {
      const guide = getCertificationGuide(name);
      expect(getCertifications().some((certification) => certification.name === name)).toBe(true);
      expect(guide?.overview.length).toBeGreaterThan(45);
      expect(guide?.useCases).toHaveLength(3);
      expect(guide?.preparation).toHaveLength(3);
      expect(guide?.comparisons.length).toBeGreaterThan(0);
    }
  });

  it("does not expose a guide for an uncurated certification", () => {
    expect(getCertificationGuide("존재하지 않는 자격증")).toBeUndefined();
  });
});
