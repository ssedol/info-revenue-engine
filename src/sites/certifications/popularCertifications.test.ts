import { describe, expect, it } from "vitest";
import { popularCertifications } from "./popularCertifications";

describe("popular certifications", () => {
  it("keeps the agreed 29 certifications without duplicates", () => {
    expect(popularCertifications).toHaveLength(29);
    expect(new Set(popularCertifications.map(({ name }) => name)).size).toBe(29);
  });

  it("contains 25 technical Q-Net items and 4 additional managed items", () => {
    const qnetTechnical = popularCertifications.filter(
      ({ provider, name }) => provider === "qnet" && name !== "공인중개사",
    );
    expect(qnetTechnical).toHaveLength(25);
    expect(popularCertifications.map(({ name }) => name)).not.toContain("재경관리사");
    expect(popularCertifications.map(({ name }) => name)).not.toContain("컴퓨터활용능력 1급");
  });
});
