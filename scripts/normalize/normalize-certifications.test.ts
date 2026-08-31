import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeQnetListXml, normalizeScheduleXml } from "./normalize-certifications";

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

  it("normalizes written and practical Q-Net schedule fields", async () => {
    const xml = await readFile(
      join("scripts", "fixtures", "certifications", "qnet-schedules-getEList.fixture.xml"),
      "utf8",
    );
    const schedules = normalizeScheduleXml(xml, "2026-08-31T00:00:00.000Z");

    expect(schedules).toHaveLength(3);
    expect(schedules[0]).toMatchObject({
      round: "2026년 정기 시험 1회",
      applicationStart: "2026-01-12",
      examStart: "2026-02-07",
      practicalApplicationStart: "2026-03-23",
      practicalExamStart: "2026-04-18",
      practicalResultDate: "2026-06-12",
    });
  });
});
