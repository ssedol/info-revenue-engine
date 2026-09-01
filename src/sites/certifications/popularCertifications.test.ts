import { describe, expect, it } from "vitest";
import { popularCertifications } from "./popularCertifications";

describe("popular certifications", () => {
  it("keeps the agreed 32 certifications without duplicates", () => {
    expect(popularCertifications).toHaveLength(32);
    expect(new Set(popularCertifications.map(({ name }) => name)).size).toBe(32);
  });

  it("contains 25 technical Q-Net items and 7 additional managed items", () => {
    const qnetTechnical = popularCertifications.filter(
      ({ provider, name }) => provider === "qnet" && name !== "공인중개사",
    );
    expect(qnetTechnical).toHaveLength(25);
    expect(popularCertifications.map(({ name }) => name)).toContain("재경관리사");
    expect(popularCertifications.map(({ name }) => name)).toContain("컴퓨터활용능력 1급");
    expect(popularCertifications.map(({ name }) => name)).toContain("사회복지사 1급");
  });
});
