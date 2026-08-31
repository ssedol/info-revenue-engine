import { describe, expect, it } from "vitest";
import { popularCertifications } from "./popularCertifications";

describe("popular certifications", () => {
  it("keeps the agreed 31 certifications without duplicates", () => {
    expect(popularCertifications).toHaveLength(31);
    expect(new Set(popularCertifications.map(({ name }) => name)).size).toBe(31);
  });

  it("contains 25 technical Q-Net items and 6 additional managed items", () => {
    const qnetTechnical = popularCertifications.filter(
      ({ provider, name }) => provider === "qnet" && name !== "공인중개사",
    );
    expect(qnetTechnical).toHaveLength(25);
    expect(popularCertifications.map(({ name }) => name)).toContain("재경관리사");
  });
});
