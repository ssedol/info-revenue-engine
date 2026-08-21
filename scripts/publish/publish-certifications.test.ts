import { describe, expect, it } from "vitest";
import type { Certification } from "../../src/sites/certifications/types";
import { buildSeoIndex } from "./publish-certifications";

const source = {
  provider: "Q-Net",
  endpoint: "http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList",
  officialPage: "https://www.data.go.kr/data/15003024/openapi.do",
  fetchedAt: "2026-08-21T00:00:00.000Z",
};

describe("buildSeoIndex", () => {
  it("creates canonical paths for certification intent pages", () => {
    const certification: Certification = {
      id: "1320",
      slug: "cert-1320",
      name: "정보처리기사",
      officialName: "정보처리기사",
      category: "정보통신",
      level: "기사",
      issuer: "한국산업인력공단",
      schedules: [],
      fees: [],
      passRate: [],
      source,
      updatedAt: "2026-08-21T00:00:00.000Z",
    };

    const index = buildSeoIndex([certification]);

    expect(index.map((item) => item.path)).toContain("/certifications/cert-1320/schedule");
    expect(index.every((item) => item.canonicalPath.startsWith("/"))).toBe(true);
  });
});
