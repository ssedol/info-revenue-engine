import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeQnetListXml } from "./normalize-certifications";

describe("normalizeQnetListXml", () => {
  it("normalizes official Q-Net list fields into internal certifications", async () => {
    const xml = await readFile(join("scripts", "fixtures", "certifications", "qnet-list.fixture.xml"), "utf8");
    const certifications = normalizeQnetListXml(xml, {
      provider: "Q-Net",
      mode: "fixture",
      fetchedAt: "2026-08-21T00:00:00.000Z",
      endpoint: "http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList",
      officialPage: "https://www.data.go.kr/data/15003024/openapi.do",
    });

    expect(certifications).toHaveLength(7);
    expect(certifications[0]).toMatchObject({
      id: "1320",
      slug: "cert-1320",
      name: "정보처리기사",
      schedules: [],
      fees: [],
    });
  });
});
