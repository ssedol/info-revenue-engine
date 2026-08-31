import { describe, expect, it } from "vitest";
import { normalizeRealtorHtml } from "./normalize-external-certifications";

describe("normalize external certifications", () => {
  it("normalizes the Q-Net realtor schedule", () => {
    const certification = normalizeRealtorHtml(
      `<main>
        <h1>2026년도 제37회 공인중개사</h1>
        <p>접수기간 2026.08.03 ~ 2026.08.07</p>
        <p>시험일정 2026.10.31 ~ 2026.10.31</p>
        <p>합격자발표기간 2026.12.02 ~ 2027.01.31</p>
      </main>`,
      "2026-08-31T00:00:00.000Z",
      "https://www.q-net.or.kr/example",
    );

    expect(certification.name).toBe("공인중개사");
    expect(certification.schedules[0]).toMatchObject({
      round: "2026년도 제37회 공인중개사",
      applicationStart: "2026-08-03",
      examStart: "2026-10-31",
      resultDate: "2026-12-02",
    });
  });
});
