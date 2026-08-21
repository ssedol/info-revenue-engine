import { describe, expect, it } from "vitest";
import { validateNormalizedCertifications } from "./validate-certifications";

describe("validateNormalizedCertifications", () => {
  it("rejects invalid published data before publish", () => {
    const report = validateNormalizedCertifications({ certifications: [{ id: "" }] }, "2026-08-21T00:00:00.000Z");

    expect(report.ok).toBe(false);
    expect(report.errors.length).toBeGreaterThan(0);
  });
});
