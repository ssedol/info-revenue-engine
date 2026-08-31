import { describe, expect, it } from "vitest";
import type { Certification } from "@/sites/certifications/types";
import { getUpcomingSchedules } from "./page";

const source = {
  provider: "Q-Net",
  fetchedAt: "2026-08-31T00:00:00.000Z",
};

function certification(id: string, name: string): Certification {
  return {
    id,
    slug: `cert-${id}`,
    name,
    officialName: name,
    category: "정보통신",
    level: "기사",
    issuer: "한국산업인력공단",
    schedules: [{
      round: "2026년 정기 기사 3회",
      applicationStart: "2026-07-20",
      practicalApplicationStart: "2026-09-21",
      practicalExamStart: "2026-10-17",
      practicalResultDate: "2026-12-11",
      source,
    }],
    fees: [],
    source,
    updatedAt: "2026-08-31T00:00:00.000Z",
  };
}

describe("getUpcomingSchedules", () => {
  it("removes past milestones and groups shared schedules", () => {
    const result = getUpcomingSchedules(
      [certification("1320", "정보처리기사"), certification("1150", "전기기사")],
      "2026-08-31",
    );

    expect(result.map((item) => item.label)).toEqual(["실기 접수", "실기시험", "최종 발표"]);
    expect(result[0]).toMatchObject({
      date: "2026-09-21",
      certificationCount: 2,
    });
  });
});
