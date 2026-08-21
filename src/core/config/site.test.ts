import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("keeps the MVP site configured without external services", () => {
    expect(siteConfig.name).toBe("자격증 인사이트");
    expect(siteConfig.topic).toBe("certifications");
  });
});
